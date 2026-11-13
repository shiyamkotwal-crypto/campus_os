import { Router } from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead
} from './announcements.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';
import { validate } from '../../middleware/validate.js';
import { AnnouncementSchema } from '../../ai/schemas/index.js';

const router = Router();

router.get('/', authenticate, getAnnouncements);
router.get('/:id', authenticate, getAnnouncementById);
router.post('/', authenticate, requireRole(['faculty', 'admin']), validate(AnnouncementSchema), createAnnouncement);
router.patch('/:id', authenticate, requireRole(['faculty', 'admin']), updateAnnouncement);
router.delete('/:id', authenticate, requireRole(['faculty', 'admin']), deleteAnnouncement);
router.post('/:id/read', authenticate, markAsRead);

export default router;

