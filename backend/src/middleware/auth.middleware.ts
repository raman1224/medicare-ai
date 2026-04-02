import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthUser } from '../types/index';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Check for token in headers first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token from Authorization header');
    }
    
    // If no token in headers, check cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token from cookie');
    }

    if (!token) {
      console.log('No token found in request. Headers:', req.headers.authorization);
      console.log('Cookies:', req.cookies);
      res.status(401).json({ 
        success: false, 
        message: 'Not authorized - No token provided' 
      });
      return;
    }

    try {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json({ 
          success: false, 
          message: 'Not authorized - User not found' 
        });
        return;
      }

      // Create authUser object
      const authUser: AuthUser = {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        donorAvailable: user.donorAvailable,
        avatar: user.avatar
      };
      
      // Set authUser on request
      req.authUser = authUser;
      
      // For backward compatibility, use type assertion for user
      (req as any).user = authUser;

      next();
    } catch (jwtError) {
      res.status(401).json({ 
        success: false, 
        message: 'Not authorized - Invalid token' 
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication' 
    });
    return;
  }
};

// Authorize middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ 
        success: false, 
        message: 'Not authorized' 
      });
      return;
    }

    if (!roles.includes(req.authUser.role)) {
      res.status(403).json({ 
        success: false, 
        message: `User role ${req.authUser.role} is not authorized to access this route` 
      });
      return;
    }

    next();
  };
};

// Check verification middleware
export const checkVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.authUser;
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // FOR DEVELOPMENT/TESTING - Skip verification check
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log('DEV MODE: Skipping email verification check');
      next();
      return;
    }

    // Check if email is verified (you'll need to fetch the full user for this)
    const fullUser = await User.findById(user.id);
    
    if (!fullUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!fullUser.isVerified) {
      res.status(403).json({
        success: false,
        message: 'Please verify your email to access this feature',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Verification check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};