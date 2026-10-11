import { Router } from 'express';
import { submitEnquiry, getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { enquiryLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public submission with rate limiting
router.post('/', enquiryLimiter, submitEnquiry);

// Administrative triage & grievance tracking
router.get('/', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), getEnquiries);
router.put('/:id/status', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateEnquiryStatus);

export default router;
