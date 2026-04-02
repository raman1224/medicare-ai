import { Request, Response } from 'express';
import { Chat, Message } from '../models/Chat';
import User  from '../models/User';
import cloudinary from '../config/cloudinary';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp3|wav|webm|mp4/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: File type not allowed!'));
    }
  }
});

export const uploadMessage = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const { message, receiverId, type } = req.body;
      const senderId = req.user.id;

      if (!req.file && !message) {
        return res.status(400).json({ success: false, error: 'Message or file required' });
      }

      let fileUrl;
      let fileName;

      // Upload file to Cloudinary if exists
      if (req.file) {
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: 'medicare-chat',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        fileUrl = (result as { secure_url: string }).secure_url;
        fileName = req.file.originalname;
      }

      // Find or create chat
      let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!chat) {
        chat = await Chat.create({
          participants: [senderId, receiverId],
          messages: []
        });
      }

      // Create message
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content: message || 'File shared',
        type: type || (req.file ? getFileType(req.file.mimetype) : 'text'),
        fileUrl,
        fileName,
        read: false
      });

      // Update chat
      chat.messages.push(newMessage._id);
      chat.lastMessage = newMessage._id;
      await chat.save();

      res.json({
        success: true,
        data: {
          message: newMessage,
          chatId: chat._id
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ success: false, error: 'Failed to upload message' });
    }
  }
];

function getFileType(mimetype: string): 'image' | 'file' | 'voice' | 'video' {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('audio/')) return 'voice';
  if (mimetype.startsWith('video/')) return 'video';
  return 'file';
}

export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as any;

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name email avatar')
      .populate({
        path: 'lastMessage',
        select: 'content type createdAt'
      })
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ success: false, error: 'Failed to get chats' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id as any;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    const messages = await Message.find({ _id: { $in: chat.messages } })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    // Mark messages as read
    await Message.updateMany(
      { 
        _id: { $in: chat.messages },
        receiver: userId,
        read: false 
      },
      { read: true }
    );

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Failed to get messages' });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id as any;

    const count = await Message.countDocuments({
      receiver: userId,
      read: false
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, error: 'Failed to get unread count' });
  }
};