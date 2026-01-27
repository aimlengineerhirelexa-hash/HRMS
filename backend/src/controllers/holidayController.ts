import { Request, Response } from 'express';
import { Holiday } from '../models/Holiday';

interface AuthenticatedRequest extends Request {
  user?: {
    tenantId?: string;
    userId: string;
    role: string;
  };
}

export const getHolidays = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const holidays = await Holiday.find({ tenantId: req.user?.tenantId || 'default' });
    res.json({ success: true, data: holidays });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching holidays', error });
  }
};

export const createHoliday = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const holiday = new Holiday({
      ...req.body,
      tenantId: req.user?.tenantId || 'default'
    });
    await holiday.save();
    res.status(201).json({ success: true, data: holiday });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating holiday', error });
  }
};

export const updateHoliday = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const holiday = await Holiday.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!holiday) {
      return res.status(404).json({ success: false, message: 'Holiday not found' });
    }
    res.json({ success: true, data: holiday });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating holiday', error });
  }
};

export const deleteHoliday = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) {
      return res.status(404).json({ success: false, message: 'Holiday not found' });
    }
    res.json({ success: true, message: 'Holiday deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting holiday', error });
  }
};