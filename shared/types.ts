export interface User {
  _id?: string;
  tenantId: string;
  employeeId: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'hr_manager' | 'finance_manager' | 'manager' | 'employee';
  firstName: string;
  lastName: string;
  department: string;
  managerId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  _id?: string;
  tenantId: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender?: string;
    maritalStatus?: string;
    bloodGroup?: string;
    currentAddress?: string;
    currentCity?: string;
    currentState?: string;
    currentPinCode?: string;
    currentCountry?: string;
    permanentAddress?: string;
    permanentCity?: string;
    permanentState?: string;
    permanentPinCode?: string;
    permanentCountry?: string;
    sameAsCurrentAddress?: boolean;
  };
  identityInfo: {
    countryCode: string;
    // India specific fields
    aadhaar?: string;
    pan?: string;
    uan?: string;
    esicNumber?: string;
    pfAccountNumber?: string;
    // US specific fields
    ssn?: string;
    workAuthorizationType?: string;
    visaExpiryDate?: Date;
    // UK specific fields
    nationalInsuranceNumber?: string;
    rightToWorkStatus?: string;
    // Generic international fields
    nationalIdNumber?: string;
    workPermitNumber?: string;
    visaType?: string;
    // Common identity fields
    passport?: string;
    drivingLicense?: string;
    voterId?: string;
    // Bank details - common
    bankAccountHolderName: string;
    bankName: string;
    accountNumber: string;
    accountType: string;
    currency: string;
    payrollEnabled?: boolean;
    // India bank fields
    ifscCode?: string;
    upiId?: string;
    // US bank fields
    routingNumber?: string;
    bankAddress?: string;
    achEnabled?: boolean;
    // Europe/UK bank fields
    iban?: string;
    swiftBic?: string;
    // International bank fields
    swiftCode?: string;
    bankCountry?: string;
  };
  workInfo: {
    department: string;
    designation: string;
    reportingManager?: string;
    joinDate: Date;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
    workLocation: 'office' | 'remote' | 'hybrid';
    probationPeriod?: number;
    experience?: string;
    highestQualification?: string;
    skillSet?: string;
    highestSalary?: number;
  };
  status: 'active' | 'inactive' | 'onboarding' | 'terminated';
  source: 'direct' | 'onboarding';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Role {
  _id?: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Permission {
  _id?: string;
  name: string;
  displayName: string;
  module: string;
  action: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NavigationItem {
  _id?: string;
  id: string;
  label: string;
  icon?: string;
  path?: string;
  parentId?: string;
  order: number;
  requiredPermissions: string[];
  children?: NavigationItem[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = 'super_admin' | 'admin' | 'hr_manager' | 'finance_manager' | 'manager' | 'employee';

export interface RolePermissions {
  [key: string]: string[];
}