import { api } from './api';

export const dashboardService = {
  getMetrics: () => api.get('/api/dashboard/metrics'),
  getEmployeeKPIs: () => api.get('/api/dashboard/employee-kpis'),
  getWorkforceDistribution: () => api.get('/api/dashboard/workforce-distribution'),
  getDepartmentDistribution: () => api.get('/api/dashboard/department-distribution'),
};
