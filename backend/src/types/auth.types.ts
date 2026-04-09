// medicare-nepal/backend/src/types/auth.ts
import { Request } from 'express';

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

export interface AuthRequest extends Request {
  authUser?: AuthUser;
    user?: AuthUser;

}

export interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}