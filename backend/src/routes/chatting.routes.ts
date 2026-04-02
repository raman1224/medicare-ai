import express from 'express';
import { 
  uploadMessage, 
  getChats, 
  getMessages, 
  getUnreadCount 
} from '../controllers/chatting.controller';
import {protect} from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/upload', uploadMessage);
router.get('/chats', getChats);
router.get('/messages/:chatId', getMessages);
router.get('/unread', getUnreadCount);

export default router;