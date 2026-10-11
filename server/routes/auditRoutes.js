import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Administrative audit logs (Super Admin and Compliance Officer)
router.get('/', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), getAuditLogs);

export default router;
