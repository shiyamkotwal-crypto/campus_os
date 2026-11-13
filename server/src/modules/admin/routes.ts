import { Router } from 'express';
import {
  getUsers,
  updateUserStatus,
  updateUserRole,
  getAnalytics,
  getAuditLogs
} from './admin.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';

const router = Router();

router.use(authenticate, requireRole(['admin']));

router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);
router.get('/analytics', getAnalytics);
router.get('/audit-logs', getAuditLogs);

export default router;

