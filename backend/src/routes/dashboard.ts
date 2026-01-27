import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getDashboardMetrics,
  getEmployeeKPIs,
  getWorkforceDistribution,
  getDepartmentDistribution,
  getRecruitmentFunnel,
  getComplianceData,
  getFullDashboardData
} from '../controllers/dashboardController';

const router = express.Router();

router.get('/metrics', authenticateToken, getDashboardMetrics);
router.get('/employee-kpis', authenticateToken, getEmployeeKPIs);
router.get('/kpis/employees', authenticateToken, getEmployeeKPIs);
router.get('/workforce-distribution', authenticateToken, getWorkforceDistribution);
router.get('/department-distribution', authenticateToken, getDepartmentDistribution);
router.get('/recruitment-funnel', authenticateToken, getRecruitmentFunnel);
router.get('/compliance', authenticateToken, getComplianceData);
router.get('/data', authenticateToken, getFullDashboardData);

export default router;
