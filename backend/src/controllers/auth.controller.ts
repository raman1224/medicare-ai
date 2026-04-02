

import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Doctor from '../models/Doctor';
import { sendEmail } from '../services/email.service';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'medicare-nepal-secret-key-2024';
  return jwt.sign({ id: userId }, secret, { expiresIn: '30d' });
};

const sendTokenResponse = (user: IUser, statusCode: number, res: Response): void => {
  const token = generateToken(user._id.toString());

  const userResponse = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    country: user.country,
    language: user.language,
    avatar: user.avatar,
    isVerified: user.isVerified,
  };

  // CRITICAL FIX: Cookie options that work
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Must be false for localhost
    sameSite: 'lax', // 'lax' works for localhost
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/'
  });

  console.log('✅ Token cookie set for user:', user.email);
  console.log('✅ Cookie path: /, sameSite: lax, httpOnly: true');

  res.status(statusCode).json({
    success: true,
    token,
    user: userResponse,
  });
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    if (!user) {
      console.error('No user in request after Google OAuth');
      res.redirect(`${process.env.CLIENT_URL}/auth/login?error=oauth_failed`);
      return;
    }

    const token = generateToken(user._id.toString());
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      country: user.country,
      language: user.language,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };

    // Set cookie before redirect
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    const encodedUserData = encodeURIComponent(JSON.stringify(userData));
    res.redirect(`${process.env.CLIENT_URL}/auth/oauth-callback?token=${token}&user=${encodedUserData}`);
  } catch (error: any) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/login?error=oauth_failed`);
  }
};

export const githubCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    if (!user) {
      console.error('No user in request after GitHub OAuth');
      res.redirect(`${process.env.CLIENT_URL}/auth/login?error=oauth_failed`);
      return;
    }

    const token = generateToken(user._id.toString());
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      country: user.country,
      language: user.language,
      avatar: user.avatar,
      isVerified: user.isVerified,
    };

    // Set cookie before redirect
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    const encodedUserData = encodeURIComponent(JSON.stringify(userData));
    res.redirect(`${process.env.CLIENT_URL}/auth/oauth-callback?token=${token}&user=${encodedUserData}`);
  } catch (error: any) {
    console.error('GitHub callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/login?error=oauth_failed`);
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, country, language, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email and password' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User already exists with this email' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      country: country || 'Nepal',
      language: language || 'en',
      role: role || 'patient',
    });

    if (role === 'doctor') {
      try {
        await Doctor.create({
          user: user._id,
          licenseNumber: req.body.licenseNumber || '',
          specialization: req.body.specialization || 'General',
          qualifications: req.body.qualifications || [],
          experience: req.body.experience || 0,
          consultationFee: req.body.consultationFee || 0,
        });
      } catch (doctorError) {
        console.error('Error creating doctor profile:', doctorError);
      }
    }

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'User with this email already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.cookie('token', 'none', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: new Date(Date.now() + 10 * 1000),
    path: '/'
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user?.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        language: user.language,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'phone', 'dateOfBirth', 'gender', 'bloodGroup', 'avatar'];
    
    const filteredUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      (req as any).user?.id,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(404).json({ success: false, message: 'No user found with this email' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Medicare Nepal',
      html: `<h1>Password Reset Request</h1><p>Click the link to reset your password:</p><a href="${resetUrl}">Reset Password</a><p>Link expires in 10 minutes.</p>`,
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired token' });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid verification token' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error: any) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Current password is incorrect' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};