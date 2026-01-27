import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getBenefits,
  getBenefitById,
  createBenefit,
  updateBenefit,
  deleteBenefit
} from '../controllers/benefitController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all benefits
router.get('/', getBenefits);

// Get single benefit
router.get('/:id', getBenefitById);

// Create benefit
router.post('/', createBenefit);

// Update benefit
router.put('/:id', updateBenefit);

// Delete benefit
router.delete('/:id', deleteBenefit);

export default router;