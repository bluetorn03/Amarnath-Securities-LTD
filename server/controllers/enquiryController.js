import crypto from 'crypto';
import { query } from '../config/db.js';
import { logAudit } from '../utils/auditLogger.js';

export async function submitEnquiry(req, res, next) {
  try {
    const {
      type,
      name,
      email,
      phone,
      companyName,
      serviceInterest,
      estimatedCapital,
      folioOrDpId,
      grievanceCategory,
      details
    } = req.body;

    if (!type || !name || !email || !details) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters. Name, email, type, and details are mandatory.'
      });
    }

    if (!['business', 'investor'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid submission type.' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }

    // Generate reference code
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const prefix = type === 'business' ? 'ASL-CORP' : 'ASL-INV';
    const referenceNo = `${prefix}-${randomSuffix}`;
    const id = `enq-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';

    const isTest = 
      email.includes('test') || 
      email.includes('audit-client') || 
      name.toLowerCase().includes('automated audit') || 
      details.toLowerCase().includes('audit test');

    await query(
      `INSERT INTO enquiries (
        id, reference_no, type, name, email, phone, company_name,
        service_interest, estimated_capital, folio_or_dp_id,
        grievance_category, details, status, is_test, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`,
      [
        id,
        referenceNo,
        type,
        name.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : null,
        companyName ? companyName.trim() : null,
        serviceInterest || null,
        estimatedCapital || null,
        folioOrDpId ? folioOrDpId.trim() : null,
        grievanceCategory || null,
        details.trim(),
        isTest ? 1 : 0,
        ipAddress
      ]
    );

    res.status(201).json({
      success: true,
      message: type === 'business'
        ? 'Business enquiry submitted successfully. Our team will review your mandate.'
        : 'Shareholder grievance filed successfully with the Investor Desk.',
      referenceNo,
      type
    });
  } catch (err) {
    next(err);
  }
}

export async function getEnquiries(req, res, next) {
  try {
    const { type, status, search } = req.query;
    const conditions = [];
    const params = [];

    if (type && type !== 'all') {
      conditions.push('type = ?');
      params.push(type);
    }

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (req.query.is_test !== undefined && req.query.is_test !== 'all') {
      conditions.push('is_test = ?');
      params.push(req.query.is_test === '1' || req.query.is_test === 'true' ? 1 : 0);
    }

    if (search && search.trim()) {
      conditions.push('(name LIKE ? OR email LIKE ? OR reference_no LIKE ? OR details LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM enquiries ${where} ORDER BY created_at DESC`;
    const rows = await query(sql, params);

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
}

export async function updateEnquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['new', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status parameter.' });
    }

    await query(
      `UPDATE enquiries SET
        status = ?,
        admin_notes = COALESCE(?, admin_notes)
       WHERE id = ?`,
      [status, adminNotes || null, id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_ENQUIRY_STATUS',
      entityType: 'enquiry',
      entityId: id,
      details: { status, adminNotes },
      req
    });

    res.json({ success: true, message: 'Enquiry updated successfully.' });
  } catch (err) {
    next(err);
  }
}
