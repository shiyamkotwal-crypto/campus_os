import { Router } from 'express';
import {
  getTickets,
  createTicket,
  getTicketById,
  addTicketMessage,
  updateTicketStatus
} from './support.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { SupportTicketSchema } from '../../ai/schemas/index.js';

const router = Router();

router.get('/tickets', authenticate, getTickets);
router.post('/tickets', authenticate, validate(SupportTicketSchema), createTicket);
router.get('/tickets/:id', authenticate, getTicketById);
router.post('/tickets/:id/messages', authenticate, addTicketMessage);
router.patch('/tickets/:id/status', authenticate, requireRole(['faculty', 'admin']), updateTicketStatus);

export default router;

