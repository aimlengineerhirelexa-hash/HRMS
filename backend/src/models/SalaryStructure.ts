import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryComponent extends Document {
  componentName: string;
  componentCode: string;
  componentType: 'earning' | 'deduction';
  calculationMethod: 'fixed' | 'percentage';
  amount?: number;
  percentage?: number;
  payFrequency: 'monthly' | 'bi-weekly';
  taxApplicability: boolean;
  showOnPayslip: boolean;
  effectiveFromDate: string;
  status: 'active' | 'inactive';
  componentGroup: string;
  mandatory: boolean;
  roundingRules?: string;
  visibilityControl: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISalaryTemplate extends Document {
  templateName: string;
  description: string;
  components: string[];
  status: 'active' | 'inactive';
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const salaryComponentSchema = new Schema({
  componentName: { type: String, required: true },
  componentCode: { type: String, required: true, unique: true },
  componentType: { type: String, enum: ['earning', 'deduction'], required: true },
  calculationMethod: { type: String, enum: ['fixed', 'percentage'], required: true },
  amount: { type: Number },
  percentage: { type: Number },
  payFrequency: { type: String, enum: ['monthly', 'bi-weekly'], default: 'monthly' },
  taxApplicability: { type: Boolean, default: true },
  showOnPayslip: { type: Boolean, default: true },
  effectiveFromDate: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  componentGroup: { type: String },
  mandatory: { type: Boolean, default: false },
  roundingRules: { type: String },
  visibilityControl: { type: Boolean, default: true }
}, { timestamps: true });

const salaryTemplateSchema = new Schema({
  templateName: { type: String, required: true, unique: true },
  description: { type: String },
  components: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  version: { type: Number, default: 1 }
}, { timestamps: true });

export const SalaryComponent = mongoose.models.SalaryComponent || mongoose.model<ISalaryComponent>('SalaryComponent', salaryComponentSchema);
export const SalaryTemplate = mongoose.models.SalaryTemplate || mongoose.model<ISalaryTemplate>('SalaryTemplate', salaryTemplateSchema);
