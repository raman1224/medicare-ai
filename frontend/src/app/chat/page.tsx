"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";

import { 
  Send, Mic, MicOff, User, Bot, Volume2, VolumeX, 
  AlertTriangle, Phone,
  Heart, Thermometer, Brain, Zap, Sparkles,
  Loader2,  X, CheckCircle
} from "lucide-react";
import { api } from "@/lib/api";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isVoiceMessage?: boolean;
  audioUrl?: string;
  ttsAudio?: string;
  emergency?: {
    detected: boolean;
    severity: string;
    action: string;
  };
}

interface VoiceRecorder {
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  icon: React.ReactNode;
}

export default function ChatPage() {
  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
    id: Date.now().toString(), // ✅ Use timestamp for unique ID
      text: "👋 Hello! I'm Dr. AI, your 24/7 health assistant. I can understand both text and voice messages. How can I help you today?", 
      sender: "ai", 
      timestamp: new Date(),
      emergency: { detected: false, severity: "low", action: "" }
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice states
  const [voiceRecorder, setVoiceRecorder] = useState<VoiceRecorder>({
    isRecording: false,
    mediaRecorder: null,
    audioChunks: []
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  
  // UI states
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<any>(null);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [quickActions, setQuickActions] = useState([
    { text: "🤒 Headache relief", icon: "🤒" },
    { text: "🌡️ Fever management", icon: "🌡️" },
    { text: "💊 Medicine advice", icon: "💊" },
    { text: "🏥 Emergency check", icon: "🏥" },
    { text: "🎤 Voice message", icon: "🎤" },
    { text: "📊 Symptom analysis", icon: "📊" }
  ]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  // Emergency contacts
  const emergencyContacts: EmergencyContact[] = [
    { name: "Ambulance", number: "102", description: "Medical Emergency", icon: "🚑" },
    { name: "Police", number: "100", description: "Police Emergency", icon: "👮" },
    { name: "Fire Brigade", number: "101", description: "Fire Emergency", icon: "🚒" },
    { name: "Women Helpline", number: "1144", description: "Women Safety", icon: "👩" },
    { name: "Mental Health", number: "1660", description: "Psychological Support", icon: "🧠" }
  ];

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeSpeechRecognition();
    }

    // Load initial chat history
    loadChatHistory();

    return () => {
      stopSpeechRecognition();
      stopAllAudio();
    };
  }, []);

  const initializeSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true; // FIXED: Added .current
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setInput("🎤 Listening... Speak now");
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (input !== "🎤 Listening... Speak now" && input.trim()) {
        handleSend();
      }
    };
  }
};

  const startSpeechRecognition = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      alert("Please allow microphone access for voice input.");
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Convert to base64 for sending
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await sendVoiceMessage(base64Audio);
        };

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setVoiceRecorder({
        isRecording: true,
        mediaRecorder,
        audioChunks
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required for voice messages.");
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecorder.mediaRecorder && voiceRecorder.isRecording) {
      voiceRecorder.mediaRecorder.stop();
      setVoiceRecorder(prev => ({ ...prev, isRecording: false }));
    }
  };

  const loadChatHistory = async () => {
    try {
    const response = await api.get('/api/v1/chat/history');
      if (response.success && response.data) {
      const historyMessages: ChatMessage[] = response.data.map((msg: any, index: number) => ({
        id: `history-${Date.now()}-${index}-${msg._id}`, // ✅ Create unique ID
          text: msg.response,
          sender: "ai",
          timestamp: new Date(msg.timestamp),
          emergency: msg.emergency
        }));
        setMessages(prev => [...historyMessages, ...prev]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const sendVoiceMessage = async (audioData: string) => {
    const tempMessage: ChatMessage = {
    id: `temp-${Date.now()}-${Math.random()}`, // ✅ Unique temp ID
      text: "🎤 Voice message...",
      sender: "user",
      timestamp: new Date(),
      isVoiceMessage: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setIsLoading(true);

    try {
    const response = await api.post('/api/v1/chat/message', {
        isVoiceMessage: true,
        audioData,
        requestTTS: ttsEnabled
      });

      if (response.success) {
        const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}-${Math.random()}`, // ✅ Unique AI message ID
          text: response.data.aiResponse,
          sender: "ai",
          timestamp: new Date(),
          ttsAudio: response.data.ttsAudio,
          emergency: response.emergency
        };

        setMessages(prev => [...prev.slice(0, -1), aiMessage]);
        
        // Handle emergency
        if (response.emergency?.detected) {
          setEmergencyDetected(true);
          setActiveEmergency(response.emergency);
          speakEmergencyAlert(response.emergency);
        }

        // Play TTS if available
        if (response.data.ttsAudio && ttsEnabled) {
          playTTS(response.data.ttsAudio);
        }
      }
    } catch (error) {
      console.error("Failed to send voice message:", error);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
    id: `user-${Date.now()}-${Math.random()}`, // ✅ Unique user message ID
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
    const response = await api.post('/api/v1/chat/message', {
        message: input,
        requestTTS: ttsEnabled
      });

      if (response.success) {
        const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}-${Math.random()}`, // ✅ Unique AI message ID
          text: response.data.aiResponse,
          sender: "ai",
          timestamp: new Date(),
          ttsAudio: response.data.ttsAudio,
          emergency: response.emergency
        };

        setMessages(prev => [...prev, aiMessage]);

        // Handle emergency
        if (response.emergency?.detected) {
          setEmergencyDetected(true);
          setActiveEmergency(response.emergency);
          speakEmergencyAlert(response.emergency);
        }

        // Play TTS if available
        if (response.data.ttsAudio && ttsEnabled) {
          playTTS(response.data.ttsAudio);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessage = {
      id: `error-${Date.now()}-${Math.random()}`, // ✅ Unique error message ID
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = (base64Audio: string) => {
    if (!ttsEnabled) return;

    stopAllAudio();
    
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    audio.play();
    setIsSpeaking(true);

    audio.onended = () => {
      setIsSpeaking(false);
    };

    audio.onerror = () => {
      setIsSpeaking(false);
      console.error("Failed to play TTS audio");
    };
  };

  const speakEmergencyAlert = (emergency: any) => {
    const alertText = `Emergency detected: ${emergency.severity} severity. ${emergency.action}`;
    
    if (ttsEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(alertText);
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleQuickAction = (actionText: string) => {
    if (actionText.includes("Voice message")) {
      startVoiceRecording();
    } else if (actionText.includes("Emergency")) {
      setShowEmergencyContacts(true);
    } else {
      setInput(actionText);
      setTimeout(() => handleSend(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <DashboardNav />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Emergency Alert Modal */}
          <AnimatePresence>
            {emergencyDetected && activeEmergency && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl"
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/5 border border-red-500/30 backdrop-blur-lg">
                  <button
                    onClick={() => setEmergencyDetected(false)}
                    className="absolute top-4 right-4 p-1 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        🚨 {activeEmergency.severity.toUpperCase()} EMERGENCY DETECTED
                      </h3>
                      <p className="text-gray-300 mb-4">{activeEmergency.action}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => window.open(`tel:102`)}
                          className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-2 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Call Ambulance (102)
                        </button>
                        <button
                          onClick={() => setShowEmergencyContacts(true)}
                          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                        >
                          All Emergency Contacts
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emergency Contacts Modal */}
          <AnimatePresence>
            {showEmergencyContacts && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                onClick={() => setShowEmergencyContacts(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Emergency Contacts</h3>
                    <button
                      onClick={() => setShowEmergencyContacts(false)}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {emergencyContacts.map((contact, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{contact.icon}</div>
                            <div>
                              <h4 className="font-medium text-white">{contact.name}</h4>
                              <p className="text-sm text-gray-400">{contact.description}</p>
                            </div>
                          </div>
                          <a
                            href={`tel:${contact.number}`}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                          >
                            {contact.number}
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                {isSpeaking && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 animate-ping"></div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">Dr. AI Assistant</h1>
                <div className="flex flex-wrap items-center gap-2 text-gray-400">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    24/7 Available
                  </span>
                  <span>•</span>
                  <span>Free Medical Guidance</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Ready
                      </>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`p-3 rounded-xl flex items-center gap-2 ${
                    ttsEnabled 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="hidden sm:inline">TTS</span>
                </button>
                
                <button
                  onClick={() => setShowEmergencyContacts(true)}
                  className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <AlertTriangle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <div className="h-[600px] flex flex-col rounded-3xl glass-card overflow-hidden border border-white/10">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[85%] ${message.sender === "user" ? "ml-auto" : ""}`}>
                          <div className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-primary to-secondary"
                                : "bg-gradient-to-r from-green-500 to-emerald-500"
                            }`}>
                              {message.sender === "user" ? (
                                <User className="w-5 h-5 text-white" />
                              ) : (
                                <Bot className="w-5 h-5 text-white" />
                              )}
                            </div>
                            
                            {/* Message Bubble */}
                            <div className={`rounded-2xl px-5 py-3 ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-br-none"
                                : "bg-white/10 border border-white/10 rounded-bl-none"
                            }`}>
                              {message.isVoiceMessage ? (
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-full bg-white/10">
                                    <Volume2 className="w-4 h-4" />
                                  </div>
                                  <span className="text-gray-300">Voice message sent</span>
                                </div>
                              ) : (
                                <p className="text-white whitespace-pre-wrap">{message.text}</p>
                              )}
                              
                              <div className="flex items-center justify-between mt-3">
                                <span className={`text-xs ${
                                  message.sender === "user" ? "text-primary/70" : "text-gray-400"
                                }`}>
                                  {message.timestamp.toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                                
                                {message.sender === "ai" && message.ttsAudio && (
                                  <button
                                    onClick={() => playTTS(message.ttsAudio!)}
                                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Emergency Indicator */}
                          {message.emergency?.detected && (
                            <div className="mt-2 ml-14">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm">
                                <AlertTriangle className="w-3 h-3" />
                                Emergency Detected
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[85%]">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="rounded-2xl px-5 py-3 bg-white/10 border border-white/10 rounded-bl-none">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></div>
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-gray-300">Thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="px-6 pt-4 pb-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickAction(action.text)}
                        className="px-4 py-2 rounded-full text-sm bg-white/5 text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <span>{action.icon}</span>
                        {action.text.replace(/[^\w\s]/g, '')}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex gap-3">
                    {/* Voice Recording Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseDown={startVoiceRecording}
                      onMouseUp={stopVoiceRecording}
                      onTouchStart={startVoiceRecording}
                      onTouchEnd={stopVoiceRecording}
                      className={`p-4 rounded-xl flex-shrink-0 ${
                        voiceRecorder.isRecording
                          ? "bg-red-500/20 text-red-400 animate-pulse"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                      title="Hold to record voice message"
                    >
                      {voiceRecorder.isRecording ? (
                        <div className="relative">
                          <Mic className="w-5 h-5" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"></div>
                        </div>
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </motion.button>

                    {/* Speech-to-Text Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
                      className={`p-4 rounded-xl flex-shrink-0 ${
                        isListening
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {isListening ? (
                        <div className="relative">
                          <Mic className="w-5 h-5" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                        </div>
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </motion.button>

                    {/* Text Input */}
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={isListening ? "🎤 Listening... Speak now..." : "Describe your symptoms or ask a health question..."}
                        className="w-full pl-5 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        rows={3}
                        disabled={isLoading}
                      />
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={(!input.trim() && !isListening) || isLoading}
                        className="absolute right-3 bottom-3 p-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Capabilities Card */}
              <div className="p-6 rounded-2xl glass-card border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Features
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-green-400 font-medium mb-1 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Free AI Analysis
                    </div>
                    <p className="text-gray-300 text-sm">
                      Powered by Gemini AI - 1000+ free requests/month
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-blue-400 font-medium mb-1 flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Voice Features
                    </div>
                    <p className="text-gray-300 text-sm">
                      Voice input & output with TTS support
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-purple-400 font-medium mb-1 flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Symptom Analysis
                    </div>
                    <p className="text-gray-300 text-sm">
                      Instant analysis with ICD-10 codes
                    </p>
                  </div>
                </div>
              </div>

              {/* Voice Settings */}
              <div className="p-6 rounded-2xl glass-card border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Voice Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Speech Rate: {speechRate.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Text-to-Speech</span>
                    <button
                      onClick={() => setTtsEnabled(!ttsEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        ttsEnabled ? 'bg-primary' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          ttsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 rounded-2xl glass-card border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Chat Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-2xl font-bold text-white">{messages.length}</div>
                    <div className="text-xs text-gray-400">Total Messages</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-2xl font-bold text-white">
                      {messages.filter(m => m.sender === 'user').length}
                    </div>
                    <div className="text-xs text-gray-400">Your Messages</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-2xl font-bold text-white">
                      {messages.filter(m => m.isVoiceMessage).length}
                    </div>
                    <div className="text-xs text-gray-400">Voice Messages</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-center">
                    <div className="text-2xl font-bold text-white">
                      {messages.filter(m => m.emergency?.detected).length}
                    </div>
                    <div className="text-xs text-gray-400">Emergencies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}