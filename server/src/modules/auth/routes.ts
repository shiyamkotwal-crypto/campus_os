import { Router } from 'express';
import { register, login, logout, getMe, refresh } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { RegisterSchema, LoginSchema } from '../../ai/schemas/index.js';

const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', validate(LoginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/refresh', authenticate, refresh);

export default router;

