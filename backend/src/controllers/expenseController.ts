import { Request, Response } from 'express';
import { Expense } from '../models/Expense';

interface AuthRequest extends Request {
  user?: { tenantId: string; userId: string; role: string; };
}

// Get all expenses for the tenant
export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { status, employeeId, expenseType } = req.query;
    const filter: any = { tenantId: req.user!.tenantId };

    if (status) filter.status = status;
    if (employeeId) filter.employeeId = employeeId;
    if (expenseType) filter.expenseType = expenseType;

    const expenses = await Expense.find(filter)
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName')
      .sort({ submittedDate: -1 });

    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch expenses' });
  }
};

// Get single expense
export const getExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      tenantId: req.user!.tenantId
    }).populate('employeeId', 'personalInfo.firstName personalInfo.lastName');

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch expense' });
  }
};

// Create expense
export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expenseData = {
      ...req.body,
      tenantId: req.user!.tenantId,
      submittedBy: req.user!.userId
    };

    const expense = new Expense(expenseData);
    await expense.save();

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create expense' });
  }
};

// Update expense
export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user!.tenantId },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update expense' });
  }
};

// Approve expense
export const approveExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user!.tenantId },
      {
        status: 'approved',
        approvedBy: req.user!.userId,
        approvedDate: new Date()
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to approve expense' });
  }
};

// Reject expense
export const rejectExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { rejectionReason } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user!.tenantId },
      {
        status: 'rejected',
        rejectedBy: req.user!.userId,
        rejectedDate: new Date(),
        rejectionReason
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to reject expense' });
  }
};

// Delete expense
export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user!.tenantId
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete expense' });
  }
};