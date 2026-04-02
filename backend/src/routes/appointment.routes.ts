// src/routes/appointment.routes.ts
import { Router } from 'express';
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getAvailableSlots,
  confirmAppointment,
  completeAppointment,
  getAppointmentStatistics,
} from '../controllers/appointment.controller';
import { protect, checkVerification } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { body, query } from 'express-validator';

const router = Router();

router.use(protect as any);
router.use(checkVerification as any);

router.get('/', [
  query('status').optional().isIn(['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-Show']),
  query('date').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validate,
], getAppointments);

router.get('/slots/:doctorId', [
  query('date').isISO8601(),
  validate,
], getAvailableSlots);

router.post('/', [
  body('doctor').isMongoId(),
  body('type').isIn(['Video', 'In-Person', 'Chat']),
  body('date').isISO8601(),
  body('timeSlot').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('reason').notEmpty().trim().isLength({ max: 500 }), // FIXED: Changed maxLength to isLength
  body('symptoms').optional().isArray(),
  validate,
], createAppointment);

router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', cancelAppointment);
router.patch('/:id/confirm', confirmAppointment);
router.patch('/:id/complete', completeAppointment);

router.get('/stats/me', getAppointmentStatistics);

export default router;
