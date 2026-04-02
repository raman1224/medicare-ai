



import { Router } from 'express';
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailability,
  updateDoctorProfile,
  getDoctorAppointments,
  verifyDoctor,
  searchDoctors,
  getTopDoctors,
} from '../controllers/doctor.controller';
import { protect, authorize, checkVerification } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { query } from 'express-validator';

const router = Router();

// Public routes
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('maxFee').optional().isFloat({ min: 0 }),
  validate,
], getDoctors);

router.get('/top', getTopDoctors);
router.get('/search', searchDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);

// Protected routes - FIXED: Type assertion for middleware
router.use(protect as any);
router.use(checkVerification as any);

router.post('/', authorize('admin') as any, createDoctor);
router.put('/profile/:id', authorize('doctor', 'admin') as any, updateDoctorProfile); // Changed endpoint
router.delete('/:id', authorize('admin') as any, deleteDoctor);
router.put('/:id', authorize('doctor', 'admin') as any, updateDoctor);
router.get('/:id/appointments', authorize('doctor', 'admin') as any, getDoctorAppointments);

// Admin routes
router.patch('/:id/verify', authorize('admin') as any, verifyDoctor);

export default router;
