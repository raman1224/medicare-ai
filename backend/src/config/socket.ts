// backend/src/config/socket.ts - UPDATED
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import User from '../models/User';
import { Message, Chat } from '../models/Chat';

// Store online users
const onlineUsers = new Map<string, { socketId: string; userId: string; userData: any }>();

export const setupSocket = (io: Server) => {
  console.log('🔌 Socket.io server initialized');

  // Authentication middleware - Read token from cookie
  io.use(async (socket: Socket, next) => {
    try {
      // Get token from handshake headers (cookie)
      const cookieHeader = socket.handshake.headers.cookie;
      let token = null;
      
      if (cookieHeader) {
        const cookies = cookie.parse(cookieHeader);
        token = cookies.token;
      }
      
      // Also check auth object for token (fallback for mobile)
      if (!token && socket.handshake.auth.token) {
        token = socket.handshake.auth.token;
      }
      
      if (!token) {
        console.log('❌ No token provided in socket connection');
        return next(new Error('Authentication error: No token'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medicare-nepal-secret-key-2024') as any;
      
      // Get user from database
      const user = await User.findById(decoded.id).select('name email avatar role');
      
      if (!user) {
        console.log('❌ User not found');
        return next(new Error('User not found'));
      }

      // Attach user data to socket
      (socket as any).userId = user._id.toString();
      (socket as any).userData = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      };
      
      console.log(`✅ Socket authenticated: ${user.name} (${user._id})`);
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Handle new connections
  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    const userData = (socket as any).userData;
    
    if (!userId) {
      console.log('❌ Socket connection without userId');
      socket.disconnect();
      return;
    }
    
    console.log(`✅ User connected: ${userId} (${userData.name})`);

    // Add to online users
    onlineUsers.set(userId, {
      socketId: socket.id,
      userId,
      userData
    });

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Broadcast online status to all connected clients
    io.emit('users-online', Array.from(onlineUsers.keys()));

    // Notify user of successful connection
    socket.emit('connection-success', {
      userId,
      message: 'Connected successfully',
      user: userData,
      onlineUsers: Array.from(onlineUsers.keys())
    });

    // Send list of all users (for chat list)
    socket.on('get-users', async () => {
      try {
        const users = await User.find({ _id: { $ne: userId } })
          .select('name email avatar role')
          .lean();

        // Add online status
        const usersWithStatus = users.map(user => ({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          isOnline: onlineUsers.has(user._id.toString()),
          lastSeen: new Date()
        }));

        socket.emit('users-list', usersWithStatus);
      } catch (error) {
        console.error('Error fetching users:', error);
        socket.emit('error', { message: 'Failed to fetch users' });
      }
    });

    // Get conversation with specific user
    socket.on('get-conversation', async (data: { targetUserId: string }) => {
      try {
        const targetUserId = data.targetUserId;
        
        // Check if target user exists
        const targetUser = await User.findById(targetUserId).select('name email avatar');
        if (!targetUser) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        // Get messages
        const messages = await Message.find({
          $or: [
            { sender: userId, receiver: targetUserId },
            { sender: targetUserId, receiver: userId }
          ]
        })
          .populate('sender', 'name avatar')
          .populate('receiver', 'name avatar')
          .sort({ createdAt: 1 }); // Oldest first

        // Find existing chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        // Mark messages as read
        await Message.updateMany(
          { sender: targetUserId, receiver: userId, read: false },
          { read: true, readAt: new Date() }
        );

        socket.emit('conversation', {
          chatId: chat?._id || null,
          targetUser: {
            _id: targetUser._id,
            name: targetUser.name,
            email: targetUser.email,
            avatar: targetUser.avatar,
            isOnline: onlineUsers.has(targetUserId)
          },
          messages: messages
        });

      } catch (error) {
        console.error('Get conversation error:', error);
        socket.emit('error', { message: 'Failed to load conversation' });
      }
    });

    // Send message
    socket.on('send-message', async (data: {
      receiverId: string;
      content: string;
      type?: string;
    }) => {
      try {
        const { receiverId, content, type = 'text' } = data;

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          socket.emit('error', { message: 'Receiver not found' });
          return;
        }

        // Create message in database
        const message = new Message({
          sender: userId,
          receiver: receiverId,
          content,
          type,
          read: false
        });

        await message.save();

        // Populate sender info
        await message.populate('sender', 'name avatar');
        await message.populate('receiver', 'name avatar');

        // Find or create chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, receiverId] }
        });

        if (!chat) {
          chat = await Chat.create({
            participants: [userId, receiverId],
            messages: []
          });
        }

        // Add message to chat
        chat.messages.push(message._id);
        chat.lastMessage = message._id;
        chat.updatedAt = new Date();
        await chat.save();

        // Prepare message data for sending
        const messageData = {
          _id: message._id,
          content: message.content,
          sender: {
            _id: userId,
            name: userData.name,
            avatar: userData.avatar
          },
          receiver: {
            _id: receiverId,
            name: receiver.name,
            avatar: receiver.avatar
          },
          type: message.type,
          createdAt: message.createdAt,
          read: false
        };

        // Send to recipient if online
        const recipientData = onlineUsers.get(receiverId);
        if (recipientData) {
          io.to(`user:${receiverId}`).emit('new-message', messageData);
        }

        // Send confirmation to sender
        socket.emit('message-sent', messageData);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing', (data: { receiverId: string }) => {
      const recipientData = onlineUsers.get(data.receiverId);
      if (recipientData) {
        io.to(`user:${data.receiverId}`).emit('user-typing', {
          userId: userId,
          name: userData.name
        });
      }
    });

    socket.on('stop-typing', (data: { receiverId: string }) => {
      const recipientData = onlineUsers.get(data.receiverId);
      if (recipientData) {
        io.to(`user:${data.receiverId}`).emit('user-stop-typing', {
          userId: userId
        });
      }
    });

    // Mark messages as read
    socket.on('mark-read', async (data: { senderId: string }) => {
      try {
        await Message.updateMany(
          { sender: data.senderId, receiver: userId, read: false },
          { read: true, readAt: new Date() }
        );

        // Notify sender that messages were read
        const senderData = onlineUsers.get(data.senderId);
        if (senderData) {
          io.to(`user:${data.senderId}`).emit('messages-read', {
            by: userId,
            at: new Date()
          });
        }
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${userId}`);
      
      // Remove from online users
      onlineUsers.delete(userId);
      
      // Notify others
      io.emit('users-online', Array.from(onlineUsers.keys()));
      io.emit('user-offline', { userId });
    });
  });
};