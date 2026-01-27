import mongoose, { Schema, Document } from 'mongoose';
import { Employee as IEmployee } from '../../../shared/types';

export interface EmployeeDocument extends Omit<IEmployee, '_id'>, Document {}

const employeeSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    maritalStatus: { type: String },
    bloodGroup: { type: String },
    currentAddress: { type: String },
    currentCity: { type: String },
    currentState: { type: String },
    currentPinCode: { type: String },
    currentCountry: { type: String, default: 'India' },
    permanentAddress: { type: String },
    permanentCity: { type: String },
    permanentState: { type: String },
    permanentPinCode: { type: String },
    permanentCountry: { type: String, default: 'India' },
    sameAsCurrentAddress: { type: Boolean, default: false }
  },
  identityInfo: {
    countryCode: { type: String, required: true },
    // India specific fields
    aadhaar: { type: String },
    pan: { type: String },
    uan: { type: String },
    esicNumber: { type: String },
    pfAccountNumber: { type: String },
    // US specific fields
    ssn: { type: String },
    workAuthorizationType: { type: String, enum: ['citizen', 'green_card', 'h1b', 'l1', 'opt', 'other'] },
    visaExpiryDate: { type: Date },
    // UK specific fields
    nationalInsuranceNumber: { type: String },
    rightToWorkStatus: { type: String, enum: ['settled', 'pre-settled', 'no-right'] },
    // Generic international fields
    nationalIdNumber: { type: String },
    workPermitNumber: { type: String },
    visaType: { type: String },
    // Common identity fields
    passport: { type: String },
    drivingLicense: { type: String },
    voterId: { type: String },
    // Bank details - common
    bankAccountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountType: { type: String, required: true, enum: ['savings', 'current', 'salary'] },
    currency: { type: String, required: true },
    payrollEnabled: { type: Boolean, default: true },
    // India bank fields
    ifscCode: { type: String },
    upiId: { type: String },
    // US bank fields
    routingNumber: { type: String },
    bankAddress: { type: String },
    achEnabled: { type: Boolean, default: true },
    // Europe/UK bank fields
    iban: { type: String },
    swiftBic: { type: String },
    // International bank fields
    swiftCode: { type: String },
    bankCountry: { type: String }
  },
  workInfo: {
    department: { type: String, required: true },
    designation: { type: String, required: true },
    reportingManager: { type: String },
    joinDate: { type: Date, required: true },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'intern'],
      required: true
    },
    workLocation: { type: String, enum: ['office', 'remote', 'hybrid'], default: 'office' },
    probationPeriod: { type: Number, default: 6 },
    experience: { type: String },
    highestQualification: { type: String },
    skillSet: { type: String },
    highestSalary: { type: Number }
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'onboarding', 'terminated'],
    default: 'onboarding' 
  },
  source: {
    type: String,
    enum: ['direct', 'onboarding'],
    default: 'direct'
  }
}, {
  timestamps: true
});

employeeSchema.index({ tenantId: 1, employeeId: 1 }, { unique: true });

export const Employee = mongoose.model<EmployeeDocument>('Employee', employeeSchema);