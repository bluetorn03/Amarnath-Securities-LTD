import { query } from '../config/db.js';

function toIsoUtc(val) {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) return val.toISOString();
  const s = String(val).trim();
  if (s.endsWith('Z')) return s;
  if (s.includes('T')) return s.endsWith('Z') ? s : s + 'Z';
  // "YYYY-MM-DD HH:mm:ss" stored in UTC in MySQL
  return s.replace(' ', 'T') + 'Z';
}

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

    const data = rows.map((r) => {
      const isoCreatedAt = toIsoUtc(r.created_at);
      const parsedDate = new Date(isoCreatedAt);
      const formattedIst = !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })
        : String(r.created_at);

      return {
        ...r,
        created_at: isoCreatedAt,
        formatted_ist: formattedIst,
        details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details
      };
    });

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
}
