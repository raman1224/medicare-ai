// medicare-nepal/frontend/src/hooks/useChatSocket.ts - SIMPLE & WORKING
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  read: boolean;
}

export const useChatSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Initialize socket
  useEffect(() => {
    const token = localStorage.getItem('medicare_token');
    
    if (!token) {
      console.log('No token available');
      return;
    }

    console.log('Initializing socket with token...');

    // Create socket connection
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    socket.on('connection-success', (data) => {
      console.log('Authenticated:', data.user.name);
      setCurrentUser(data.user);
    });

    socket.on('all-users', (usersList: ChatUser[]) => {
      console.log('Received users:', usersList.length);
      setUsers(usersList);
    });

    socket.on('user-online', (data: { userId: string; user: any }) => {
      console.log('User online:', data.user.name);
      setUsers(prev => prev.map(u => 
        u.id === data.userId ? { ...u, isOnline: true } : u
      ));
    });

    socket.on('user-offline', (data: { userId: string }) => {
      console.log('User offline:', data.userId);
      setUsers(prev => prev.map(u => 
        u.id === data.userId ? { ...u, isOnline: false } : u
      ));
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Cleanup
    return () => {
      console.log('Cleaning up socket...');
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  // Get all users
  const getAllUsers = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('get-all-users');
    }
  }, []);

  // Get conversation with user
  const getConversation = useCallback((targetUserId: string, callback: (data: any) => void) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('get-conversation', targetUserId);
      socketRef.current.once('conversation-data', callback);
    }
  }, []);

  // Send message
  const sendMessage = useCallback((data: {
    to: string;
    content: string;
    type?: string;
  }, callback: (data: any) => void) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send-message', data);
      socketRef.current.once('message-sent', callback);
    }
  }, []);

  // Listen for new messages
  const onNewMessage = useCallback((callback: (message: ChatMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.on('new-message', callback);
    }
  }, []);

  // Remove message listener
  const offNewMessage = useCallback((callback: (message: ChatMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.off('new-message', callback);
    }
  }, []);

  return {
    isConnected,
    users,
    currentUser,
    getAllUsers,
    getConversation,
    sendMessage,
    onNewMessage,
    offNewMessage,
    // eslint-disable-next-line react-hooks/refs
    socket: socketRef.current
  };
};