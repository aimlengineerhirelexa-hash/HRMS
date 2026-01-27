import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getResignations,
  createResignation,
  updateResignation,
  updateResignationStatus,
  deleteResignation,
  getTerminations,
  createTermination,
  updateTermination,
  updateTerminationStatus,
  deleteTermination,
  getExitKPIs
} from '../controllers/exitManagementController';

const router = express.Router();

// Resignation routes
router.get('/resignations', authenticateToken, getResignations);
router.post('/resignations', authenticateToken, createResignation);
router.put('/resignations/:id', authenticateToken, updateResignation);
router.patch('/resignations/:id/status', authenticateToken, updateResignationStatus);
router.delete('/resignations/:id', authenticateToken, deleteResignation);

// Termination routes
router.get('/terminations', authenticateToken, getTerminations);
router.post('/terminations', authenticateToken, createTermination);
router.put('/terminations/:id', authenticateToken, updateTermination);
router.patch('/terminations/:id/status', authenticateToken, updateTerminationStatus);
router.delete('/terminations/:id', authenticateToken, deleteTermination);

// KPIs
router.get('/kpis', authenticateToken, getExitKPIs);

export default router;
