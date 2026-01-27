import express from 'express';
import { Leave } from '../models/Leave';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get leave requests
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { status, employeeId } = req.query;
    const filter: any = { tenantId: req.user.tenantId };
    
    if (status) filter.status = status;
    if (employeeId) filter.employeeId = employeeId;

    const leaves = await Leave.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create leave request
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const leaveData = {
      ...req.body,
      tenantId: req.user.tenantId
    };
    
    const leave = new Leave(leaveData);
    await leave.save();
    
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update leave request
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.status === 'approved') {
      updateData.approvedBy = req.user.userId;
      updateData.approvedAt = new Date();
    }
    
    const leave = await Leave.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      updateData,
      { new: true }
    );
    
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    
    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;