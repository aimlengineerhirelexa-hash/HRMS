import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getRoles, getPermissions, getUserPermissions, getNavigationItems } from '../controllers/roleController';

const router = express.Router();

router.get('/roles', authenticateToken, getRoles);
router.get('/permissions', authenticateToken, getPermissions);
router.get('/user-permissions', authenticateToken, getUserPermissions);
router.get('/navigation', authenticateToken, getNavigationItems);

export default router;