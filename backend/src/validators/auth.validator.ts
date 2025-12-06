/**
 * Authentication Validators
 * Validation schemas for authentication endpoints
 */

import { body } from 'express-validator';

/**
 * Registration validation
 */
export const registerValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('role')
    .isIn(['PATIENT', 'DOCTOR', 'NURSE', 'ADMIN', 'PHARMACIST'])
    .withMessage('Invalid role'),

  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Invalid phone number'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 0 || age > 150) {
        throw new Error('Invalid date of birth');
      }
      return true;
    }),
];

/**
 * Login validation
 */
export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Refresh token validation
 */
export const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token format'),
];

/**
 * Change password validation
 */
export const changePasswordValidator = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain uppercase, lowercase, number, and special character')
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];
