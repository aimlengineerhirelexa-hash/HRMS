import { Request, Response } from 'express';
import { SalaryComponent, SalaryTemplate } from '../models/SalaryStructure';

interface AuthRequest extends Request {
  user?: { role: string; _id: string; email: string; };
}

// Salary Component Controllers
export const getSalaryComponents = async (req: AuthRequest, res: Response) => {
  try {
    const components = await SalaryComponent.find().sort({ createdAt: -1 });
    res.json({ success: true, data: components });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch salary components' });
  }
};

export const createSalaryComponent = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const component = new SalaryComponent(req.body);
    await component.save();
    res.status(201).json({ success: true, data: component });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create salary component' });
  }
};

export const updateSalaryComponent = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const component = await SalaryComponent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!component) {
      return res.status(404).json({ success: false, message: 'Salary component not found' });
    }
    res.json({ success: true, data: component });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update salary component' });
  }
};

export const deleteSalaryComponent = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const component = await SalaryComponent.findByIdAndDelete(req.params.id);
    if (!component) {
      return res.status(404).json({ success: false, message: 'Salary component not found' });
    }
    res.json({ success: true, message: 'Salary component deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete salary component' });
  }
};

// Salary Template Controllers
export const getSalaryTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const templates = await SalaryTemplate.find().sort({ createdAt: -1 });
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch salary templates' });
  }
};

export const createSalaryTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const template = new SalaryTemplate(req.body);
    await template.save();
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create salary template' });
  }
};

export const updateSalaryTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const template = await SalaryTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Salary template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update salary template' });
  }
};

export const deleteSalaryTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const template = await SalaryTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Salary template not found' });
    }
    res.json({ success: true, message: 'Salary template deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete salary template' });
  }
};

export const getSalaryStructureStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalComponents = await SalaryComponent.countDocuments();
    const activeComponents = await SalaryComponent.countDocuments({ status: 'active' });
    const earnings = await SalaryComponent.countDocuments({ componentType: 'earning' });
    const deductions = await SalaryComponent.countDocuments({ componentType: 'deduction' });
    const templates = await SalaryTemplate.countDocuments({ status: 'active' });
    const mandatory = await SalaryComponent.countDocuments({ mandatory: true });

    res.json({
      success: true,
      data: {
        totalComponents,
        activeComponents,
        earnings,
        deductions,
        templates,
        mandatory
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch salary structure stats' });
  }
};
