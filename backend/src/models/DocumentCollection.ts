import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentRequirement extends Document {
  name: string;
  required: boolean;
  status: 'Pending' | 'Submitted' | 'Verified' | 'Rejected';
}

export interface IEmployeeDocuments extends Document {
  employeeId: string;
  employeeName: string;
  email: string;
  joinDate: string;
  documents: IDocumentRequirement[];
  overallProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

const documentRequirementSchema = new Schema({
  name: { type: String, required: true },
  required: { type: Boolean, default: true },
  status: { type: String, enum: ['Pending', 'Submitted', 'Verified', 'Rejected'], default: 'Pending' }
});

const employeeDocumentsSchema = new Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  email: { type: String, required: true },
  joinDate: { type: String, required: true },
  documents: [documentRequirementSchema],
  overallProgress: { type: Number, default: 0 }
}, { timestamps: true });

export const EmployeeDocuments = mongoose.model<IEmployeeDocuments>('EmployeeDocuments', employeeDocumentsSchema);