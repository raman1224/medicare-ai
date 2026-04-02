import { IUser } from '../models/User';

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
      user?: User;
    }
  }
}