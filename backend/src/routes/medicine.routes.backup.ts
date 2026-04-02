// src/routes/medicine.routes.ts
import { Router } from 'express';
import { upload } from '../config/cloudinary';
import {
  scanMedicine,
  searchMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  verifyMedicine,
  getMedicineCategories,
  getMedicineByGenericName,
  checkMedicineInteractions,
} from '../controllers/medicine.controller';
import { protect, authorize, checkVerification } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { body, query } from 'express-validator';

const router = Router();

// Public routes
router.get('/search', [
  query('query').optional().isString(),
  query('category').optional().isString(),
  query('requiresPrescription').optional().isIn(['true', 'false']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validate,
], searchMedicines);

router.get('/categories', getMedicineCategories);
router.get('/generic/:genericName', getMedicineByGenericName);
router.get('/:id', getMedicineById);

// Protected routes
router.use(protect);
router.use(checkVerification);

router.post('/scan', upload.single('image'), scanMedicine);

router.post('/interactions', [
  body('medicines').isArray().isLength({ min: 2 }),
  body('medicines.*').isMongoId(),
  validate,
], checkMedicineInteractions);

// Admin/Pharmacist routes
router.post('/', authorize('admin', 'pharmacist'), upload.array('images', 5), [
  body('name').isString().notEmpty(),
  body('genericName').isString().notEmpty(),
  body('brand').isString().notEmpty(),
  body('dosage').isString().notEmpty(),
  body('form').isIn(['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Inhaler', 'Other']),
  body('category').isIn(['Analgesic', 'Antibiotic', 'Antiviral', 'Antifungal', 'Antihistamine', 'Antacid', 'Antidepressant', 'Antidiabetic', 'Cardiovascular', 'CNS', 'Gastrointestinal', 'Hormonal', 'Vitamin', 'Other']),
  body('uses').isArray(),
  body('priceNepal.min').isFloat({ min: 0 }),
  body('priceNepal.max').isFloat({ min: 0 }),
  validate,
], addMedicine);

router.put('/:id', authorize('admin', 'pharmacist'), [
  body('lastUpdated').optional().isISO8601(),
  validate,
], updateMedicine);

router.patch('/:id/verify', authorize('admin'), [
  body('verified').isBoolean(),
  validate,
], verifyMedicine);

export default router;

// // medicare-nepal/backend/src/routes/medicine.routes.ts
// import express from 'express';
// import { Request, Response, NextFunction } from 'express';
// import { protect } from '../middleware/auth.middleware';
// import { checkVerification } from '../middleware/verification.middleware';
// import { authorize } from '../middleware/auth.middleware';
// import upload from '../config/cloudinary';
// import {
//   createMedicine,
//   getMedicines,
//   getMedicineById,
//   updateMedicine,
//   deleteMedicine,
//   verifyMedicine,
//   getPendingMedicines,
//   getVerifiedMedicines,
//   searchMedicines,
//   getMedicinesByCategory
// } from '../controllers/medicine.controller';

// const router = express.Router();

// // All medicine routes require authentication
// router.use(protect);

// // Public routes (but still need authentication)
// router.get('/', getMedicines);
// router.get('/verified', getVerifiedMedicines);
// router.get('/pending', getPendingMedicines);
// router.get('/search', searchMedicines);
// router.get('/category/:category', getMedicinesByCategory);
// router.get('/:id', getMedicineById);

// // Routes that need verification check
// router.use(checkVerification);

// // Protected routes (admin and pharmacist only)
// router.post(
//   '/',
//   authorize('admin', 'pharmacist'),
//   upload.array('images', 5),
//   createMedicine
// );

// router.put(
//   '/:id',
//   authorize('admin', 'pharmacist'),
//   upload.array('images', 5),
//   updateMedicine
// );

// router.patch(
//   '/:id/verify',
//   authorize('admin'),
//   verifyMedicine
// );

// router.delete(
//   '/:id',
//   authorize('admin', 'pharmacist'),
//   deleteMedicine
// );

// export default router;