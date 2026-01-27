import mongoose, { Schema, Document } from 'mongoose';

// Recruitment Funnel Schema
export interface IRecruitmentFunnel extends Document {
  tenantId: string;
  stage: 'Applied' | 'Shortlisted' | 'Interviewed' | 'Offered' | 'Joined';
  count: number;
  percentage: number;
  color: string;
  updatedAt: Date;
  createdAt: Date;
}

const recruitmentFunnelSchema = new Schema<IRecruitmentFunnel>({
  tenantId: { type: String, required: true, index: true, default: 'default' },
  stage: { 
    type: String, 
    enum: ['Applied', 'Shortlisted', 'Interviewed', 'Offered', 'Joined'],
    required: true 
  },
  count: { type: Number, required: true, default: 0 },
  percentage: { type: Number, required: true, default: 0 }
}, { timestamps: true });

recruitmentFunnelSchema.index({ tenantId: 1, stage: 1 }, { unique: true });

// Compliance Snapshot Schema
export interface IComplianceSnapshot extends Document {
  tenantId: string;
  title: string;
  value: string | number;
  icon: string;
  color: string;
  updatedAt: Date;
  createdAt: Date;
}

const complianceSnapshotSchema = new Schema<IComplianceSnapshot>({
  tenantId: { type: String, required: true, index: true, default: 'default' },
  title: { 
    type: String, 
    required: true,
    enum: ['Documents Due', 'Skills Gap Count', 'Documents Expiring', 'Compliance Risk']
  },
  value: { type: Schema.Types.Mixed, required: true },
  icon: { 
    type: String, 
    enum: ['FileText', 'Target', 'Clock'],
    default: 'FileText'
  },
  color: { type: String, default: 'text-orange-800' }
}, { timestamps: true });

complianceSnapshotSchema.index({ tenantId: 1, title: 1 }, { unique: true });

export const RecruitmentFunnel = mongoose.model<IRecruitmentFunnel>('RecruitmentFunnel', recruitmentFunnelSchema);
export const ComplianceSnapshot = mongoose.model<IComplianceSnapshot>('ComplianceSnapshot', complianceSnapshotSchema);

