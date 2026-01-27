import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignation extends Document {
  name: string;
  department?: string;
  employeeCount: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const designationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  department: { type: String },
  employeeCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export const Designation = mongoose.model<IDesignation>('Designation', designationSchema);
