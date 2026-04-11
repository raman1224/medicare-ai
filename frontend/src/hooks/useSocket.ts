


// medicare-nepal/frontend/src/hooks/useSocket.ts - COMPLETELY FIXED
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onNewMessage?: (message: any) => void;
  onUsersList?: (users: any[]) => void;
  onUserOnline?: (user: any) => void;
  onUserOffline?: (data: any) => void;
  onTyping?: (data: any) => void;
  onStopTyping?: (data: any) => void;
  onSearchResults?: (users: any[]) => void;
  onConversationStarted?: (data: any) => void;
}

export const useSocket = (handlers: SocketEventHandlers = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Memoize handlers to prevent unnecessary re-renders
  const memoizedHandlers = useMemo(() => handlers, [
    handlers.onConnect,
    handlers.onDisconnect,
    handlers.onNewMessage,
    handlers.onUsersList,
    handlers.onUserOnline,
    handlers.onUserOffline,
    handlers.onTyping,
    handlers.onStopTyping,
    handlers.onSearchResults,
    handlers.onConversationStarted,
  ]);

  // Create stable callbacks
  const sendMessage = useCallback((data: {
    to: string;
    message: string;
    type?: 'text' | 'image' | 'file' | 'voice' | 'video';
    fileUrl?: string;
    fileName?: string;
  }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', {
        ...data,
        type: data.type || 'text'
      });
    }
  }, [isConnected]);

  const getUsers = useCallback(() => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('get-users');
    }
  }, [isConnected]);

  const searchUsers = useCallback((searchTerm: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('search-users', searchTerm);
    }
  }, [isConnected]);

  const startConversation = useCallback((targetUserId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('start-conversation', targetUserId);
    }
  }, [isConnected]);

  const sendTyping = useCallback((to: string, chatId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', { to, chatId });
    }
  }, [isConnected]);

  const sendStopTyping = useCallback((to: string, chatId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('stop-typing', { to, chatId });
    }
  }, [isConnected]);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('medicare_token');
    
    if (!token) {
      console.log('No authentication token found for socket');
      return;
    }

    // Don't reconnect if already connected
    if (socketRef.current?.connected) {
      console.log('Socket already connected');
      return;
    }

    console.log('Initializing socket connection...');
    
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 5000,
      autoConnect: true
    });

    // Store socket reference
    socketRef.current = socket;

    // Setup event listeners
    const onConnect = () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
      memoizedHandlers.onConnect?.();
    };

    const onDisconnect = () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
      memoizedHandlers.onDisconnect?.();
    };

    const onConnectError = (error: any) => {
      console.error('Socket connection error:', error);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('connection-success', () => {
      console.log('Socket authenticated successfully');
    });

    // Message events
    socket.on('new-message', (message: any) => {
      memoizedHandlers.onNewMessage?.(message);
    });

    socket.on('users-list', (users: any[]) => {
      memoizedHandlers.onUsersList?.(users);
    });

    socket.on('user-online', (user: any) => {
      memoizedHandlers.onUserOnline?.(user);
    });

    socket.on('user-offline', (data: any) => {
      memoizedHandlers.onUserOffline?.(data);
    });

    socket.on('typing', (data: any) => {
      memoizedHandlers.onTyping?.(data);
    });

    socket.on('stop-typing', (data: any) => {
      memoizedHandlers.onStopTyping?.(data);
    });

    socket.on('search-results', (users: any[]) => {
      memoizedHandlers.onSearchResults?.(users);
    });

    socket.on('conversation-started', (data: any) => {
      memoizedHandlers.onConversationStarted?.(data);
    });

    // Connect the socket
    socket.connect();

    // Cleanup function
    return () => {
      console.log('Cleaning up socket connection...');
      
      // Remove all listeners
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('new-message');
      socket.off('users-list');
      socket.off('user-online');
      socket.off('user-offline');
      socket.off('typing');
      socket.off('stop-typing');
      socket.off('search-results');
      socket.off('conversation-started');
      
      // Disconnect socket
      if (socket.connected) {
        socket.disconnect();
      }
      
      // Clear reference
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [memoizedHandlers]); // Only depend on memoizedHandlers

  return {
    isConnected,
    sendMessage,
    getUsers,
    searchUsers,
    startConversation,
    sendTyping,
    sendStopTyping
  };
};