import mongoose, { Schema, Document } from 'mongoose';

// Goal & OKR Schema
export interface IGoal extends Document {
  title: string;
  type: 'objective' | 'key-result';
  description: string;
  owner: mongoose.Types.ObjectId;
  department?: string;
  startDate: Date;
  endDate: Date;
  weightage: number;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  alignment?: mongoose.Types.ObjectId;
  visibility: 'public' | 'private' | 'team';
  comments: {
    user: mongoose.Types.ObjectId;
    comment: string;
    timestamp: Date;
  }[];
  editHistory: {
    editedBy: mongoose.Types.ObjectId;
    editedAt: Date;
    changes: string;
  }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['objective', 'key-result'], required: true },
  description: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  department: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  weightage: { type: Number, required: true, min: 0, max: 100 },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
  alignment: { type: Schema.Types.ObjectId, ref: 'Goal' },
  visibility: { type: String, enum: ['public', 'private', 'team'], default: 'public' },
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  editHistory: [{
    editedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    editedAt: { type: Date, default: Date.now },
    changes: { type: String }
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Review Cycle Schema
export interface IReviewCycle extends Document {
  cycleName: string;
  reviewPeriod: string;
  reviewType: 'annual' | 'quarterly' | 'mid-year';
  template: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'locked';
  selfReviewEnabled: boolean;
  reviewers: {
    employee: mongoose.Types.ObjectId;
    reviewers: mongoose.Types.ObjectId[];
  }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewCycleSchema: Schema = new Schema({
  cycleName: { type: String, required: true },
  reviewPeriod: { type: String, required: true },
  reviewType: { type: String, enum: ['annual', 'quarterly', 'mid-year'], required: true },
  template: { type: Schema.Types.ObjectId, ref: 'ReviewTemplate', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'active', 'completed', 'locked'], default: 'draft' },
  selfReviewEnabled: { type: Boolean, default: true },
  reviewers: [{
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    reviewers: [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Review Template Schema
export interface IReviewTemplate extends Document {
  templateName: string;
  description: string;
  sections: {
    sectionName: string;
    questions: {
      questionText: string;
      questionType: 'rating' | 'text' | 'multiple-choice';
      options?: string[];
      required: boolean;
    }[];
    weightage: number;
  }[];
  ratingScale: {
    min: number;
    max: number;
    labels: string[];
  };
  status: 'active' | 'inactive';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewTemplateSchema: Schema = new Schema({
  templateName: { type: String, required: true },
  description: { type: String },
  sections: [{
    sectionName: { type: String, required: true },
    questions: [{
      questionText: { type: String, required: true },
      questionType: { type: String, enum: ['rating', 'text', 'multiple-choice'], required: true },
      options: [{ type: String }],
      required: { type: Boolean, default: true }
    }],
    weightage: { type: Number, required: true }
  }],
  ratingScale: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 5 },
    labels: [{ type: String }]
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Performance Review Schema
export interface IPerformanceReview extends Document {
  reviewCycle: mongoose.Types.ObjectId;
  reviewee: mongoose.Types.ObjectId;
  reviewers: mongoose.Types.ObjectId[];
  selfReview?: {
    responses: {
      sectionName: string;
      questionText: string;
      answer: any;
    }[];
    comments: string;
    submittedAt: Date;
    status: 'pending' | 'submitted';
  };
  managerReview?: {
    reviewer: mongoose.Types.ObjectId;
    responses: {
      sectionName: string;
      questionText: string;
      answer: any;
    }[];
    comments: string;
    submittedAt: Date;
    status: 'pending' | 'submitted';
  };
  peerReviews?: {
    reviewer: mongoose.Types.ObjectId;
    responses: {
      sectionName: string;
      questionText: string;
      answer: any;
    }[];
    comments: string;
    submittedAt: Date;
    status: 'pending' | 'submitted';
  }[];
  overallStatus: 'not-started' | 'in-progress' | 'completed' | 'locked';
  dueDate: Date;
  submittedDate?: Date;
  reviewHistory: {
    action: string;
    performedBy: mongoose.Types.ObjectId;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PerformanceReviewSchema: Schema = new Schema({
  reviewCycle: { type: Schema.Types.ObjectId, ref: 'ReviewCycle', required: true },
  reviewee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  reviewers: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  selfReview: {
    responses: [{
      sectionName: { type: String },
      questionText: { type: String },
      answer: { type: Schema.Types.Mixed }
    }],
    comments: { type: String },
    submittedAt: { type: Date },
    status: { type: String, enum: ['pending', 'submitted'], default: 'pending' }
  },
  managerReview: {
    reviewer: { type: Schema.Types.ObjectId, ref: 'Employee' },
    responses: [{
      sectionName: { type: String },
      questionText: { type: String },
      answer: { type: Schema.Types.Mixed }
    }],
    comments: { type: String },
    submittedAt: { type: Date },
    status: { type: String, enum: ['pending', 'submitted'], default: 'pending' }
  },
  peerReviews: [{
    reviewer: { type: Schema.Types.ObjectId, ref: 'Employee' },
    responses: [{
      sectionName: { type: String },
      questionText: { type: String },
      answer: { type: Schema.Types.Mixed }
    }],
    comments: { type: String },
    submittedAt: { type: Date },
    status: { type: String, enum: ['pending', 'submitted'], default: 'pending' }
  }],
  overallStatus: { type: String, enum: ['not-started', 'in-progress', 'completed', 'locked'], default: 'not-started' },
  dueDate: { type: Date, required: true },
  submittedDate: { type: Date },
  reviewHistory: [{
    action: { type: String },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Rating & Competency Schema
export interface IRating extends Document {
  employee: mongoose.Types.ObjectId;
  reviewCycle: mongoose.Types.ObjectId;
  competencies: {
    competencyName: string;
    score: number;
    weightage: number;
    comments?: string;
  }[];
  finalRating: number;
  ratingStatus: 'draft' | 'submitted' | 'approved' | 'locked';
  ratingHistory: {
    rating: number;
    reviewCycle: mongoose.Types.ObjectId;
    date: Date;
  }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema: Schema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  reviewCycle: { type: Schema.Types.ObjectId, ref: 'ReviewCycle', required: true },
  competencies: [{
    competencyName: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 5 },
    weightage: { type: Number, required: true, min: 0, max: 100 },
    comments: { type: String }
  }],
  finalRating: { type: Number, required: true, min: 0, max: 5 },
  ratingStatus: { type: String, enum: ['draft', 'submitted', 'approved', 'locked'], default: 'draft' },
  ratingHistory: [{
    rating: { type: Number },
    reviewCycle: { type: Schema.Types.ObjectId, ref: 'ReviewCycle' },
    date: { type: Date, default: Date.now }
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Calibration Schema
export interface ICalibration extends Document {
  employee: mongoose.Types.ObjectId;
  reviewCycle: mongoose.Types.ObjectId;
  manager: mongoose.Types.ObjectId;
  originalRating: number;
  calibratedRating: number;
  justification: string;
  calibrationStatus: 'pending' | 'in-review' | 'approved' | 'rejected';
  calibrationSession?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CalibrationSchema: Schema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  reviewCycle: { type: Schema.Types.ObjectId, ref: 'ReviewCycle', required: true },
  manager: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  originalRating: { type: Number, required: true, min: 0, max: 5 },
  calibratedRating: { type: Number, required: true, min: 0, max: 5 },
  justification: { type: String, required: true },
  calibrationStatus: { type: String, enum: ['pending', 'in-review', 'approved', 'rejected'], default: 'pending' },
  calibrationSession: { type: Schema.Types.ObjectId, ref: 'CalibrationSession' },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Calibration Session Schema
export interface ICalibrationSession extends Document {
  sessionName: string;
  department: string;
  reviewCycle: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  employees: mongoose.Types.ObjectId[];
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledDate: Date;
  completedDate?: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CalibrationSessionSchema: Schema = new Schema({
  sessionName: { type: String, required: true },
  department: { type: String, required: true },
  reviewCycle: { type: Schema.Types.ObjectId, ref: 'ReviewCycle', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  status: { type: String, enum: ['scheduled', 'in-progress', 'completed'], default: 'scheduled' },
  scheduledDate: { type: Date, required: true },
  completedDate: { type: Date },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Competency Master Schema
export interface ICompetency extends Document {
  competencyName: string;
  description: string;
  category: string;
  applicableDepartments: string[];
  ratingCriteria: {
    level: number;
    description: string;
  }[];
  status: 'active' | 'inactive';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompetencySchema: Schema = new Schema({
  competencyName: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  applicableDepartments: [{ type: String }],
  ratingCriteria: [{
    level: { type: Number, required: true },
    description: { type: String, required: true }
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Indexes for performance
GoalSchema.index({ owner: 1, status: 1 });
GoalSchema.index({ department: 1, status: 1 });
ReviewCycleSchema.index({ status: 1, startDate: -1 });
PerformanceReviewSchema.index({ reviewee: 1, reviewCycle: 1 });
PerformanceReviewSchema.index({ overallStatus: 1 });
RatingSchema.index({ employee: 1, reviewCycle: 1 });
CalibrationSchema.index({ employee: 1, reviewCycle: 1 });
CalibrationSessionSchema.index({ department: 1, status: 1 });

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema);
export const ReviewCycle = mongoose.model<IReviewCycle>('ReviewCycle', ReviewCycleSchema);
export const ReviewTemplate = mongoose.model<IReviewTemplate>('ReviewTemplate', ReviewTemplateSchema);
export const PerformanceReview = mongoose.model<IPerformanceReview>('PerformanceReview', PerformanceReviewSchema);
export const Rating = mongoose.model<IRating>('Rating', RatingSchema);
export const Calibration = mongoose.model<ICalibration>('Calibration', CalibrationSchema);
export const CalibrationSession = mongoose.model<ICalibrationSession>('CalibrationSession', CalibrationSessionSchema);
export const Competency = mongoose.model<ICompetency>('Competency', CompetencySchema);
