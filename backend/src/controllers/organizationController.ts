import { Request, Response } from 'express';
import { Department } from '../models/Department';
import { Designation } from '../models/Designation';
import { ReportingManager } from '../models/ReportingManager';

interface AuthRequest extends Request {
  user?: { role: string; _id: string; email: string; };
}

// Department Controllers
export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch departments' });
  }
};

export const createDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const department = new Department(req.body);
    await department.save();
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create department' });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update department' });
  }
};

export const deleteDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete department' });
  }
};

// Designation Controllers
export const getDesignations = async (req: AuthRequest, res: Response) => {
  try {
    const designations = await Designation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: designations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch designations' });
  }
};

export const createDesignation = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const designation = new Designation(req.body);
    await designation.save();
    res.status(201).json({ success: true, data: designation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create designation' });
  }
};

export const updateDesignation = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const designation = await Designation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!designation) {
      return res.status(404).json({ success: false, message: 'Designation not found' });
    }
    res.json({ success: true, data: designation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update designation' });
  }
};

export const deleteDesignation = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const designation = await Designation.findByIdAndDelete(req.params.id);
    if (!designation) {
      return res.status(404).json({ success: false, message: 'Designation not found' });
    }
    res.json({ success: true, message: 'Designation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete designation' });
  }
};

// Reporting Manager Controllers
export const getReportingManagers = async (req: AuthRequest, res: Response) => {
  try {
    const reportingManagers = await ReportingManager.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reportingManagers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reporting managers' });
  }
};

export const createReportingManager = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const reportingManager = new ReportingManager(req.body);
    await reportingManager.save();
    res.status(201).json({ success: true, data: reportingManager });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create reporting manager' });
  }
};

export const updateReportingManager = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const reportingManager = await ReportingManager.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reportingManager) {
      return res.status(404).json({ success: false, message: 'Reporting manager not found' });
    }
    res.json({ success: true, data: reportingManager });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update reporting manager' });
  }
};

export const deleteReportingManager = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['super_admin', 'hr_manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const reportingManager = await ReportingManager.findByIdAndDelete(req.params.id);
    if (!reportingManager) {
      return res.status(404).json({ success: false, message: 'Reporting manager not found' });
    }
    res.json({ success: true, message: 'Reporting manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete reporting manager' });
  }
};

// Get Organization KPIs
export const getOrganizationKPIs = async (req: AuthRequest, res: Response) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const activeDepartments = await Department.countDocuments({ status: 'Active' });
    const totalDesignations = await Designation.countDocuments();
    const totalReportingRelations = await ReportingManager.countDocuments();

    res.json({
      success: true,
      data: {
        totalDepartments,
        activeDepartments,
        totalDesignations,
        totalReportingRelations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch KPIs' });
  }
};
