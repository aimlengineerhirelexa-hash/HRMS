import mongoose, { Schema, Document } from 'mongoose';

export interface IBenefit extends Document {
  tenantId: string;
  benefitType: 'health_insurance' | 'life_insurance' | 'dental' | 'vision' | 'retirement' | 'education' | 'gym_membership' | 'meal_allowance' | 'other';
  name: string;
  description: string;
  provider: string;
  coverageAmount?: number;
  employeeContribution?: number;
  employerContribution?: number;
  totalCost?: number;
  currency: string;
  eligibilityCriteria: string;
  enrollmentRequired: boolean;
  enrollmentPeriod?: {
    startDate: Date;
    endDate: Date;
  };
  status: 'active' | 'inactive' | 'draft';
  applicableTo: string[]; // employee IDs or 'all'
  documents?: string[]; // URLs or file paths
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const benefitSchema = new Schema<IBenefit>({
  tenantId: { type: String, required: true, index: true },
  benefitType: {
    type: String,
    enum: ['health_insurance', 'life_insurance', 'dental', 'vision', 'retirement', 'education', 'gym_membership', 'meal_allowance', 'other'],
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  provider: { type: String, required: true },
  coverageAmount: { type: Number },
  employeeContribution: { type: Number },
  employerContribution: { type: Number },
  totalCost: { type: Number },
  currency: { type: String, default: 'INR' },
  eligibilityCriteria: { type: String, required: true },
  enrollmentRequired: { type: Boolean, default: true },
  enrollmentPeriod: {
    startDate: { type: Date },
    endDate: { type: Date }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  applicableTo: [{ type: String }],
  documents: [{ type: String }],
  createdBy: { type: String, required: true }
}, { timestamps: true });

// Indexes
benefitSchema.index({ tenantId: 1, benefitType: 1 });
benefitSchema.index({ tenantId: 1, status: 1 });

export const Benefit = mongoose.model<IBenefit>('Benefit', benefitSchema);