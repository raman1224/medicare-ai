
import { Router } from 'express';
import {
  getSymptoms,
  analyzeSymptoms,
  getHistory,
  getCheckById
} from '../controllers/symptom.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes (no authentication needed)
router.get('/symptoms', getSymptoms);
router.post('/analyze', analyzeSymptoms);

// Protected routes (require authentication)
router.use(protect);
router.get('/history', getHistory);
router.get('/:id', getCheckById);

export default router;