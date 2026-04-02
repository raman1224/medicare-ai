


import { Request, Response, NextFunction } from 'express';

// Custom error class
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err } as AppError;
  error.message = err.message;

  // Log error for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map((val: any) => val.message);
    const message = `Invalid input data. ${messages.join('. ')}`;
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    error = new AppError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export { AppError };
export default errorHandler;
