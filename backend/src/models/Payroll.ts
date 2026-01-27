import mongoose, { Schema, Document } from 'mongoose';

// Salary Component Schema
export interface SalaryComponentDocument extends Document {
  tenantId: string;
  componentName: string;
  componentCode: string;
  componentType: 'earning' | 'deduction';
  calculationMethod: 'fixed' | 'percentage';
  amount?: number;
  percentage?: number;
  payFrequency: 'monthly' | 'bi-weekly';
  taxApplicability: boolean;
  showOnPayslip: boolean;
  effectiveFromDate: Date;
  status: 'active' | 'inactive';
  componentGroup: string;
  mandatory: boolean;
  roundingRules?: string;
  visibilityControl: boolean;
}

const salaryComponentSchema = new Schema<SalaryComponentDocument>({
  tenantId: { type: String, required: true, index: true },
  componentName: { type: String, required: true },
  componentCode: { type: String, required: true, unique: true },
  componentType: { type: String, enum: ['earning', 'deduction'], required: true },
  calculationMethod: { type: String, enum: ['fixed', 'percentage'], required: true },
  amount: { type: Number },
  percentage: { type: Number },
  payFrequency: { type: String, enum: ['monthly', 'bi-weekly'], default: 'monthly' },
  taxApplicability: { type: Boolean, default: true },
  showOnPayslip: { type: Boolean, default: true },
  effectiveFromDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  componentGroup: { type: String, required: true },
  mandatory: { type: Boolean, default: false },
  roundingRules: { type: String },
  visibilityControl: { type: Boolean, default: true }
}, { timestamps: true });

// Payroll Run Schema
export interface PayrollRunDocument extends Document {
  tenantId: string;
  payrollPeriod: string;
  payrollType: 'regular' | 'off-cycle';
  payDate: Date;
  startDate: Date;
  endDate: Date;
  employeeList: string[];
  includedEmployees: string[];
  excludedEmployees: string[];
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'approved' | 'processed' | 'locked';
  notes?: string;
  remarks?: string;
  processedBy?: string;
  approvedBy?: string;
  lockedBy?: string;
  processedAt?: Date;
  approvedAt?: Date;
  lockedAt?: Date;
  bankAdviceGenerated: boolean;
  paymentFileGenerated: boolean;
  finalConfirmation: boolean;
}

const payrollRunSchema = new Schema<PayrollRunDocument>({
  tenantId: { type: String, required: true, index: true },
  payrollPeriod: { type: String, required: true },
  payrollType: { type: String, enum: ['regular', 'off-cycle'], default: 'regular' },
  payDate: { type: Date, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  employeeList: [{ type: String }],
  includedEmployees: [{ type: String }],
  excludedEmployees: [{ type: String }],
  totalEarnings: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  netPay: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'approved', 'processed', 'locked'], default: 'draft' },
  notes: { type: String },
  remarks: { type: String },
  processedBy: { type: String },
  approvedBy: { type: String },
  lockedBy: { type: String },
  processedAt: { type: Date },
  approvedAt: { type: Date },
  lockedAt: { type: Date },
  bankAdviceGenerated: { type: Boolean, default: false },
  paymentFileGenerated: { type: Boolean, default: false },
  finalConfirmation: { type: Boolean, default: false }
}, { timestamps: true });

// Payslip Schema
export interface PayslipDocument extends Document {
  tenantId: string;
  payrollRunId: string;
  employeeId: string;
  payPeriod: string;
  companyDetails: {
    name: string;
    address: string;
    logo?: string;
  };
  employeeDetails: {
    name: string;
    employeeId: string;
    department: string;
    designation: string;
    bankAccount?: string;
  };
  earningsBreakdown: {
    componentName: string;
    amount: number;
  }[];
  deductionsBreakdown: {
    componentName: string;
    amount: number;
  }[];
  grossPay: number;
  netPay: number;
  paymentDate: Date;
  payslipNumber: string;
  status: 'generated' | 'sent' | 'downloaded' | 'acknowledged';
  passwordProtected: boolean;
  revisionHistory: {
    version: number;
    modifiedBy: string;
    modifiedAt: Date;
    changes: string;
  }[];
  template: string;
}

const payslipSchema = new Schema<PayslipDocument>({
  tenantId: { type: String, required: true, index: true },
  payrollRunId: { type: String, required: true },
  employeeId: { type: String, required: true },
  payPeriod: { type: String, required: true },
  companyDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String }
  },
  employeeDetails: {
    name: { type: String, required: true },
    employeeId: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    bankAccount: { type: String }
  },
  earningsBreakdown: [{
    componentName: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  deductionsBreakdown: [{
    componentName: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  grossPay: { type: Number, required: true },
  netPay: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  payslipNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['generated', 'sent', 'downloaded', 'acknowledged'], default: 'generated' },
  passwordProtected: { type: Boolean, default: false },
  revisionHistory: [{
    version: { type: Number, required: true },
    modifiedBy: { type: String, required: true },
    modifiedAt: { type: Date, default: Date.now },
    changes: { type: String, required: true }
  }],
  template: { type: String, default: 'default' }
}, { timestamps: true });

// Compliance Schema (PF/ESI)
export interface ComplianceDocument extends Document {
  tenantId: string;
  payrollRunId: string;
  period: string;
  pfApplicability: boolean;
  esiApplicability: boolean;
  pfCalculation: {
    employeeContribution: number;
    employerContribution: number;
    totalContribution: number;
  };
  esiCalculation: {
    employeeContribution: number;
    employerContribution: number;
    totalContribution: number;
  };
  challanGenerated: boolean;
  challanNumber?: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  filingPeriod: string;
  complianceSummary: {
    totalEmployees: number;
    pfEligibleEmployees: number;
    esiEligibleEmployees: number;
  };
}

const complianceSchema = new Schema<ComplianceDocument>({
  tenantId: { type: String, required: true, index: true },
  payrollRunId: { type: String, required: true },
  period: { type: String, required: true },
  pfApplicability: { type: Boolean, default: true },
  esiApplicability: { type: Boolean, default: true },
  pfCalculation: {
    employeeContribution: { type: Number, default: 0 },
    employerContribution: { type: Number, default: 0 },
    totalContribution: { type: Number, default: 0 }
  },
  esiCalculation: {
    employeeContribution: { type: Number, default: 0 },
    employerContribution: { type: Number, default: 0 },
    totalContribution: { type: Number, default: 0 }
  },
  challanGenerated: { type: Boolean, default: false },
  challanNumber: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  filingPeriod: { type: String, required: true },
  complianceSummary: {
    totalEmployees: { type: Number, default: 0 },
    pfEligibleEmployees: { type: Number, default: 0 },
    esiEligibleEmployees: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const SalaryComponent = mongoose.model<SalaryComponentDocument>('SalaryComponent', salaryComponentSchema);
export const PayrollRun = mongoose.model<PayrollRunDocument>('PayrollRun', payrollRunSchema);
export const Payslip = mongoose.model<PayslipDocument>('Payslip', payslipSchema);
export const Compliance = mongoose.model<ComplianceDocument>('Compliance', complianceSchema);

// Legacy Payroll Document (kept for backward compatibility)
export interface PayrollDocument extends Document {
  tenantId: string;
  employeeId: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
  };
  basicSalary: number;
  allowances: {
    name: string;
    amount: number;
  }[];
  deductions: {
    name: string;
    amount: number;
  }[];
  grossPay: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
  processedBy?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const payrollSchema = new Schema<PayrollDocument>({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true },
  payPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  basicSalary: { type: Number, required: true },
  allowances: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  deductions: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  grossPay: { type: Number, required: true },
  netPay: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'processed', 'paid'],
    default: 'draft' 
  },
  processedBy: { type: String },
  processedAt: { type: Date }
}, { timestamps: true });

export const Payroll = mongoose.model<PayrollDocument>('Payroll', payrollSchema);