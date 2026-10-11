import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { config } from '../config/env.js';

// Ensure upload directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate safe, unguessable, non-traversable filename
    const randomHex = crypto.randomBytes(12).toString('hex');
    const safeBase = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 40);
    cb(null, `asl_${Date.now()}_${randomHex}_${safeBase}.pdf`);
  }
});

const fileFilter = (req, file, cb) => {
  // Strict check: mimetype and extension
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (ext !== '.pdf' || (mime !== 'application/pdf' && mime !== 'application/x-pdf')) {
    const error = new Error('Invalid file type. Only authentic PDF documents (.pdf) are permitted for regulatory archiving.');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
  }

  cb(null, true);
};

export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.security.maxUploadSizeBytes, // 25 MB max
    files: 1
  }
});

/**
 * Middleware: Verify PDF magic bytes (%PDF-) to prevent spoofed/polyglot files
 */
export function validatePdfMagicBytes(req, res, next) {
  if (!req.file) return next();

  try {
    const filePath = req.file.path;
    const buffer = Buffer.alloc(5);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 5, 0);
    fs.closeSync(fd);

    if (buffer.toString('ascii') !== '%PDF-') {
      // Delete spoofed non-PDF file immediately
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        error: 'Security verification failed: File content does not match authentic PDF format (%PDF- binary signature missing).'
      });
    }

    next();
  } catch (err) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    next(err);
  }
}
