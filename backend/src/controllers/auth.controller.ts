/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest, ApiResponse } from '../types';
import { logInfo } from '../utils/logger';

export class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, role, phoneNumber, dateOfBirth } = req.body;

      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
        role,
        phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      });

      const response: ApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: result.data,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login({
        email,
        password,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: result.data,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshToken(refreshToken);

      const response: ApiResponse = {
        success: true,
        message: 'Token refreshed successfully',
        data: result.data,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new Error('User not authenticated'));
      }

      const response: ApiResponse = {
        success: true,
        message: 'User profile retrieved successfully',
        data: req.user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new Error('User not authenticated'));
      }

      const { oldPassword, newPassword } = req.body;

      await authService.changePassword(req.user.id, oldPassword, newPassword);

      const response: ApiResponse = {
        success: true,
        message: 'Password changed successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email
   * POST /api/v1/auth/verify-email
   */
  async verifyEmail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new Error('User not authenticated'));
      }

      await authService.verifyEmail(req.user.id);

      const response: ApiResponse = {
        success: true,
        message: 'Email verified successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout (client-side token deletion)
   * POST /api/v1/auth/logout
   */
  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        logInfo('User logged out', {
          userId: req.user.id,
        });
      }

      const response: ApiResponse = {
        success: true,
        message: 'Logout successful',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
