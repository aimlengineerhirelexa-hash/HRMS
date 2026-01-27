import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    tenantId?: string;
    userId: string;
    role: string;
  };
}

const Leave = mongoose.models.Leave || mongoose.model('Leave', new mongoose.Schema({
  tenantId: { type: String, default: 'default' },
  employeeId: String,
  leaveType: String,
  startDate: Date,
  endDate: Date,
  days: Number,
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true }));

export const getLeaveRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leaves = await Leave.find({ tenantId: req.user?.tenantId || 'default' });
    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leave requests', error });
  }
};

export const createLeaveRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leave = new Leave({
      ...req.body,
      tenantId: req.user?.tenantId || 'default'
    });
    await leave.save();
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating leave request', error });
  }
};

export const updateLeaveRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating leave request', error });
  }
};