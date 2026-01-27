import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getShifts,
  createShift,
  updateShift,
  toggleShiftStatus,
  deleteShift,
  getShiftStats
} from '../controllers/shiftController';

const router = express.Router();

router.get('/', authenticateToken, getShifts);
router.post('/', authenticateToken, createShift);
router.put('/:id', authenticateToken, updateShift);
router.patch('/:id/toggle-status', authenticateToken, toggleShiftStatus);
router.delete('/:id', authenticateToken, deleteShift);
router.get('/stats', authenticateToken, getShiftStats);

export default router;
