import { query } from '../config/db.js';

/**
 * Standardized institutional audit logger.
 * Tracks non-repudiation administrative events, state changes, and security actions.
 */
export async function logAudit({ userId, action, entityType, entityId, details, req }) {
  try {
    // Extract genuine client IP across proxies (Hostinger, Cloudflare, Nginx reverse proxy)
    const rawIp = req?.headers?.['cf-connecting-ip'] ||
      req?.headers?.['x-real-ip'] ||
      req?.headers?.['x-forwarded-for']?.split(',')[0].trim() ||
      req?.socket?.remoteAddress ||
      '127.0.0.1';

    // Normalize IPv6 localhost
    const ipAddress = (rawIp === '::1' || rawIp === '::ffff:127.0.0.1') ? '127.0.0.1' : rawIp;
    const userAgent = req?.headers?.['user-agent']?.slice(0, 250) || 'unknown';

    // Explicitly record using UTC_TIMESTAMP() to ensure uniform global epoch across all server environments
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [
        userId || null,
        action,
        entityType,
        entityId || null,
        details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent
      ]
    );
  } catch (err) {
    console.error('[AUDIT LOG ERROR]', err.message);
  }
}

/**
 * Automatically purge audit log entries older than 365 days (1 year).
 * Complies with institutional retention and data hygiene guidelines.
 */
export async function purgeExpiredAuditLogs() {
  try {
    const result = await query(
      'DELETE FROM audit_logs WHERE created_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 YEAR)'
    );
    const affected = result?.affectedRows || 0;
    if (affected > 0) {
      console.log(`[AUDIT RETENTION] Successfully auto-deleted ${affected} audit record(s) older than 1 year.`);
    }
    return { success: true, deletedCount: affected };
  } catch (err) {
    console.error('[AUDIT RETENTION ERROR]', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Initialize background scheduler to run the 1-year audit purge daily
 */
let retentionTimer = null;
export function startAuditRetentionScheduler() {
  // Run once shortly after startup (after 10 seconds)
  setTimeout(() => {
    purgeExpiredAuditLogs().catch(() => {});
  }, 10000);

  // Run recurring check every 24 hours (86,400,000 ms)
  if (!retentionTimer) {
    retentionTimer = setInterval(() => {
      purgeExpiredAuditLogs().catch(() => {});
    }, 24 * 60 * 60 * 1000);
    // Unref timer so it doesn't block process termination
    if (retentionTimer?.unref) {
      retentionTimer.unref();
    }
  }
}
