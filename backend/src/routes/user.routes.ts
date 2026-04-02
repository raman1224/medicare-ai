
import express from 'express';
import { Response } from 'express';
import { getUsers, searchUsers, getUserProfile } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import User from '../models/User';
import BloodRequest from '../models/BloodRequest';
import { AuthRequest } from '../types/auth.types';

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/:userId', getUserProfile);

// Get current user profile
router.get('/me', async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.authUser?.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findById(req.authUser.id)
      .select('-password')
      .populate('donationHistory');
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in /me route:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user role to donor
router.put('/update-role', async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.authUser?.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findByIdAndUpdate(
      req.authUser.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in /update-role route:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update donor information
router.put('/donor-info', async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.authUser?.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findByIdAndUpdate(
      req.authUser.id,
      {
        bloodGroup: req.body.bloodGroup,
        donorAvailable: req.body.donorAvailable,
        lastDonation: req.body.lastDonation,
        emergencyContact: req.body.emergencyContact
      },
      { new: true }
    ).select('-password');
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in /donor-info route:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update donor availability status
router.put('/donor-status', async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.authUser?.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findByIdAndUpdate(
      req.authUser.id,
      { donorAvailable: req.body.available },
      { new: true }
    ).select('-password');
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in /donor-status route:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's donation history
router.get('/donations', async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.authUser?.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findById(req.authUser.id)
      .select('donationHistory');
    
    return res.json({
      success: true,
      data: user?.donationHistory || []
    });
  } catch (error) {
    console.error('Error in /donations route:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's blood requests
router.get('/blood-requests', async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.authUser?.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const requests = await BloodRequest.find({ patient: req.authUser.id })
      .sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error in /blood-requests route:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;