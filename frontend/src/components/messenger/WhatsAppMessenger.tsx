// frontend/src/components/messenger/WhatsAppMessenger.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Send, Search, MoreVertical, Phone, Video, 
  Smile, Paperclip, Check, CheckCheck, Menu, LogOut, MessageCircle
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';
interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    _id: string;
    name: string;
    avatar?: string;
  };
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  read: boolean;
  createdAt: Date;
}

interface Conversation {
  chatId: string | null;
  targetUser: User;
  messages: Message[];
}

export default function WhatsAppMessenger() {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize socket connection when currentUser is available
  useEffect(() => {
    if (!currentUser || !isAuthenticated) {
      console.log('Waiting for user authentication...');
      return;
    }

    console.log('Current user from auth:', currentUser);

    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    
    // Socket will send cookies automatically with withCredentials
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      withCredentials: true, // This sends cookies!
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to server with user:', currentUser.name);
      setIsConnected(true);
      
      // Request users list after connection
      setTimeout(() => {
        newSocket.emit('get-users');
      }, 500);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connection-success', (data) => {
      console.log('Connection success:', data);
      setOnlineUsers(data.onlineUsers || []);
    });

    newSocket.on('users-online', (users: string[]) => {
      setOnlineUsers(users);
      
      // Update online status in users list
      setUsers(prev => prev.map(user => ({
        ...user,
        isOnline: users.includes(user._id)
      })));
      
      if (selectedUser) {
        setSelectedUser(prev => prev ? {
          ...prev,
          isOnline: users.includes(prev._id)
        } : null);
      }
    });

    newSocket.on('users-list', (usersList: User[]) => {
      console.log('Received users list:', usersList);
      // Add online status
      const usersWithStatus = usersList.map(user => ({
        ...user,
        isOnline: onlineUsers.includes(user._id)
      }));
      setUsers(usersWithStatus);
    });

    newSocket.on('conversation', (data: Conversation) => {
      console.log('Received conversation:', data);
      setMessages(data.messages);
      if (data.targetUser) {
        setSelectedUser(data.targetUser);
      }
    });

    newSocket.on('new-message', (message: Message) => {
      console.log('New message received:', message);
      // Add message to current conversation if it's from/to selected user
      if (selectedUser && 
          ((message.sender._id === selectedUser._id) || 
           (message.receiver._id === selectedUser._id))) {
        setMessages(prev => [...prev, message]);
      }
      
      // Update unread count in users list
      setUsers(prev => prev.map(user => {
        if (user._id === message.sender._id) {
          return { ...user, unreadCount: ((user as any).unreadCount || 0) + 1 };
        }
        return user;
      }));
    });

    newSocket.on('message-sent', (message: Message) => {
      console.log('Message sent confirmation:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user-typing', (data: { userId: string; name: string }) => {
      if (selectedUser && data.userId === selectedUser._id) {
        setIsTyping(true);
      }
    });

    newSocket.on('user-stop-typing', (data: { userId: string }) => {
      if (selectedUser && data.userId === selectedUser._id) {
        setIsTyping(false);
      }
    });

    newSocket.on('messages-read', (data) => {
      setMessages(prev => prev.map(msg => ({
        ...msg,
        read: true
      })));
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, isAuthenticated]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when conversation opens
  useEffect(() => {
    if (selectedUser && socket && messages.length > 0) {
      socket.emit('mark-read', { senderId: selectedUser._id });
    }
  }, [selectedUser, socket, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setMessages([]);
    
    if (socket) {
      socket.emit('get-conversation', { targetUserId: user._id });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !selectedUser || !socket) return;

    socket.emit('send-message', {
      receiverId: selectedUser._id,
      content: inputMessage.trim(),
      type: 'text'
    });

    setInputMessage('');
  };

  const handleTyping = () => {
    if (!selectedUser || !socket) return;

    socket.emit('typing', { receiverId: selectedUser._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { receiverId: selectedUser._id });
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser || !socket) return;

    // For now, just send as text message with file name
    socket.emit('send-message', {
      receiverId: selectedUser._id,
      content: `📎 Sent a file: ${file.name}`,
      type: 'text'
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MessageStatus = ({ message }: { message: Message }) => {
    if (message.sender._id !== currentUser?.id) return null;
    
    if (message.read) {
      return <CheckCheck className="w-4 h-4 text-blue-400" />;
    }
    return <Check className="w-4 h-4 text-gray-400" />;
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"> </div>
          <p className="text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-900 rounded-2xl overflow-hidden border border-white/10">
      {/* Sidebar - Users List */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-white/10 bg-gray-900/50 overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-white">{currentUser?.name}</h3>
                <p className="text-xs text-gray-400">
                  {isConnected ? 'Online' : 'Connecting...'}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                  selectedUser?._id === user._id ? 'bg-white/10' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name} width={48} height={48} className="rounded-full" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white truncate">{user.name}</h4>
                    <span className="text-xs text-gray-400">
                      {(user as any).unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {(user as any).unreadCount}
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.isOnline ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      `Last seen ${user.lastSeen ? 'recently' : 'long ago'}`
                    )}
                  </p>
                </div>
              </button>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gray-900/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {selectedUser.avatar ? (
                      <Image src={selectedUser.avatar} alt={selectedUser.name} width={40} height={40} className="rounded-full" />
                    ) : (
                      selectedUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  {selectedUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-400">
                    {selectedUser.isOnline ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => {
                const isOwnMessage = message.sender._id === currentUser?.id;
                
                return (
                  <div
                    key={message._id || index}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                          : 'bg-white/10 text-gray-300 rounded-bl-none'
                      }`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs text-gray-400 mb-1">{message.sender.name}</p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                        isOwnMessage ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        <span>{formatTime(message.createdAt)}</span>
                        {isOwnMessage && <MessageStatus message={message} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-gray-900/50">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => {
                      setInputMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 pr-24 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to Medicare Chat</h3>
              <p className="text-gray-400">Select a user to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






