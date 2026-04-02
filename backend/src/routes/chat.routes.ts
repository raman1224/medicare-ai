// backend/src/routes/chat.routes.ts
import { Router } from 'express';
import {
  getChatHistory,
  sendMessage,
  getConversation,
  aiAnalyzeSymptoms,
  getChatStats,
  deleteConversation,
  getEmergencyContacts,
  getTTSAudio,
  processVoiceMessage
} from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(protect);

// Main chat routes
router.get('/history', getChatHistory);
router.get('/stats', getChatStats);
router.post('/message', sendMessage);
router.get('/conversation/:id', getConversation);
router.delete('/conversation/:id', deleteConversation);
router.get('/emergency-contacts', getEmergencyContacts);

// Symptom analysis
router.post('/analyze-symptoms', aiAnalyzeSymptoms);

// Voice features (mock for now)
router.post('/tts', getTTSAudio);
router.post('/voice/process', processVoiceMessage);

export default router;