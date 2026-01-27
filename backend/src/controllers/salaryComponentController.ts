import { Request, Response } from 'express';
import { SalaryComponent, SalaryTemplate } from '../models/SalaryStructure';

interface AuthenticatedRequest extends Request {
  user?: {
    tenantId?: string;
    userId: string;
    role: string;
  };
}

export const getSalaryComponents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const components = await SalaryComponent.find({ tenantId: req.user?.tenantId || 'default' });
    res.json({ success: true, data: components });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching salary components', error });
  }
};

export const createSalaryComponent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const component = new SalaryComponent({
      ...req.body,
      tenantId: req.user?.tenantId || 'default'
    });
    await component.save();
    res.status(201).json({ success: true, data: component });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating salary component', error });
  }
};

export const updateSalaryComponent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const component = await SalaryComponent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!component) {
      return res.status(404).json({ success: false, message: 'Salary component not found' });
    }
    res.json({ success: true, data: component });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating salary component', error });
  }
};

export const deleteSalaryComponent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const component = await SalaryComponent.findByIdAndDelete(req.params.id);
    if (!component) {
      return res.status(404).json({ success: false, message: 'Salary component not found' });
    }
    res.json({ success: true, message: 'Salary component deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting salary component', error });
  }
};

export const getSalaryTemplates = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const templates = await SalaryTemplate.find({ tenantId: req.user?.tenantId || 'default' })
      .populate('components');
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching salary templates', error });
  }
};

export const createSalaryTemplate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const template = new SalaryTemplate({
      ...req.body,
      tenantId: req.user?.tenantId || 'default'
    });
    await template.save();
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating salary template', error });
  }
};