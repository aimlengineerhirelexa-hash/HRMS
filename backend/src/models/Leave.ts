import mongoose, { Schema, Document } from 'mongoose';

export interface LeaveDocument extends Document {
  tenantId: string;
  employeeId: string;
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'personal' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leaveSchema = new Schema<LeaveDocument>({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true },
  leaveType: { 
    type: String, 
    enum: ['annual', 'sick', 'maternity', 'paternity', 'personal', 'emergency'],
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' 
  },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  rejectionReason: { type: String }
}, {
  timestamps: true
});

export const Leave = mongoose.model<LeaveDocument>('Leave', leaveSchema);