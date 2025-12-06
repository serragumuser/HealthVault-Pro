/**
 * Authentication Routes
 * Defines all authentication-related endpoints
 */

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  changePasswordValidator,
} from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  registerValidator,
  validate(registerValidator),
  authController.register.bind(authController)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  loginValidator,
  validate(loginValidator),
  authController.login.bind(authController)
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  refreshTokenValidator,
  validate(refreshTokenValidator),
  authController.refreshToken.bind(authController)
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser.bind(authController)
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  changePasswordValidator,
  validate(changePasswordValidator),
  authController.changePassword.bind(authController)
);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email
 * @access  Private
 */
router.post(
  '/verify-email',
  authenticate,
  authController.verifyEmail.bind(authController)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token deletion)
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  authController.logout.bind(authController)
);

export default router;
