// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import doctorRoutes from './doctor.routes';
import medicineRoutes from './medicine.routes';
import hospitalRoutes from './hospital.routes';
import bloodRoutes from './blood.routes';
import chatRoutes from './chat.routes';
import appointmentRoutes from './appointment.routes';
import analysisRoutes from './analysis.routes';
// import fitnessRoutes from './fitness.routes';
// import chattingRoutes from './chatting.routes';
import userRoutes from './user.routes';
import contactRoutes from './contact.routes'; // Add this line

const router = Router();
// Test OAuth configuration
router.get('/test-oauth', (req, res) => {
  const googleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  const githubConfigured = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET;
  
  res.json({
    success: true,
    message: 'OAuth Configuration Test',
    data: {
      google: {
        configured: googleConfigured,
        clientId: process.env.GOOGLE_CLIENT_ID ? 'Set (hidden)' : 'Not set',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set (hidden)' : 'Not set',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL
      },
      github: {
        configured: githubConfigured,
        clientId: process.env.GITHUB_CLIENT_ID ? 'Set (hidden)' : 'Not set',
        clientSecret: process.env.GITHUB_CLIENT_SECRET ? 'Set (hidden)' : 'Not set',
        callbackUrl: process.env.GITHUB_CALLBACK_URL
      },
      envLoaded: process.env.NODE_ENV || 'development'
    }
  });
});


router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/medicines', medicineRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/blood', bloodRoutes);
router.use('/chat', chatRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/analysis', analysisRoutes);
// router.use('/fitness', fitnessRoutes);
// router.use('/chatting', chattingRoutes);
router.use('/users', userRoutes); // Add this line
router.use('/contact', contactRoutes); // Add this line

export default router;
