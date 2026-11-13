import { Router } from 'express';
import {
  chat,
  getSessions,
  getSessionById,
  deleteSession,
  summarize,
  extractNotice,
  studyPlan
} from './ai.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.post('/chat', authenticate, chat);
router.get('/sessions', authenticate, getSessions);
router.get('/sessions/:id', authenticate, getSessionById);
router.delete('/sessions/:id', authenticate, deleteSession);
router.post('/summarize', authenticate, summarize);
router.post('/extract-notice', authenticate, extractNotice);
router.post('/study-plan', authenticate, studyPlan);

export default router;

