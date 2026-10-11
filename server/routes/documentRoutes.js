import { Router } from 'express';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  replaceDocumentFile,
  deleteDocument,
  downloadDocument,
  getDocumentVersions,
  approveDocument,
  publishDocument,
  unpublishDocument,
  archiveDocument,
  restoreDocument
} from '../controllers/documentController.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';
import { uploadPdf, validatePdfMagicBytes } from '../middleware/upload.js';

const router = Router();

// Public / Guest accessible (with optional auth for administrative views)
router.get('/', optionalAuth, getDocuments);
router.get('/:id', optionalAuth, getDocumentById);
router.get('/:id/download', optionalAuth, downloadDocument);

// Administrative & Compliance document management
router.get('/:id/versions', authenticate, getDocumentVersions);
router.post(
  '/',
  authenticate,
  requireRole('super_admin', 'compliance_officer', 'compliance_admin', 'editor'),
  uploadPdf.single('file'),
  validatePdfMagicBytes,
  createDocument
);
router.put(
  '/:id',
  authenticate,
  requireRole('super_admin', 'compliance_officer', 'compliance_admin', 'editor'),
  updateDocument
);
router.post(
  '/:id/replace',
  authenticate,
  requireRole('super_admin', 'compliance_officer', 'compliance_admin', 'editor'),
  uploadPdf.single('file'),
  validatePdfMagicBytes,
  replaceDocumentFile
);
router.delete(
  '/:id',
  authenticate,
  requireRole('super_admin'),
  deleteDocument
);

// Workflow state transition endpoints
router.post('/:id/approve', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), approveDocument);
router.post('/:id/publish', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), publishDocument);
router.post('/:id/unpublish', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), unpublishDocument);
router.post('/:id/archive', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), archiveDocument);
router.post('/:id/restore', authenticate, requireRole('super_admin', 'compliance_officer', 'compliance_admin'), restoreDocument);

export default router;
