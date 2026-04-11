
// medicare-nepal/backend/src/models/Chat.ts - UPDATED
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // For voice/video
  read: boolean;
  readAt?: Date;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDocument extends IMessage, Document {
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>({
  sender: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['text', 'image', 'file', 'voice', 'video'],
    default: 'text'
  },
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  duration: { type: Number },
  read: { 
    type: Boolean, 
    default: false 
  },
  readAt: { type: Date }
}, { 
  timestamps: true 
});

const ChatSchema = new Schema<IChat>({
  participants: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  messages: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Message' 
  }],
  lastMessage: { 
    type: Schema.Types.ObjectId, 
    ref: 'Message' 
  },
  unreadCount: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

// Indexes for better performance
ChatSchema.index({ participants: 1 });
ChatSchema.index({ updatedAt: -1 });
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, read: 1 });

// Pre-save middleware for chat
ChatSchema.pre('save', async function(next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    // Update unread count
    const unreadMessages = await mongoose.models.Message.countDocuments({
      _id: { $in: this.messages },
      receiver: { $in: this.participants },
      read: false
    });
    this.unreadCount = unreadMessages;
  }
  next();
});

export const Message = mongoose.model<IMessageDocument>('Message', MessageSchema);
export const Chat = mongoose.model<IChat>('Chat', ChatSchema);