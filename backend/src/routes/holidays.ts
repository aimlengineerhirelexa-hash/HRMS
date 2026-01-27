import express from 'express';
import { getHolidays, createHoliday, updateHoliday, deleteHoliday } from '../controllers/holidayController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getHolidays);
router.post('/', authenticateToken, createHoliday);
router.put('/:id', authenticateToken, updateHoliday);
router.delete('/:id', authenticateToken, deleteHoliday);

export default router;