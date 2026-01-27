import { Request, Response } from 'express';
import { Resignation, Termination } from '../models/ExitManagement';

interface AuthRequest extends Request {
  user?: { role: string; _id: string; email: string; };
}

// Resignation Controllers
export const getResignations = async (req: AuthRequest, res: Response) => {
  try {
    const resignations = await Resignation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: resignations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resignations' });
  }
};

export const createResignation = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager', 'Manager', 'Employee'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const resignation = new Resignation(req.body);
    await resignation.save();
    res.status(201).json({ success: true, data: resignation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create resignation' });
  }
};

export const updateResignation = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager', 'Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const resignation = await Resignation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resignation) {
      return res.status(404).json({ success: false, message: 'Resignation not found' });
    }
    res.json({ success: true, data: resignation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update resignation' });
  }
};

export const updateResignationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { status } = req.body;
    const resignation = await Resignation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!resignation) {
      return res.status(404).json({ success: false, message: 'Resignation not found' });
    }
    res.json({ success: true, data: resignation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update resignation status' });
  }
};

export const deleteResignation = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const resignation = await Resignation.findByIdAndDelete(req.params.id);
    if (!resignation) {
      return res.status(404).json({ success: false, message: 'Resignation not found' });
    }
    res.json({ success: true, message: 'Resignation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete resignation' });
  }
};

// Termination Controllers
export const getTerminations = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const terminations = await Termination.find().sort({ createdAt: -1 });
    res.json({ success: true, data: terminations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch terminations' });
  }
};

export const createTermination = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const termination = new Termination(req.body);
    await termination.save();
    res.status(201).json({ success: true, data: termination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create termination' });
  }
};

export const updateTermination = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const termination = await Termination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!termination) {
      return res.status(404).json({ success: false, message: 'Termination not found' });
    }
    res.json({ success: true, data: termination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update termination' });
  }
};

export const updateTerminationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { status } = req.body;
    const termination = await Termination.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!termination) {
      return res.status(404).json({ success: false, message: 'Termination not found' });
    }
    res.json({ success: true, data: termination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update termination status' });
  }
};

export const deleteTermination = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const termination = await Termination.findByIdAndDelete(req.params.id);
    if (!termination) {
      return res.status(404).json({ success: false, message: 'Termination not found' });
    }
    res.json({ success: true, message: 'Termination deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete termination' });
  }
};

// Get Exit Management KPIs
export const getExitKPIs = async (req: AuthRequest, res: Response) => {
  try {
    const totalResignations = await Resignation.countDocuments();
    const pendingApprovals = await Resignation.countDocuments({ status: 'Pending' });
    const totalTerminations = await Termination.countDocuments();
    const thisMonthExits = totalResignations + totalTerminations;

    res.json({
      success: true,
      data: {
        totalResignations,
        pendingApprovals,
        totalTerminations,
        thisMonthExits
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch exit KPIs' });
  }
};
