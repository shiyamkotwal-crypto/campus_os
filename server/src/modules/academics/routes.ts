import { Router } from 'express';
import {
  getAcademicOverview,
  getTimetable,
  getAssignments,
  createAssignment,
  submitAssignment,
  getAttendance,
  getCourses,
  markAttendance,
  getCourseStudents,
  getAssignmentSubmissions,
  gradeSubmission,
  getResults,
  getLeaveApplications,
  submitLeaveApplication,
  updateLeaveStatus,
  getAcademicCalendar,
  getStudyMaterials,
  uploadStudyMaterial,
  getFacultyDirectory,
  getFeeDetails
} from './academics.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { AssignmentSchema, SubmissionSchema } from '../../ai/schemas/index.js';

const router = Router();

// Student Core Academic Routes
router.get('/overview', authenticate, getAcademicOverview);
router.get('/courses', authenticate, getCourses);
router.get('/timetable', authenticate, getTimetable);
router.get('/attendance', authenticate, requireRole(['student', 'admin']), getAttendance);
router.get('/results', authenticate, getResults);
router.get('/fees', authenticate, requireRole(['student', 'admin']), getFeeDetails);
router.get('/faculty-directory', authenticate, getFacultyDirectory);
router.get('/calendar', authenticate, getAcademicCalendar);

// Assignments & Submissions
router.get('/assignments', authenticate, getAssignments);
router.post('/assignments', authenticate, requireRole(['faculty', 'admin']), validate(AssignmentSchema), createAssignment);
router.post('/submissions', authenticate, requireRole(['student']), validate(SubmissionSchema), submitAssignment);

// Faculty Grading & Attendance Management
router.post('/attendance/mark', authenticate, requireRole(['faculty', 'admin']), markAttendance);
router.get('/courses/:id/students', authenticate, requireRole(['faculty', 'admin']), getCourseStudents);
router.get('/assignments/:id/submissions', authenticate, requireRole(['faculty', 'admin']), getAssignmentSubmissions);
router.patch('/submissions/:id/grade', authenticate, requireRole(['faculty', 'admin']), gradeSubmission);

// Study Materials
router.get('/materials', authenticate, getStudyMaterials);
router.post('/materials', authenticate, requireRole(['faculty', 'admin']), uploadStudyMaterial);

// Leave Applications
router.get('/leave', authenticate, getLeaveApplications);
router.post('/leave', authenticate, requireRole(['student']), submitLeaveApplication);
router.patch('/leave/:id/status', authenticate, requireRole(['faculty', 'admin']), updateLeaveStatus);

export default router;

