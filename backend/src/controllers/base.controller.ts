import { Response } from 'express';
import { AuthRequest } from '../types/auth.types';

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  protected sendError(res: Response, message: string, statusCode: number = 500, error?: any): Response {
    console.error(`Error: ${message}`, error);
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }

  protected getUserId(req: AuthRequest): string {
    // Use authUser instead of user
    if (!req.authUser?.id) {
      throw new Error('User not authenticated');
    }
    return req.authUser.id;
  }
}