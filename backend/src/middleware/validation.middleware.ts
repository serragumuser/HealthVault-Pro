/**
 * Validation Middleware
 * Request validation using express-validator
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../types';

/**
 * Validate request using express-validator chains
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined,
    }));

    // Create error response
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: formattedErrors,
    });
  };
};

/**
 * Sanitize request body by removing undefined and null values
 */
export const sanitizeBody = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined || req.body[key] === null) {
        delete req.body[key];
      }
    });
  }
  next();
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    if (page < 1) {
      throw new AppError('Page must be greater than 0', 400, true, 'INVALID_PAGE');
    }

    if (limit < 1 || limit > 100) {
      throw new AppError('Limit must be between 1 and 100', 400, true, 'INVALID_LIMIT');
    }

    req.query.page = String(page);
    req.query.limit = String(limit);

    next();
  } catch (error) {
    next(error);
  }
};
