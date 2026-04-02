// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
    });
    return;
  }

  next();
};

// Custom validators
export const validatePhone = (value: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(value);
};

export const validateEmail = (value: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(value);
};

export const validateBloodGroup = (value: string): boolean => {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  return validGroups.includes(value);
};

export const validateDate = (value: string): boolean => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
};
