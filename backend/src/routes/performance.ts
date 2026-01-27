import express, { Request, Response } from 'express';
import { 
  Goal, ReviewCycle, ReviewTemplate, PerformanceReview, 
  Rating, Calibration, CalibrationSession, Competency 
} from '../models/Performance';

const router = express.Router();

// ==================== GOALS & OKRs ====================

// Get all goals with filters
router.get('/goals', async (req: Request, res: Response) => {
  try {
    const { status, type, owner, department } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (owner) filter.owner = owner;
    if (department) filter.department = department;

    const goals = await Goal.find(filter)
      .populate('owner', 'firstName lastName')
      .populate('alignment', 'title')
      .sort({ createdAt: -1 });
    
    res.json(goals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single goal
router.get('/goals/:id', async (req: Request, res: Response) => {
  try {
    const goal = await Goal.findById(req.params.id)
      .populate('owner', 'firstName lastName')
      .populate('alignment', 'title')
      .populate('comments.user', 'firstName lastName');
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create goal
router.post('/goals', async (req: Request, res: Response) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.status(201).json(goal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update goal
router.put('/goals/:id', async (req: Request, res: Response) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        $push: {
          editHistory: {
            editedBy: req.body.editedBy,
            editedAt: new Date(),
            changes: req.body.changeDescription
          }
        }
      },
      { new: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update goal progress
router.patch('/goals/:id/progress', async (req: Request, res: Response) => {
  try {
    const { progress } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { progress, status: progress === 100 ? 'completed' : 'in-progress' },
      { new: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Add comment to goal
router.post('/goals/:id/comments', async (req: Request, res: Response) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: req.body } },
      { new: true }
    ).populate('comments.user', 'firstName lastName');
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete goal
router.delete('/goals/:id', async (req: Request, res: Response) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== REVIEW CYCLES ====================

// Get all review cycles
router.get('/review-cycles', async (req: Request, res: Response) => {
  try {
    const { status, reviewType } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (reviewType) filter.reviewType = reviewType;

    const cycles = await ReviewCycle.find(filter)
      .populate('template', 'templateName')
      .sort({ startDate: -1 });
    
    res.json(cycles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single review cycle
router.get('/review-cycles/:id', async (req: Request, res: Response) => {
  try {
    const cycle = await ReviewCycle.findById(req.params.id)
      .populate('template')
      .populate('reviewers.employee', 'firstName lastName')
      .populate('reviewers.reviewers', 'firstName lastName');
    
    if (!cycle) {
      return res.status(404).json({ message: 'Review cycle not found' });
    }
    
    res.json(cycle);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create review cycle
router.post('/review-cycles', async (req: Request, res: Response) => {
  try {
    const cycle = new ReviewCycle(req.body);
    await cycle.save();
    res.status(201).json(cycle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update review cycle
router.put('/review-cycles/:id', async (req: Request, res: Response) => {
  try {
    const cycle = await ReviewCycle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!cycle) {
      return res.status(404).json({ message: 'Review cycle not found' });
    }
    
    res.json(cycle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update review cycle status
router.patch('/review-cycles/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const cycle = await ReviewCycle.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!cycle) {
      return res.status(404).json({ message: 'Review cycle not found' });
    }
    
    res.json(cycle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// ==================== REVIEW TEMPLATES ====================

// Get all templates
router.get('/review-templates', async (req: Request, res: Response) => {
  try {
    const templates = await ReviewTemplate.find({ status: 'active' });
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create template
router.post('/review-templates', async (req: Request, res: Response) => {
  try {
    const template = new ReviewTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// ==================== PERFORMANCE REVIEWS ====================

// Get all reviews
router.get('/reviews', async (req: Request, res: Response) => {
  try {
    const { reviewCycle, reviewee, status } = req.query;
    const filter: any = {};
    
    if (reviewCycle) filter.reviewCycle = reviewCycle;
    if (reviewee) filter.reviewee = reviewee;
    if (status) filter.overallStatus = status;

    const reviews = await PerformanceReview.find(filter)
      .populate('reviewCycle', 'cycleName')
      .populate('reviewee', 'firstName lastName department')
      .populate('reviewers', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single review
router.get('/reviews/:id', async (req: Request, res: Response) => {
  try {
    const review = await PerformanceReview.findById(req.params.id)
      .populate('reviewCycle')
      .populate('reviewee', 'firstName lastName department')
      .populate('reviewers', 'firstName lastName')
      .populate('selfReview.responses')
      .populate('managerReview.reviewer', 'firstName lastName')
      .populate('peerReviews.reviewer', 'firstName lastName');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create review
router.post('/reviews', async (req: Request, res: Response) => {
  try {
    const review = new PerformanceReview(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Submit self review
router.post('/reviews/:id/self-review', async (req: Request, res: Response) => {
  try {
    const review = await PerformanceReview.findByIdAndUpdate(
      req.params.id,
      {
        selfReview: {
          ...req.body,
          submittedAt: new Date(),
          status: 'submitted'
        },
        overallStatus: 'in-progress',
        $push: {
          reviewHistory: {
            action: 'Self review submitted',
            performedBy: req.body.performedBy,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Submit manager review
router.post('/reviews/:id/manager-review', async (req: Request, res: Response) => {
  try {
    const review = await PerformanceReview.findByIdAndUpdate(
      req.params.id,
      {
        managerReview: {
          ...req.body,
          submittedAt: new Date(),
          status: 'submitted'
        },
        overallStatus: 'completed',
        submittedDate: new Date(),
        $push: {
          reviewHistory: {
            action: 'Manager review submitted',
            performedBy: req.body.performedBy,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Lock review
router.patch('/reviews/:id/lock', async (req: Request, res: Response) => {
  try {
    const review = await PerformanceReview.findByIdAndUpdate(
      req.params.id,
      { 
        overallStatus: 'locked',
        $push: {
          reviewHistory: {
            action: 'Review locked',
            performedBy: req.body.performedBy,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// ==================== RATINGS & SCORES ====================

// Get all ratings
router.get('/ratings', async (req: Request, res: Response) => {
  try {
    const { reviewCycle, employee, department, status } = req.query;
    const filter: any = {};
    
    if (reviewCycle) filter.reviewCycle = reviewCycle;
    if (employee) filter.employee = employee;
    if (status) filter.ratingStatus = status;

    const ratings = await Rating.find(filter)
      .populate('employee', 'firstName lastName department')
      .populate('reviewCycle', 'cycleName')
      .sort({ finalRating: -1 });
    
    res.json(ratings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single rating
router.get('/ratings/:id', async (req: Request, res: Response) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate('employee', 'firstName lastName department')
      .populate('reviewCycle', 'cycleName')
      .populate('ratingHistory.reviewCycle', 'cycleName');
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    res.json(rating);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update rating
router.post('/ratings', async (req: Request, res: Response) => {
  try {
    const { employee, reviewCycle } = req.body;
    
    // Check if rating already exists
    let rating = await Rating.findOne({ employee, reviewCycle });
    
    if (rating) {
      // Update existing rating
      rating = await Rating.findByIdAndUpdate(
        rating._id,
        req.body,
        { new: true }
      );
    } else {
      // Create new rating
      rating = new Rating(req.body);
      await rating.save();
    }
    
    res.status(201).json(rating);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update rating status
router.patch('/ratings/:id/status', async (req: Request, res: Response) => {
  try {
    const { ratingStatus } = req.body;
    const rating = await Rating.findByIdAndUpdate(
      req.params.id,
      { ratingStatus },
      { new: true }
    );
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    res.json(rating);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get rating distribution
router.get('/ratings/distribution/:reviewCycle', async (req: Request, res: Response) => {
  try {
    const distribution = await Rating.aggregate([
      { $match: { reviewCycle: req.params.reviewCycle } },
      {
        $bucket: {
          groupBy: '$finalRating',
          boundaries: [0, 2.5, 3.5, 4.5, 5.1],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            employees: { $push: '$employee' }
          }
        }
      }
    ]);
    
    res.json(distribution);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== CALIBRATION ====================

// Get all calibrations
router.get('/calibrations', async (req: Request, res: Response) => {
  try {
    const { reviewCycle, department, status } = req.query;
    const filter: any = {};
    
    if (reviewCycle) filter.reviewCycle = reviewCycle;
    if (status) filter.calibrationStatus = status;

    const calibrations = await Calibration.find(filter)
      .populate('employee', 'firstName lastName department')
      .populate('manager', 'firstName lastName')
      .populate('reviewCycle', 'cycleName')
      .sort({ createdAt: -1 });
    
    res.json(calibrations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update calibration
router.post('/calibrations', async (req: Request, res: Response) => {
  try {
    const { employee, reviewCycle } = req.body;
    
    let calibration = await Calibration.findOne({ employee, reviewCycle });
    
    if (calibration) {
      calibration = await Calibration.findByIdAndUpdate(
        calibration._id,
        req.body,
        { new: true }
      );
    } else {
      calibration = new Calibration(req.body);
      await calibration.save();
    }
    
    res.status(201).json(calibration);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Approve calibration
router.patch('/calibrations/:id/approve', async (req: Request, res: Response) => {
  try {
    const calibration = await Calibration.findByIdAndUpdate(
      req.params.id,
      {
        calibrationStatus: 'approved',
        approvedBy: req.body.approvedBy,
        approvedAt: new Date()
      },
      { new: true }
    );
    
    if (!calibration) {
      return res.status(404).json({ message: 'Calibration not found' });
    }
    
    // Update the rating with calibrated value
    await Rating.findOneAndUpdate(
      { employee: calibration.employee, reviewCycle: calibration.reviewCycle },
      { finalRating: calibration.calibratedRating, ratingStatus: 'approved' }
    );
    
    res.json(calibration);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// ==================== CALIBRATION SESSIONS ====================

// Get all calibration sessions
router.get('/calibration-sessions', async (req: Request, res: Response) => {
  try {
    const { department, status } = req.query;
    const filter: any = {};
    
    if (department) filter.department = department;
    if (status) filter.status = status;

    const sessions = await CalibrationSession.find(filter)
      .populate('reviewCycle', 'cycleName')
      .populate('participants', 'firstName lastName')
      .sort({ scheduledDate: -1 });
    
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create calibration session
router.post('/calibration-sessions', async (req: Request, res: Response) => {
  try {
    const session = new CalibrationSession(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update session status
router.patch('/calibration-sessions/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updateData: any = { status };
    
    if (status === 'completed') {
      updateData.completedDate = new Date();
    }
    
    const session = await CalibrationSession.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// ==================== COMPETENCIES ====================

// Get all competencies
router.get('/competencies', async (req: Request, res: Response) => {
  try {
    const competencies = await Competency.find({ status: 'active' });
    res.json(competencies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create competency
router.post('/competencies', async (req: Request, res: Response) => {
  try {
    const competency = new Competency(req.body);
    await competency.save();
    res.status(201).json(competency);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
