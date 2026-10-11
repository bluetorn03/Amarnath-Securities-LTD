import { Router } from 'express';
import {
  getCompanyProfile,
  updateCompanyProfile,
  getDirectors,
  createDirector,
  updateDirector,
  deleteDirector,
  getCommittees,
  createCommittee,
  updateCommittee,
  deleteCommittee,
  getKmpContacts,
  createKmpContact,
  updateKmpContact,
  deleteKmpContact,
  getReg46Clauses,
  updateReg46Clause
} from '../controllers/contentController.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// 1. Company Profile
router.get('/profile', getCompanyProfile);
router.put('/profile', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateCompanyProfile);

// 2. Board Directors
router.get('/directors', optionalAuth, getDirectors);
router.post('/directors', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), createDirector);
router.put('/directors/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateDirector);
router.delete('/directors/:id', authenticate, requireRole('super_admin'), deleteDirector);

// 3. Board Committees & Composition
router.get('/committees', optionalAuth, getCommittees);
router.post('/committees', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), createCommittee);
router.put('/committees/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateCommittee);
router.delete('/committees/:id', authenticate, requireRole('super_admin'), deleteCommittee);

// 4. KMP Key Contacts
router.get('/kmp', optionalAuth, getKmpContacts);
router.post('/kmp', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), createKmpContact);
router.put('/kmp/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateKmpContact);
router.delete('/kmp/:id', authenticate, requireRole('super_admin'), deleteKmpContact);

// 5. Regulation 46 Compliance Clauses
router.get('/regulation-46', optionalAuth, getReg46Clauses);
router.put('/regulation-46/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateReg46Clause);

export default router;
