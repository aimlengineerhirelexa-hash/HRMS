import mongoose, { Schema, Document } from 'mongoose';

export interface AnalyticsDocument extends Document {
  tenantId: string;
  type: 'hr_metrics' | 'payroll' | 'expense' | 'attendance' | 'attrition' | 'custom';
  period: { startDate: Date; endDate: Date; };
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<AnalyticsDocument>({
  tenantId: { type: String, required: true, index: true },
  type: { type: String, enum: ['hr_metrics', 'payroll', 'expense', 'attendance', 'attrition', 'custom'], required: true },
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  data: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });

analyticsSchema.index({ tenantId: 1, type: 1, 'period.startDate': 1 });

export const Analytics = mongoose.model<AnalyticsDocument>('Analytics', analyticsSchema);
