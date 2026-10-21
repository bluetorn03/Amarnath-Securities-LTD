import { Router } from 'express';
import { 
  submitEnquiry, 
  getEnquiries, 
  getEnquiryDetails, 
  updateEnquiryStatus, 
  addEnquiryNote, 
  setEnquiryFollowUp, 
  classifyEnquiry, 
  deleteEnquiry,
  getRtaContactInfo,
  updateRtaContactInfo
} from '../controllers/enquiryController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { enquiryLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public submission with rate limiting
router.post('/', enquiryLimiter, submitEnquiry);

// RTA & Contact Configuration (Restricted to compliance & super_admin staff)
router.get('/rta-contact', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), getRtaContactInfo);
router.put('/rta-contact', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateRtaContactInfo);

// Administrative triage, grievance tracking & record management
router.get('/', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), getEnquiries);
router.get('/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), getEnquiryDetails);
router.put('/:id/status', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateEnquiryStatus);
router.post('/:id/notes', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), addEnquiryNote);
router.put('/:id/follow-up', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), setEnquiryFollowUp);
router.put('/:id/classify', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), classifyEnquiry);
router.delete('/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), deleteEnquiry);

export default router;
