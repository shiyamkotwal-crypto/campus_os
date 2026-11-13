import { Router } from 'express';
import { getEvents, createEvent, registerForEvent, cancelRegistration } from './events.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { EventSchema } from '../../ai/schemas/index.js';

const router = Router();

router.get('/', authenticate, getEvents);
router.post('/', authenticate, requireRole(['faculty', 'admin']), validate(EventSchema), createEvent);
router.post('/:id/register', authenticate, requireRole(['student']), registerForEvent);
router.delete('/:id/register', authenticate, requireRole(['student']), cancelRegistration);

export default router;

