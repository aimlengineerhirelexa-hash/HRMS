import mongoose, { Schema, Document } from 'mongoose';

export interface IReportingManager extends Document {
  employeeName: string;
  reportingManager: string;
  department: string;
  effectiveDate: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportingManagerSchema = new Schema({
  employeeName: { type: String, required: true },
  reportingManager: { type: String, required: true },
  department: { type: String, required: true },
  effectiveDate: { type: String, required: true }
}, { timestamps: true });

export const ReportingManager = mongoose.model<IReportingManager>('ReportingManager', reportingManagerSchema);
