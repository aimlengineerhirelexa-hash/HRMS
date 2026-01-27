import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  tenantId: string;
  employeeId: string;
  expenseType: 'travel' | 'medical' | 'food' | 'accommodation' | 'transport' | 'miscellaneous';
  amount: number;
  currency: string;
  description: string;
  expenseDate: Date;
  receipt?: string; // URL or file path
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  submittedBy: string;
  submittedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectedBy?: string;
  rejectedDate?: Date;
  rejectionReason?: string;
  category: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'other';
  vendor?: string;
  location?: string;
  taxAmount?: number;
  taxable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true },
  expenseType: {
    type: String,
    enum: ['travel', 'medical', 'food', 'accommodation', 'transport', 'miscellaneous'],
    required: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  description: { type: String, required: true },
  expenseDate: { type: Date, required: true },
  receipt: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'reimbursed'],
    default: 'pending'
  },
  submittedBy: { type: String, required: true },
  submittedDate: { type: Date, default: Date.now },
  approvedBy: { type: String },
  approvedDate: { type: Date },
  rejectedBy: { type: String },
  rejectedDate: { type: Date },
  rejectionReason: { type: String },
  category: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'other']
  },
  vendor: { type: String },
  location: { type: String },
  taxAmount: { type: Number },
  taxable: { type: Boolean, default: false }
}, { timestamps: true });

// Indexes
expenseSchema.index({ tenantId: 1, employeeId: 1 });
expenseSchema.index({ tenantId: 1, status: 1 });
expenseSchema.index({ tenantId: 1, expenseDate: -1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);