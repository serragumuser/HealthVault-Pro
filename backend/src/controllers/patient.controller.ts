/**
 * Patient Controller
 * Handles patient-related HTTP requests
 */

import { Response, NextFunction } from 'express';
import { patientService } from '../services/patient.service';
import { AuthRequest, ApiResponse } from '../types';

export class PatientController {
  /**
   * Get current patient profile
   * GET /api/v1/patients/me
   */
  async getCurrentPatient(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(new Error('User not authenticated'));
      }

      const result = await patientService.getByUserId(req.user.id);

      const response: ApiResponse = {
        success: true,
        message: 'Patient profile retrieved successfully',
        data: result.data,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get patient by ID
   * GET /api/v1/patients/:id
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await patientService.getById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Patient retrieved successfully',
        data: result.data,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update patient profile
   * PUT /api/v1/patients/:id
   */
  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await patientService.update(id, updateData);

      const response: ApiResponse = {
        success: true,
        message: 'Patient updated successfully',
        data: result.data,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all patients
   * GET /api/v1/patients
   */
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await patientService.getAll({ page, limit });

      const response: ApiResponse = {
        success: true,
        message: 'Patients retrieved successfully',
        data: result.data?.patients,
        meta: {
          currentPage: result.data?.page || 1,
          pageSize: result.data?.limit || 20,
          totalCount: result.data?.total || 0,
          totalPages: Math.ceil((result.data?.total || 0) / (result.data?.limit || 20)),
          hasNext: (result.data?.page || 1) * (result.data?.limit || 20) < (result.data?.total || 0),
          hasPrevious: (result.data?.page || 1) > 1,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search patients
   * GET /api/v1/patients/search
   */
  async search(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchQuery = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!searchQuery) {
        return next(new Error('Search query is required'));
      }

      const result = await patientService.search(searchQuery, { page, limit });

      const response: ApiResponse = {
        success: true,
        message: 'Search completed successfully',
        data: result.data,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get patient health summary
   * GET /api/v1/patients/:id/summary
   */
  async getHealthSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await patientService.getHealthSummary(id);

      const response: ApiResponse = {
        success: true,
        message: 'Health summary retrieved successfully',
        data: result.data,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete patient
   * DELETE /api/v1/patients/:id
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await patientService.delete(id);

      const response: ApiResponse = {
        success: true,
        message: 'Patient deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const patientController = new PatientController();
