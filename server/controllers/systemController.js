import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { query, checkConnection } from '../config/db.js';
import { config } from '../config/env.js';
import { logAudit } from '../utils/auditLogger.js';
import { createBackup, restoreBackup } from '../database/backupRestore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUPS_DIR = path.resolve(__dirname, '../database/backups');

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Real system health & environmental metrics
 */
export async function getSystemHealth(req, res, next) {
  try {
    const startTime = Date.now();
    const dbStatus = await checkConnection();
    const dbPingMs = Date.now() - startTime;

    // Upload storage telemetry
    let uploadCount = 0;
    let uploadSizeBytes = 0;
    if (fs.existsSync(config.uploadDir)) {
      const files = fs.readdirSync(config.uploadDir);
      uploadCount = files.length;
      for (const file of files) {
        try {
          const stats = fs.statSync(path.join(config.uploadDir, file));
          uploadSizeBytes += stats.size;
        } catch {
          // ignore transient file errors
        }
      }
    }

    // Latest backup telemetry
    let latestBackup = null;
    let totalBackupsCount = 0;
    if (fs.existsSync(BACKUPS_DIR)) {
      const backupFiles = fs.readdirSync(BACKUPS_DIR).filter((f) => f.endsWith('.sql'));
      totalBackupsCount = backupFiles.length;
      if (backupFiles.length > 0) {
        const sorted = backupFiles
          .map((f) => {
            const stat = fs.statSync(path.join(BACKUPS_DIR, f));
            return { filename: f, sizeBytes: stat.size, sizeDisplay: formatBytes(stat.size), createdAt: stat.mtime };
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        latestBackup = sorted[0];
      }
    }

    // Database statistics & compliance indicators
    const [docStats] = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as review,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived
      FROM documents
    `);

    const [reg46Stats] = await query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN review_status = 'Verified' THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN review_status = 'Pending Evidence' THEN 1 ELSE 0 END) as pendingEvidence,
        SUM(CASE WHEN review_status = 'Under Review' THEN 1 ELSE 0 END) as underReview,
        SUM(CASE WHEN review_status = 'Not Applicable' THEN 1 ELSE 0 END) as notApplicable
      FROM regulation_46_clauses
    `);

    const [enquiryStats] = await query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_test = 0 AND type = 'investor' THEN 1 ELSE 0 END) as genuineGrievances,
        SUM(CASE WHEN is_test = 0 AND type = 'business' THEN 1 ELSE 0 END) as genuineEnquiries,
        SUM(CASE WHEN is_test = 1 THEN 1 ELSE 0 END) as testAuditRuns,
        SUM(CASE WHEN is_test = 0 AND status = 'new' THEN 1 ELSE 0 END) as pendingNew,
        SUM(CASE WHEN is_test = 0 AND status = 'in_progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN is_test = 0 AND status = 'resolved' THEN 1 ELSE 0 END) as resolved
      FROM enquiries
    `);

    const [userStats] = await query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
      FROM users
    `);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      service: 'Amarnath Securities Management API',
      version: '2.0.0-institutional',
      nodeEnv: config.nodeEnv,
      connectivity: {
        database: dbStatus.ok ? 'connected' : 'disconnected',
        pingMs: dbPingMs,
        storageMounted: fs.existsSync(config.uploadDir),
        status: dbStatus.ok ? 'healthy' : 'degraded'
      },
      systemTelemetry: {
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: (process.memoryUsage().rss / 1024 / 1024).toFixed(1),
        nodeVersion: process.version,
        platform: os.platform(),
        freeMemMb: (os.freemem() / 1024 / 1024).toFixed(1),
        totalMemMb: (os.totalmem() / 1024 / 1024).toFixed(1)
      },
      storage: {
        uploadDir: config.uploadDir,
        fileCount: uploadCount,
        storageSizeBytes: uploadSizeBytes,
        storageSizeDisplay: formatBytes(uploadSizeBytes),
        maxCapacityMb: 5000,
        usagePercentage: ((uploadSizeBytes / (5000 * 1024 * 1024)) * 100).toFixed(2)
      },
      backupStatus: {
        totalBackupsCount,
        latestBackup,
        storagePath: BACKUPS_DIR
      },
      metrics: {
        documents: {
          total: Number(docStats.total || 0),
          published: Number(docStats.published || 0),
          draft: Number(docStats.draft || 0),
          review: Number(docStats.review || 0),
          archived: Number(docStats.archived || 0)
        },
        regulation46: {
          total: Number(reg46Stats.total || 0),
          active: Number(reg46Stats.total || 0) - Number(reg46Stats.notApplicable || 0),
          verified: Number(reg46Stats.verified || 0),
          pendingEvidence: Number(reg46Stats.pendingEvidence || 0),
          underReview: Number(reg46Stats.underReview || 0),
          notApplicable: Number(reg46Stats.notApplicable || 0),
          complianceScore: (Number(reg46Stats.total) - Number(reg46Stats.notApplicable)) > 0
            ? Math.round((Number(reg46Stats.verified) / (Number(reg46Stats.total) - Number(reg46Stats.notApplicable))) * 100)
            : 0
        },
        enquiries: {
          total: Number(enquiryStats.total || 0),
          grievances: Number(enquiryStats.genuineGrievances || 0),
          genuineGrievances: Number(enquiryStats.genuineGrievances || 0),
          genuineEnquiries: Number(enquiryStats.genuineEnquiries || 0),
          testAuditRuns: Number(enquiryStats.testAuditRuns || 0),
          pendingNew: Number(enquiryStats.pendingNew || 0),
          inProgress: Number(enquiryStats.inProgress || 0),
          resolved: Number(enquiryStats.resolved || 0)
        },
        users: {
          total: Number(userStats.total || 0),
          active: Number(userStats.active || 0)
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all system settings
 */
export async function getSettings(req, res, next) {
  try {
    const rows = await query('SELECT setting_key, setting_value, category, description, updated_at FROM system_settings');
    const settingsMap = {};
    for (const row of rows) {
      settingsMap[row.setting_key] = {
        value: typeof row.setting_value === 'string' ? JSON.parse(row.setting_value) : row.setting_value,
        category: row.category,
        description: row.description,
        updatedAt: row.updated_at
      };
    }
    res.json({ success: true, data: settingsMap });
  } catch (err) {
    next(err);
  }
}

/**
 * Update system setting (Restricted to super_admin)
 */
export async function updateSetting(req, res, next) {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    const allowedKeys = [
      'company_profile',
      'investor_relations',
      'security_policy',
      'notifications',
      'website_seo',
      'storage_settings',
      'compliance_workflow'
    ];

    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ success: false, error: `Invalid setting key '${key}'.` });
    }

    if (!value || typeof value !== 'object') {
      return res.status(400).json({ success: false, error: 'Setting value must be a valid JSON object.' });
    }

    // Retrieve prior setting state to record precise audit diff
    const existingRows = await query('SELECT setting_value FROM system_settings WHERE setting_key = ?', [key]);
    const oldValue = existingRows && existingRows.length > 0
      ? (typeof existingRows[0].setting_value === 'string' ? JSON.parse(existingRows[0].setting_value) : existingRows[0].setting_value)
      : {};

    const changes = {};
    const allKeys = new Set([...Object.keys(oldValue || {}), ...Object.keys(value || {})]);
    for (const field of allKeys) {
      const prev = oldValue ? oldValue[field] : undefined;
      const curr = value ? value[field] : undefined;
      if (JSON.stringify(prev) !== JSON.stringify(curr)) {
        changes[field] = {
          from: prev !== undefined ? prev : null,
          to: curr !== undefined ? curr : null
        };
      }
    }
    const changedFieldNames = Object.keys(changes);

    const valueStr = JSON.stringify(value);
    await query(
      `UPDATE system_settings SET 
        setting_value = ?, 
        description = COALESCE(?, description), 
        updated_by = ?,
        updated_at = NOW()
       WHERE setting_key = ?`,
      [valueStr, description || null, req.user.id, key]
    );

    // If company_profile is updated, keep the statutory company_profile table in sync
    if (key === 'company_profile') {
      await query(
        `UPDATE company_profile SET
          company_name = COALESCE(?, company_name),
          cin = COALESCE(?, cin),
          bse_scrip_code = COALESCE(?, bse_scrip_code),
          isin = COALESCE(?, isin),
          reg_office = COALESCE(?, reg_office),
          corp_office = COALESCE(?, corp_office),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          updated_by = ?
         WHERE id = 1`,
        [
          value.company_name,
          value.cin,
          value.bse_scrip_code,
          value.isin,
          value.reg_office,
          value.corp_office,
          value.email,
          value.phone,
          req.user.id
        ]
      );
    }

    // If investor_relations is updated, keep RTA and compliance contact details in sync
    if (key === 'investor_relations') {
      await query(
        `UPDATE company_profile SET
          compliance_officer = COALESCE(?, compliance_officer),
          compliance_email = COALESCE(?, compliance_email),
          compliance_phone = COALESCE(?, compliance_phone),
          rta_name = COALESCE(?, rta_name),
          rta_address = COALESCE(?, rta_address),
          rta_email = COALESCE(?, rta_email),
          rta_phone = COALESCE(?, rta_phone),
          rta_website = COALESCE(?, rta_website),
          sebi_scores_url = COALESCE(?, sebi_scores_url),
          sebi_smart_odr_url = COALESCE(?, sebi_smart_odr_url),
          bse_portal_url = COALESCE(?, bse_portal_url),
          updated_by = ?
         WHERE id = 1`,
        [
          value.compliance_officer,
          value.compliance_email,
          value.compliance_phone,
          value.rta_name,
          value.rta_address,
          value.rta_email,
          value.rta_phone,
          value.rta_website,
          value.sebi_scores_url,
          value.sebi_smart_odr_url,
          value.bse_portal_url,
          req.user.id
        ]
      );
    }

    // Determine descriptive action name for audit trail
    let actionName = 'UPDATE_SYSTEM_SETTINGS';
    if (key === 'company_profile') actionName = 'UPDATE_COMPANY_PROFILE';
    else if (key === 'investor_relations') actionName = 'UPDATE_INVESTOR_RELATIONS';
    else if (key === 'security_policy') actionName = 'UPDATE_SECURITY_POLICY';
    else if (key === 'compliance_workflow') actionName = 'UPDATE_COMPLIANCE_WORKFLOW';

    await logAudit({
      userId: req.user.id,
      action: actionName,
      entityType: key,
      entityId: key,
      details: {
        settingKey: key,
        summary: `Updated ${key.replace(/_/g, ' ')} (${changedFieldNames.length} field(s) changed)`,
        changedFields: changedFieldNames,
        changes: changedFieldNames.length > 0 ? changes : 'No values modified',
        newValues: value,
        previousValues: oldValue
      },
      req
    });

    res.json({ success: true, message: `Setting '${key}' updated successfully.`, data: value });
  } catch (err) {
    next(err);
  }
}

/**
 * List database backups
 */
export async function getBackups(req, res, next) {
  try {
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }

    const files = fs.readdirSync(BACKUPS_DIR).filter((f) => f.endsWith('.sql'));
    const backups = files.map((file) => {
      const stats = fs.statSync(path.join(BACKUPS_DIR, file));
      return {
        filename: file,
        sizeBytes: stats.size,
        sizeDisplay: formatBytes(stats.size),
        createdAt: stats.mtime.toISOString(),
        status: 'available'
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: backups.length, data: backups });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new database backup snapshot
 */
export async function triggerBackup(req, res, next) {
  try {
    const backupFilePath = await createBackup();
    const filename = path.basename(backupFilePath);
    const stat = fs.statSync(backupFilePath);

    // Record in system_backups table
    await query(
      `INSERT INTO system_backups (filename, file_size_bytes, file_size_display, backup_type, status, created_by)
       VALUES (?, ?, ?, 'manual', 'completed', ?)`,
      [filename, stat.size, formatBytes(stat.size), req.user.id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'DATABASE_BACKUP_CREATED',
      entityType: 'database_backup',
      entityId: filename,
      details: { filename, size: formatBytes(stat.size) },
      req
    });

    res.json({
      success: true,
      message: 'Database backup snapshot created successfully.',
      data: {
        filename,
        sizeBytes: stat.size,
        sizeDisplay: formatBytes(stat.size),
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Restore database from an existing backup snapshot (Super Admin only)
 */
export async function executeRestore(req, res, next) {
  try {
    const { filename, confirmationText } = req.body;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ success: false, error: 'Backup filename is required.' });
    }

    // Require explicit confirmation token to prevent accidental invocation
    if (confirmationText !== 'RESTORE_DATABASE_CONFIRM') {
      return res.status(400).json({
        success: false,
        error: 'Safety verification failed. Please supply confirmationText: "RESTORE_DATABASE_CONFIRM".'
      });
    }

    // Prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\') || !filename.endsWith('.sql')) {
      return res.status(400).json({ success: false, error: 'Invalid backup file selection.' });
    }

    const backupFilePath = path.join(BACKUPS_DIR, filename);
    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({ success: false, error: 'Selected backup file does not exist on disk.' });
    }

    await restoreBackup(backupFilePath);

    await logAudit({
      userId: req.user.id,
      action: 'DATABASE_RESTORE_EXECUTED',
      entityType: 'database_restore',
      entityId: filename,
      details: { filename, restoredAt: new Date().toISOString() },
      req
    });

    res.json({
      success: true,
      message: `Database successfully restored from backup snapshot '${filename}'.`
    });
  } catch (err) {
    next(err);
  }
}
