/**
 * Patient Service
 * Handles patient profile and health data management
 */

import { Patient, Gender, BloodType } from '@prisma/client';
import { prisma } from '../server';
import { AppError, ServiceResponse, PaginationQuery } from '../types';
import { logInfo, logError } from '../utils/logger';

interface CreatePatientData {
  userId: string;
  bloodType?: BloodType;
  gender: Gender;
  height?: number;
  weight?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

interface UpdatePatientData {
  bloodType?: BloodType;
  gender?: Gender;
  height?: number;
  weight?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export class PatientService {
  /**
   * Get patient by user ID
   */
  async getByUserId(userId: string): Promise<ServiceResponse<Patient>> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              dateOfBirth: true,
              profileImageUrl: true,
            },
          },
        },
      });

      if (!patient) {
        throw new AppError('Patient not found', 404, true, 'PATIENT_NOT_FOUND');
      }

      return {
        success: true,
        data: patient,
      };
    } catch (error) {
      logError('Failed to get patient', error as Error, { userId });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Failed to retrieve patient', 500, false);
    }
  }

  /**
   * Get patient by ID
   */
  async getById(patientId: string): Promise<ServiceResponse<Patient>> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              dateOfBirth: true,
              profileImageUrl: true,
            },
          },
        },
      });

      if (!patient) {
        throw new AppError('Patient not found', 404, true, 'PATIENT_NOT_FOUND');
      }

      return {
        success: true,
        data: patient,
      };
    } catch (error) {
      logError('Failed to get patient', error as Error, { patientId });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Failed to retrieve patient', 500, false);
    }
  }

  /**
   * Update patient profile
   */
  async update(
    patientId: string,
    data: UpdatePatientData
  ): Promise<ServiceResponse<Patient>> {
    try {
      // Check if patient exists
      const existingPatient = await prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!existingPatient) {
        throw new AppError('Patient not found', 404, true, 'PATIENT_NOT_FOUND');
      }

      // Update patient
      const patient = await prisma.patient.update({
        where: { id: patientId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              dateOfBirth: true,
            },
          },
        },
      });

      logInfo('Patient updated successfully', {
        patientId: patient.id,
      });

      return {
        success: true,
        data: patient,
      };
    } catch (error) {
      logError('Failed to update patient', error as Error, { patientId });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Failed to update patient', 500, false);
    }
  }

  /**
   * Get all patients (admin/doctor access)
   */
  async getAll(query: PaginationQuery): Promise<ServiceResponse<{
    patients: Patient[];
    total: number;
    page: number;
    limit: number;
  }>> {
    try {
      const page = query.page || 1;
      const limit = query.limit || 20;
      const skip = (page - 1) * limit;

      const [patients, total] = await Promise.all([
        prisma.patient.findMany({
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                dateOfBirth: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.patient.count(),
      ]);

      return {
        success: true,
        data: {
          patients,
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      logError('Failed to get patients', error as Error);
      throw new AppError('Failed to retrieve patients', 500, false);
    }
  }

  /**
   * Search patients by name or email
   */
  async search(
    searchQuery: string,
    pagination: PaginationQuery
  ): Promise<ServiceResponse<Patient[]>> {
    try {
      const page = pagination.page || 1;
      const limit = pagination.limit || 20;
      const skip = (page - 1) * limit;

      const patients = await prisma.patient.findMany({
        where: {
          user: {
            OR: [
              {
                firstName: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
      });

      return {
        success: true,
        data: patients,
      };
    } catch (error) {
      logError('Failed to search patients', error as Error, { searchQuery });
      throw new AppError('Failed to search patients', 500, false);
    }
  }

  /**
   * Get patient health summary
   */
  async getHealthSummary(patientId: string): Promise<ServiceResponse<{
    patient: Patient;
    latestVitals: any;
    activeMedications: number;
    upcomingAppointments: number;
    pendingLabResults: number;
  }>> {
    try {
      const [patient, latestVitals, activeMedications, upcomingAppointments, pendingLabResults] =
        await Promise.all([
          prisma.patient.findUnique({
            where: { id: patientId },
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  dateOfBirth: true,
                },
              },
            },
          }),
          prisma.vitalSign.findFirst({
            where: { patientId },
            orderBy: { recordedAt: 'desc' },
          }),
          prisma.patientMedication.count({
            where: {
              patientId,
              isActive: true,
            },
          }),
          prisma.appointment.count({
            where: {
              patientId,
              scheduledAt: {
                gte: new Date(),
              },
              status: {
                in: ['SCHEDULED', 'CONFIRMED'],
              },
            },
          }),
          prisma.labResult.count({
            where: {
              patientId,
              status: {
                in: ['PENDING', 'IN_PROGRESS'],
              },
            },
          }),
        ]);

      if (!patient) {
        throw new AppError('Patient not found', 404, true, 'PATIENT_NOT_FOUND');
      }

      return {
        success: true,
        data: {
          patient,
          latestVitals,
          activeMedications,
          upcomingAppointments,
          pendingLabResults,
        },
      };
    } catch (error) {
      logError('Failed to get health summary', error as Error, { patientId });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Failed to retrieve health summary', 500, false);
    }
  }

  /**
   * Delete patient (soft delete - deactivate user)
   */
  async delete(patientId: string): Promise<ServiceResponse<void>> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patient) {
        throw new AppError('Patient not found', 404, true, 'PATIENT_NOT_FOUND');
      }

      // Deactivate user instead of deleting
      await prisma.user.update({
        where: { id: patient.userId },
        data: {
          status: 'INACTIVE',
        },
      });

      logInfo('Patient deactivated successfully', {
        patientId,
      });

      return {
        success: true,
      };
    } catch (error) {
      logError('Failed to delete patient', error as Error, { patientId });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Failed to delete patient', 500, false);
    }
  }
}

export const patientService = new PatientService();
