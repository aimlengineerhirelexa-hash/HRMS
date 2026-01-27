import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  tenantId: string;
  employeeId?: string; // null for company-wide documents
  documentType: 'payslip' | 'offer_letter' | 'appointment_letter' | 'id_proof' | 'address_proof' | 'education_cert' | 'experience_cert' | 'policy_document' | 'compliance_record' | 'tax_document' | 'audit_log' | 'other';
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string; // URL or file path
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedDate: Date;
  expiryDate?: Date;
  status: 'active' | 'expired' | 'archived';
  accessLevel: 'public' | 'employee' | 'hr' | 'admin';
  tags?: string[];
  version?: number;
  parentDocument?: string; // For document versions
  complianceStatus?: 'compliant' | 'non_compliant' | 'pending_review';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: String },
  documentType: {
    type: String,
    enum: ['payslip', 'offer_letter', 'appointment_letter', 'id_proof', 'address_proof', 'education_cert', 'experience_cert', 'policy_document', 'compliance_record', 'tax_document', 'audit_log', 'other'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  status: {
    type: String,
    enum: ['active', 'expired', 'archived'],
    default: 'active'
  },
  accessLevel: {
    type: String,
    enum: ['public', 'employee', 'hr', 'admin'],
    default: 'employee'
  },
  tags: [{ type: String }],
  version: { type: Number, default: 1 },
  parentDocument: { type: String },
  complianceStatus: {
    type: String,
    enum: ['compliant', 'non_compliant', 'pending_review']
  },
  reviewNotes: { type: String },
  reviewedBy: { type: String },
  reviewedDate: { type: Date }
}, { timestamps: true });

// Indexes
documentSchema.index({ tenantId: 1, employeeId: 1 });
documentSchema.index({ tenantId: 1, documentType: 1 });
documentSchema.index({ tenantId: 1, status: 1 });
documentSchema.index({ tenantId: 1, expiryDate: 1 });

export const HRDocument = mongoose.model<IDocument>('Document', documentSchema);