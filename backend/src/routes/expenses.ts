import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  approveExpense,
  rejectExpense,
  deleteExpense
} from '../controllers/expenseController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all expenses
router.get('/', getExpenses);

// Get single expense
router.get('/:id', getExpenseById);

// Create expense
router.post('/', createExpense);

// Update expense
router.put('/:id', updateExpense);

// Approve expense
router.patch('/:id/approve', approveExpense);

// Reject expense
router.patch('/:id/reject', rejectExpense);

// Delete expense
router.delete('/:id', deleteExpense);

export default router;