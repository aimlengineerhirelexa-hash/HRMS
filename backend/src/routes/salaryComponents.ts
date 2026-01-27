import express from 'express';
import { 
  getSalaryComponents, 
  createSalaryComponent, 
  updateSalaryComponent, 
  deleteSalaryComponent,
  getSalaryTemplates,
  createSalaryTemplate
} from '../controllers/salaryComponentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/components', authenticateToken, getSalaryComponents);
router.post('/components', authenticateToken, createSalaryComponent);
router.put('/components/:id', authenticateToken, updateSalaryComponent);
router.delete('/components/:id', authenticateToken, deleteSalaryComponent);

router.get('/templates', authenticateToken, getSalaryTemplates);
router.post('/templates', authenticateToken, createSalaryTemplate);

export default router;