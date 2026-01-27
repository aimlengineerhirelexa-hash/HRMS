import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '../../../shared/types';

export interface UserDocument extends Omit<IUser, '_id'>, Document {}

const userSchema = new Schema<UserDocument>({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'hr_manager', 'finance_manager', 'manager', 'employee'],
    required: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { type: String, required: true },
  managerId: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, {
  timestamps: true
});

userSchema.index({ tenantId: 1, employeeId: 1 }, { unique: true });

export const User = mongoose.model<UserDocument>('User', userSchema);