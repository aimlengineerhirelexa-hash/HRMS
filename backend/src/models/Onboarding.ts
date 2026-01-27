import mongoose, { Schema, Document } from 'mongoose';

interface IOnboardingTask {
  _id?: any;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
}

export interface IOnboarding extends Document {
  employeeId: string;
  employeeName: string;
  email: string;
  department: string;
  designation: string;
  joinDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  tasks: IOnboardingTask[];
  createdAt: Date;
  updatedAt: Date;
}

const onboardingSchema = new Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joinDate: { type: String, required: true },
  status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
  progress: { type: Number, default: 0 },
  tasks: [{
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    dueDate: { type: String },
    assignedTo: { type: String }
  }]
}, { timestamps: true });

export const Onboarding = mongoose.model<IOnboarding>('Onboarding', onboardingSchema);
