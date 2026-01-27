import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSalaryComponents,
  createSalaryComponent,
  updateSalaryComponent,
  deleteSalaryComponent,
  getSalaryTemplates,
  createSalaryTemplate,
  updateSalaryTemplate,
  deleteSalaryTemplate,
  getSalaryStructureStats
} from '../controllers/salaryStructureController';

const router = express.Router();

// Salary Component routes
router.get('/components', authenticateToken, getSalaryComponents);
router.post('/components', authenticateToken, createSalaryComponent);
router.put('/components/:id', authenticateToken, updateSalaryComponent);
router.delete('/components/:id', authenticateToken, deleteSalaryComponent);

// Salary Template routes
router.get('/templates', authenticateToken, getSalaryTemplates);
router.post('/templates', authenticateToken, createSalaryTemplate);
router.put('/templates/:id', authenticateToken, updateSalaryTemplate);
router.delete('/templates/:id', authenticateToken, deleteSalaryTemplate);

// Stats
router.get('/stats', authenticateToken, getSalaryStructureStats);

export default router;
