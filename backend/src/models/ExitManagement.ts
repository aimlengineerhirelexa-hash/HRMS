import mongoose, { Schema, Document } from 'mongoose';

export interface IResignation extends Document {
  employeeName: string;
  employeeId: string;
  department: string;
  resignationDate: string;
  lastWorkingDay: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ITermination extends Document {
  employeeName: string;
  employeeId: string;
  department: string;
  terminationDate: string;
  reason: string;
  remarks: string;
  status: 'Draft' | 'Submitted' | 'Approved';
  createdAt: Date;
  updatedAt: Date;
}

const resignationSchema = new Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  department: { type: String, required: true },
  resignationDate: { type: String, required: true },
  lastWorkingDay: { type: String, required: true },
  reason: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

const terminationSchema = new Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  department: { type: String, required: true },
  terminationDate: { type: String, required: true },
  reason: { type: String, required: true },
  remarks: { type: String },
  status: { type: String, enum: ['Draft', 'Submitted', 'Approved'], default: 'Draft' }
}, { timestamps: true });

export const Resignation = mongoose.model<IResignation>('Resignation', resignationSchema);
export const Termination = mongoose.model<ITermination>('Termination', terminationSchema);

export interface IExitManagement extends Document {
  employeeId: string;
  exitDate: Date;
  type: 'resignation' | 'termination';
}

const exitManagementSchema = new Schema({
  employeeId: { type: String, required: true },
  exitDate: { type: Date, required: true },
  type: { type: String, enum: ['resignation', 'termination'], required: true }
}, { timestamps: true });

export const ExitManagement = mongoose.model<IExitManagement>('ExitManagement', exitManagementSchema);
