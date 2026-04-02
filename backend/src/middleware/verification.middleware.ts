// medicare-nepal/backend/src/middleware/verification.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const checkVerification = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  // Get user from request (added by auth middleware)
  const user = req.authUser || req.user;
  
  if (!user) {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized' 
    });
    return;
  }

  // Check if user is verified (you can customize this logic)
  // For now, we'll just pass through
  // You can add verification logic here later
  
  next();
};