import crypto from 'crypto';
import { query } from '../config/db.js';
import { logAudit } from '../utils/auditLogger.js';

// Cache for duplicate submission prevention (in-memory, sliding window 60s)
const recentSubmissions = new Map();

function cleanOldSubmissions() {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 60000) {
      recentSubmissions.delete(key);
    }
  }
}
setInterval(cleanOldSubmissions, 30000);

/**
 * 1. PUBLIC / AUTHENTICATED ENQUIRY & GRIEVANCE SUBMISSION
 * Validates inputs, detects duplicates, reliably classifies genuine vs test records,
 * saves to MySQL, and responds with reference number without exposing sensitive internals.
 */
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
      details,
      is_test: explicitTestFlag,
      isTest: altTestFlag
    } = req.body;

    // Validate mandatory fields
    if (!type || !name || !email || !details) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters. Name, email, type, and details are mandatory.'
      });
    }

    if (!['business', 'investor'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid submission type. Must be business or investor.' });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedDetails = String(details).trim();

    if (trimmedName.length < 2 || trimmedName.length > 150) {
      return res.status(400).json({ success: false, error: 'Name must be between 2 and 150 characters.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid email address format.' });
    }

    if (trimmedDetails.length < 5 || trimmedDetails.length > 5000) {
      return res.status(400).json({ success: false, error: 'Details must be between 5 and 5,000 characters.' });
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';

    // Duplicate submission protection (prevent double-clicks within 60s)
    const duplicateKey = `${ipAddress}:${trimmedEmail}:${type}:${crypto.createHash('md5').update(trimmedDetails).digest('hex')}`;
    const now = Date.now();
    if (recentSubmissions.has(duplicateKey) && (now - recentSubmissions.get(duplicateKey) < 60000)) {
      return res.status(429).json({
        success: false,
        error: 'A submission with identical details was recently received. Please allow our team time to process.'
      });
    }
    recentSubmissions.set(duplicateKey, now);

    // Reliable Test vs Genuine classification (No name-based guessing on regular submissions)
    const isHeaderTest = req.headers['x-audit-test'] === 'true';
    const isExplicitTest = explicitTestFlag === true || explicitTestFlag === 1 || explicitTestFlag === '1' ||
                           altTestFlag === true || altTestFlag === 1 || altTestFlag === '1';
    // Maintain backwards compatibility for automated integration test suite identities
    const isTestSuiteIdentity = trimmedEmail === 'audit-client@institution.com' ||
                                trimmedName === 'Automated Audit Client' ||
                                trimmedEmail.includes('@test-audit.local');

    const isTest = (isHeaderTest || isExplicitTest || isTestSuiteIdentity) ? 1 : 0;

    // Generate reference code
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const prefix = type === 'business' ? 'ASL-CORP' : 'ASL-INV';
    const referenceNo = `${prefix}-${randomSuffix}`;
    const id = `enq-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    await query(
      `INSERT INTO enquiries (
        id, reference_no, type, name, email, phone, company_name,
        service_interest, estimated_capital, folio_or_dp_id,
        grievance_category, details, status, is_test, ip_address,
        is_archived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, 0)`,
      [
        id,
        referenceNo,
        type,
        trimmedName,
        trimmedEmail,
        phone ? String(phone).trim() : null,
        companyName ? String(companyName).trim() : null,
        serviceInterest ? String(serviceInterest).trim() : null,
        estimatedCapital ? String(estimatedCapital).trim() : null,
        folioOrDpId ? String(folioOrDpId).trim() : null,
        grievanceCategory ? String(grievanceCategory).trim() : null,
        trimmedDetails,
        isTest,
        ipAddress
      ]
    );

    // If an authenticated staff member created this manually, log to audit trail
    if (req.user?.id) {
      await logAudit({
        userId: req.user.id,
        action: 'MANUAL_ENQUIRY_CREATED',
        entityType: 'enquiry',
        entityId: id,
        details: { referenceNo, type, isTest },
        req
      });
    }

    res.status(201).json({
      success: true,
      message: type === 'business'
        ? 'Business enquiry submitted successfully. Our corporate advisory desk will review your mandate.'
        : 'Shareholder grievance filed successfully with the Investor Grievance Desk.',
      referenceNo,
      type
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 2. GET ENQUIRIES LIST & LIVE DATABASE METRICS
 * Supports filtering by type, status, is_test, search, date range, and archival.
 * Calculates dynamic counts from MySQL database.
 */
export async function getEnquiries(req, res, next) {
  try {
    const { type, status, search, date_from, date_to, is_archived } = req.query;
    const conditions = [];
    const params = [];

    // Filter by type
    if (type && type !== 'all') {
      conditions.push('type = ?');
      params.push(type);
    }

    // Filter by status
    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    // Filter by is_test (genuine vs test)
    if (req.query.is_test !== undefined && req.query.is_test !== 'all') {
      if (req.query.is_test === '1' || req.query.is_test === 'true' || req.query.is_test === 'test') {
        conditions.push('is_test = 1');
      } else if (req.query.is_test === '0' || req.query.is_test === 'false' || req.query.is_test === 'genuine') {
        conditions.push('is_test = 0');
      }
    }

    // Filter by archival
    if (is_archived === '1' || is_archived === 'true') {
      conditions.push('is_archived = 1');
    } else if (is_archived === 'all') {
      // include all
    } else {
      // Default: exclude archived
      conditions.push('(is_archived = 0 OR is_archived IS NULL)');
    }

    // Search query
    if (search && search.trim()) {
      conditions.push('(name LIKE ? OR email LIKE ? OR reference_no LIKE ? OR details LIKE ? OR folio_or_dp_id LIKE ? OR company_name LIKE ?)');
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s, s, s);
    }

    // Date range filters
    if (date_from) {
      conditions.push('created_at >= ?');
      params.push(`${date_from} 00:00:00`);
    }
    if (date_to) {
      conditions.push('created_at <= ?');
      params.push(`${date_to} 23:59:59`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT 
        id, reference_no, type, name, email, phone, company_name,
        service_interest, estimated_capital, folio_or_dp_id,
        grievance_category, details, status, 
        COALESCE(resolution_notes, admin_notes) AS resolution_notes,
        COALESCE(admin_notes, resolution_notes) AS admin_notes,
        follow_up_date, is_archived, assigned_to, updated_by,
        is_test, ip_address, created_at, updated_at
      FROM enquiries 
      ${where} 
      ORDER BY created_at DESC
    `;
    const rows = await query(sql, params);

    // Calculate live database metrics across entire table for institutional dashboard
    const metricsSql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_test = 0 AND (is_archived = 0 OR is_archived IS NULL) THEN 1 ELSE 0 END) as genuine_total,
        SUM(CASE WHEN is_test = 1 AND (is_archived = 0 OR is_archived IS NULL) THEN 1 ELSE 0 END) as test_total,
        SUM(CASE WHEN type = 'investor' AND is_test = 0 AND (is_archived = 0 OR is_archived IS NULL) THEN 1 ELSE 0 END) as genuine_grievances,
        SUM(CASE WHEN type = 'business' AND is_test = 0 AND (is_archived = 0 OR is_archived IS NULL) THEN 1 ELSE 0 END) as genuine_enquiries,
        SUM(CASE WHEN status = 'new' AND is_test = 0 AND (is_archived = 0 OR is_archived IS NULL) THEN 1 ELSE 0 END) as genuine_new,
        SUM(CASE WHEN status = 'in_progress' AND is_test = 0 AND (is_archived = 0 OR is_archived IS NULL) THEN 1 ELSE 0 END) as genuine_in_progress,
        SUM(CASE WHEN status = 'resolved' AND is_test = 0 AND (is_archived = 0 OR is_archived IS NULL) THEN 1 ELSE 0 END) as genuine_resolved,
        SUM(CASE WHEN status = 'closed' AND is_test = 0 AND (is_archived = 0 OR is_archived IS NULL) THEN 1 ELSE 0 END) as genuine_closed,
        SUM(CASE WHEN is_archived = 1 THEN 1 ELSE 0 END) as archived_total
      FROM enquiries
    `;
    const [metrics] = await query(metricsSql);

    res.json({
      success: true,
      count: rows.length,
      data: rows,
      metrics: {
        total: Number(metrics?.total || 0),
        genuineTotal: Number(metrics?.genuine_total || 0),
        testTotal: Number(metrics?.test_total || 0),
        genuineGrievances: Number(metrics?.genuine_grievances || 0),
        genuineEnquiries: Number(metrics?.genuine_enquiries || 0),
        genuineNew: Number(metrics?.genuine_new || 0),
        genuineInProgress: Number(metrics?.genuine_in_progress || 0),
        genuineResolved: Number(metrics?.genuine_resolved || 0),
        genuineClosed: Number(metrics?.genuine_closed || 0),
        archivedTotal: Number(metrics?.archived_total || 0)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 3. GET SINGLE ENQUIRY DETAILS WITH FULL AUDIT HISTORY
 */
export async function getEnquiryDetails(req, res, next) {
  try {
    const { id } = req.params;
    const rows = await query(
      `SELECT 
        id, reference_no, type, name, email, phone, company_name,
        service_interest, estimated_capital, folio_or_dp_id,
        grievance_category, details, status, 
        COALESCE(resolution_notes, admin_notes) AS resolution_notes,
        COALESCE(admin_notes, resolution_notes) AS admin_notes,
        follow_up_date, is_archived, assigned_to, updated_by,
        is_test, ip_address, created_at, updated_at
       FROM enquiries 
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Enquiry or grievance record not found.' });
    }

    const item = rows[0];

    // Fetch action history / audit logs for this specific record
    const historyRows = await query(
      `SELECT al.id, al.action, al.details, al.created_at, u.name as user_name, u.email as user_email
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.entity_type = 'enquiry' AND al.entity_id = ?
       ORDER BY al.created_at DESC`,
      [id]
    );

    const history = historyRows.map((h) => ({
      id: h.id,
      action: h.action,
      details: typeof h.details === 'string' ? JSON.parse(h.details || '{}') : h.details,
      createdAt: h.created_at,
      userName: h.user_name || 'System / Staff',
      userEmail: h.user_email || 'staff'
    }));

    res.json({
      success: true,
      data: item,
      history
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 4. UPDATE ENQUIRY STATUS (WITH MANDATORY RESOLUTION NOTES GUARDRAIL)
 */
export async function updateEnquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes, resolutionNotes, followUpDate } = req.body;

    const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status parameter. Must be one of: ${validStatuses.join(', ')}.`
      });
    }

    // Retrieve existing record to inspect previous state
    const currentRows = await query('SELECT * FROM enquiries WHERE id = ?', [id]);
    if (currentRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Enquiry record not found.' });
    }
    const current = currentRows[0];

    // Accept both resolutionNotes and adminNotes interchangeably
    const incomingNotes = (resolutionNotes !== undefined && resolutionNotes !== null) 
      ? String(resolutionNotes).trim() 
      : ((adminNotes !== undefined && adminNotes !== null) ? String(adminNotes).trim() : null);

    const finalNotes = incomingNotes !== null ? incomingNotes : (current.resolution_notes || current.admin_notes || null);

    // Requirement 6 Guardrail: Require suitable resolution notes before marking Resolved
    if (status === 'resolved' && current.status !== 'resolved') {
      if (!finalNotes || finalNotes.trim().length < 5) {
        return res.status(400).json({
          success: false,
          error: 'Resolution notes are required before marking a complaint as Resolved. Please record the redressal actions taken, RTA communication, or investor response.'
        });
      }
    }

    const updatedFollowUp = followUpDate !== undefined ? (followUpDate ? String(followUpDate).trim() : null) : current.follow_up_date;

    await query(
      `UPDATE enquiries SET
        status = ?,
        resolution_notes = ?,
        admin_notes = ?,
        follow_up_date = ?,
        updated_by = ?
       WHERE id = ?`,
      [
        status,
        finalNotes,
        finalNotes,
        updatedFollowUp,
        req.user?.id || null,
        id
      ]
    );

    // Audit log
    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_ENQUIRY_STATUS',
      entityType: 'enquiry',
      entityId: id,
      details: {
        previousStatus: current.status,
        newStatus: status,
        resolutionNotes: finalNotes,
        followUpDate: updatedFollowUp
      },
      req
    });

    res.json({
      success: true,
      message: `Enquiry status updated to ${status.replace('_', ' ')}.`,
      status,
      resolutionNotes: finalNotes
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 5. ADD INTERNAL NOTE TO ENQUIRY
 */
export async function addEnquiryNote(req, res, next) {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !String(note).trim()) {
      return res.status(400).json({ success: false, error: 'Note text cannot be empty.' });
    }

    const rows = await query('SELECT * FROM enquiries WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }
    const current = rows[0];

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const actor = req.user?.email || 'Staff';
    const noteEntry = `[${timestamp} by ${actor}]: ${String(note).trim()}`;

    const existingNotes = current.resolution_notes || current.admin_notes || '';
    const newNotes = existingNotes ? `${existingNotes}\n\n${noteEntry}` : noteEntry;

    await query(
      `UPDATE enquiries SET
        resolution_notes = ?,
        admin_notes = ?,
        updated_by = ?
       WHERE id = ?`,
      [newNotes, newNotes, req.user.id, id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'ADD_ENQUIRY_NOTE',
      entityType: 'enquiry',
      entityId: id,
      details: { note: String(note).trim() },
      req
    });

    res.json({
      success: true,
      message: 'Internal note appended successfully.',
      notes: newNotes
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 6. SET OR UPDATE FOLLOW-UP DATE
 */
export async function setEnquiryFollowUp(req, res, next) {
  try {
    const { id } = req.params;
    const { followUpDate, notes } = req.body;

    const rows = await query('SELECT * FROM enquiries WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }
    const current = rows[0];

    const cleanDate = followUpDate ? String(followUpDate).trim() : null;

    let updatedNotes = current.resolution_notes || current.admin_notes || null;
    if (notes && String(notes).trim()) {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const noteEntry = `[${timestamp} Follow-up scheduled for ${cleanDate || 'None'}]: ${String(notes).trim()}`;
      updatedNotes = updatedNotes ? `${updatedNotes}\n\n${noteEntry}` : noteEntry;
    }

    await query(
      `UPDATE enquiries SET
        follow_up_date = ?,
        resolution_notes = ?,
        admin_notes = ?,
        updated_by = ?
       WHERE id = ?`,
      [cleanDate, updatedNotes, updatedNotes, req.user.id, id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'SET_FOLLOW_UP',
      entityType: 'enquiry',
      entityId: id,
      details: { followUpDate: cleanDate, notes },
      req
    });

    res.json({
      success: true,
      message: cleanDate ? `Follow-up date set to ${cleanDate}.` : 'Follow-up date cleared.',
      followUpDate: cleanDate,
      notes: updatedNotes
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 7. CLASSIFY RECORD (GENUINE VS TEST / ARCHIVE VS UNARCHIVE)
 */
export async function classifyEnquiry(req, res, next) {
  try {
    const { id } = req.params;
    const { is_test, is_archived } = req.body;

    const rows = await query('SELECT * FROM enquiries WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }
    const current = rows[0];

    const newIsTest = is_test !== undefined ? (is_test ? 1 : 0) : current.is_test;
    const newIsArchived = is_archived !== undefined ? (is_archived ? 1 : 0) : current.is_archived;

    await query(
      `UPDATE enquiries SET
        is_test = ?,
        is_archived = ?,
        updated_by = ?
       WHERE id = ?`,
      [newIsTest, newIsArchived, req.user.id, id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'CLASSIFY_ENQUIRY',
      entityType: 'enquiry',
      entityId: id,
      details: {
        previousIsTest: current.is_test,
        newIsTest,
        previousIsArchived: current.is_archived,
        newIsArchived
      },
      req
    });

    res.json({
      success: true,
      message: 'Record classification updated.',
      is_test: newIsTest,
      is_archived: newIsArchived
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 8. DELETE OR ARCHIVE ENQUIRY
 * Restricts permanent deletion of genuine investor complaints (Requirement 5).
 */
export async function deleteEnquiry(req, res, next) {
  try {
    const { id } = req.params;
    const { confirmPermanent } = req.body;

    const rows = await query('SELECT * FROM enquiries WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }
    const current = rows[0];

    // Check if record is a genuine investor grievance
    const isGenuineGrievance = current.type === 'investor' && !current.is_test;

    if (isGenuineGrievance) {
      // Deletion restricted to super_admin only, with explicit permanent confirmation
      if (req.user?.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          error: 'Statutory investor grievances cannot be permanently deleted by non-super-admin staff. You may archive the record instead.'
        });
      }

      if (!confirmPermanent) {
        // Safe default: Archive instead of deleting
        await query('UPDATE enquiries SET is_archived = 1, updated_by = ? WHERE id = ?', [req.user.id, id]);
        await logAudit({
          userId: req.user.id,
          action: 'ARCHIVE_GENUINE_GRIEVANCE',
          entityType: 'enquiry',
          entityId: id,
          details: { referenceNo: current.reference_no, reason: 'Archived pursuant to retention safety policy' },
          req
        });

        return res.json({
          success: true,
          message: 'Grievance archived safely. Retention audit history preserved.',
          archived: true
        });
      }
    }

    // Permanent deletion for test records, or super_admin confirmed deletion
    await query('DELETE FROM enquiries WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_ENQUIRY',
      entityType: 'enquiry',
      entityId: id,
      details: { referenceNo: current.reference_no, type: current.type, isTest: current.is_test },
      req
    });

    res.json({
      success: true,
      message: 'Record permanently removed.',
      deleted: true
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 9. GET RTA & CONTACT SETTINGS (DATABASE SINGLE SOURCE OF TRUTH)
 */
export async function getRtaContactInfo(req, res, next) {
  try {
    const rows = await query(
      "SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('investor_relations', 'company_profile')"
    );

    const settingsMap = {};
    for (const row of rows) {
      settingsMap[row.setting_key] = typeof row.setting_value === 'string'
        ? JSON.parse(row.setting_value)
        : row.setting_value;
    }

    const ir = settingsMap['investor_relations'] || {};
    const cp = settingsMap['company_profile'] || {};

    const data = {
      // RTA Coordinates
      rta_name: ir.rta_name || 'Bigshare Services Pvt. Ltd.',
      rta_address: ir.rta_address || 'Office No S6-2, 6th Floor, Pinnacle Business Park, Next to Ahura Centre, Mahakali Caves Road, Andheri (East), Mumbai - 400 093, Maharashtra',
      rta_phone: ir.rta_phone || '+91 22 6263 8200',
      rta_email: ir.rta_email || 'investor@bigshareonline.com',
      rta_website: ir.rta_website || 'https://www.bigshareonline.com',

      // Grievance Officer & Corporate Coordinates
      compliance_officer: ir.compliance_officer || 'Company Secretary & Compliance Officer',
      compliance_email: ir.compliance_email || 'compliance@amarnathsecuritiesltd.com',
      compliance_phone: ir.compliance_phone || '+91 22 2523 0048',
      grievance_email: ir.grievance_email || 'compliance@amarnathsecuritiesltd.com',
      reg_office: cp.reg_office || '1/104, Sarthik Complex, Nr. Fun Republic, Satellite Road, Ahmedabad, Gujarat - 380015',
      corp_office: cp.corp_office || 'Office A9, Ground Floor, Ellora Park, Near Damani Zapa, Killa Pardi, Valsad, Pardi, Gujarat - 396125',

      // Escalation Portals
      sebi_scores_url: ir.sebi_scores_url || 'https://scores.sebi.gov.in',
      sebi_smart_odr_url: ir.sebi_smart_odr_url || 'https://smartodr.in',
      bse_portal_url: ir.bse_portal_url || 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnat/538465/',

      // Institutional Audit Confirmation Statuses
      confirmations: {
        rta_appointment: {
          status: 'Pending Confirmation',
          description: 'Tripartite Agreement pursuant to SEBI circulars pending formal Company Secretary sign-off.',
          primary: 'Bigshare Services Pvt. Ltd. (Mumbai)',
          legacy: 'Purva Sharegistry (India) Pvt. Ltd.'
        },
        office_coordinates: {
          status: 'Pending Confirmation',
          description: 'Awaiting Form INC-22 board resolution confirmation between RoC Ahmedabad and Mumbai office.',
          registered: cp.reg_office || 'Sarthik Complex, Ahmedabad',
          corporate: cp.corp_office || 'Valsad, Gujarat'
        },
        grievance_email: {
          status: 'Pending Confirmation',
          description: 'Awaiting formal compliance officer mandate email confirmation.',
          institutional: ir.compliance_email || 'compliance@amarnathsecuritiesltd.com',
          historical: 'amarnathsecurities@gmail.com'
        }
      }
    };

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * 10. UPDATE RTA & CONTACT SETTINGS (RESTRICTED TO AUTHORIZED STAFF)
 */
export async function updateRtaContactInfo(req, res, next) {
  try {
    const {
      rta_name,
      rta_address,
      rta_phone,
      rta_email,
      rta_website,
      compliance_officer,
      compliance_email,
      compliance_phone,
      grievance_email,
      reg_office,
      corp_office,
      sebi_scores_url,
      sebi_smart_odr_url,
      bse_portal_url
    } = req.body;

    // Validate email addresses if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (rta_email && !emailRegex.test(rta_email.trim())) {
      return res.status(400).json({ success: false, error: 'Invalid RTA email format.' });
    }
    if (compliance_email && !emailRegex.test(compliance_email.trim())) {
      return res.status(400).json({ success: false, error: 'Invalid compliance email format.' });
    }
    if (grievance_email && !emailRegex.test(grievance_email.trim())) {
      return res.status(400).json({ success: false, error: 'Invalid grievance email format.' });
    }

    // Retrieve existing settings
    const rows = await query("SELECT setting_value FROM system_settings WHERE setting_key = 'investor_relations'");
    let currentIr = {};
    if (rows.length > 0) {
      currentIr = typeof rows[0].setting_value === 'string'
        ? JSON.parse(rows[0].setting_value)
        : rows[0].setting_value;
    }

    const updatedIr = {
      ...currentIr,
      rta_name: rta_name !== undefined ? String(rta_name).trim() : currentIr.rta_name,
      rta_address: rta_address !== undefined ? String(rta_address).trim() : currentIr.rta_address,
      rta_phone: rta_phone !== undefined ? String(rta_phone).trim() : currentIr.rta_phone,
      rta_email: rta_email !== undefined ? String(rta_email).trim().toLowerCase() : currentIr.rta_email,
      rta_website: rta_website !== undefined ? String(rta_website).trim() : currentIr.rta_website,
      compliance_officer: compliance_officer !== undefined ? String(compliance_officer).trim() : currentIr.compliance_officer,
      compliance_email: compliance_email !== undefined ? String(compliance_email).trim().toLowerCase() : currentIr.compliance_email,
      compliance_phone: compliance_phone !== undefined ? String(compliance_phone).trim() : currentIr.compliance_phone,
      grievance_email: grievance_email !== undefined ? String(grievance_email).trim().toLowerCase() : currentIr.grievance_email,
      sebi_scores_url: sebi_scores_url !== undefined ? String(sebi_scores_url).trim() : currentIr.sebi_scores_url,
      sebi_smart_odr_url: sebi_smart_odr_url !== undefined ? String(sebi_smart_odr_url).trim() : currentIr.sebi_smart_odr_url,
      bse_portal_url: bse_portal_url !== undefined ? String(bse_portal_url).trim() : currentIr.bse_portal_url
    };

    // Update system_settings
    await query(
      `INSERT INTO system_settings (setting_key, setting_value, category, description, updated_by)
       VALUES ('investor_relations', ?, 'investor', 'Designated grievance redressal and Registrar details', ?)
       ON DUPLICATE KEY UPDATE 
         setting_value = VALUES(setting_value),
         updated_by = VALUES(updated_by),
         updated_at = NOW()`,
      [JSON.stringify(updatedIr), req.user.id]
    );

    // Keep company_profile columns synchronized
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
        reg_office = COALESCE(?, reg_office),
        corp_office = COALESCE(?, corp_office),
        sebi_scores_url = COALESCE(?, sebi_scores_url),
        sebi_smart_odr_url = COALESCE(?, sebi_smart_odr_url),
        bse_portal_url = COALESCE(?, bse_portal_url),
        updated_by = ?
       WHERE id = 1`,
      [
        updatedIr.compliance_officer,
        updatedIr.compliance_email,
        updatedIr.compliance_phone,
        updatedIr.rta_name,
        updatedIr.rta_address,
        updatedIr.rta_email,
        updatedIr.rta_phone,
        updatedIr.rta_website,
        reg_office ? String(reg_office).trim() : null,
        corp_office ? String(corp_office).trim() : null,
        updatedIr.sebi_scores_url,
        updatedIr.sebi_smart_odr_url,
        updatedIr.bse_portal_url,
        req.user.id
      ]
    );

    // Log audit trail
    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_RTA_CONTACT_CONFIG',
      entityType: 'system_settings',
      entityId: 'investor_relations',
      details: { updated: updatedIr },
      req
    });

    res.json({
      success: true,
      message: 'RTA and contact information updated and synchronized across all portals.',
      data: updatedIr
    });
  } catch (err) {
    next(err);
  }
}
