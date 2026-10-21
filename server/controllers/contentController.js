import { query, transaction } from '../config/db.js';
import { logAudit } from '../utils/auditLogger.js';

// -------------------------------------------------------------
// 1. COMPANY PROFILE (Dynamic institutional settings sync)
// -------------------------------------------------------------
export async function getCompanyProfile(req, res, next) {
  try {
    const rows = await query('SELECT * FROM company_profile WHERE status = "published" LIMIT 1');
    const legacy = rows.length > 0 ? rows[0] : {};

    // Retrieve live configuration from system_settings
    const settingsRows = await query(
      "SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('company_profile', 'investor_relations', 'website_seo')"
    );
    const settingsMap = {};
    for (const row of settingsRows) {
      settingsMap[row.setting_key] = typeof row.setting_value === 'string'
        ? JSON.parse(row.setting_value)
        : row.setting_value;
    }

    const cp = settingsMap['company_profile'] || {};
    const ir = settingsMap['investor_relations'] || {};

    // Combine legacy record and system settings with priority to explicit admin settings
    const combined = {
      // Identity & Statutory
      name: cp.company_name || legacy.company_name || 'Amarnath Securities Limited',
      company_name: cp.company_name || legacy.company_name || 'Amarnath Securities Limited',
      shortName: legacy.short_name || 'Amarnath Securities',
      short_name: legacy.short_name || 'Amarnath Securities',
      cin: cp.cin || legacy.cin || 'L67120GJ1994PLC023254',
      bseScripCode: cp.bse_scrip_code || legacy.bse_scrip_code || '538465',
      bse_scrip_code: cp.bse_scrip_code || legacy.bse_scrip_code || '538465',
      isin: cp.isin || legacy.isin || 'INE745P01010',
      tagline: legacy.tagline || 'Capital. Strategy. Opportunity.',
      trustLine: legacy.trust_line || 'BSE Listed • Since 1994 • Scrip Code 538465',
      trust_line: legacy.trust_line || 'BSE Listed • Since 1994 • Scrip Code 538465',
      corePositioning: legacy.core_positioning || 'Corporate Evolution, Strategic Opportunities & Sustainable Growth',
      core_positioning: legacy.core_positioning || 'Corporate Evolution, Strategic Opportunities & Sustainable Growth',
      foundedYear: legacy.founded_year || '1994',
      founded_year: legacy.founded_year || '1994',

      // Direct Contact
      email: cp.email || legacy.email || 'compliance@amarnathsecuritiesltd.com',
      phone: cp.phone || legacy.phone || '+91 99309 82815',
      website: cp.website || legacy.website || 'https://www.amarnathsecuritiesltd.com',

      // Physical Coordinates
      regOffice: cp.reg_office || legacy.reg_office || '1/104, Sarthik Complex, Nr. Fun Republic, Satellite Road, Ahmedabad, Gujarat - 380015',
      reg_office: cp.reg_office || legacy.reg_office || '1/104, Sarthik Complex, Nr. Fun Republic, Satellite Road, Ahmedabad, Gujarat - 380015',
      corpOffice: cp.corp_office || legacy.corp_office || 'Office A9, Ground Floor, Ellora Park, Near Damani Zapa, Killa Pardi, Valsad, Pardi, Gujarat - 396125',
      corp_office: cp.corp_office || legacy.corp_office || 'Office A9, Ground Floor, Ellora Park, Near Damani Zapa, Killa Pardi, Valsad, Pardi, Gujarat - 396125',

      // Compliance Officer
      complianceOfficer: ir.compliance_officer || legacy.compliance_officer || 'Company Secretary & Compliance Officer',
      compliance_officer: ir.compliance_officer || legacy.compliance_officer || 'Company Secretary & Compliance Officer',
      complianceDesignation: legacy.compliance_designation || 'Company Secretary & Compliance Officer',
      compliance_designation: legacy.compliance_designation || 'Company Secretary & Compliance Officer',
      complianceEmail: ir.compliance_email || legacy.compliance_email || 'compliance@amarnathsecuritiesltd.com',
      compliance_email: ir.compliance_email || legacy.compliance_email || 'compliance@amarnathsecuritiesltd.com',
      compliancePhone: ir.compliance_phone || legacy.compliance_phone || '+91 22 2523 0048',
      compliance_phone: ir.compliance_phone || legacy.compliance_phone || '+91 22 2523 0048',

      // Registrar and Share Transfer Agent (RTA)
      rtaName: ir.rta_name || legacy.rta_name || 'Bigshare Services Pvt. Ltd.',
      rta_name: ir.rta_name || legacy.rta_name || 'Bigshare Services Pvt. Ltd.',
      rtaHistoricalLiaison: legacy.rta_historical_liaison || 'Purva Sharegistry (India) Pvt. Ltd.',
      rta_historical_liaison: legacy.rta_historical_liaison || 'Purva Sharegistry (India) Pvt. Ltd.',
      rtaAddress: ir.rta_address || legacy.rta_address || 'Office No S6-2, 6th Floor, Pinnacle Business Park, Next to Ahura Centre, Mahakali Caves Road, Andheri (East), Mumbai - 400 093, Maharashtra',
      rta_address: ir.rta_address || legacy.rta_address || 'Office No S6-2, 6th Floor, Pinnacle Business Park, Next to Ahura Centre, Mahakali Caves Road, Andheri (East), Mumbai - 400 093, Maharashtra',
      rtaEmail: ir.rta_email || legacy.rta_email || 'investor@bigshareonline.com',
      rta_email: ir.rta_email || legacy.rta_email || 'investor@bigshareonline.com',
      rtaPhone: ir.rta_phone || legacy.rta_phone || '+91 22 6263 8200',
      rta_phone: ir.rta_phone || legacy.rta_phone || '+91 22 6263 8200',
      rtaWebsite: ir.rta_website || legacy.rta_website || 'https://www.bigshareonline.com',
      rta_website: ir.rta_website || legacy.rta_website || 'https://www.bigshareonline.com',

      // Regulatory Portals
      sebiScoresUrl: ir.sebi_scores_url || legacy.sebi_scores_url || 'https://scores.sebi.gov.in',
      sebi_scores_url: ir.sebi_scores_url || legacy.sebi_scores_url || 'https://scores.sebi.gov.in',
      sebiSmartOdrUrl: ir.sebi_smart_odr_url || legacy.sebi_smart_odr_url || 'https://smartodr.in',
      sebi_smart_odr_url: ir.sebi_smart_odr_url || legacy.sebi_smart_odr_url || 'https://smartodr.in',
      bsePortalUrl: ir.bse_portal_url || legacy.bse_portal_url || 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
      bse_portal_url: ir.bse_portal_url || legacy.bse_portal_url || 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',

      // Metadata
      updated_at: legacy.updated_at || new Date().toISOString()
    };

    res.json({ success: true, data: combined });
  } catch (err) {
    next(err);
  }
}

export async function updateCompanyProfile(req, res, next) {
  try {
    const p = req.body;

    const existingRows = await query('SELECT * FROM company_profile WHERE id = 1');
    const oldProfile = existingRows.length > 0 ? existingRows[0] : {};

    await query(
      `UPDATE company_profile SET
        cin = COALESCE(?, cin),
        bse_scrip_code = COALESCE(?, bse_scrip_code),
        isin = COALESCE(?, isin),
        company_name = COALESCE(?, company_name),
        short_name = COALESCE(?, short_name),
        tagline = COALESCE(?, tagline),
        trust_line = COALESCE(?, trust_line),
        core_positioning = COALESCE(?, core_positioning),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        compliance_officer = COALESCE(?, compliance_officer),
        compliance_designation = COALESCE(?, compliance_designation),
        compliance_email = COALESCE(?, compliance_email),
        compliance_phone = COALESCE(?, compliance_phone),
        reg_office = COALESCE(?, reg_office),
        corp_office = COALESCE(?, corp_office),
        rta_name = COALESCE(?, rta_name),
        rta_address = COALESCE(?, rta_address),
        rta_email = COALESCE(?, rta_email),
        rta_phone = COALESCE(?, rta_phone),
        rta_website = COALESCE(?, rta_website),
        updated_by = ?
       WHERE id = 1`,
      [
        p.cin, p.bse_scrip_code, p.isin, p.company_name, p.short_name, p.tagline,
        p.trust_line, p.core_positioning, p.email, p.phone, p.compliance_officer,
        p.compliance_designation, p.compliance_email, p.compliance_phone,
        p.reg_office, p.corp_office, p.rta_name, p.rta_address, p.rta_email,
        p.rta_phone, p.rta_website, req.user.id
      ]
    );

    // Keep system_settings company_profile in sync
    const [sysRows] = await query("SELECT setting_value FROM system_settings WHERE setting_key = 'company_profile'");
    const currentSys = sysRows && sysRows.setting_value ? JSON.parse(sysRows.setting_value) : {};
    const updatedSys = {
      ...currentSys,
      ...(p.company_name && { company_name: p.company_name }),
      ...(p.cin && { cin: p.cin }),
      ...(p.bse_scrip_code && { bse_scrip_code: p.bse_scrip_code }),
      ...(p.isin && { isin: p.isin }),
      ...(p.reg_office && { reg_office: p.reg_office }),
      ...(p.corp_office && { corp_office: p.corp_office }),
      ...(p.email && { email: p.email }),
      ...(p.phone && { phone: p.phone })
    };
    await query(
      "UPDATE system_settings SET setting_value = ?, updated_by = ?, updated_at = NOW() WHERE setting_key = 'company_profile'",
      [JSON.stringify(updatedSys), req.user.id]
    );

    // Compute diff for audit log
    const changes = {};
    for (const key of Object.keys(p)) {
      if (oldProfile[key] !== undefined && String(oldProfile[key]) !== String(p[key])) {
        changes[key] = { from: oldProfile[key], to: p[key] };
      }
    }

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_COMPANY_PROFILE',
      entityType: 'company_profile',
      entityId: '1',
      details: {
        summary: `Updated Company Profile (${Object.keys(changes).length} field(s) modified)`,
        changedFields: Object.keys(changes),
        changes: Object.keys(changes).length > 0 ? changes : 'No fields modified',
        newValues: p,
        previousValues: oldProfile
      },
      req
    });

    const updated = await query('SELECT * FROM company_profile WHERE id = 1');
    res.json({ success: true, message: 'Company profile updated successfully.', data: updated[0] });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// 2. DIRECTORS
// -------------------------------------------------------------
export async function getDirectors(req, res, next) {
  try {
    const isAdmin = Boolean(req.user);
    const { status } = req.query;

    let sql = 'SELECT * FROM directors';
    const params = [];

    if (!isAdmin) {
      sql += ' WHERE status = "published"';
    } else if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY sort_order ASC, name ASC';

    const rows = await query(sql, params);

    const data = rows.map((d) => {
      const otherDirs = typeof d.other_directorships === 'string'
        ? JSON.parse(d.other_directorships)
        : d.other_directorships || [];
      const commMembers = typeof d.committee_memberships === 'string'
        ? JSON.parse(d.committee_memberships)
        : d.committee_memberships || [];

      return {
        ...d,
        appointmentDate: d.appointment_date || '',
        appointment_date: d.appointment_date || '',
        otherDirectorships: otherDirs,
        other_directorships: otherDirs,
        committeeMemberships: commMembers,
        committee_memberships: commMembers,
        verified: Boolean(d.is_verified),
        is_verified: Boolean(d.is_verified),
        approvalStatus: d.approval_status,
        approval_status: d.approval_status,
        term: d.term || '',
        sortOrder: d.sort_order,
        sort_order: d.sort_order,
        status: d.status
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createDirector(req, res, next) {
  try {
    const d = req.body;

    if (!d.name || !d.name.trim()) {
      return res.status(400).json({ success: false, error: 'Director name is required.' });
    }
    if (!d.designation || !d.designation.trim()) {
      return res.status(400).json({ success: false, error: 'Designation is required.' });
    }
    if (!d.category || !d.category.trim()) {
      return res.status(400).json({ success: false, error: 'Category is required.' });
    }
    if (!d.din || !d.din.trim()) {
      return res.status(400).json({ success: false, error: 'DIN is required.' });
    }

    // Check for duplicate DIN if an actual number is provided
    const cleanDin = d.din.trim();
    if (!cleanDin.toLowerCase().includes('pending') && cleanDin !== 'N/A') {
      const existing = await query('SELECT id, name FROM directors WHERE din = ?', [cleanDin]);
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          error: `A director record already exists with DIN ${cleanDin} (${existing[0].name}).`
        });
      }
    }

    const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = d.id || `dir-${slug}-${Date.now().toString().slice(-4)}`;

    const otherDirs = d.other_directorships || d.otherDirectorships || [];
    const commMemberships = d.committee_memberships || d.committeeMemberships || [];
    const status = d.status || 'published';
    const isVerified = Boolean(d.is_verified ?? d.verified ?? false);
    const approvalStatus = d.approval_status || d.approvalStatus || (isVerified ? 'Verified against MCA / BSE Records' : 'Subject to Company / CS Confirmation');

    await query(
      `INSERT INTO directors (
        id, name, designation, category, din, appointment_date, term, bio,
        other_directorships, committee_memberships, is_verified, approval_status, sort_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        d.name.trim(),
        d.designation.trim(),
        d.category.trim(),
        cleanDin,
        d.appointment_date || d.appointmentDate || null,
        d.term || null,
        d.bio || '',
        JSON.stringify(otherDirs),
        JSON.stringify(commMemberships),
        isVerified,
        approvalStatus,
        d.sort_order ?? 0,
        status
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_DIRECTOR',
      entityType: 'director',
      entityId: id,
      details: { name: d.name, designation: d.designation, din: cleanDin, status },
      req
    });

    res.status(201).json({ success: true, message: 'Director profile created successfully.', id });
  } catch (err) {
    next(err);
  }
}

export async function updateDirector(req, res, next) {
  try {
    const { id } = req.params;
    const d = req.body;

    const existingRows = await query('SELECT * FROM directors WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Director record not found.' });
    }
    const current = existingRows[0];

    // Check duplicate DIN if changed
    if (d.din && d.din.trim() !== current.din) {
      const cleanDin = d.din.trim();
      if (!cleanDin.toLowerCase().includes('pending') && cleanDin !== 'N/A') {
        const dup = await query('SELECT id, name FROM directors WHERE din = ? AND id != ?', [cleanDin, id]);
        if (dup.length > 0) {
          return res.status(400).json({
            success: false,
            error: `Another director record already exists with DIN ${cleanDin} (${dup[0].name}).`
          });
        }
      }
    }

    const otherDirs = d.other_directorships !== undefined
      ? d.other_directorships
      : d.otherDirectorships !== undefined
        ? d.otherDirectorships
        : undefined;

    const commMemberships = d.committee_memberships !== undefined
      ? d.committee_memberships
      : d.committeeMemberships !== undefined
        ? d.committeeMemberships
        : undefined;

    const isVerified = d.is_verified !== undefined
      ? Boolean(d.is_verified)
      : d.verified !== undefined
        ? Boolean(d.verified)
        : current.is_verified;

    await query(
      `UPDATE directors SET
        name = COALESCE(?, name),
        designation = COALESCE(?, designation),
        category = COALESCE(?, category),
        din = COALESCE(?, din),
        appointment_date = COALESCE(?, appointment_date),
        term = COALESCE(?, term),
        bio = COALESCE(?, bio),
        other_directorships = COALESCE(?, other_directorships),
        committee_memberships = COALESCE(?, committee_memberships),
        is_verified = ?,
        approval_status = COALESCE(?, approval_status),
        sort_order = COALESCE(?, sort_order),
        status = COALESCE(?, status),
        updated_at = NOW()
       WHERE id = ?`,
      [
        d.name !== undefined ? d.name.trim() : null,
        d.designation !== undefined ? d.designation.trim() : null,
        d.category !== undefined ? d.category.trim() : null,
        d.din !== undefined ? d.din.trim() : null,
        d.appointment_date !== undefined ? d.appointment_date : d.appointmentDate,
        d.term,
        d.bio,
        otherDirs !== undefined ? JSON.stringify(otherDirs) : null,
        commMemberships !== undefined ? JSON.stringify(commMemberships) : null,
        isVerified,
        d.approval_status !== undefined ? d.approval_status : d.approvalStatus,
        d.sort_order !== undefined ? d.sort_order : d.sortOrder,
        d.status,
        id
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_DIRECTOR',
      entityType: 'director',
      entityId: id,
      details: { id, changes: d },
      req
    });

    const [updated] = await query('SELECT * FROM directors WHERE id = ?', [id]);
    res.json({ success: true, message: 'Director profile updated successfully.', data: updated });
  } catch (err) {
    next(err);
  }
}

export async function archiveDirector(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name FROM directors WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Director record not found.' });
    }

    await query('UPDATE directors SET status = "archived", updated_at = NOW() WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'ARCHIVE_DIRECTOR',
      entityType: 'director',
      entityId: id,
      details: { name: existing[0].name },
      req
    });

    res.json({ success: true, message: `Director ${existing[0].name} has been archived.` });
  } catch (err) {
    next(err);
  }
}

export async function restoreDirector(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name FROM directors WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Director record not found.' });
    }

    await query('UPDATE directors SET status = "published", updated_at = NOW() WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'RESTORE_DIRECTOR',
      entityType: 'director',
      entityId: id,
      details: { name: existing[0].name },
      req
    });

    res.json({ success: true, message: `Director ${existing[0].name} has been restored to published status.` });
  } catch (err) {
    next(err);
  }
}

export async function deleteDirector(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name FROM directors WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Director record not found.' });
    }

    await query('DELETE FROM directors WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_DIRECTOR',
      entityType: 'director',
      entityId: id,
      details: { name: existing[0].name },
      req
    });

    res.json({ success: true, message: `Director ${existing[0].name} removed successfully.` });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// 3. BOARD COMMITTEES
// -------------------------------------------------------------
export async function getCommittees(req, res, next) {
  try {
    const isAdmin = Boolean(req.user);
    const { status } = req.query;

    let sql = 'SELECT * FROM board_committees';
    const params = [];

    if (!isAdmin) {
      sql += ' WHERE status = "published"';
    } else if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY sort_order ASC, name ASC';

    const committees = await query(sql, params);

    // Attach members
    const allMembers = await query('SELECT * FROM committee_members ORDER BY sort_order ASC, name ASC');

    const data = committees.map((c) => {
      const keyResp = typeof c.key_responsibilities === 'string'
        ? JSON.parse(c.key_responsibilities)
        : c.key_responsibilities || [];

      const membersList = allMembers
        .filter((m) => m.committee_id === c.id)
        .map((m) => ({
          name: m.name,
          designation: m.designation,
          role: m.role || 'Member',
          category: m.category,
          sort_order: m.sort_order
        }));

      return {
        ...c,
        shortName: c.short_name,
        short_name: c.short_name,
        compositionRule: c.composition_rule,
        composition_rule: c.composition_rule,
        statutoryReference: c.statutory_reference,
        statutory_reference: c.statutory_reference,
        meetingsFrequency: c.meetings_frequency,
        meetings_frequency: c.meetings_frequency,
        keyResponsibilities: keyResp,
        key_responsibilities: keyResp,
        chairperson: {
          name: c.chairperson_name,
          designation: c.chairperson_designation,
          role: c.chairperson_role || 'Chairperson',
          category: c.chairperson_category
        },
        chairperson_name: c.chairperson_name,
        chairperson_designation: c.chairperson_designation,
        chairperson_role: c.chairperson_role || 'Chairperson',
        chairperson_category: c.chairperson_category,
        members: membersList,
        sortOrder: c.sort_order,
        sort_order: c.sort_order,
        status: c.status
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createCommittee(req, res, next) {
  try {
    const c = req.body;

    if (!c.name || !c.name.trim()) {
      return res.status(400).json({ success: false, error: 'Committee name is required.' });
    }
    if (!c.short_name && !c.shortName) {
      return res.status(400).json({ success: false, error: 'Short name is required.' });
    }
    if (!c.mandate || !c.mandate.trim()) {
      return res.status(400).json({ success: false, error: 'Committee mandate is required.' });
    }
    if (!c.chairperson_name && !c.chairperson?.name) {
      return res.status(400).json({ success: false, error: 'Chairperson name is required.' });
    }

    const shortName = (c.short_name || c.shortName).trim();
    const slug = shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = c.id || `comm-${slug}-${Date.now().toString().slice(-4)}`;

    const chairpersonName = c.chairperson_name || c.chairperson?.name || '';
    const chairpersonDesignation = c.chairperson_designation || c.chairperson?.designation || 'Director';
    const chairpersonRole = c.chairperson_role || c.chairperson?.role || 'Chairperson';
    const chairpersonCategory = c.chairperson_category || c.chairperson?.category || 'Independent Director';
    const compositionRule = c.composition_rule || c.compositionRule || 'Majority independent directors';
    const statutoryRef = c.statutory_reference || c.statutoryReference || 'Companies Act 2013 / SEBI LODR';
    const meetingsFreq = c.meetings_frequency || c.meetingsFrequency || 'Quarterly (minimum 4 meetings per year)';
    const keyResp = c.key_responsibilities || c.keyResponsibilities || [];
    const status = c.status || 'published';

    await transaction(async (conn) => {
      await conn.query(
        `INSERT INTO board_committees (
          id, name, short_name, mandate, composition_rule, statutory_reference,
          chairperson_name, chairperson_designation, chairperson_role, chairperson_category,
          meetings_frequency, key_responsibilities, sort_order, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          c.name.trim(),
          shortName,
          c.mandate.trim(),
          compositionRule,
          statutoryRef,
          chairpersonName,
          chairpersonDesignation,
          chairpersonRole,
          chairpersonCategory,
          meetingsFreq,
          JSON.stringify(keyResp),
          c.sort_order ?? 0,
          status
        ]
      );

      if (Array.isArray(c.members) && c.members.length > 0) {
        for (let i = 0; i < c.members.length; i++) {
          const m = c.members[i];
          if (m && m.name) {
            await conn.query(
              `INSERT INTO committee_members (committee_id, name, designation, role, category, sort_order)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [id, m.name.trim(), m.designation || 'Director', m.role || 'Member', m.category || 'Director', i]
            );
          }
        }
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_COMMITTEE',
      entityType: 'board_committee',
      entityId: id,
      details: { name: c.name, chairpersonName, status },
      req
    });

    res.status(201).json({ success: true, message: 'Board committee created successfully.', id });
  } catch (err) {
    next(err);
  }
}

export async function updateCommittee(req, res, next) {
  try {
    const { id } = req.params;
    const c = req.body;

    const existing = await query('SELECT * FROM board_committees WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Board committee not found.' });
    }

    const shortName = c.short_name !== undefined ? c.short_name : c.shortName;
    const compositionRule = c.composition_rule !== undefined ? c.composition_rule : c.compositionRule;
    const statutoryRef = c.statutory_reference !== undefined ? c.statutory_reference : c.statutoryReference;
    const meetingsFreq = c.meetings_frequency !== undefined ? c.meetings_frequency : c.meetingsFrequency;
    const keyResp = c.key_responsibilities !== undefined ? c.key_responsibilities : c.keyResponsibilities;

    const chairpersonName = c.chairperson_name !== undefined ? c.chairperson_name : c.chairperson?.name;
    const chairpersonDesignation = c.chairperson_designation !== undefined ? c.chairperson_designation : c.chairperson?.designation;
    const chairpersonRole = c.chairperson_role !== undefined ? c.chairperson_role : c.chairperson?.role;
    const chairpersonCategory = c.chairperson_category !== undefined ? c.chairperson_category : c.chairperson?.category;

    await transaction(async (conn) => {
      await conn.query(
        `UPDATE board_committees SET
          name = COALESCE(?, name),
          short_name = COALESCE(?, short_name),
          mandate = COALESCE(?, mandate),
          composition_rule = COALESCE(?, composition_rule),
          statutory_reference = COALESCE(?, statutory_reference),
          chairperson_name = COALESCE(?, chairperson_name),
          chairperson_designation = COALESCE(?, chairperson_designation),
          chairperson_role = COALESCE(?, chairperson_role),
          chairperson_category = COALESCE(?, chairperson_category),
          meetings_frequency = COALESCE(?, meetings_frequency),
          key_responsibilities = COALESCE(?, key_responsibilities),
          sort_order = COALESCE(?, sort_order),
          status = COALESCE(?, status),
          updated_at = NOW()
         WHERE id = ?`,
        [
          c.name !== undefined ? c.name.trim() : null,
          shortName !== undefined ? shortName.trim() : null,
          c.mandate !== undefined ? c.mandate.trim() : null,
          compositionRule,
          statutoryRef,
          chairpersonName,
          chairpersonDesignation,
          chairpersonRole,
          chairpersonCategory,
          meetingsFreq,
          keyResp !== undefined ? JSON.stringify(keyResp) : null,
          c.sort_order,
          c.status,
          id
        ]
      );

      // Replace members if array provided
      if (Array.isArray(c.members)) {
        await conn.query('DELETE FROM committee_members WHERE committee_id = ?', [id]);
        for (let i = 0; i < c.members.length; i++) {
          const m = c.members[i];
          if (m && m.name) {
            await conn.query(
              `INSERT INTO committee_members (committee_id, name, designation, role, category, sort_order)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [id, m.name.trim(), m.designation || 'Director', m.role || 'Member', m.category || 'Director', i]
            );
          }
        }
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_COMMITTEE',
      entityType: 'board_committee',
      entityId: id,
      details: c,
      req
    });

    res.json({ success: true, message: 'Board committee updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function archiveCommittee(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name FROM board_committees WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Board committee not found.' });
    }

    await query('UPDATE board_committees SET status = "archived", updated_at = NOW() WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'ARCHIVE_COMMITTEE',
      entityType: 'board_committee',
      entityId: id,
      details: { name: existing[0].name },
      req
    });

    res.json({ success: true, message: `Committee ${existing[0].name} has been archived.` });
  } catch (err) {
    next(err);
  }
}

export async function restoreCommittee(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name FROM board_committees WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Board committee not found.' });
    }

    await query('UPDATE board_committees SET status = "published", updated_at = NOW() WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'RESTORE_COMMITTEE',
      entityType: 'board_committee',
      entityId: id,
      details: { name: existing[0].name },
      req
    });

    res.json({ success: true, message: `Committee ${existing[0].name} has been restored to published status.` });
  } catch (err) {
    next(err);
  }
}

export async function deleteCommittee(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name FROM board_committees WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Board committee not found.' });
    }

    await transaction(async (conn) => {
      await conn.query('DELETE FROM committee_members WHERE committee_id = ?', [id]);
      await conn.query('DELETE FROM board_committees WHERE id = ?', [id]);
    });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_COMMITTEE',
      entityType: 'board_committee',
      entityId: id,
      details: { name: existing[0].name },
      req
    });

    res.json({ success: true, message: `Committee ${existing[0].name} removed successfully.` });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// 4. KMP CONTACTS
// -------------------------------------------------------------
export async function getKmpContacts(req, res, next) {
  try {
    const isAdmin = Boolean(req.user);
    const { status } = req.query;

    let sql = 'SELECT * FROM kmp_contacts';
    const params = [];

    if (!isAdmin) {
      sql += ' WHERE status = "published"';
    } else if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY sort_order ASC, role_title ASC';

    const rows = await query(sql, params);

    const data = rows.map((k) => ({
      ...k,
      role: k.role_title,
      role_title: k.role_title,
      authorityScope: k.authority_scope,
      authority_scope: k.authority_scope,
      statutoryReference: k.statutory_reference,
      statutory_reference: k.statutory_reference,
      verified: Boolean(k.is_verified),
      is_verified: Boolean(k.is_verified),
      sortOrder: k.sort_order,
      sort_order: k.sort_order,
      status: k.status
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createKmpContact(req, res, next) {
  try {
    const k = req.body;

    const roleTitle = (k.role_title || k.role || '').trim();
    if (!roleTitle) {
      return res.status(400).json({ success: false, error: 'Role title is required.' });
    }
    if (!k.name || !k.name.trim()) {
      return res.status(400).json({ success: false, error: 'Contact name is required.' });
    }
    if (!k.designation || !k.designation.trim()) {
      return res.status(400).json({ success: false, error: 'Designation is required.' });
    }
    if (!k.email || !k.email.trim()) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const slug = roleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = k.id || `kmp-${slug}-${Date.now().toString().slice(-4)}`;

    const authScope = k.authority_scope || k.authorityScope || 'Key Managerial Personnel';
    const statRef = k.statutory_reference || k.statutoryReference || 'Regulation 30(5) SEBI LODR';
    const isVerified = Boolean(k.is_verified ?? k.verified ?? false);
    const status = k.status || 'published';

    await query(
      `INSERT INTO kmp_contacts (
        id, role_title, name, designation, email, phone, address,
        authority_scope, statutory_reference, is_verified, sort_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        roleTitle,
        k.name.trim(),
        k.designation.trim(),
        k.email.trim(),
        k.phone ? k.phone.trim() : '+91 22 2523 0048',
        k.address ? k.address.trim() : '',
        authScope,
        statRef,
        isVerified,
        k.sort_order ?? 0,
        status
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_KMP',
      entityType: 'kmp_contact',
      entityId: id,
      details: { roleTitle, name: k.name, status },
      req
    });

    res.status(201).json({ success: true, message: 'KMP contact created successfully.', id });
  } catch (err) {
    next(err);
  }
}

export async function updateKmpContact(req, res, next) {
  try {
    const { id } = req.params;
    const k = req.body;

    const existing = await query('SELECT * FROM kmp_contacts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'KMP contact not found.' });
    }

    const roleTitle = k.role_title !== undefined ? k.role_title : k.role;
    const authScope = k.authority_scope !== undefined ? k.authority_scope : k.authorityScope;
    const statRef = k.statutory_reference !== undefined ? k.statutory_reference : k.statutoryReference;
    const isVerified = k.is_verified !== undefined ? Boolean(k.is_verified) : k.verified !== undefined ? Boolean(k.verified) : undefined;

    await query(
      `UPDATE kmp_contacts SET
        role_title = COALESCE(?, role_title),
        name = COALESCE(?, name),
        designation = COALESCE(?, designation),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        authority_scope = COALESCE(?, authority_scope),
        statutory_reference = COALESCE(?, statutory_reference),
        is_verified = COALESCE(?, is_verified),
        sort_order = COALESCE(?, sort_order),
        status = COALESCE(?, status),
        updated_at = NOW()
       WHERE id = ?`,
      [
        roleTitle !== undefined ? roleTitle.trim() : null,
        k.name !== undefined ? k.name.trim() : null,
        k.designation !== undefined ? k.designation.trim() : null,
        k.email !== undefined ? k.email.trim() : null,
        k.phone !== undefined ? k.phone.trim() : null,
        k.address !== undefined ? k.address.trim() : null,
        authScope,
        statRef,
        isVerified,
        k.sort_order,
        k.status,
        id
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_KMP',
      entityType: 'kmp_contact',
      entityId: id,
      details: k,
      req
    });

    const [updated] = await query('SELECT * FROM kmp_contacts WHERE id = ?', [id]);
    res.json({ success: true, message: 'KMP details updated successfully.', data: updated });
  } catch (err) {
    next(err);
  }
}

export async function archiveKmpContact(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name, role_title FROM kmp_contacts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'KMP contact not found.' });
    }

    await query('UPDATE kmp_contacts SET status = "archived", updated_at = NOW() WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'ARCHIVE_KMP',
      entityType: 'kmp_contact',
      entityId: id,
      details: { name: existing[0].name, role: existing[0].role_title },
      req
    });

    res.json({ success: true, message: `KMP ${existing[0].name} has been archived.` });
  } catch (err) {
    next(err);
  }
}

export async function restoreKmpContact(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name, role_title FROM kmp_contacts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'KMP contact not found.' });
    }

    await query('UPDATE kmp_contacts SET status = "published", updated_at = NOW() WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'RESTORE_KMP',
      entityType: 'kmp_contact',
      entityId: id,
      details: { name: existing[0].name, role: existing[0].role_title },
      req
    });

    res.json({ success: true, message: `KMP ${existing[0].name} has been restored to published status.` });
  } catch (err) {
    next(err);
  }
}

export async function deleteKmpContact(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, name, role_title FROM kmp_contacts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'KMP contact not found.' });
    }

    await query('DELETE FROM kmp_contacts WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_KMP',
      entityType: 'kmp_contact',
      entityId: id,
      details: { name: existing[0].name, role: existing[0].role_title },
      req
    });

    res.json({ success: true, message: `KMP ${existing[0].name} removed successfully.` });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// 5. REGULATION 46 CLAUSES
// -------------------------------------------------------------
export async function getReg46Clauses(req, res, next) {
  try {
    const isAdmin = Boolean(req.user);
    const { status } = req.query;

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    let rows;
    if (!isAdmin) {
      // Public / Guest: do NOT expose internal compliance notes or unapproved internal drafts
      rows = await query(
        `SELECT id, clause, sub_regulation, title, requirement, category,
                website_location, target_route, target_category, status,
                action_text, legal_citation, last_verified_date, review_status, sort_order
         FROM regulation_46_clauses
         WHERE publish_status = 'published'
         ORDER BY sort_order ASC, clause ASC`
      );
    } else {
      // Authenticated admin: expose complete tracking matrix
      let sql = 'SELECT * FROM regulation_46_clauses';
      const params = [];
      if (status && status !== 'all') {
        sql += ' WHERE publish_status = ?';
        params.push(status);
      }
      sql += ' ORDER BY sort_order ASC, clause ASC';
      rows = await query(sql, params);
    }

    // Map both camelCase and snake_case for seamless public and admin UI consumption
    const data = rows.map((r) => ({
      ...r,
      subRegulation: r.sub_regulation,
      sub_regulation: r.sub_regulation,
      websiteLocation: r.website_location,
      website_location: r.website_location,
      targetRoute: r.target_route,
      target_route: r.target_route,
      targetCategory: r.target_category,
      target_category: r.target_category,
      actionText: r.action_text,
      action_text: r.action_text,
      legalCitation: r.legal_citation,
      legal_citation: r.legal_citation,
      lastVerifiedDate: r.last_verified_date,
      last_verified_date: r.last_verified_date,
      reviewStatus: r.review_status,
      review_status: r.review_status,
      publishStatus: r.publish_status || 'published',
      publish_status: r.publish_status || 'published'
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateReg46Clause(req, res, next) {
  try {
    const { id } = req.params;
    const r = req.body;

    const existingRows = await query('SELECT * FROM regulation_46_clauses WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Regulation 46 clause not found.' });
    }
    const current = existingRows[0];

    // Mandatory rule: Compliance cannot be marked Verified without required evidence link & authorized review
    const targetReviewStatus = r.review_status !== undefined ? r.review_status : current.review_status;
    const effectiveEvidence = (r.evidence_link !== undefined ? r.evidence_link : current.evidence_link) || '';
    const effectiveReviewer = (r.responsible_reviewer !== undefined ? r.responsible_reviewer : current.responsible_reviewer) || '';

    if (targetReviewStatus === 'Verified') {
      if (!effectiveEvidence.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Statutory compliance cannot be marked Verified without a valid evidence link or document repository reference.'
        });
      }
      if (!effectiveReviewer.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Statutory compliance cannot be marked Verified without designated Company Secretary / authorized reviewer sign-off.'
        });
      }
    }

    // Synchronize public status with review status
    let targetStatus = r.status && typeof r.status === 'string' && r.status.trim() ? r.status.trim() : null;
    if (!targetStatus) {
      if (targetReviewStatus === 'Verified') {
        targetStatus = current.status?.includes('Continuous')
          ? 'Continuous Statutory Compliance'
          : 'Complied & Verified';
      } else if (targetReviewStatus === 'Not Applicable') {
        targetStatus = 'Nil / Not Applicable (Company Confirmation Required)';
      } else if (['Pending Evidence', 'Under Review', 'Not Reviewed'].includes(targetReviewStatus)) {
        targetStatus = 'Company/CS Confirmation Required';
      } else {
        targetStatus = current.status;
      }
    }

    let verifiedDate = r.last_verified_date !== undefined ? r.last_verified_date : current.last_verified_date;
    if (targetReviewStatus === 'Verified' && !verifiedDate) {
      verifiedDate = new Date().toISOString().split('T')[0];
    } else if (targetReviewStatus !== 'Verified') {
      verifiedDate = null;
    }

    await query(
      `UPDATE regulation_46_clauses SET
        status = ?,
        review_status = ?,
        target_route = COALESCE(?, target_route),
        target_category = COALESCE(?, target_category),
        action_text = COALESCE(?, action_text),
        responsible_reviewer = COALESCE(?, responsible_reviewer),
        internal_review_date = COALESCE(?, internal_review_date),
        evidence_link = COALESCE(?, evidence_link),
        last_verified_date = ?,
        compliance_notes = COALESCE(?, compliance_notes),
        publish_status = COALESCE(?, publish_status),
        updated_at = NOW()
       WHERE id = ?`,
      [
        targetStatus,
        targetReviewStatus,
        r.target_route || r.targetRoute,
        r.target_category || r.targetCategory,
        r.action_text || r.actionText,
        effectiveReviewer,
        r.internal_review_date,
        effectiveEvidence,
        verifiedDate,
        r.compliance_notes || r.reason,
        r.publish_status || r.publishStatus,
        id
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_REG46_CLAUSE',
      entityType: 'regulation_46_clause',
      entityId: String(id),
      details: {
        clause: current.clause,
        title: current.title,
        previousReviewStatus: current.review_status,
        newReviewStatus: targetReviewStatus,
        evidenceLink: effectiveEvidence,
        reason: r.reason || r.compliance_notes || 'Regulatory checklist update'
      },
      req
    });

    const [updated] = await query('SELECT * FROM regulation_46_clauses WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Regulation 46 clause ${current.clause} compliance status updated successfully.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

export async function archiveReg46Clause(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, clause, title FROM regulation_46_clauses WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Regulation 46 clause not found.' });
    }

    await query('UPDATE regulation_46_clauses SET publish_status = "archived", updated_at = NOW() WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'ARCHIVE_REG46_CLAUSE',
      entityType: 'regulation_46_clause',
      entityId: String(id),
      details: { clause: existing[0].clause, title: existing[0].title },
      req
    });

    res.json({ success: true, message: `Clause ${existing[0].clause} archived from public view.` });
  } catch (err) {
    next(err);
  }
}

export async function restoreReg46Clause(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, clause, title FROM regulation_46_clauses WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Regulation 46 clause not found.' });
    }

    await query('UPDATE regulation_46_clauses SET publish_status = "published", updated_at = NOW() WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'RESTORE_REG46_CLAUSE',
      entityType: 'regulation_46_clause',
      entityId: String(id),
      details: { clause: existing[0].clause, title: existing[0].title },
      req
    });

    res.json({ success: true, message: `Clause ${existing[0].clause} restored to public view.` });
  } catch (err) {
    next(err);
  }
}
