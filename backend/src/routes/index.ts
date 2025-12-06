/**
 * Main Routes Index
 * Aggregates all route modules
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import patientRoutes from './patient.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);

// Health check for API routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API routes are working',
    timestamp: new Date().toISOString(),
  });
});

export default router;
