import { query } from '../config/db.js';

export async function getAuditLogs(req, res, next) {
  try {
    const { action, entityType, limit = 50, offset = 0 } = req.query;
    const conditions = [];
    const params = [];

    if (action) {
      conditions.push('a.action = ?');
      params.push(action);
    }

    if (entityType) {
      conditions.push('a.entity_type = ?');
      params.push(entityType);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT 
        a.id, a.action, a.entity_type, a.entity_id, a.details, a.ip_address, a.created_at,
        u.name as user_name, u.email as user_email, u.role as user_role
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ${where}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(parseInt(limit, 10), parseInt(offset, 10));
    const rows = await query(sql, params);

    const data = rows.map((r) => ({
      ...r,
      details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details
    }));

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
}
