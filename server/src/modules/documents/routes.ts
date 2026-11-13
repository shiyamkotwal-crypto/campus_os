import { Router } from 'express';
import {
  getDocuments,
  getDocumentById,
  uploadDocument,
  processDocument,
  deleteDocument
} from './documents.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/roles.js';

const router = Router();

router.get('/', authenticate, getDocuments);
router.get('/:id', authenticate, getDocumentById);
router.post('/upload', authenticate, requireRole(['faculty', 'admin']), uploadDocument);
router.post('/:id/process', authenticate, requireRole(['admin']), processDocument);
router.delete('/:id', authenticate, requireRole(['admin']), deleteDocument);

export default router;

