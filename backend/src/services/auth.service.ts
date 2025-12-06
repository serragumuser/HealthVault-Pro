/**
 * Authentication Service
 * Handles user authentication, JWT tokens, and password management
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole, UserStatus } from '@prisma/client';
import config from '../config';
import { prisma } from '../server';
import { AppError, ServiceResponse, AuthUser } from '../types';
import { logInfo, logError } from '../utils/logger';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: Date;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export class AuthService {
  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(config.security.bcryptSaltRounds);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verify password against hash
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Generate JWT refresh token
   */
  private generateRefreshToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  private generateTokens(user: User): AuthTokens {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<ServiceResponse<AuthResponse>> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (existingUser) {
        throw new AppError('Email already registered', 400, true, 'EMAIL_EXISTS');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(data.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
          status: UserStatus.PENDING_VERIFICATION,
        },
      });

      // Create role-specific profile
      if (data.role === UserRole.PATIENT) {
        await prisma.patient.create({
          data: {
            userId: user.id,
            gender: 'PREFER_NOT_TO_SAY',
          },
        });
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      logInfo('User registered successfully', {
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          tokens,
        },
      };
    } catch (error) {
      logError('Registration failed', error as Error, {
        email: data.email,
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Registration failed', 500, false);
    }
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<ServiceResponse<AuthResponse>> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (!user) {
        throw new AppError('Invalid credentials', 401, true, 'INVALID_CREDENTIALS');
      }

      // Check if user is active
      if (user.status === UserStatus.SUSPENDED) {
        throw new AppError('Account suspended', 403, true, 'ACCOUNT_SUSPENDED');
      }

      if (user.status === UserStatus.INACTIVE) {
        throw new AppError('Account inactive', 403, true, 'ACCOUNT_INACTIVE');
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(data.password, user.password);

      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401, true, 'INVALID_CREDENTIALS');
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate tokens
      const tokens = this.generateTokens(user);

      logInfo('User logged in successfully', {
        userId: user.id,
        email: user.email,
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          tokens,
        },
      };
    } catch (error) {
      logError('Login failed', error as Error, {
        email: data.email,
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Login failed', 500, false);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<ServiceResponse<AuthTokens>> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        id: string;
        email: string;
      };

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new AppError('User not found', 404, true, 'USER_NOT_FOUND');
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw new AppError('Account not active', 403, true, 'ACCOUNT_NOT_ACTIVE');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      logInfo('Token refreshed successfully', {
        userId: user.id,
      });

      return {
        success: true,
        data: tokens,
      };
    } catch (error) {
      logError('Token refresh failed', error as Error);

      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Refresh token expired', 401, true, 'REFRESH_TOKEN_EXPIRED');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid refresh token', 401, true, 'INVALID_REFRESH_TOKEN');
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Token refresh failed', 500, false);
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ServiceResponse<void>> {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404, true, 'USER_NOT_FOUND');
      }

      // Verify old password
      const isOldPasswordValid = await this.verifyPassword(oldPassword, user.password);

      if (!isOldPasswordValid) {
        throw new AppError('Invalid current password', 400, true, 'INVALID_PASSWORD');
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      logInfo('Password changed successfully', {
        userId: user.id,
      });

      return {
        success: true,
      };
    } catch (error) {
      logError('Password change failed', error as Error, {
        userId,
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Password change failed', 500, false);
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<ServiceResponse<void>> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          status: UserStatus.ACTIVE,
        },
      });

      logInfo('Email verified successfully', {
        userId,
      });

      return {
        success: true,
      };
    } catch (error) {
      logError('Email verification failed', error as Error, {
        userId,
      });

      throw new AppError('Email verification failed', 500, false);
    }
  }
}

export const authService = new AuthService();
