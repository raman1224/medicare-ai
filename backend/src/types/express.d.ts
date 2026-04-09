import { IUser } from '../models/User';
import { AuthUser } from './auth.types';

declare global {
  namespace Express {
    interface User {
      id: string;
      _id: string;
      name: string;
      email: string;
      role: string;
    }

    interface Request {
      user?: any;
            authUser?: AuthUser;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];

    }
  }
}