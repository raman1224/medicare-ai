import { Router } from 'express';
import {
  getHospitals,
  getHospitalById,
  getHospitalDoctors,
  searchHospitalsByLocation,
  getEmergencyHospitals,
  addHospital,
  updateHospital,
  verifyHospital,
  getHospitalStatistics,
} from '../controllers/hospital.controller';
import { protect, authorize, checkVerification } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { query } from 'express-validator';

const router = Router();

// Public routes
router.get('/', [
  query('province').optional().isString(),
  query('district').optional().isString(),
  query('type').optional().isIn(['Government', 'Private', 'Community']),
  query('emergency').optional().isIn(['true', 'false']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validate,
], getHospitals);
router.get('/emergency', getEmergencyHospitals);
router.get('/search/location', searchHospitalsByLocation);
router.get('/:id', getHospitalById);
router.get('/:id/doctors', getHospitalDoctors);
router.get('/stats', getHospitalStatistics);
// Protected routes
router.use(protect);
router.use(checkVerification);

// Admin routes
router.post('/', authorize('admin'), addHospital);
router.put('/:id', authorize('admin'), updateHospital);
router.patch('/:id/verify', authorize('admin'), verifyHospital);

export default router;
