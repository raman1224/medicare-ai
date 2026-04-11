

"use client";

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Send, Phone, Video, Mic, Paperclip, FileText, 
  Download, X, Pause, Play
} from 'lucide-react';
import Image from 'next/image';
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice' | 'video' | 'emergency';
  fileUrl?: string;
  fileName?: string;
  duration?: number; // For voice messages
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      content: 'Hello! I am your AI Health Assistant. How can I help you today?', 
      sender: 'other', 
      timestamp: new Date(), 
      type: 'text' 
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const token = localStorage.getItem('medicare_token');
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      
      // Join chat room
      newSocket.emit('join-chat', 'ai-chat');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    });

    newSocket.on('new-message', (data) => {
      console.log('New message received:', data);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content: data.message,
        sender: 'other',
        timestamp: new Date(data.timestamp),
        type: 'text'
      }]);
    });

    newSocket.on('message-sent', (data) => {
      console.log('Message sent confirmation:', data);
    });

    newSocket.on('user-typing', (data) => {
      if (data.userId !== socket?.id) {
        setIsTyping(true);
      }
    });

    newSocket.on('user-stop-typing', () => {
      setIsTyping(false);
    });

    newSocket.on('call-received', (data) => {
      console.log('Incoming call:', data);
      // Handle incoming call
    });

    newSocket.on('emergency-received', (data) => {
      console.log('Emergency alert:', data);
      // Show emergency notification
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content: `🚨 EMERGENCY: ${data.symptoms.join(', ')} at ${data.location}`,
        sender: 'other',
        timestamp: new Date(data.timestamp),
        type: 'emergency'
      }]);
    });

    newSocket.on('chat-error', (error) => {
      console.error('Chat error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', {
        chatId: 'ai-chat',
        to: 'ai',
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', {
          chatId: 'ai-chat',
          to: 'ai',
        });
      }, 1000);
    }
  };

  const sendMessage = async (message: string, type: 'text' | 'image' | 'file' | 'voice' = 'text', file?: File, messageId?: string) => {
    if (!message.trim() && !file) return;

    const userMessage: Message = {
      id: messageId || crypto.randomUUID(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type,
      fileName: file?.name,
    };

    setMessages(prev => [...prev, userMessage]);

    // Send via WebSocket
    if (socket) {
      socket.emit('chat-message', {
        message,
        chatId: 'ai-chat',
        to: 'ai',
        type,
        fileInfo: file ? {
          name: file.name,
          type: file.type,
          size: file.size,
        } : undefined,
      });
    }

    // Upload file if exists
    if (file) {
      await uploadFile(file);
    }

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand. Can you tell me more about your symptoms?",
        "Based on what you've described, I recommend drinking plenty of fluids and resting.",
        "It's important to consult with a doctor if symptoms persist for more than 3 days.",
        "I can help you find nearby hospitals or schedule an appointment if needed.",
      ];
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'other',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input, 'text', undefined);
    setInput('');
    setSelectedFile(null);
    setShowFilePreview(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowFilePreview(true);
      
      if (file.type.startsWith('image/')) {
        await sendMessage('Sending an image...', 'image', file);
      } else {
        await sendMessage(`Sending file: ${file.name}`, 'file', file);
      }
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/v1/chat/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('medicare_token')}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      console.log('File uploaded:', data);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
        
        await sendMessage('Voice message', 'voice', audioFile);
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (audioRecorderRef.current && isRecording) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleVideoCall = () => {
    if (socket) {
      socket.emit('call-user', {
        to: 'ai',
        from: socket.id,
        signal: { type: 'offer' },
      });
    }
  };

  const handleEmergencyCall = () => {
    if (socket) {
      socket.emit('emergency-alert', {
        location: 'Current Location',
        symptoms: ['Emergency assistance needed'],
        contact: localStorage.getItem('user_phone') || '',
      });
    }

    alert('🚨 Emergency alert sent! Help is on the way.');
  };

  return (
    <div className="flex flex-col h-[600px] rounded-2xl glass-card overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-white">AI Health Assistant</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-400">
                  {isConnected ? 'Online • 24/7' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleVideoCall}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'emergency'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : message.type === 'image'
                    ? 'bg-transparent'
                    : message.type === 'file'
                    ? 'bg-blue-500/10 border border-blue-500/20'
                    : message.type === 'voice'
                    ? 'bg-purple-500/10 border border-purple-500/20'
                    : message.sender === 'user'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                {message.type === 'image' && message.fileUrl ? (
                  <div className="relative">
                    <Image 
                      src={message.fileUrl} 
                      alt="Uploaded" 
                      width={256}
                      height={256}
                      className="rounded-lg"
                    />
                    <div className="mt-2 text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ) : message.type === 'file' ? (
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{message.fileName}</p>
                      <button className="mt-1 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ) : message.type === 'voice' ? (
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                      {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <div className="flex-1">
                      <p className="text-white">Voice message</p>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-3/4"></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
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
      </div>

      {/* File Preview */}
      {showFilePreview && selectedFile && (
        <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white text-sm">{selectedFile.name}</p>
              <p className="text-gray-400 text-xs">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              setSelectedFile(null);
              setShowFilePreview(false);
            }}
            className="p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms or ask a health question..."
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <label className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <FileText className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              <label className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-1 ${isRecording ? 'text-red-400' : 'text-gray-400'} hover:text-white`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() && !selectedFile}
            className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setInput('What should I do for fever?')}
            className="px-3 py-1.5 rounded-full text-sm bg-white/5 text-gray-300 hover:bg-white/10"
          >
            Fever advice
          </button>
          <button
            onClick={() => setInput('Medication for headache?')}
            className="px-3 py-1.5 rounded-full text-sm bg-white/5 text-gray-300 hover:bg-white/10"
          >
            Headache relief
          </button>
          <button
            onClick={() => setInput('When to see a doctor?')}
            className="px-3 py-1.5 rounded-full text-sm bg-white/5 text-gray-300 hover:bg-white/10"
          >
            Doctor consultation
          </button>
          <button
            onClick={handleEmergencyCall}
            className="px-3 py-1.5 rounded-full text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            🚨 Emergency
          </button>
        </div>
      </div>
    </div>
  );
}