import { Router } from 'express';
import { getStudentDashboard, getFacultyDashboard, getAdminDashboard } from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';

const router = Router();

router.get('/student', authenticate, requireRole(['student']), getStudentDashboard);
router.get('/faculty', authenticate, requireRole(['faculty']), getFacultyDashboard);
router.get('/admin', authenticate, requireRole(['admin']), getAdminDashboard);

export default router;

