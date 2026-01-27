import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  getReportingManagers,
  createReportingManager,
  updateReportingManager,
  deleteReportingManager,
  getOrganizationKPIs
} from '../controllers/organizationController';

const router = express.Router();

// Department routes
router.get('/departments', authenticateToken, getDepartments);
router.post('/departments', authenticateToken, createDepartment);
router.put('/departments/:id', authenticateToken, updateDepartment);
router.delete('/departments/:id', authenticateToken, deleteDepartment);

// Designation routes
router.get('/designations', authenticateToken, getDesignations);
router.post('/designations', authenticateToken, createDesignation);
router.put('/designations/:id', authenticateToken, updateDesignation);
router.delete('/designations/:id', authenticateToken, deleteDesignation);

// Reporting Manager routes
router.get('/reporting-managers', authenticateToken, getReportingManagers);
router.post('/reporting-managers', authenticateToken, createReportingManager);
router.put('/reporting-managers/:id', authenticateToken, updateReportingManager);
router.delete('/reporting-managers/:id', authenticateToken, deleteReportingManager);

// KPIs
router.get('/organization/kpis', authenticateToken, getOrganizationKPIs);

export default router;
