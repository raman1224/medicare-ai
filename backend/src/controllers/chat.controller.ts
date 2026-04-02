

// backend/src/controllers/chat.controller.ts
import { Request, Response } from 'express';
import AIChatService from '../services/aichat.service';

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const history = AIChatService.getUserChatHistory(userId);
    const formattedHistory = history.map((msg, index) => ({
      _id: index.toString(),
      response: msg.content,
      sender: msg.role,
      timestamp: msg.timestamp || new Date(),
      emergency: AIChatService.detectEmergency(msg.content)
    }));
    res.json({ success: true, data: formattedHistory, count: history.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, requestTTS } = req.body;
    const userId = (req as any).user?.id;

    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    const history = AIChatService.getUserChatHistory(userId);
    const aiHistory = history.map(msg => ({ role: msg.role, content: msg.content }));
    const emergencyDetection = AIChatService.detectEmergency(message);
    const aiResponse = await AIChatService.chat(message, aiHistory);
    
    AIChatService.saveUserMessage(userId, message, aiResponse);
    
    const responseData: any = {
      success: true,
      data: { messageId: Date.now().toString(), userMessage: message, aiResponse, timestamp: new Date(), ttsAvailable: false }
    };
    
    if (emergencyDetection.isEmergency) {
      responseData.emergency = {
        detected: true,
        severity: emergencyDetection.severity,
        action: emergencyDetection.action,
        emergencyContacts: { ambulance: '102', police: '100', fire: '101' }
      };
    }
    
    res.json(responseData);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to process message' });
  }
};

export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const history = AIChatService.getUserChatHistory(userId);
    res.json({ success: true, data: { conversationId: req.params.id, messages: history } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const aiAnalyzeSymptoms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !Array.isArray(symptoms)) {
      res.status(400).json({ success: false, message: 'Symptoms array required' });
      return;
    }
    const analysis = await AIChatService.aiAnalyzeSymptoms(symptoms);
    const icdCodes = await AIChatService.getICDCodesPublic(symptoms);
    res.json({ success: true, data: { ...analysis, icdCodes, disclaimer: '⚠️ AI analysis only.' } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to analyze symptoms' });
  }
};

export const getChatStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const stats = AIChatService.getUserChatStats(userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    AIChatService.clearUserChatHistory(userId);
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEmergencyContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = AIChatService.getEmergencyContacts();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getTTSAudio = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: false, message: 'TTS not available' });
};

export const processVoiceMessage = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: { transcribedText: 'Voice feature coming soon' } });
};