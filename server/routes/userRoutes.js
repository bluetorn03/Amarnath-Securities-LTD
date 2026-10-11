import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  resetUserPassword,
  deleteUser
} from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// User management endpoints (Restricted to super_admin)
router.get('/', authenticate, requireRole('super_admin'), getUsers);
router.post('/', authenticate, requireRole('super_admin'), createUser);
router.put('/:id', authenticate, requireRole('super_admin'), updateUser);
router.post('/:id/reset-password', authenticate, requireRole('super_admin'), resetUserPassword);
router.delete('/:id', authenticate, requireRole('super_admin'), deleteUser);

export default router;
