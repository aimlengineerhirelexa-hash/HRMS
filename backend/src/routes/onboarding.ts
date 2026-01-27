import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getOnboardingRecords,
  getOnboardingById,
  createOnboarding,
  updateOnboarding,
  updateTaskStatus,
  deleteOnboarding,
  getEmployeeDocuments,
  getEmployeeDocumentsById,
  createEmployeeDocuments,
  updateEmployeeDocuments,
  deleteEmployeeDocuments
} from '../controllers/onboardingController';

const router = express.Router();

router.get('/', authenticateToken, getOnboardingRecords);
router.get('/:id', authenticateToken, getOnboardingById);
router.post('/', authenticateToken, createOnboarding);
router.put('/:id', authenticateToken, updateOnboarding);
router.patch('/:onboardingId/tasks/:taskId', authenticateToken, updateTaskStatus);
router.delete('/:id', authenticateToken, deleteOnboarding);

// Document collection routes
router.get('/documents', authenticateToken, getEmployeeDocuments);
router.get('/documents/:id', authenticateToken, getEmployeeDocumentsById);
router.post('/documents', authenticateToken, createEmployeeDocuments);
router.put('/documents/:id', authenticateToken, updateEmployeeDocuments);
router.delete('/documents/:id', authenticateToken, deleteEmployeeDocuments);

export default router;
