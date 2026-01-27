import mongoose, { Schema, Document } from 'mongoose';

export interface JobDocument extends Document {
  tenantId: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  status: 'draft' | 'active' | 'closed' | 'on-hold';
  postedBy: string;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<JobDocument>({
  tenantId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  employmentType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true 
  },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'closed', 'on-hold'],
    default: 'draft' 
  },
  postedBy: { type: String, required: true },
  applicationsCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Job = mongoose.model<JobDocument>('Job', jobSchema);