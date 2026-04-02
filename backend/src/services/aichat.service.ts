
// backend/src/services/aichat.service.ts
import axios from 'axios';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

class AIChatService {
  private geminiApiKey: string;
  private geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private userChatHistory: Map<string, ChatMessage[]> = new Map();

  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    console.log('🤖 AI Chat Service initialized', this.geminiApiKey ? '✅ Gemini ready' : '⚠️ Using mock mode');
  }

  getUserChatHistory(userId: string): ChatMessage[] {
    return this.userChatHistory.get(userId) || [];
  }

  saveUserMessage(userId: string, message: string, response: string): void {
    const history = this.userChatHistory.get(userId) || [];
    history.push({ role: 'user', content: message, timestamp: new Date() });
    history.push({ role: 'assistant', content: response, timestamp: new Date() });
    while (history.length > 50) history.shift();
    this.userChatHistory.set(userId, history);
  }

  clearUserChatHistory(userId: string): void {
    this.userChatHistory.delete(userId);
  }

  getUserChatStats(userId: string): any {
    const history = this.userChatHistory.get(userId) || [];
    return {
      totalMessages: history.length,
      emergencyMessages: 0,
      voiceMessages: 0,
      firstChat: history.length > 0 ? history[0].timestamp : null,
      lastChat: history.length > 0 ? history[history.length - 1].timestamp : null
    };
  }

  async chat(message: string, history: ChatMessage[] = []): Promise<string> {
    try {
      if (this.geminiApiKey) {
        return await this.callGeminiAPI(message, history);
      }
      return this.getMockResponse(message);
    } catch (error: any) {
      console.error('Chat error:', error.message);
      return this.getMockResponse(message);
    }
  }

  private async callGeminiAPI(message: string, history: ChatMessage[]): Promise<string> {
    try {
      const prompt = this.buildPrompt(message, history);
      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
      );
      return response.data.candidates[0]?.content?.parts[0]?.text || "I couldn't process that. Please try again.";
    } catch (error) {
      return this.getMockResponse(message);
    }
  }

  private buildPrompt(message: string, history: ChatMessage[]): string {
    let prompt = `You are Dr. AI, a friendly medical assistant in Nepal. 
Rules: Be helpful, add disclaimer, keep responses short.
`;
    for (const msg of history.slice(-3)) {
      prompt += `${msg.role === 'user' ? 'User' : 'Dr. AI'}: ${msg.content}\n`;
    }
    prompt += `User: ${message}\nDr. AI: `;
    return prompt;
  }

  private getMockResponse(message: string): string {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('fever')) return "🌡️ For fever: Rest, drink fluids, take Paracetamol. If fever > 103°F or lasts >3 days, see a doctor.\n\n⚠️ AI advice only.";
    if (lowerMsg.includes('headache')) return "🤕 For headache: Rest in dark room, apply cold compress, stay hydrated.\n\n⚠️ AI advice only.";
    if (lowerMsg.includes('cold') || lowerMsg.includes('cough')) return "😷 For cold/cough: Rest, warm fluids, honey in warm water, steam inhalation.\n\n⚠️ AI advice only.";
    if (lowerMsg.includes('chest pain') || lowerMsg.includes('emergency')) return "🚨 EMERGENCY! Call AMBULANCE: 102 immediately!\n\n⚠️ THIS IS A MEDICAL EMERGENCY.";
    return "👋 I'm Dr. AI. I can help with fever, headache, cold, cough. Describe your symptoms.\n\n⚠️ AI advice only. Consult a doctor for serious concerns.";
  }

  detectEmergency(message: string): { isEmergency: boolean; severity: string; action: string; confidence: number } {
    const emergencyKeywords = ['chest pain', 'heart attack', 'stroke', 'bleeding', 'unconscious', 'seizure', 'choking', "can't breathe"];
    const lowerMsg = message.toLowerCase();
    for (const keyword of emergencyKeywords) {
      if (lowerMsg.includes(keyword)) {
        return { isEmergency: true, severity: 'high', action: 'Call ambulance (102) immediately!', confidence: 0.9 };
      }
    }
    return { isEmergency: false, severity: 'low', action: 'Monitor symptoms', confidence: 0 };
  }

  async aiAnalyzeSymptoms(symptoms: string[], context?: any): Promise<any> {
    return {
      possibleConditions: ["Common Cold", "Viral Infection"],
      severity: "low",
      recommendedActions: ["Rest", "Stay hydrated", "Monitor symptoms"],
      shouldSeeDoctor: false
    };
  }

  async getICDCodesPublic(symptoms: string[]): Promise<string[]> {
    return ['R50.9', 'R05'];
  }

  async textToSpeech(text: string): Promise<Buffer | null> {
    return null;
  }

  async speechToText(audioBuffer: Buffer): Promise<string> {
    return "Voice message received. Please type your message.";
  }

  getEmergencyContacts(): any {
    return { ambulance: '102', police: '100', fire: '101', womenHelpline: '1144', mentalHealth: '1660' };
  }
}

export default new AIChatService();