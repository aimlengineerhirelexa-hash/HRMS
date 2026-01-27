import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getHRMetrics, getPayrollAnalytics, getAttendanceReports, getAttritionAnalysis } from '../controllers/analyticsController';

const router = Router();

router.get('/hr-metrics', authenticateToken, getHRMetrics);
router.get('/payroll-analytics', authenticateToken, getPayrollAnalytics);
router.get('/attendance-reports', authenticateToken, getAttendanceReports);
router.get('/attrition-analysis', authenticateToken, getAttritionAnalysis);

export default router;
