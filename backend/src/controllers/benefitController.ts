import { Request, Response } from 'express';
import { Benefit } from '../models/Benefit';

interface AuthRequest extends Request {
  user?: { tenantId: string; userId: string; role: string; };
}

// Get all benefits for the tenant
export const getBenefits = async (req: AuthRequest, res: Response) => {
  try {
    const { status, benefitType } = req.query;
    const filter: any = { tenantId: req.user!.tenantId };

    if (status) filter.status = status;
    if (benefitType) filter.benefitType = benefitType;

    const benefits = await Benefit.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: benefits });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch benefits' });
  }
};

// Get single benefit
export const getBenefitById = async (req: AuthRequest, res: Response) => {
  try {
    const benefit = await Benefit.findOne({
      _id: req.params.id,
      tenantId: req.user!.tenantId
    });

    if (!benefit) {
      return res.status(404).json({ success: false, message: 'Benefit not found' });
    }

    res.json({ success: true, data: benefit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch benefit' });
  }
};

// Create benefit
export const createBenefit = async (req: AuthRequest, res: Response) => {
  try {
    const benefitData = {
      ...req.body,
      tenantId: req.user!.tenantId,
      createdBy: req.user!.userId
    };

    const benefit = new Benefit(benefitData);
    await benefit.save();

    res.status(201).json({ success: true, data: benefit });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create benefit' });
  }
};

// Update benefit
export const updateBenefit = async (req: AuthRequest, res: Response) => {
  try {
    const benefit = await Benefit.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user!.tenantId },
      req.body,
      { new: true }
    );

    if (!benefit) {
      return res.status(404).json({ success: false, message: 'Benefit not found' });
    }

    res.json({ success: true, data: benefit });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update benefit' });
  }
};

// Delete benefit
export const deleteBenefit = async (req: AuthRequest, res: Response) => {
  try {
    const benefit = await Benefit.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user!.tenantId
    });

    if (!benefit) {
      return res.status(404).json({ success: false, message: 'Benefit not found' });
    }

    res.json({ success: true, message: 'Benefit deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete benefit' });
  }
};