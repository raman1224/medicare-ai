import { Router } from 'express';
import { upload } from '../config/cloudinary';
import {
  analyzeXRay,
  analyzeMedicalImage,
  analyzeMedicine,  // Add this import
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getAnalysisStatistics,
} from '../controllers/analysis.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

// Medicine analysis route (Google Lens style)
router.post('/medicine', upload.single('image'), analyzeMedicine);

// Other routes
router.post('/xray', upload.single('image'), analyzeXRay);
router.post('/medical-image', upload.single('image'), analyzeMedicalImage);
router.get('/history', getAnalysisHistory);
router.get('/stats/me', getAnalysisStatistics);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

export default router;