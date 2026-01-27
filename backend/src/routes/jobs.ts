import express from 'express';
import { Job } from '../models/Job';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get jobs
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { status, department } = req.query;
    const filter: any = { tenantId: req.user.tenantId };
    
    if (status) filter.status = status;
    if (department) filter.department = department;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create job
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const jobData = {
      ...req.body,
      tenantId: req.user.tenantId,
      postedBy: req.user.userId
    };
    
    const job = new Job(jobData);
    await job.save();
    
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update job
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete job
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId
    });
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;