import { api } from './api';

export const analyticsService = {
  getHRMetrics: () => api.get('/api/analytics/hr-metrics'),
  getPayrollAnalytics: () => api.get('/api/analytics/payroll-analytics'),
  getAttendanceReports: () => api.get('/api/analytics/attendance-reports'),
  getAttritionAnalysis: () => api.get('/api/analytics/attrition-analysis'),
};
