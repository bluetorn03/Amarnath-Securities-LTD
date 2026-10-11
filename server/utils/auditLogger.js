import { query } from '../config/db.js';

export async function logAudit({ userId, action, entityType, entityId, details, req }) {
  try {
    const ipAddress = req?.headers['x-forwarded-for']?.split(',')[0].trim() || req?.socket?.remoteAddress || 'unknown';
    const userAgent = req?.headers['user-agent']?.slice(0, 250) || 'unknown';

    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
