import { Router } from 'express';
import {
  getAcademicOverview,
  getTimetable,
  getAssignments,
  createAssignment,
  submitAssignment,
  getAttendance,
  getCourses
} from './academics.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { AssignmentSchema, SubmissionSchema } from '../../ai/schemas/index.js';

const router = Router();

router.get('/overview', authenticate, getAcademicOverview);
router.get('/courses', authenticate, getCourses);
router.get('/timetable', authenticate, getTimetable);
router.get('/assignments', authenticate, getAssignments);
router.post('/assignments', authenticate, requireRole(['faculty', 'admin']), validate(AssignmentSchema), createAssignment);
router.post('/submissions', authenticate, requireRole(['student']), validate(SubmissionSchema), submitAssignment);
router.get('/attendance', authenticate, requireRole(['student']), getAttendance);

export default router;

