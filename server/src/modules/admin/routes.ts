import { Router } from 'express';
import {
  getUsers,
  updateUserStatus,
  updateUserRole,
  getAnalytics,
  getAuditLogs,
  getDepartments,
  createDepartment,
  getPrograms,
  createProgram,
  createCourseAdmin,
  getAttendanceMonitoring,
  getSystemSettings,
  updateSystemSettings
} from './admin.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';

const router = Router();

// All administrative routes require valid authentication and role = admin
router.use(authenticate, requireRole(['admin']));

// User & Role Management
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

// Academic Governance (Departments, Programs, Courses)
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.get('/programs', getPrograms);
router.post('/programs', createProgram);
router.post('/courses', createCourseAdmin);

// Attendance Monitoring
router.get('/attendance/stats', getAttendanceMonitoring);

// Analytics & Audit Trails
router.get('/analytics', getAnalytics);
router.get('/audit-logs', getAuditLogs);

// System Settings
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);

export default router;

