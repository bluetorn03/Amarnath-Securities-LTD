import { query, transaction } from '../config/db.js';
import { logAudit } from '../utils/auditLogger.js';

// -------------------------------------------------------------
// 1. COMPANY PROFILE
// -------------------------------------------------------------
export async function getCompanyProfile(req, res, next) {
  try {
    const rows = await query('SELECT * FROM company_profile WHERE status = "published" LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Company profile not found.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateCompanyProfile(req, res, next) {
  try {
    const p = req.body;
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

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_COMPANY_PROFILE',
      entityType: 'company_profile',
      entityId: '1',
      details: p,
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
    const sql = isAdmin
      ? 'SELECT * FROM directors ORDER BY sort_order ASC'
      : 'SELECT * FROM directors WHERE status = "published" ORDER BY sort_order ASC';
    const rows = await query(sql);

    const data = rows.map((d) => ({
      ...d,
      other_directorships: typeof d.other_directorships === 'string'
        ? JSON.parse(d.other_directorships)
        : d.other_directorships || []
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createDirector(req, res, next) {
  try {
    const d = req.body;
    const id = d.id || `dir-${Date.now()}`;

    await query(
      `INSERT INTO directors (
        id, name, designation, category, din, appointment_date, term, bio,
        other_directorships, is_verified, approval_status, sort_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        d.name,
        d.designation,
        d.category,
        d.din,
        d.appointment_date || null,
        d.term || null,
        d.bio,
        JSON.stringify(d.other_directorships || []),
        Boolean(d.is_verified),
        d.approval_status || 'Subject to Company / CS Confirmation',
        d.sort_order || 0,
        d.status || 'draft'
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_DIRECTOR',
      entityType: 'director',
      entityId: id,
      details: { name: d.name, designation: d.designation },
      req
    });

    res.status(201).json({ success: true, message: 'Director created successfully.', id });
  } catch (err) {
    next(err);
  }
}

export async function updateDirector(req, res, next) {
  try {
    const { id } = req.params;
    const d = req.body;

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
        is_verified = COALESCE(?, is_verified),
        approval_status = COALESCE(?, approval_status),
        sort_order = COALESCE(?, sort_order),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [
        d.name,
        d.designation,
        d.category,
        d.din,
        d.appointment_date,
        d.term,
        d.bio,
        d.other_directorships ? JSON.stringify(d.other_directorships) : null,
        d.is_verified !== undefined ? Boolean(d.is_verified) : null,
        d.approval_status,
        d.sort_order,
        d.status,
        id
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_DIRECTOR',
      entityType: 'director',
      entityId: id,
      details: d,
      req
    });

    res.json({ success: true, message: 'Director profile updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function deleteDirector(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM directors WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_DIRECTOR',
      entityType: 'director',
      entityId: id,
      req
    });

    res.json({ success: true, message: 'Director removed successfully.' });
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
    const sql = isAdmin
      ? 'SELECT * FROM board_committees ORDER BY sort_order ASC'
      : 'SELECT * FROM board_committees WHERE status = "published" ORDER BY sort_order ASC';
    const committees = await query(sql);

    // Attach members
    const allMembers = await query('SELECT * FROM committee_members ORDER BY sort_order ASC');

    const data = committees.map((c) => ({
      ...c,
      key_responsibilities: typeof c.key_responsibilities === 'string'
        ? JSON.parse(c.key_responsibilities)
        : c.key_responsibilities || [],
      members: allMembers.filter((m) => m.committee_id === c.id)
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateCommittee(req, res, next) {
  try {
    const { id } = req.params;
    const c = req.body;

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
          status = COALESCE(?, status)
         WHERE id = ?`,
        [
          c.name, c.short_name, c.mandate, c.composition_rule, c.statutory_reference,
          c.chairperson_name, c.chairperson_designation, c.chairperson_role,
          c.chairperson_category, c.meetings_frequency,
          c.key_responsibilities ? JSON.stringify(c.key_responsibilities) : null,
          c.status, id
        ]
      );

      // If members array provided, replace members
      if (Array.isArray(c.members)) {
        await conn.query('DELETE FROM committee_members WHERE committee_id = ?', [id]);
        for (let i = 0; i < c.members.length; i++) {
          const m = c.members[i];
          await conn.query(
            `INSERT INTO committee_members (committee_id, name, designation, role, category, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, m.name, m.designation, m.role || 'Member', m.category, i]
          );
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

export async function createCommittee(req, res, next) {
  try {
    const c = req.body;
    const id = c.id || `comm-${Date.now()}`;
    await query(
      `INSERT INTO board_committees (
        id, name, short_name, mandate, composition_rule, statutory_reference,
        chairperson_name, chairperson_designation, chairperson_role, chairperson_category,
        meetings_frequency, key_responsibilities, sort_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, c.name, c.short_name, c.mandate, c.composition_rule, c.statutory_reference,
        c.chairperson_name, c.chairperson_designation, c.chairperson_role || 'Chairperson',
        c.chairperson_category, c.meetings_frequency,
        JSON.stringify(c.key_responsibilities || []),
        c.sort_order || 0, c.status || 'draft'
      ]
    );

    if (Array.isArray(c.members) && c.members.length > 0) {
      for (let i = 0; i < c.members.length; i++) {
        const m = c.members[i];
        await query(
          `INSERT INTO committee_members (committee_id, name, designation, role, category, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, m.name, m.designation, m.role || 'Member', m.category, i]
        );
      }
    }

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_COMMITTEE',
      entityType: 'board_committee',
      entityId: id,
      details: c,
      req
    });

    res.status(201).json({ success: true, message: 'Committee created successfully.', id });
  } catch (err) {
    next(err);
  }
}

export async function deleteCommittee(req, res, next) {
  try {
    const { id } = req.params;
    await transaction(async (conn) => {
      await conn.query('DELETE FROM committee_members WHERE committee_id = ?', [id]);
      await conn.query('DELETE FROM board_committees WHERE id = ?', [id]);
    });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_COMMITTEE',
      entityType: 'board_committee',
      entityId: id,
      req
    });

    res.json({ success: true, message: 'Committee removed successfully.' });
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
    const sql = isAdmin
      ? 'SELECT * FROM kmp_contacts ORDER BY sort_order ASC'
      : 'SELECT * FROM kmp_contacts WHERE status = "published" ORDER BY sort_order ASC';
    const rows = await query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export async function createKmpContact(req, res, next) {
  try {
    const k = req.body;
    const id = k.id || `kmp-${Date.now()}`;
    await query(
      `INSERT INTO kmp_contacts (
        id, role_title, name, designation, email, phone, address,
        authority_scope, statutory_reference, is_verified, sort_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, k.role_title, k.name, k.designation, k.email, k.phone, k.address,
        k.authority_scope, k.statutory_reference,
        Boolean(k.is_verified), k.sort_order || 0, k.status || 'draft'
      ]
    );

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_KMP',
      entityType: 'kmp_contact',
      entityId: id,
      details: k,
      req
    });

    res.status(201).json({ success: true, message: 'KMP contact created successfully.', id });
  } catch (err) {
    next(err);
  }
}

export async function deleteKmpContact(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM kmp_contacts WHERE id = ?', [id]);

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_KMP',
      entityType: 'kmp_contact',
      entityId: id,
      req
    });

    res.json({ success: true, message: 'KMP contact removed successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function updateKmpContact(req, res, next) {
  try {
    const { id } = req.params;
    const k = req.body;

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
        status = COALESCE(?, status)
       WHERE id = ?`,
      [
        k.role_title, k.name, k.designation, k.email, k.phone, k.address,
        k.authority_scope, k.statutory_reference,
        k.is_verified !== undefined ? Boolean(k.is_verified) : null,
        k.status, id
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

    res.json({ success: true, message: 'KMP details updated successfully.' });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------
// 5. REGULATION 46 CLAUSES
// -------------------------------------------------------------
export async function getReg46Clauses(req, res, next) {
  try {
    const rows = await query('SELECT * FROM regulation_46_clauses ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
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

    // If review_status is being changed to Verified, record last_verified_date
    let verifiedDate = r.last_verified_date !== undefined ? r.last_verified_date : current.last_verified_date;
    if (r.review_status === 'Verified' && !verifiedDate) {
      verifiedDate = new Date().toISOString().split('T')[0];
    }

    await query(
      `UPDATE regulation_46_clauses SET
        status = COALESCE(?, status),
        target_route = COALESCE(?, target_route),
        target_category = COALESCE(?, target_category),
        action_text = COALESCE(?, action_text),
        review_status = COALESCE(?, review_status),
        responsible_reviewer = COALESCE(?, responsible_reviewer),
        internal_review_date = COALESCE(?, internal_review_date),
        evidence_link = COALESCE(?, evidence_link),
        last_verified_date = ?,
        compliance_notes = COALESCE(?, compliance_notes),
        updated_at = NOW()
       WHERE id = ?`,
      [
        r.status,
        r.target_route,
        r.target_category,
        r.action_text,
        r.review_status,
        r.responsible_reviewer,
        r.internal_review_date,
        r.evidence_link,
        verifiedDate,
        r.compliance_notes || r.reason,
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
        newReviewStatus: r.review_status || current.review_status,
        evidenceLink: r.evidence_link || current.evidence_link,
        reason: r.reason || r.compliance_notes || 'Regulatory checklist update'
      },
      req
    });

    const updated = await query('SELECT * FROM regulation_46_clauses WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Regulation 46 clause ${current.clause} compliance status updated successfully.`,
      data: updated[0]
    });
  } catch (err) {
    next(err);
  }
}

