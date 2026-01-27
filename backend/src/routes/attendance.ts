import express from 'express';
import { Attendance } from '../models/Attendance';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get attendance records
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    const filter: any = { tenantId: req.user.tenantId };
    
    if (employeeId) filter.employeeId = employeeId;
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const attendance = await Attendance.find(filter).sort({ date: -1 });
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create attendance record
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const attendanceData = {
      ...req.body,
      tenantId: req.user.tenantId
    };
    
    const attendance = new Attendance(attendanceData);
    await attendance.save();
    
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update attendance record
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );
    
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    
    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;