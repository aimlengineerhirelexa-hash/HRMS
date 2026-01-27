import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Employee } from '../models/Employee';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { NavigationItem } from '../models/NavigationItem';
import { Holiday } from '../models/Holiday';
import { SalaryComponent, SalaryTemplate } from '../models/SalaryStructure';
import { Job } from '../models/Job';
import { Department } from '../models/Department';
import { Designation } from '../models/Designation';
import { Shift } from '../models/Shift';
import { RecruitmentFunnel } from '../models/DashboardMetrics';
import { ComplianceSnapshot } from '../models/DashboardMetrics';
import { Attendance } from '../models/Attendance';
import { Leave } from '../models/Leave';


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/HRMS');

    // Drop database to start fresh
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log('Database dropped successfully');
    }

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await NavigationItem.deleteMany({});
    await Holiday.deleteMany({});
    await SalaryComponent.deleteMany({});
    await SalaryTemplate.deleteMany({});
    await Job.deleteMany({});
    await Department.deleteMany({});
    await Designation.deleteMany({});
    await Shift.deleteMany({});
    await RecruitmentFunnel.deleteMany({});
    await ComplianceSnapshot.deleteMany({});
    await Attendance.deleteMany({});


    // Seed Permissions
    const permissions = [
      { name: 'dashboard.view', displayName: 'View Dashboard', module: 'dashboard', action: 'view' },
      { name: 'employees.view', displayName: 'View Employees', module: 'employees', action: 'view' },
      { name: 'employees.create', displayName: 'Create Employee', module: 'employees', action: 'create' },
      { name: 'employees.edit', displayName: 'Edit Employee', module: 'employees', action: 'edit' },
      { name: 'employees.delete', displayName: 'Delete Employee', module: 'employees', action: 'delete' },
      { name: 'organization.view', displayName: 'View Organization', module: 'organization', action: 'view' },
      { name: 'organization.manage', displayName: 'Manage Organization', module: 'organization', action: 'manage' },
      { name: 'payroll.view', displayName: 'View Payroll', module: 'payroll', action: 'view' },
      { name: 'payroll.process', displayName: 'Process Payroll', module: 'payroll', action: 'process' },
      { name: 'attendance.view', displayName: 'View Attendance', module: 'attendance', action: 'view' },
      { name: 'attendance.manage', displayName: 'Manage Attendance', module: 'attendance', action: 'manage' },
      { name: 'recruitment.view', displayName: 'View Recruitment', module: 'recruitment', action: 'view' },
      { name: 'recruitment.manage', displayName: 'Manage Recruitment', module: 'recruitment', action: 'manage' },
    ];

    await Permission.insertMany(permissions);

    // Seed Roles
    const roles = [
      {
        name: 'super_admin',
        displayName: 'Super Admin',
        description: 'Full system access',
        permissions: permissions.map(p => p.name)
      },
      {
        name: 'hr_manager',
        displayName: 'HR Manager',
        description: 'HR module access',
        permissions: ['dashboard.view', 'employees.view', 'employees.create', 'employees.edit', 'organization.view', 'organization.manage', 'recruitment.view', 'recruitment.manage']
      },
      {
        name: 'finance_manager',
        displayName: 'Finance Manager',
        description: 'Finance and payroll access',
        permissions: ['dashboard.view', 'employees.view', 'payroll.view', 'payroll.process']
      },
      {
        name: 'manager',
        displayName: 'Manager',
        description: 'Team management access',
        permissions: ['dashboard.view', 'employees.view', 'attendance.view', 'attendance.manage']
      },
      {
        name: 'employee',
        displayName: 'Employee',
        description: 'Basic employee access',
        permissions: ['dashboard.view', 'employees.view', 'attendance.view']
      }
    ];

    await Role.insertMany(roles);

    // Seed Attendance Records
const attendanceRecords = [
  // EMP006 – Regular employee
  {
    tenantId: 'default',
    employeeId: 'EMP006',
    date: new Date('2024-12-18'),
    checkIn: new Date('2024-12-18T09:05:00'),
    checkOut: new Date('2024-12-18T18:10:00'),
    breakTime: 60,
    totalHours: 8,
    status: 'present',
    notes: 'On time'
  },
  {
    tenantId: 'default',
    employeeId: 'EMP006',
    date: new Date('2024-12-19'),
    checkIn: new Date('2024-12-19T09:45:00'),
    checkOut: new Date('2024-12-19T18:00:00'),
    breakTime: 60,
    totalHours: 7.25,
    status: 'late',
    notes: 'Late due to traffic'
  },
  {
    tenantId: 'default',
    employeeId: 'EMP006',
    date: new Date('2024-12-20'),
    checkIn: new Date('2024-12-20T09:30:00'),
    checkOut: new Date('2024-12-20T14:00:00'),
    breakTime: 30,
    totalHours: 4,
    status: 'half-day',
    notes: 'Personal work'
  },

  // EMP007 – HR Manager
  {
    tenantId: 'default',
    employeeId: 'EMP007',
    date: new Date('2024-12-18'),
    checkIn: new Date('2024-12-18T09:00:00'),
    checkOut: new Date('2024-12-18T18:30:00'),
    breakTime: 60,
    totalHours: 8.5,
    status: 'present'
  },
  {
    tenantId: 'default',
    employeeId: 'EMP007',
    date: new Date('2024-12-19'),
    status: 'absent',
    notes: 'Sick leave'
  },

  // EMP008 – Finance
  {
    tenantId: 'default',
    employeeId: 'EMP008',
    date: new Date('2024-12-18'),
    checkIn: new Date('2024-12-18T09:10:00'),
    checkOut: new Date('2024-12-18T18:00:00'),
    breakTime: 45,
    totalHours: 7.75,
    status: 'present'
  },

  // EMP009 – Marketing (remote)
  {
    tenantId: 'default',
    employeeId: 'EMP009',
    date: new Date('2024-12-18'),
    checkIn: new Date('2024-12-18T10:00:00'),
    checkOut: new Date('2024-12-18T17:30:00'),
    breakTime: 30,
    totalHours: 7,
    status: 'late',
    notes: 'Remote work'
  },

  // EMP010 – Sales Manager
  {
    tenantId: 'default',
    employeeId: 'EMP010',
    date: new Date('2024-12-18'),
    checkIn: new Date('2024-12-18T09:00:00'),
    checkOut: new Date('2024-12-18T19:00:00'),
    breakTime: 60,
    totalHours: 9,
    status: 'present',
    notes: 'Client meetings'
  },

  // Today's attendance for dashboard demo
  {
    tenantId: 'default',
    employeeId: 'EMP006',
    date: new Date(),
    checkIn: new Date(new Date().setHours(9, 0, 0, 0)),
    checkOut: new Date(new Date().setHours(18, 0, 0, 0)),
    breakTime: 60,
    totalHours: 8,
    status: 'present',
    notes: 'Regular work day'
  },
  {
    tenantId: 'default',
    employeeId: 'EMP007',
    date: new Date(),
    checkIn: new Date(new Date().setHours(9, 15, 0, 0)),
    checkOut: new Date(new Date().setHours(17, 45, 0, 0)),
    breakTime: 60,
    totalHours: 7.5,
    status: 'present',
    notes: 'Team meeting'
  }
];

await Attendance.insertMany(attendanceRecords);


    // Seed Recruitment Funnel
const recruitmentFunnelData = [
  {
    tenantId: 'default',
    stage: 'Applied',
    count: 100,
    percentage: 100
  },
  {
    tenantId: 'default',
    stage: 'Shortlisted',
    count: 60,
    percentage: 60
  },
  {
    tenantId: 'default',
    stage: 'Interviewed',
    count: 35,
    percentage: 35
  },
  {
    tenantId: 'default',
    stage: 'Offered',
    count: 15,
    percentage: 15
  },
  {
    tenantId: 'default',
    stage: 'Joined',
    count: 10,
    percentage: 10
  }
];

await RecruitmentFunnel.insertMany(recruitmentFunnelData);

// Seed Compliance Snapshots
const complianceSnapshots = [
  {
    tenantId: 'default',
    title: 'Documents Due',
    value: 12,
    icon: 'FileText',
    color: 'text-orange-600'
  },
  {
    tenantId: 'default',
    title: 'Documents Expiring',
    value: 5,
    icon: 'Clock',
    color: 'text-red-600'
  },
  {
    tenantId: 'default',
    title: 'Skills Gap Count',
    value: 8,
    icon: 'Target',
    color: 'text-yellow-600'
  },
  {
    tenantId: 'default',
    title: 'Compliance Risk',
    value: 'Medium',
    icon: 'FileText',
    color: 'text-amber-700'
  }
];

await ComplianceSnapshot.insertMany(complianceSnapshots);

    // Seed Navigation Items
    const navigationItems = [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', order: 1, requiredPermissions: ['dashboard.view'] },

      // Recruitment
      { id: 'recruitment', label: 'Recruitment', order: 2, requiredPermissions: ['recruitment.view'] },
      { id: 'job_openings', label: 'Job Openings', path: '/recruitment/jobs', parentId: 'recruitment', order: 1, requiredPermissions: ['recruitment.view'] },
      { id: 'applicants', label: 'Applicants', path: '/recruitment/applicants', parentId: 'recruitment', order: 2, requiredPermissions: ['recruitment.view'] },
      { id: 'interview_scheduling', label: 'Interview Scheduling', path: '/recruitment/interviews', parentId: 'recruitment', order: 3, requiredPermissions: ['recruitment.manage'] },
      { id: 'offer_management', label: 'Offer Management', path: '/recruitment/offers', parentId: 'recruitment', order: 4, requiredPermissions: ['recruitment.manage'] },
      { id: 'recruitment_onboarding', label: 'Onboarding', path: '/recruitment/onboarding', parentId: 'recruitment', order: 5, requiredPermissions: ['recruitment.manage'] },
      
      
      // Employee Management
      { id: 'employee_management', label: 'Employee Management', order: 3, requiredPermissions: ['employees.view'] },
      { id: 'employees', label: 'Employees', path: '/core-hr/employees', parentId: 'employee_management', order: 1, requiredPermissions: ['employees.view'] },
      // { id: 'onboarding', label: 'Onboarding', path: '/core-hr/onboarding', parentId: 'employee_management', order: 2, requiredPermissions: ['employees.create'] },
      { id: 'organization', label: 'Organization', path: '/core-hr/organization', parentId: 'employee_management', order: 3, requiredPermissions: ['organization.view'] },
      { id: 'exit_management', label: 'Exit Management', path: '/core-hr/exit', parentId: 'employee_management', order: 4, requiredPermissions: ['employees.edit'] },

      // Documents & Compliance
      { id: 'documents', label: 'Documents & Compliance', order: 4, requiredPermissions: ['employees.view'] },
      { id: 'financial_documents', label: 'Financial Documents', path: '/documents/financial', parentId: 'documents', order: 1, requiredPermissions: ['payroll.view'] },
      { id: 'compliance_records', label: 'Compliance Records', path: '/documents/compliance', parentId: 'documents', order: 2, requiredPermissions: ['employees.edit'] },
      { id: 'tax_documents', label: 'Tax Documents', path: '/documents/tax', parentId: 'documents', order: 3, requiredPermissions: ['payroll.view'] },
      { id: 'audit_logs', label: 'Audit Logs', path: '/documents/audit', parentId: 'documents', order: 4, requiredPermissions: ['employees.edit'] },

      // Benefits
      { id: 'benefits', label: 'Benefits', order: 5, requiredPermissions: ['payroll.view'] },
      { id: 'insurance_plans', label: 'Insurance Plans', path: '/benefits/insurance', parentId: 'benefits', order: 1, requiredPermissions: ['payroll.view'] },
      { id: 'allowances', label: 'Allowances', path: '/benefits/allowances', parentId: 'benefits', order: 2, requiredPermissions: ['payroll.process'] },
      { id: 'employee_benefits_costing', label: 'Employee Benefits Costing', path: '/benefits/costing', parentId: 'benefits', order: 3, requiredPermissions: ['payroll.process'] },
      
      // Time & Attendance
      { id: 'time_attendance', label: 'Time & Attendance', order: 6, requiredPermissions: ['attendance.view'] },
      { id: 'attendance_tracking', label: 'Attendance Tracking', path: '/time-attendance/tracking', parentId: 'time_attendance', order: 1, requiredPermissions: ['attendance.view'] },
      { id: 'shift_management', label: 'Shift Management', path: '/time-attendance/shifts', parentId: 'time_attendance', order: 2, requiredPermissions: ['attendance.manage'] },
      { id: 'leave_management', label: 'Leave Management', path: '/time-attendance/leaves', parentId: 'time_attendance', order: 3, requiredPermissions: ['attendance.view'] },
      // { id: 'overtime_management', label: 'Overtime', path: '/time-attendance/overtime', parentId: 'time_attendance', order: 4, requiredPermissions: ['attendance.view'] },
      // { id: 'holidays_management', label: 'Holidays', path: '/time-attendance/holidays', parentId: 'time_attendance', order: 5, requiredPermissions: ['attendance.view'] },
      
      
      // Payroll
      { id: 'payroll', label: 'Payroll', order: 7, requiredPermissions: ['payroll.view'] },
      { id: 'salary_structure', label: 'Salary Structure', path: '/payroll/salary-structure', parentId: 'payroll', order: 1, requiredPermissions: ['payroll.process'] },
      { id: 'payroll_runs', label: 'Payroll Runs', path: '/payroll/runs', parentId: 'payroll', order: 2, requiredPermissions: ['payroll.process'] },
      { id: 'payslips', label: 'Payslips', path: '/payroll/payslips', parentId: 'payroll', order: 3, requiredPermissions: ['payroll.view'] },
      { id: 'payroll_reports', label: 'Reports', path: '/payroll/reports', parentId: 'payroll', order: 4, requiredPermissions: ['payroll.view'] },
      
      // Expenses
      { id: 'expenses', label: 'Expenses', order: 8, requiredPermissions: ['payroll.view'] },
      { id: 'expense_claims', label: 'Expense Claims', path: '/expenses/claims', parentId: 'expenses', order: 1, requiredPermissions: ['payroll.view'] },
      { id: 'expense_approvals', label: 'Expense Approvals', path: '/expenses/approvals', parentId: 'expenses', order: 2, requiredPermissions: ['payroll.process'] },
      { id: 'expense_reports', label: 'Expense Reports', path: '/expenses/reports', parentId: 'expenses', order: 3, requiredPermissions: ['payroll.view'] },
      

      // Performance Management
      { id: 'performance', label: 'Performance Management', order: 9, requiredPermissions: ['employees.view'] },
      { id: 'goals_okrs', label: 'Goals & OKRs', path: '/performance/goals', parentId: 'performance', order: 1, requiredPermissions: ['employees.view'] },
      { id: 'performance_reviews', label: 'Performance Reviews', path: '/performance/reviews', parentId: 'performance', order: 2, requiredPermissions: ['employees.view'] },
      { id: 'appraisal_history', label: 'Appraisal History', path: '/performance/history', parentId: 'performance', order: 3, requiredPermissions: ['employees.edit'] },
      
      // Analytics & Reports
      { id: 'analytics', label: 'Analytics & Reports', order: 10, requiredPermissions: ['employees.view'] },
      { id: 'hr_metrics', label: 'HR Metrics', path: '/analytics/hr-metrics', parentId: 'analytics', order: 1, requiredPermissions: ['employees.view'] },
      { id: 'payroll_analytics', label: 'Payroll Analytics', path: '/analytics/payroll', parentId: 'analytics', order: 2, requiredPermissions: ['payroll.view'] },
      { id: 'expense_analytics', label: 'Expense Analytics', path: '/analytics/expenses', parentId: 'analytics', order: 3, requiredPermissions: ['payroll.view'] },
      { id: 'cost_budget', label: 'Cost & Budget Reports', path: '/analytics/cost-budget', parentId: 'analytics', order: 4, requiredPermissions: ['payroll.process'] },
      { id: 'custom_financial', label: 'Custom Financial Reports', path: '/analytics/custom-financial', parentId: 'analytics', order: 5, requiredPermissions: ['payroll.process'] },
      { id: 'attendance_reports', label: 'Attendance Reports', path: '/analytics/attendance', parentId: 'analytics', order: 6, requiredPermissions: ['attendance.view'] },
      { id: 'attrition_analysis', label: 'Attrition Analysis', path: '/analytics/attrition', parentId: 'analytics', order: 7, requiredPermissions: ['employees.edit'] },
      { id: 'custom_reports', label: 'Custom Reports', path: '/analytics/custom', parentId: 'analytics', order: 8, requiredPermissions: ['employees.view'] },
      
      // Settings
      { id: 'settings', label: 'Settings', order: 11, requiredPermissions: ['organization.manage'] },
      { id: 'company_settings', label: 'Company Settings', path: '/settings/company', parentId: 'settings', order: 1, requiredPermissions: ['organization.manage'] },
      { id: 'payroll_settings', label: 'Payroll Settings', path: '/settings/payroll', parentId: 'settings', order: 2, requiredPermissions: ['payroll.process'] },
      { id: 'tax_statutory', label: 'Tax & Statutory Settings', path: '/settings/tax-statutory', parentId: 'settings', order: 3, requiredPermissions: ['payroll.process'] },
      { id: 'roles_permissions', label: 'Roles & Permissions', path: '/settings/roles', parentId: 'settings', order: 4, requiredPermissions: ['organization.manage'] },
      { id: 'security_settings', label: 'Security Settings', path: '/settings/security', parentId: 'settings', order: 5, requiredPermissions: ['organization.manage'] },
      { id: 'integrations', label: 'Integrations', path: '/settings/integrations', parentId: 'settings', order: 6, requiredPermissions: ['organization.manage'] },
      { id: 'system_preferences', label: 'System Preferences', path: '/settings/preferences', parentId: 'settings', order: 7, requiredPermissions: ['organization.manage'] }
    ];

    await NavigationItem.insertMany(navigationItems);

    // Seed Users with hashed passwords
    const users = [
      {
        tenantId: 'default',
        employeeId: 'EMP001',
        email: 'admin@company.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'super_admin',
        firstName: 'John',
        lastName: 'Admin',
        department: 'IT',
        isActive: true
      },
      {
        tenantId: 'default',
        employeeId: 'EMP002',
        email: 'hr@company.com',
        password: await bcrypt.hash('hr123', 10),
        role: 'hr_manager',
        firstName: 'Sarah',
        lastName: 'Johnson',
        department: 'Human Resources',
        isActive: true
      },
      {
        tenantId: 'default',
        employeeId: 'EMP003',
        email: 'manager@company.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'manager',
        firstName: 'Mike',
        lastName: 'Wilson',
        department: 'Engineering',
        isActive: true
      },
      {
        tenantId: 'default',
        employeeId: 'EMP004',
        email: 'finance@company.com',
        password: await bcrypt.hash('finance123', 10),
        role: 'finance_manager',
        firstName: 'David',
        lastName: 'Finance',
        department: 'Finance',
        isActive: true
      },
      {
        tenantId: 'default',
        employeeId: 'EMP005',
        email: 'employee@company.com',
        password: await bcrypt.hash('emp123', 10),
        role: 'employee',
        firstName: 'Jane',
        lastName: 'Smith',
        department: 'Engineering',
        managerId: 'EMP003',
        isActive: true
      }
    ];

    await User.insertMany(users);

    // Seed Employees
    const employees = [
      {
        tenantId: 'default',
        employeeId: 'EMP001',
        personalInfo: {
          firstName: 'John',
          lastName: 'Admin',
          email: 'admin@company.com',
          phone: '+1-555-0101',
          dateOfBirth: new Date('1985-03-15'),
          gender: 'male',
          maritalStatus: 'married'
        },
        identityInfo: {
          countryCode: 'US',
          bankAccountHolderName: 'John Admin',
          bankName: 'Bank of America',
          accountNumber: '1234567890',
          accountType: 'savings',
          currency: 'USD',
          payrollEnabled: true
        },
        workInfo: {
          department: 'IT',
          designation: 'System Administrator',
          joinDate: new Date('2020-01-15'),
          employmentType: 'full-time',
          workLocation: 'remote',
          salary: 95000
        },
        status: 'active'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP012',
        personalInfo: {
          firstName: 'priya',
          lastName: 'Johnson',
          email: 'hr@company.com',
          phone: '+1-555-0102',
          dateOfBirth: new Date('1988-07-22'),
          gender: 'female',
          maritalStatus: 'single'
        },
        identityInfo: {
          countryCode: 'US',
          bankAccountHolderName: 'Priya Johnson',
          bankName: 'Chase Bank',
          accountNumber: '0987654321',
          accountType: 'savings',
          currency: 'USD',
          payrollEnabled: true
        },
        workInfo: {
          department: 'Human Resources',
          designation: 'HR Manager',
          joinDate: new Date('2019-03-10'),
          employmentType: 'full-time',
          workLocation: 'hybrid',
          salary: 85000
        },
        status: 'active'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP011',
        personalInfo: {
          firstName: 'govardhan',
          lastName: 'Johnson',
          email: 'hr@company.com',
          phone: '+1-555-0102',
          dateOfBirth: new Date('1988-07-22'),
          gender: 'female',
          maritalStatus: 'single'
        },
        identityInfo: {
          countryCode: 'US',
          bankAccountHolderName: 'Govardhan Johnson',
          bankName: 'Wells Fargo',
          accountNumber: '1122334455',
          accountType: 'savings',
          currency: 'USD',
          payrollEnabled: true
        },
        workInfo: {
          department: 'Human Resources',
          designation: 'HR Manager',
          joinDate: new Date('2019-03-10'),
          employmentType: 'full-time',
          workLocation: 'hybrid',
          salary: 85000
        },
        status: 'active'
      }
    ];

    await Employee.insertMany(employees);

    // Seed Holidays
    const holidays = [
      // National Holidays
      { tenantId: 'default', name: "New Year's Day", date: new Date('2024-01-01'), type: 'national', locations: 'All', description: 'New Year celebration', isActive: true },
      { tenantId: 'default', name: 'Republic Day', date: new Date('2024-01-26'), type: 'national', locations: 'All', description: 'National holiday', isActive: true },
      { tenantId: 'default', name: 'Independence Day', date: new Date('2024-08-15'), type: 'national', locations: 'All', description: 'National holiday', isActive: true },
      { tenantId: 'default', name: 'Gandhi Jayanti', date: new Date('2024-10-02'), type: 'national', locations: 'All', description: 'National holiday', isActive: true },
      // Regional Holidays
      { tenantId: 'default', name: 'Diwali', date: new Date('2024-11-01'), type: 'regional', locations: 'Mumbai, Delhi', description: 'Festival of lights', isActive: true },
      { tenantId: 'default', name: 'Durga Puja', date: new Date('2024-10-10'), type: 'regional', locations: 'Kolkata', description: 'Bengali festival', isActive: true },
      { tenantId: 'default', name: 'Onam', date: new Date('2024-09-15'), type: 'regional', locations: 'Kochi', description: 'Kerala festival', isActive: true },
      { tenantId: 'default', name: 'Karva Chauth', date: new Date('2024-11-01'), type: 'regional', locations: 'Delhi, Mumbai', description: 'Regional festival', isActive: true },
      // Optional Holidays
      { tenantId: 'default', name: 'Holi', date: new Date('2024-03-25'), type: 'optional', locations: 'All', description: 'Festival of colors', isActive: true },
      { tenantId: 'default', name: 'Good Friday', date: new Date('2024-03-29'), type: 'optional', locations: 'All', description: 'Christian holiday', isActive: true },
      { tenantId: 'default', name: 'Eid al-Fitr', date: new Date('2024-04-10'), type: 'optional', locations: 'All', description: 'Islamic festival', isActive: true },
      { tenantId: 'default', name: 'Christmas', date: new Date('2024-12-25'), type: 'optional', locations: 'All', description: 'Christian festival', isActive: true }
    ];

    await Holiday.insertMany(holidays);

    // Seed Salary Components
    const salaryComponents = [
      {
        tenantId: 'default',
        componentName: 'Basic Salary',
        componentCode: 'BASIC',
        componentType: 'earning',
        calculationMethod: 'fixed',
        amount: 50000,
        payFrequency: 'monthly',
        taxApplicability: true,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Primary Earnings',
        mandatory: true,
        roundingRules: 'Round to nearest 100',
        visibilityControl: true
      },
      {
        tenantId: 'default',
        componentName: 'House Rent Allowance',
        componentCode: 'HRA',
        componentType: 'earning',
        calculationMethod: 'percentage',
        percentage: 40,
        payFrequency: 'monthly',
        taxApplicability: true,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Allowances',
        mandatory: true,
        visibilityControl: true
      },
      {
        tenantId: 'default',
        componentName: 'Transport Allowance',
        componentCode: 'TA',
        componentType: 'earning',
        calculationMethod: 'fixed',
        amount: 3000,
        payFrequency: 'monthly',
        taxApplicability: false,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Allowances',
        mandatory: false,
        visibilityControl: true
      },
      {
        tenantId: 'default',
        componentName: 'Medical Allowance',
        componentCode: 'MA',
        componentType: 'earning',
        calculationMethod: 'fixed',
        amount: 2500,
        payFrequency: 'monthly',
        taxApplicability: false,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Allowances',
        mandatory: false,
        visibilityControl: true
      },
      {
        tenantId: 'default',
        componentName: 'Special Allowance',
        componentCode: 'SA',
        componentType: 'earning',
        calculationMethod: 'fixed',
        amount: 5000,
        payFrequency: 'monthly',
        taxApplicability: true,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Allowances',
        mandatory: false,
        visibilityControl: true
      },
      {
        tenantId: 'default',
        componentName: 'Provident Fund',
        componentCode: 'PF',
        componentType: 'deduction',
        calculationMethod: 'percentage',
        percentage: 12,
        payFrequency: 'monthly',
        taxApplicability: false,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Statutory Deductions',
        mandatory: true,
        visibilityControl: true
      },
      {
        tenantId: 'default',
        componentName: 'Employee State Insurance',
        componentCode: 'ESI',
        componentType: 'deduction',
        calculationMethod: 'percentage',
        percentage: 0.75,
        payFrequency: 'monthly',
        taxApplicability: false,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Statutory Deductions',
        mandatory: true,
        visibilityControl: true
      },
      {
        tenantId: 'default',
        componentName: 'Professional Tax',
        componentCode: 'PT',
        componentType: 'deduction',
        calculationMethod: 'fixed',
        amount: 200,
        payFrequency: 'monthly',
        taxApplicability: false,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Statutory Deductions',
        mandatory: true,
        visibilityControl: true
      },
      {
        tenantId: 'default',
        componentName: 'Income Tax',
        componentCode: 'TDS',
        componentType: 'deduction',
        calculationMethod: 'percentage',
        percentage: 10,
        payFrequency: 'monthly',
        taxApplicability: false,
        showOnPayslip: true,
        effectiveFromDate: new Date('2024-01-01'),
        status: 'active',
        componentGroup: 'Tax Deductions',
        mandatory: true,
        visibilityControl: true
      }
    ];

    const savedComponents = await SalaryComponent.insertMany(salaryComponents);

    // Seed Salary Templates
    const salaryTemplates = [
      {
        tenantId: 'default',
        templateName: 'Standard Employee Template',
        description: 'Default salary structure for regular employees',
        components: [savedComponents[0]._id, savedComponents[1]._id, savedComponents[2]._id, savedComponents[5]._id, savedComponents[7]._id, savedComponents[8]._id],
        status: 'active',
        version: 1
      },
      {
        tenantId: 'default',
        templateName: 'Senior Management Template',
        description: 'Enhanced salary structure for senior positions',
        components: savedComponents.map(c => c._id),
        status: 'active',
        version: 2
      },
      {
        tenantId: 'default',
        templateName: 'Contract Employee Template',
        description: 'Simplified structure for contract workers',
        components: [savedComponents[0]._id, savedComponents[7]._id, savedComponents[8]._id],
        status: 'active',
        version: 1
      }
    ];

    await SalaryTemplate.insertMany(salaryTemplates);

    // Seed Departments
    const departments = [
      { tenantId: 'default', name: 'Information Technology', code: 'IT', status: 'Active' },
      { tenantId: 'default', name: 'Human Resources', code: 'HR', status: 'Active' },
      { tenantId: 'default', name: 'Finance', code: 'FIN', status: 'Active' },
      { tenantId: 'default', name: 'Marketing', code: 'MKT', status: 'Active' },
      { tenantId: 'default', name: 'Sales', code: 'SAL', status: 'Active' },
      { tenantId: 'default', name: 'Operations', code: 'OPS', status: 'Active' },
      { tenantId: 'default', name: 'Engineering', code: 'ENG', status: 'Active' }
    ];

    await Department.insertMany(departments);

    // Seed Designations
    const designations = [
      { tenantId: 'default', name: 'Software Engineer', department: 'IT', status: 'Active' },
      { tenantId: 'default', name: 'Senior Software Engineer', department: 'IT', status: 'Active' },
      { tenantId: 'default', name: 'Tech Lead', department: 'IT', status: 'Active' },
      { tenantId: 'default', name: 'Engineering Manager', department: 'IT', status: 'Active' },
      { tenantId: 'default', name: 'HR Executive', department: 'HR', status: 'Active' },
      { tenantId: 'default', name: 'HR Manager', department: 'HR', status: 'Active' },
      { tenantId: 'default', name: 'Finance Analyst', department: 'Finance', status: 'Active' },
      { tenantId: 'default', name: 'Finance Manager', department: 'Finance', status: 'Active' },
      { tenantId: 'default', name: 'Marketing Executive', department: 'Marketing', status: 'Active' },
      { tenantId: 'default', name: 'Marketing Manager', department: 'Marketing', status: 'Active' }
    ];

    await Designation.insertMany(designations);

    // Seed Shifts
    const shifts = [
      {
        tenantId: 'default',
        name: 'General Shift',
        startTime: '09:00',
        endTime: '18:00',
        department: 'IT',
        status: 'active'
      },
      {
        tenantId: 'default',
        name: 'Night Shift',
        startTime: '22:00',
        endTime: '06:00',
        department: 'IT',
        status: 'active'
      },
      {
        tenantId: 'default',
        name: 'Flexible Shift',
        startTime: '10:00',
        endTime: '19:00',
        department: 'Engineering',
        status: 'active'
      }
    ];

    await Shift.insertMany(shifts);

    // Seed Job Openings
    const jobs = [
      {
        tenantId: 'default',
        title: 'Senior Software Engineer',
        department: 'IT',
        location: 'Mumbai',
        employmentType: 'full-time',
        description: 'We are looking for a Senior Software Engineer to join our dynamic team. The ideal candidate will have strong experience in full-stack development.',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '5+ years of experience in software development',
          'Proficiency in React, Node.js, and MongoDB',
          'Experience with cloud platforms (AWS/Azure)',
          'Strong problem-solving skills'
        ],
        salaryRange: { min: 800000, max: 1200000 },
        status: 'active',
        postedBy: 'EMP002',
        applicationsCount: 15
      },
      {
        tenantId: 'default',
        title: 'HR Business Partner',
        department: 'HR',
        location: 'Delhi',
        employmentType: 'full-time',
        description: 'Join our HR team as a Business Partner to support our growing organization with strategic HR initiatives.',
        requirements: [
          'MBA in HR or related field',
          '3+ years of HR experience',
          'Experience in talent acquisition',
          'Strong communication skills',
          'Knowledge of labor laws'
        ],
        salaryRange: { min: 600000, max: 900000 },
        status: 'active',
        postedBy: 'EMP002',
        applicationsCount: 8
      },
      {
        tenantId: 'default',
        title: 'Product Manager',
        department: 'Engineering',
        location: 'Bangalore',
        employmentType: 'full-time',
        description: 'Lead product development initiatives and work closely with engineering and design teams.',
        requirements: [
          'Bachelor\'s degree in Engineering or Business',
          '4+ years of product management experience',
          'Experience with Agile methodologies',
          'Strong analytical skills',
          'Excellent leadership abilities'
        ],
        salaryRange: { min: 1000000, max: 1500000 },
        status: 'active',
        postedBy: 'EMP001',
        applicationsCount: 22
      },
      {
        tenantId: 'default',
        title: 'Marketing Specialist',
        department: 'Marketing',
        location: 'Mumbai',
        employmentType: 'full-time',
        description: 'Drive marketing campaigns and brand awareness initiatives across digital platforms.',
        requirements: [
          'Bachelor\'s degree in Marketing or Communications',
          '2+ years of digital marketing experience',
          'Experience with social media platforms',
          'Knowledge of SEO/SEM',
          'Creative thinking abilities'
        ],
        salaryRange: { min: 400000, max: 600000 },
        status: 'draft',
        postedBy: 'EMP002',
        applicationsCount: 5
      },
      {
        tenantId: 'default',
        title: 'DevOps Engineer',
        department: 'IT',
        location: 'Pune',
        employmentType: 'contract',
        description: 'Manage and optimize our cloud infrastructure and deployment pipelines.',
        requirements: [
          'Bachelor\'s degree in Computer Science',
          '3+ years of DevOps experience',
          'Experience with Docker and Kubernetes',
          'Knowledge of CI/CD pipelines',
          'AWS/Azure certification preferred'
        ],
        salaryRange: { min: 700000, max: 1000000 },
        status: 'active',
        postedBy: 'EMP001',
        applicationsCount: 12
      }
    ];

    await Job.insertMany(jobs);

    // Seed More Employees with detailed data
    const moreEmployees = [
      {
        tenantId: 'default',
        employeeId: 'EMP006',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1-555-0101',
          dateOfBirth: new Date('1985-03-15'),
          gender: 'male',
          maritalStatus: 'married'
        },
        identityInfo: {
          countryCode: 'US',
          bankAccountHolderName: 'John Doe',
          bankName: 'Citibank',
          accountNumber: '1111222233',
          accountType: 'savings',
          currency: 'USD',
          payrollEnabled: true
        },
        workInfo: {
          department: 'Engineering',
          designation: 'Senior Developer',
          joinDate: new Date('2020-01-15'),
          employmentType: 'full-time',
          workLocation: 'office',
          salary: 95000,
          reportingManager: 'Jane Smith'
        },
        status: 'active',
        location: 'New York'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP007',
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@company.com',
          phone: '+1-555-0102',
          dateOfBirth: new Date('1988-07-22'),
          gender: 'female',
          maritalStatus: 'single'
        },
        identityInfo: {
          countryCode: 'US',
          bankAccountHolderName: 'Sarah Johnson',
          bankName: 'Bank of America',
          accountNumber: '4444555566',
          accountType: 'savings',
          currency: 'USD',
          payrollEnabled: true
        },
        workInfo: {
          department: 'Human Resources',
          designation: 'HR Manager',
          joinDate: new Date('2019-03-10'),
          employmentType: 'full-time',
          workLocation: 'office',
          salary: 85000,
          reportingManager: 'Michael Brown'
        },
        status: 'onboarding',
        location: 'San Francisco'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP008',
        personalInfo: {
          firstName: 'Mike',
          lastName: 'Wilson',
          email: 'mike.wilson@company.com',
          phone: '+1-555-0103',
          dateOfBirth: new Date('1990-12-05'),
          gender: 'male',
          maritalStatus: 'married'
        },
        identityInfo: {
          countryCode: 'US',
          bankAccountHolderName: 'Mike Wilson',
          bankName: 'Chase Bank',
          accountNumber: '7777888899',
          accountType: 'savings',
          currency: 'USD',
          payrollEnabled: true
        },
        workInfo: {
          department: 'Finance',
          designation: 'Financial Analyst',
          joinDate: new Date('2021-06-01'),
          employmentType: 'full-time',
          workLocation: 'office',
          salary: 75000,
          reportingManager: 'Lisa Davis'
        },
        status: 'inactive',
        location: 'Chicago'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP009',
        personalInfo: {
          firstName: 'Emily',
          lastName: 'Chen',
          email: 'emily.chen@company.com',
          phone: '+1-555-0104',
          dateOfBirth: new Date('1992-08-18'),
          gender: 'female',
          maritalStatus: 'single'
        },
        identityInfo: {
          countryCode: 'US',
          bankAccountHolderName: 'Emily Chen',
          bankName: 'Wells Fargo',
          accountNumber: '0000111122',
          accountType: 'savings',
          currency: 'USD',
          payrollEnabled: true
        },
        workInfo: {
          department: 'Marketing',
          designation: 'Marketing Specialist',
          joinDate: new Date('2022-02-14'),
          employmentType: 'full-time',
          workLocation: 'remote',
          salary: 65000,
          reportingManager: 'David Kim'
        },
        status: 'onboarding',
        location: 'Los Angeles'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP010',
        personalInfo: {
          firstName: 'Alex',
          lastName: 'Rodriguez',
          email: 'alex.rodriguez@company.com',
          phone: '+1-555-0105',
          dateOfBirth: new Date('1987-11-30'),
          gender: 'male',
          maritalStatus: 'married'
        },
        identityInfo: {
          countryCode: 'US',
          bankAccountHolderName: 'Alex Rodriguez',
          bankName: 'HSBC',
          accountNumber: '3333444455',
          accountType: 'savings',
          currency: 'USD',
          payrollEnabled: true
        },
        workInfo: {
          department: 'Sales',
          designation: 'Sales Manager',
          joinDate: new Date('2020-09-01'),
          employmentType: 'full-time',
          workLocation: 'office',
          salary: 90000,
          reportingManager: 'Jennifer Lee'
        },
        status: 'active',
        location: 'Miami'
      }
    ];

    await Employee.insertMany(moreEmployees);

    // Seed Leave Requests
    const leaveRequests = [
      {
        tenantId: 'default',
        employeeId: 'EMP006',
        leaveType: 'annual',
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        days: 3,
        reason: 'Family vacation',
        status: 'approved'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP007',
        leaveType: 'sick',
        startDate: new Date('2026-1-15'),
        endDate: new Date('2026-1-25'),
        days: 2,
        reason: 'Medical appointment and recovery',
        status: 'pending'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP009',
        leaveType: 'personal',
        startDate: new Date('2026-1-15'),
        endDate: new Date('2026-1-25'),
        days: 3,
        reason: 'Personal matters to attend',
        status: 'approved'
      },
      {
        tenantId: 'default',
        employeeId: 'EMP010',
        leaveType: 'emergency',
        startDate: new Date('2024-12-18'),
        endDate: new Date('2024-12-18'),
        days: 1,
        reason: 'Family emergency',
        status: 'pending'
      }
    ];

    // Create Leave model if it doesn't exist
    const Leave = mongoose.models.Leave || mongoose.model('Leave', new mongoose.Schema({
      tenantId: { type: String, default: 'default' },
      employeeId: String,
      leaveType: String,
      startDate: Date,
      endDate: Date,
      days: Number,
      reason: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    }, { timestamps: true }));

    await Leave.insertMany(leaveRequests);

    // Dashboard data is now calculated dynamically in the controller

    console.log('Database seeded successfully!');
    console.log('\n=== SEEDED DATA SUMMARY ===');
    console.log(`✓ ${permissions.length} Permissions`);
    console.log(`✓ ${roles.length} Roles`);
    console.log(`✓ ${navigationItems.length} Navigation Items`);
    console.log(`✓ ${users.length} Users`);
    console.log(`✓ ${employees.length + moreEmployees.length} Employees`);
    console.log(`✓ ${holidays.length} Holidays`);
    console.log(`✓ ${salaryComponents.length} Salary Components`);
    console.log(`✓ ${salaryTemplates.length} Salary Templates`);
    console.log(`✓ ${departments.length} Departments`);
    console.log(`✓ ${designations.length} Designations`);
    console.log(`✓ ${shifts.length} Shifts`);
    console.log(`✓ ${jobs.length} Job Openings`);
    console.log(`✓ ${leaveRequests.length} Leave Requests`);
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Super Admin: admin@company.com / admin123');
    console.log('HR Manager: hr@company.com / hr123');
    console.log('Manager: manager@company.com / manager123');
    console.log('Finance Manager: finance@company.com / finance123');
    console.log('Employee: employee@company.com / emp123');
    console.log('\n=== FEATURES WITH DATA ===');
    console.log('✓ Dashboard Widgets (All role-based metrics)');
    console.log('✓ Organization Holidays (National, Regional, Optional)');
    console.log('✓ Salary Structure (Components & Templates)');
    console.log('✓ Job Openings (Active recruitment data)');
    console.log('✓ Employee Directory (Complete employee profiles)');
    console.log('✓ Leave Management (Leave requests & approvals)');
    console.log('✓ Departments & Designations');
    console.log('✓ Shift Management');
    console.log('✓ Complete Navigation Structure');
    console.log('\nAll frontend data has been populated in the database!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();