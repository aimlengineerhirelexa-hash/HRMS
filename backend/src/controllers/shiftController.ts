import { Request, Response } from 'express';
import { Shift } from '../models/Shift';

interface AuthRequest extends Request {
  user?: { role: string; _id: string; email: string; };
}

export const getShifts = async (req: AuthRequest, res: Response) => {
  try {
    const shifts = await Shift.find().sort({ createdAt: -1 });
    res.json({ success: true, data: shifts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch shifts' });
  }
};

export const createShift = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager', 'Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const shift = new Shift(req.body);
    await shift.save();
    res.status(201).json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create shift' });
  }
};

export const updateShift = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager', 'Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }
    res.json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update shift' });
  }
};

export const toggleShiftStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager', 'Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }

    shift.status = shift.status === 'active' ? 'inactive' : 'active';
    await shift.save();
    res.json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle shift status' });
  }
};

export const deleteShift = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }
    res.json({ success: true, message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete shift' });
  }
};

export const getShiftStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalShifts = await Shift.countDocuments();
    const activeShifts = await Shift.countDocuments({ status: 'active' });
    const shifts = await Shift.find();
    const totalEmployees = shifts.reduce((sum, shift) => sum + shift.assignedEmployees, 0);

    res.json({
      success: true,
      data: {
        totalShifts,
        activeShifts,
        totalEmployees
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch shift stats' });
  }
};
