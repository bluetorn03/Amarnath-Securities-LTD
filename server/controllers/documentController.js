import path from 'path';
import fs from 'fs';
import { query, transaction } from '../config/db.js';
import { config } from '../config/env.js';
import { logAudit } from '../utils/auditLogger.js';

/**
 * Format bytes to human readable string (e.g. 1.8 MB)
 */
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function getDocuments(req, res, next) {
  try {
    const isAdmin = Boolean(req.user);
    const { category, financialYear, quarter, status, search } = req.query;

    const conditions = [];
    const params = [];

    if (!isAdmin) {
      conditions.push('status = "published"');
    } else if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (financialYear && financialYear !== 'All') {
      conditions.push('financial_year = ?');
      params.push(financialYear);
    }

    if (quarter && quarter !== 'All') {
      conditions.push('quarter = ?');
      params.push(quarter);
    }

    if (search && search.trim()) {
      conditions.push('(title LIKE ? OR description LIKE ? OR bse_ack_number LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM documents ${whereClause} ORDER BY filing_date DESC, created_at DESC`;
    const rows = await query(sql, params);

    // Map snake_case to camelCase for frontend consistency
    const data = rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      financialYear: r.financial_year,
      quarter: r.quarter,
      filingDate: r.filing_date,
      bseAckNumber: r.bse_ack_number,
      fileSize: r.file_size,
      fileType: r.file_type,
      description: r.description,
      sourceType: r.source_type,
      fileUrl: r.file_url,
      externalUrl: r.external_url,
      isAvailable: Boolean(r.is_available),
      sebiReference: r.sebi_reference,
      effectiveDate: r.effective_date,
      version: r.version,
      isStatutory: Boolean(r.is_statutory),
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
}

export async function getDocumentById(req, res, next) {
  try {
    const { id } = req.params;
    const rows = await query('SELECT * FROM documents WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    const doc = rows[0];
    const versions = await query(
      'SELECT * FROM document_versions WHERE document_id = ? ORDER BY id DESC',
      [id]
    );

    res.json({
      success: true,
      data: {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        financialYear: doc.financial_year,
        quarter: doc.quarter,
        filingDate: doc.filing_date,
        bseAckNumber: doc.bse_ack_number,
        fileSize: doc.file_size,
        fileType: doc.file_type,
        description: doc.description,
        sourceType: doc.source_type,
        fileUrl: doc.file_url,
        externalUrl: doc.external_url,
        isAvailable: Boolean(doc.is_available),
        sebiReference: doc.sebi_reference,
        effectiveDate: doc.effective_date,
        version: doc.version,
        isStatutory: Boolean(doc.is_statutory),
        status: doc.status,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        versions
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function createDocument(req, res, next) {
  try {
    const body = req.body;
    const file = req.file;

    const id = body.id || `doc-${Date.now()}`;
    const sourceType = body.sourceType || (file ? 'upload' : 'external_url');

    let fileUrl = body.fileUrl || null;
    let fileSize = body.fileSize || 'Pending Upload';
    let isAvailable = false;

    if (sourceType === 'upload') {
      if (!file) {
        return res.status(400).json({ success: false, error: 'File upload is required for sourceType: upload.' });
      }
      fileUrl = `/uploads/${file.filename}`;
      fileSize = formatFileSize(file.size);
      isAvailable = true;
    } else if (sourceType === 'file_url') {
      if (!fileUrl) {
        return res.status(400).json({ success: false, error: 'fileUrl is required for sourceType: file_url.' });
      }
      isAvailable = true;
    } else if (sourceType === 'external_url') {
      isAvailable = false;
    }

    const version = 'Version 1.0';
    const status = body.status || 'published';

    await transaction(async (conn) => {
      await conn.query(
        `INSERT INTO documents (
          id, title, category, financial_year, quarter, filing_date, bse_ack_number,
          file_size, file_type, description, source_type, file_url, external_url,
          is_available, sebi_reference, effective_date, version, is_statutory,
          status, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          body.title,
          body.category,
          body.financialYear || 'FY 2025-26',
          body.quarter || 'N/A',
          body.filingDate || new Date().toISOString().split('T')[0],
          body.bseAckNumber || 'BSE/LODR/PENDING',
          fileSize,
          body.fileType || 'PDF',
          body.description || '',
          sourceType,
          fileUrl,
          body.externalUrl || null,
          isAvailable,
          body.sebiReference || null,
          body.effectiveDate || null,
          version,
          body.isStatutory !== undefined ? Boolean(body.isStatutory) : true,
          status,
          req.user.id,
          req.user.id
        ]
      );

      // Record initial version
      await conn.query(
        `INSERT INTO document_versions (document_id, version, file_url, file_size, source_type, change_summary, created_by)
         VALUES (?, ?, ?, ?, ?, 'Initial regulatory filing', ?)`,
        [id, version, fileUrl, fileSize, sourceType, req.user.id]
      );
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_DOCUMENT',
      entityType: 'document',
      entityId: id,
      details: { title: body.title, category: body.category, sourceType, version },
      req
    });

    res.status(201).json({ success: true, message: 'Document created successfully.', id });
  } catch (err) {
    next(err);
  }
}

export async function updateDocument(req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;

    const existing = await query('SELECT * FROM documents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    await query(
      `UPDATE documents SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        financial_year = COALESCE(?, financial_year),
        quarter = COALESCE(?, quarter),
        filing_date = COALESCE(?, filing_date),
        bse_ack_number = COALESCE(?, bse_ack_number),
        description = COALESCE(?, description),
        source_type = COALESCE(?, source_type),
        external_url = COALESCE(?, external_url),
        sebi_reference = COALESCE(?, sebi_reference),
        effective_date = COALESCE(?, effective_date),
        status = COALESCE(?, status),
        updated_by = ?
       WHERE id = ?`,
      [
        body.title,
        body.category,
        body.financialYear,
        body.quarter,
        body.filingDate,
        body.bseAckNumber,
        body.description,
        body.sourceType,
        body.externalUrl,
        body.sebiReference,
        body.effectiveDate,
        body.status,
        req.user.id,
        id
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_DOCUMENT',
      entityType: 'document',
      entityId: id,
      details: body,
      req
    });

    res.json({ success: true, message: 'Document updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function replaceDocumentFile(req, res, next) {
  try {
    const { id } = req.params;
    const file = req.file;
    const { sourceType, fileUrl: customFileUrl, changeSummary } = req.body;

    const existing = await query('SELECT * FROM documents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }
    const currentDoc = existing[0];

    // Compute new version
    const currentVerNum = parseFloat(currentDoc.version.replace(/[^0-9.]/g, '')) || 1.0;
    const nextVersion = (currentVerNum + 1.0).toFixed(1);

    let newFileUrl = currentDoc.file_url;
    let newFileSize = currentDoc.file_size;
    let newSourceType = sourceType || currentDoc.source_type;

    if (newSourceType === 'upload') {
      if (!file) {
        return res.status(400).json({ success: false, error: 'File is required for upload replacement.' });
      }
      newFileUrl = `/uploads/${file.filename}`;
      newFileSize = formatFileSize(file.size);
    } else if (newSourceType === 'file_url') {
      if (!customFileUrl) {
        return res.status(400).json({ success: false, error: 'fileUrl is required for file_url replacement.' });
      }
      newFileUrl = customFileUrl;
    }

    await transaction(async (conn) => {
      // 1. Update main document
      await conn.query(
        `UPDATE documents SET
          file_url = ?,
          file_size = ?,
          source_type = ?,
          is_available = TRUE,
          version = ?,
          updated_by = ?
         WHERE id = ?`,
        [newFileUrl, newFileSize, newSourceType, nextVersion, req.user.id, id]
      );

      // 2. Insert into version history
      await conn.query(
        `INSERT INTO document_versions (document_id, version, file_url, file_size, source_type, change_summary, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, nextVersion, newFileUrl, newFileSize, newSourceType, changeSummary || 'Document file replaced', req.user.id]
      );
    });

    await logAudit({
      userId: req.user.id,
      action: 'REPLACE_DOCUMENT_FILE',
      entityType: 'document',
      entityId: id,
      details: { oldVersion: currentDoc.version, newVersion: nextVersion, changeSummary },
      req
    });

    res.json({
      success: true,
      message: `Document file replaced successfully. Version updated to ${nextVersion}.`,
      version: nextVersion,
      fileUrl: newFileUrl,
      fileSize: newFileSize
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteDocument(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM documents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    await query('DELETE FROM documents WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_DOCUMENT',
      entityType: 'document',
      entityId: id,
      details: { title: existing[0].title },
      req
    });

    res.json({ success: true, message: 'Document and its version history deleted.' });
  } catch (err) {
    next(err);
  }
}

export async function downloadDocument(req, res, next) {
  try {
    const rawTarget = req.params.filename || req.params.id;
    if (!rawTarget) {
      return res.status(400).json({ success: false, error: 'Document identifier or filename is required.' });
    }

    // Strict path traversal prevention: ensure only filename without path separators
    if (rawTarget.includes('..') || rawTarget.includes('/') || rawTarget.includes('\\')) {
      return res.status(400).json({ success: false, error: 'Invalid document filename or path traversal detected.' });
    }

    const safeFilename = path.basename(rawTarget);
    const filePath = path.resolve(config.uploadDir, safeFilename);
    const resolvedUploadDir = path.resolve(config.uploadDir);
    if (!filePath.startsWith(resolvedUploadDir)) {
      return res.status(403).json({ success: false, error: 'Access denied: Directory traversal detected.' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Requested document file not found.' });
    }

    // Access control check: if the document is unapproved/draft/archived, only authenticated users can view
    const docRows = await query('SELECT status, is_available FROM documents WHERE file_url LIKE ?', [`%${safeFilename}`]);
    if (docRows.length > 0) {
      const doc = docRows[0];
      if (doc.status !== 'published' && !req.user) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: This regulatory filing is unpublished or archived and requires administrative authorization.'
        });
      }
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
}

export async function getDocumentVersions(req, res, next) {
  try {
    const { id } = req.params;
    const versions = await query(
      `SELECT v.*, u.name as created_by_name, u.email as created_by_email
       FROM document_versions v
       LEFT JOIN users u ON v.created_by = u.id
       WHERE v.document_id = ?
       ORDER BY v.version DESC`,
      [id]
    );
    res.json({ success: true, data: versions });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// DOCUMENT LIFECYCLE WORKFLOWS: APPROVE, PUBLISH, UNPUBLISH, ARCHIVE, RESTORE
// -------------------------------------------------------------

export async function approveDocument(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title, status FROM documents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    await query('UPDATE documents SET status = "published", is_available = TRUE, updated_by = ? WHERE id = ?', [req.user.id, id]);

    await logAudit({
      userId: req.user.id,
      action: 'APPROVE_DOCUMENT',
      entityType: 'document',
      entityId: id,
      details: { title: existing[0].title, previousStatus: existing[0].status },
      req
    });

    res.json({ success: true, message: 'Document approved and published to the public registry.' });
  } catch (err) {
    next(err);
  }
}

export async function publishDocument(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title, status FROM documents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    await query('UPDATE documents SET status = "published", updated_by = ? WHERE id = ?', [req.user.id, id]);

    await logAudit({
      userId: req.user.id,
      action: 'PUBLISH_DOCUMENT',
      entityType: 'document',
      entityId: id,
      details: { title: existing[0].title, previousStatus: existing[0].status },
      req
    });

    res.json({ success: true, message: 'Document published successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function unpublishDocument(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title, status FROM documents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    await query('UPDATE documents SET status = "draft", updated_by = ? WHERE id = ?', [req.user.id, id]);

    await logAudit({
      userId: req.user.id,
      action: 'UNPUBLISH_DOCUMENT',
      entityType: 'document',
      entityId: id,
      details: { title: existing[0].title, previousStatus: existing[0].status },
      req
    });

    res.json({ success: true, message: 'Document unpublished and reverted to draft status.' });
  } catch (err) {
    next(err);
  }
}

export async function archiveDocument(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title, status FROM documents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    await query('UPDATE documents SET status = "archived", updated_by = ? WHERE id = ?', [req.user.id, id]);

    await logAudit({
      userId: req.user.id,
      action: 'ARCHIVE_DOCUMENT',
      entityType: 'document',
      entityId: id,
      details: { title: existing[0].title, previousStatus: existing[0].status },
      req
    });

    res.json({ success: true, message: 'Document archived from active public indexing.' });
  } catch (err) {
    next(err);
  }
}

export async function restoreDocument(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title, status FROM documents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    await query('UPDATE documents SET status = "published", updated_by = ? WHERE id = ?', [req.user.id, id]);

    await logAudit({
      userId: req.user.id,
      action: 'RESTORE_DOCUMENT',
      entityType: 'document',
      entityId: id,
      details: { title: existing[0].title, previousStatus: existing[0].status },
      req
    });

    res.json({ success: true, message: 'Archived document restored to published status.' });
  } catch (err) {
    next(err);
  }
}

