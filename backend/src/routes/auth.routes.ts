import { Router } from 'express';
import passport from '../config/oauth';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  googleCallback,
  githubCallback,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { body } from 'express-validator';

const router = Router();

// Public routes
router.post(
  '/register',
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('country').optional().isString(),
    body('language').optional().isString(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/verify/:token', verifyEmail);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  validate,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  resetPassword
);

// OAuth Routes - IMPORTANT: Don't use session: false here
router.get('/google',
   passport.authenticate('google', {
  scope: ['profile', 'email'],
      session: false

}));

router.get('/google/callback',
  passport.authenticate('google',
     { failureRedirect: '/auth/login?error=oauth_failed',
        session: false

   }),
  googleCallback
);

router.get('/github',
   passport.authenticate('github', {
  scope: ['user:email'],
      session: false

}));

router.get('/github/callback',
  passport.authenticate('github', 
    { failureRedirect: '/auth/login?error=oauth_failed',
        session: false

   }),
  githubCallback
);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.get('/logout', logout);

router.put(
  '/profile',
  [
    body('name').optional().trim(),
    body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
    body('dateOfBirth').optional().isISO8601().withMessage('Valid date required'),
  ],
  validate,
  updateProfile
);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  changePassword
);

export default router;