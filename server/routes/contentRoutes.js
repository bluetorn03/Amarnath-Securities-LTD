import { Router } from 'express';
import {
  getCompanyProfile,
  updateCompanyProfile,
  getDirectors,
  createDirector,
  updateDirector,
  archiveDirector,
  restoreDirector,
  deleteDirector,
  getCommittees,
  createCommittee,
  updateCommittee,
  archiveCommittee,
  restoreCommittee,
  deleteCommittee,
  getKmpContacts,
  createKmpContact,
  updateKmpContact,
  archiveKmpContact,
  restoreKmpContact,
  deleteKmpContact,
  getReg46Clauses,
  updateReg46Clause,
  archiveReg46Clause,
  restoreReg46Clause
} from '../controllers/contentController.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Ensure dynamic governance and compliance content is never cached by browser heuristics
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// 1. Company Profile
router.get('/profile', getCompanyProfile);
router.put('/profile', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateCompanyProfile);

// 2. Board Directors
router.get('/directors', optionalAuth, getDirectors);
router.post('/directors', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), createDirector);
router.put('/directors/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateDirector);
router.post('/directors/:id/archive', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), archiveDirector);
router.post('/directors/:id/restore', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), restoreDirector);
router.delete('/directors/:id', authenticate, requireRole('super_admin'), deleteDirector);

// 3. Board Committees & Composition
router.get('/committees', optionalAuth, getCommittees);
router.post('/committees', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), createCommittee);
router.put('/committees/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateCommittee);
router.post('/committees/:id/archive', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), archiveCommittee);
router.post('/committees/:id/restore', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), restoreCommittee);
router.delete('/committees/:id', authenticate, requireRole('super_admin'), deleteCommittee);

// 4. KMP Key Contacts
router.get('/kmp', optionalAuth, getKmpContacts);
router.post('/kmp', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), createKmpContact);
router.put('/kmp/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateKmpContact);
router.post('/kmp/:id/archive', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), archiveKmpContact);
router.post('/kmp/:id/restore', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), restoreKmpContact);
router.delete('/kmp/:id', authenticate, requireRole('super_admin'), deleteKmpContact);

// 5. Regulation 46 Compliance Clauses
router.get('/regulation-46', optionalAuth, getReg46Clauses);
router.put('/regulation-46/:id', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), updateReg46Clause);
router.post('/regulation-46/:id/archive', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), archiveReg46Clause);
router.post('/regulation-46/:id/restore', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), restoreReg46Clause);

export default router;
