import mongoose, { Schema, Document } from 'mongoose';

export interface IShift extends Document {
  name: string;
  startTime: string;
  endTime: string;
  department: string;
  assignedEmployees: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const shiftSchema = new Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  department: { type: String, required: true },
  assignedEmployees: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export const Shift = mongoose.model<IShift>('Shift', shiftSchema);
