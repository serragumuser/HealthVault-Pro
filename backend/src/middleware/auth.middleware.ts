/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JWTPayload, AppError, UserRole } from '../types';
import config from '../config';
import { logWarn } from '../utils/logger';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, true, 'NO_TOKEN');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        phoneNumber: decoded.phoneNumber,
        dateOfBirth: decoded.dateOfBirth,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401, true, 'TOKEN_EXPIRED');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401, true, 'INVALID_TOKEN');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user has required role(s)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401, true, 'NOT_AUTHENTICATED');
      }

      if (!allowedRoles.includes(req.user.role)) {
        logWarn('Unauthorized access attempt', {
          userId: req.user.id,
          role: req.user.role,
          requiredRoles: allowedRoles,
          path: req.path,
        });

        throw new AppError(
          'Insufficient permissions',
          403,
          true,
          'INSUFFICIENT_PERMISSIONS'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          firstName: decoded.firstName || '',
          lastName: decoded.lastName || '',
          phoneNumber: decoded.phoneNumber,
          dateOfBirth: decoded.dateOfBirth,
        };
      } catch (error) {
        // Silently fail for optional auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
