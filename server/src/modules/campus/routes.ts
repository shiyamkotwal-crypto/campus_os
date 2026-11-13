import { Router } from 'express';
import {
  getCampusLocations,
  getLostFound,
  createLostFound,
  updateLostFoundStatus
} from './campus.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/locations', authenticate, getCampusLocations);
router.get('/lost-found', authenticate, getLostFound);
router.post('/lost-found', authenticate, createLostFound);
router.patch('/lost-found/:id', authenticate, updateLostFoundStatus);

export default router;

