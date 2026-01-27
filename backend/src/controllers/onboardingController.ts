import { Request, Response } from 'express';
import { Onboarding } from '../models/Onboarding';
import { EmployeeDocuments } from '../models/DocumentCollection';

interface AuthRequest extends Request {
  user?: { role: string; _id: string; email: string; };
}

export const getOnboardingRecords = async (req: AuthRequest, res: Response) => {
  try {
    const onboardingRecords = await Onboarding.find().sort({ createdAt: -1 });
    res.json({ success: true, data: onboardingRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch onboarding records' });
  }
};

export const getOnboardingById = async (req: AuthRequest, res: Response) => {
  try {
    const onboarding = await Onboarding.findById(req.params.id);
    if (!onboarding) {
      return res.status(404).json({ success: false, message: 'Onboarding record not found' });
    }
    res.json({ success: true, data: onboarding });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch onboarding record' });
  }
};

export const createOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const onboarding = new Onboarding(req.body);
    await onboarding.save();
    res.status(201).json({ success: true, data: onboarding });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create onboarding record' });
  }
};

export const updateOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager', 'Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const onboarding = await Onboarding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!onboarding) {
      return res.status(404).json({ success: false, message: 'Onboarding record not found' });
    }
    res.json({ success: true, data: onboarding });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update onboarding record' });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { onboardingId, taskId } = req.params;
    const { status } = req.body;

    const onboarding = await Onboarding.findById(onboardingId);
    if (!onboarding) {
      return res.status(404).json({ success: false, message: 'Onboarding record not found' });
    }

    const task = onboarding.tasks.find(t => t._id?.toString() === taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;
    
    // Calculate progress
    const completedTasks = onboarding.tasks.filter(t => t.status === 'completed').length;
    onboarding.progress = Math.round((completedTasks / onboarding.tasks.length) * 100);
    
    if (onboarding.progress === 100) {
      onboarding.status = 'completed';
    } else if (onboarding.progress > 0) {
      onboarding.status = 'in-progress';
    }

    await onboarding.save();
    res.json({ success: true, data: onboarding });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task status' });
  }
};

export const deleteOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const onboarding = await Onboarding.findByIdAndDelete(req.params.id);
    if (!onboarding) {
      return res.status(404).json({ success: false, message: 'Onboarding record not found' });
    }
    res.json({ success: true, message: 'Onboarding record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete onboarding record' });
  }
};

// Document Collection Controllers
export const getEmployeeDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const documents = await EmployeeDocuments.find().sort({ createdAt: -1 });
    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employee documents' });
  }
};

export const getEmployeeDocumentsById = async (req: AuthRequest, res: Response) => {
  try {
    const documents = await EmployeeDocuments.findById(req.params.id);
    if (!documents) {
      return res.status(404).json({ success: false, message: 'Employee documents not found' });
    }
    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employee documents' });
  }
};

export const createEmployeeDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const employeeDocuments = new EmployeeDocuments(req.body);
    await employeeDocuments.save();
    res.status(201).json({ success: true, data: employeeDocuments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create employee documents' });
  }
};

export const updateEmployeeDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (!['Super Admin', 'HR Manager', 'Manager'].includes(role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const employeeDocuments = await EmployeeDocuments.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employeeDocuments) {
      return res.status(404).json({ success: false, message: 'Employee documents not found' });
    }
    res.json({ success: true, data: employeeDocuments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update employee documents' });
  }
};

export const deleteEmployeeDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    if (role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const employeeDocuments = await EmployeeDocuments.findByIdAndDelete(req.params.id);
    if (!employeeDocuments) {
      return res.status(404).json({ success: false, message: 'Employee documents not found' });
    }
    res.json({ success: true, message: 'Employee documents deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete employee documents' });
  }
};
