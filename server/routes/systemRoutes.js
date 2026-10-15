import { Router } from 'express';
import {
  getSystemHealth,
  getSettings,
  updateSetting,
  getBackups,
  triggerBackup,
  executeRestore,
  executeStagingTest
} from '../controllers/systemController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Detailed system health & telemetry (Available to all authenticated staff)
router.get('/health', authenticate, getSystemHealth);

// System settings
router.get('/settings', authenticate, getSettings);
router.put('/settings/:key', authenticate, requireRole('super_admin'), updateSetting);

// Backups & Recovery (Restricted to super_admin)
router.get('/backups', authenticate, requireRole('super_admin'), getBackups);
router.post('/backups', authenticate, requireRole('super_admin'), triggerBackup);
router.post('/backups/restore', authenticate, requireRole('super_admin'), executeRestore);
router.post('/backups/test-staging', authenticate, requireRole('super_admin'), executeStagingTest);

export default router;
