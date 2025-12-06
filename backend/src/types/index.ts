/**
 * Shared TypeScript Type Definitions
 * Common types and interfaces used across the application
 */

import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// ==================== USER & AUTHENTICATION ====================

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface JWTPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
}

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  ADMIN = 'ADMIN',
  PHARMACIST = 'PHARMACIST',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ValidationError[];
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// ==================== QUERY PARAMETERS ====================

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery extends PaginationQuery {
  query?: string;
  filters?: Record<string, any>;
}

// ==================== MEDICAL RECORDS ====================

export interface LabResultData {
  testName: string;
  value: string | number;
  unit?: string;
  referenceRange?: string;
  abnormal?: boolean;
  notes?: string;
}

export interface VitalSignsData {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
}

// ==================== AI SERVICES ====================

export interface AIRequest {
  type: 'chatbot' | 'lab_analysis' | 'risk_assessment' | 'symptom_analysis';
  userId: string;
  input: string | object;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  type: string;
  response: string;
  confidence?: number;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// ==================== FILE UPLOAD ====================

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  path: string;
  url?: string;
}

// ==================== ERROR HANDLING ====================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// ==================== SERVICE RESPONSES ====================

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

// ==================== APPOINTMENTS ====================

export enum AppointmentType {
  IN_PERSON = 'IN_PERSON',
  VIDEO_CALL = 'VIDEO_CALL',
  PHONE_CALL = 'PHONE_CALL',
  FOLLOW_UP = 'FOLLOW_UP',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// ==================== NOTIFICATIONS ====================

export enum NotificationType {
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  MEDICATION_REMINDER = 'MEDICATION_REMINDER',
  LAB_RESULT_AVAILABLE = 'LAB_RESULT_AVAILABLE',
  PRESCRIPTION_EXPIRING = 'PRESCRIPTION_EXPIRING',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

// ==================== HEALTH DATA ====================

export enum BloodType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE',
  UNKNOWN = 'UNKNOWN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

// ==================== WEBSOCKET ====================

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface TelemedicineSession {
  sessionId: string;
  appointmentId: string;
  participants: {
    patientId: string;
    doctorId: string;
  };
  startTime: Date;
  status: 'waiting' | 'active' | 'ended';
}

// ==================== CACHE ====================

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key: string;
}

// ==================== ANALYTICS ====================

export interface HealthMetrics {
  averageHeartRate?: number;
  averageBloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  bmiTrend?: Array<{
    date: Date;
    value: number;
  }>;
  medicationAdherence?: number;
}

export interface RiskFactors {
  cardiovascular?: number;
  diabetes?: number;
  hypertension?: number;
  overall?: number;
}
