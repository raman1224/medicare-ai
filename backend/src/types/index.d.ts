import { IUser } from '../../models/User';

// Define AuthUser interface
export interface AuthUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  bloodGroup?: string;
  donorAvailable?: boolean;
  avatar?: string;
}
export interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}


// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
      // DON'T declare user here - let passport handle it
    }
  }
}

export {};