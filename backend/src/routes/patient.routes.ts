/**
 * Patient Routes
 * Defines all patient-related endpoints
 */

import { Router } from 'express';
import { patientController } from '../controllers/patient.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validatePagination } from '../middleware/validation.middleware';
import { UserRole } from '../types';

const router = Router();

/**
 * @route   GET /api/v1/patients/me
 * @desc    Get current patient profile
 * @access  Private (Patient)
 */
router.get(
  '/me',
  authenticate,
  authorize(UserRole.PATIENT),
  patientController.getCurrentPatient.bind(patientController)
);

/**
 * @route   GET /api/v1/patients/search
 * @desc    Search patients
 * @access  Private (Doctor, Nurse, Admin)
 */
router.get(
  '/search',
  authenticate,
  authorize(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN),
  validatePagination,
  patientController.search.bind(patientController)
);

/**
 * @route   GET /api/v1/patients
 * @desc    Get all patients
 * @access  Private (Doctor, Nurse, Admin)
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN),
  validatePagination,
  patientController.getAll.bind(patientController)
);

/**
 * @route   GET /api/v1/patients/:id
 * @desc    Get patient by ID
 * @access  Private (Patient owner, Doctor, Nurse, Admin)
 */
router.get(
  '/:id',
  authenticate,
  patientController.getById.bind(patientController)
);

/**
 * @route   GET /api/v1/patients/:id/summary
 * @desc    Get patient health summary
 * @access  Private (Patient owner, Doctor, Admin)
 */
router.get(
  '/:id/summary',
  authenticate,
  patientController.getHealthSummary.bind(patientController)
);

/**
 * @route   PUT /api/v1/patients/:id
 * @desc    Update patient profile
 * @access  Private (Patient owner, Admin)
 */
router.put(
  '/:id',
  authenticate,
  patientController.update.bind(patientController)
);

/**
 * @route   DELETE /api/v1/patients/:id
 * @desc    Delete patient
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  patientController.delete.bind(patientController)
);

export default router;
