// // src/routes/blood.routes.ts
// import { Router } from 'express';
// import {
//   getBloodRequests,
//   createBloodRequest,
//   getBloodRequestById,
//   updateBloodRequest,
//   deleteBloodRequest,
//   getDonors,
//   registerAsDonor,
//   updateDonorStatus,
//   getDonorStatistics,
//   matchDonorsToRequest,
// } from '../controllers/blood.controller';
// import { protect, checkVerification } from '../middleware/auth.middleware';
// import { validate } from '../middleware/validation.middleware';
// import { body, query } from 'express-validator';

// const router = Router();

// // Public routes
// router.get('/requests', [
//   query('bloodGroup').optional().isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
//   query('urgency').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
//   query('province').optional().isString(),
//   validate,
// ], getBloodRequests);

// router.get('/donors', [
//   query('bloodGroup').optional().isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
//   query('location').optional().isString(),
//   validate,
// ], getDonors);

// router.get('/stats', getDonorStatistics);

// // Protected routes
// router.use(protect);
// router.use(checkVerification);

// router.post('/requests', [
//   body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
//   body('units').isInt({ min: 1, max: 10 }),
//   body('urgency').isIn(['Low', 'Medium', 'High', 'Critical']),
//   body('hospital').isMongoId(),
//   body('requiredBy').isISO8601(),
//   body('patientInfo.name').notEmpty(),
//   body('patientInfo.age').isInt({ min: 0 }),
//   body('patientInfo.gender').isIn(['male', 'female', 'other']),
//   body('patientInfo.condition').notEmpty(),
//   body('contact.phone').matches(/^[0-9]{10}$/),
//   body('contact.relationship').notEmpty(),
//   body('location.province').notEmpty(),
//   body('location.district').notEmpty(),
//   body('location.address').notEmpty(),
//   validate,
// ], createBloodRequest);

// router.get('/requests/:id', getBloodRequestById);
// router.put('/requests/:id', updateBloodRequest);
// router.delete('/requests/:id', deleteBloodRequest);

// router.post('/donors/register', [
//   body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
//   body('lastDonation').optional().isISO8601(),
//   body('available').optional().isBoolean(),
//   validate,
// ], registerAsDonor);

// router.put('/donors/status', updateDonorStatus);
// router.post('/requests/:id/match', matchDonorsToRequest);

// export default router;




// backend/src/routes/blood.routes.ts
import { Router } from 'express';
import {
  getBloodRequests,
  createBloodRequest,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
  getDonors,
  registerAsDonor,
  updateDonorStatus,
  getDonorStatistics,
  matchDonorsToRequest,
  getDonorProfile,
  getMyDonations,
  getMyRequests
} from '../controllers/blood.controller';
import { protect, checkVerification } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { body, query } from 'express-validator';

const router = Router();

// ==================== PUBLIC ROUTES ====================
router.get('/requests', getBloodRequests);
router.get('/donors', getDonors);
router.get('/statistics', getDonorStatistics);

// ==================== PROTECTED ROUTES ====================
router.use(protect);
router.use(checkVerification);

// Blood Request Routes
router.post('/requests', [
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
  body('units').isInt({ min: 1, max: 10 }),
  body('urgency').isIn(['Low', 'Medium', 'High', 'Critical']),
  body('hospital').isString(),
  body('requiredBy').isISO8601(),
  body('patientInfo.name').notEmpty(),
  body('patientInfo.age').isInt({ min: 0 }),
  body('patientInfo.gender').isIn(['male', 'female', 'other']),
  body('patientInfo.condition').notEmpty(),
  body('contact.phone').matches(/^[0-9]{10}$/),
  body('contact.relationship').notEmpty(),
  body('location.province').notEmpty(),
  body('location.district').notEmpty(),
  body('location.address').notEmpty(),
  validate,
], createBloodRequest);

router.get('/requests/:id', getBloodRequestById);
router.put('/requests/:id', updateBloodRequest);
router.delete('/requests/:id', deleteBloodRequest);
router.post('/requests/:id/match', matchDonorsToRequest);

// Donor Routes
router.get('/donor/profile', getDonorProfile);
router.post('/donors/register', [
  body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
  body('lastDonation').optional().isISO8601(),
  body('available').optional().isBoolean(),
  validate,
], registerAsDonor);

router.put('/donors/status', updateDonorStatus);
router.get('/donors/donations', getMyDonations);
router.get('/requests/my', getMyRequests);

export default router;