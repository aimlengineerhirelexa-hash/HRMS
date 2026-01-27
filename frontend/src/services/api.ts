import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5008';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const holidayService = {
  getAll: () => api.get('/api/holidays'),
  create: (data: any) => api.post('/api/holidays', data),
  update: (id: string, data: any) => api.put(`/api/holidays/${id}`, data),
  delete: (id: string) => api.delete(`/api/holidays/${id}`)
};

export const salaryComponentService = {
  getComponents: () => api.get('/api/salary-components/components'),
  createComponent: (data: any) => api.post('/api/salary-components/components', data),
  updateComponent: (id: string, data: any) => api.put(`/api/salary-components/components/${id}`, data),
  deleteComponent: (id: string) => api.delete(`/api/salary-components/components/${id}`),
  getTemplates: () => api.get('/api/salary-components/templates'),
  createTemplate: (data: any) => api.post('/api/salary-components/templates', data)
};

export const dashboardService = {
  // getMetrics: (category?: string) => api.get('/api/dashboard-metrics/metrics', { params: { category } }),
  // updateMetric: (data: any) => api.put('/api/dashboard-metrics/metrics', data),
  getDashboardData: () => api.get('/api/dashboard/data'),
  getFullDashboardData: () => api.get('/api/dashboard/data')
};

export const jobService = {
  getAll: () => api.get('/api/jobs'),
  create: (data: any) => api.post('/api/jobs', data),
  update: (id: string, data: any) => api.put(`/api/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/api/jobs/${id}`)
};

export const departmentService = {
  getAll: () => api.get('/api/organization/departments'),
  create: (data: any) => api.post('/api/organization/departments', data)
};

export const designationService = {
  getAll: () => api.get('/api/organization/designations'),
  create: (data: any) => api.post('/api/organization/designations', data)
};

export const shiftService = {
  getAll: () => api.get('/api/shifts'),
  create: (data: any) => api.post('/api/shifts', data),
  update: (id: string, data: any) => api.put(`/api/shifts/${id}`, data),
  delete: (id: string) => api.delete(`/api/shifts/${id}`)
};

export const employeeService = {
  getAll: () => api.get('/api/employees'),
  getById: (id: string) => api.get(`/api/employees/${id}`),
  getByDepartment: (department: string) => api.get(`/api/employees/department/${department}`),
  create: (data: any) => api.post('/api/employees', data),
  update: (id: string, data: any) => api.put(`/api/employees/${id}`, data),
  delete: (id: string) => api.delete(`/api/employees/${id}`)
};

export const payrollService = {
  // Salary Components
  getComponents: () => api.get('/api/salary-components/components'),
  createComponent: (data: any) => api.post('/api/salary-components/components', data),
  updateComponent: (id: string, data: any) => api.put(`/api/salary-components/components/${id}`, data),
  deleteComponent: (id: string) => api.delete(`/api/salary-components/components/${id}`),

  // Salary Templates
  getTemplates: () => api.get('/api/salary-components/templates'),
  createTemplate: (data: any) => api.post('/api/salary-components/templates', data),

  // Payroll Runs
  getRuns: () => api.get('/api/payroll/runs'),
  createRun: (data: any) => api.post('/api/payroll/runs', data),
  updateRun: (id: string, data: any) => api.put(`/api/payroll/runs/${id}`, data),

  // Payslips
  getPayslips: () => api.get('/api/payroll/payslips'),
  generatePayslip: (data: any) => api.post('/api/payroll/payslips', data),

  // Compliance
  getCompliance: () => api.get('/api/payroll/compliance')
};

export const expenseService = {
  getAll: () => api.get('/api/expenses'),
  getById: (id: string) => api.get(`/api/expenses/${id}`),
  create: (data: any) => api.post('/api/expenses', data),
  update: (id: string, data: any) => api.put(`/api/expenses/${id}`, data),
  approve: (id: string) => api.patch(`/api/expenses/${id}/approve`),
  reject: (id: string, data: any) => api.patch(`/api/expenses/${id}/reject`, data),
  delete: (id: string) => api.delete(`/api/expenses/${id}`)
};

export const benefitService = {
  getAll: () => api.get('/api/benefits'),
  getById: (id: string) => api.get(`/api/benefits/${id}`),
  create: (data: any) => api.post('/api/benefits', data),
  update: (id: string, data: any) => api.put(`/api/benefits/${id}`, data),
  delete: (id: string) => api.delete(`/api/benefits/${id}`)
};

export const documentService = {
  getAll: (params?: { employeeId?: string; documentType?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', params.employeeId);
    if (params?.documentType) queryParams.append('documentType', params.documentType);
    if (params?.status) queryParams.append('status', params.status);
    return api.get(`/api/documents?${queryParams.toString()}`);
  },
  getById: (id: string) => api.get(`/api/documents/${id}`),
  create: (data: any) => api.post('/api/documents', data),
  update: (id: string, data: any) => api.put(`/api/documents/${id}`, data),
  delete: (id: string) => api.delete(`/api/documents/${id}`),
  getExpiringSoon: () => api.get('/api/documents/expiring/soon')
};

export const onboardingService = {
  getAll: () => api.get('/api/onboarding'),
  getById: (id: string) => api.get(`/api/onboarding/${id}`),
  create: (data: any) => api.post('/api/onboarding', data),
  update: (id: string, data: any) => api.put(`/api/onboarding/${id}`, data),
  updateTaskStatus: (onboardingId: string, taskId: string, status: string) => api.patch(`/api/onboarding/${onboardingId}/tasks/${taskId}`, { status }),
  delete: (id: string) => api.delete(`/api/onboarding/${id}`),
  getEmployeeDocuments: () => api.get('/api/onboarding/documents'),
  getEmployeeDocumentsById: (id: string) => api.get(`/api/onboarding/documents/${id}`),
  createEmployeeDocuments: (data: any) => api.post('/api/onboarding/documents', data),
  updateEmployeeDocuments: (id: string, data: any) => api.put(`/api/onboarding/documents/${id}`, data),
  deleteEmployeeDocuments: (id: string) => api.delete(`/api/onboarding/documents/${id}`)
};

export const organizationService = {
  // Departments
  getDepartments: () => api.get('/api/organization/departments'),
  createDepartment: (data: any) => api.post('/api/organization/departments', data),
  updateDepartment: (id: string, data: any) => api.put(`/api/organization/departments/${id}`, data),
  deleteDepartment: (id: string) => api.delete(`/api/organization/departments/${id}`),

  // Designations
  getDesignations: () => api.get('/api/organization/designations'),
  createDesignation: (data: any) => api.post('/api/organization/designations', data),
  updateDesignation: (id: string, data: any) => api.put(`/api/organization/designations/${id}`, data),
  deleteDesignation: (id: string) => api.delete(`/api/organization/designations/${id}`),

  // Reporting Managers
  getReportingManagers: () => api.get('/api/organization/reporting-managers'),
  createReportingManager: (data: any) => api.post('/api/organization/reporting-managers', data),
  updateReportingManager: (id: string, data: any) => api.put(`/api/organization/reporting-managers/${id}`, data),
  deleteReportingManager: (id: string) => api.delete(`/api/organization/reporting-managers/${id}`),

  // KPIs
  getKPIs: () => api.get('/api/organization/kpis')
};

export default api;