import { Router } from 'express';
import { login, getMe, changePassword, updateCredentials, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public auth endpoints with strict rate limiting
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, requestPasswordReset);
router.post('/reset-password', authLimiter, resetPassword);

// Protected endpoints
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, changePassword);
router.post('/update-credentials', authenticate, updateCredentials);

export default router;
