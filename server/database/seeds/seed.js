import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query, transaction, closePool } from '../../config/db.js';
import { config } from '../../config/env.js';
import { 
  COMPANY_DETAILS, 
  DIRECTORS_REGISTRY, 
  BOARD_COMMITTEES_REGISTRY, 
  KMP_CONTACTS_REGISTRY, 
  REGULATION_46_MASTER_INDEX 
} from '../../../src/data/mockData.ts';
import { STATUTORY_DOCUMENTS_LIBRARY } from '../../../src/data/regulation46Data.ts';

export async function runSeeds() {
  console.log('[SEED] Starting institutional seed process...');

  await transaction(async (conn) => {
    // 1. Initial Admin User
    const [existingUsers] = await conn.query('SELECT id, email FROM users WHERE email = ?', [config.initialAdmin.email]);
    let adminId;
    if (existingUsers.length === 0) {
      adminId = crypto.randomUUID();
      const rawPassword = config.initialAdmin.password || `Asl#${crypto.randomBytes(8).toString('hex')}!`;
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(rawPassword, salt);

      await conn.query(
        `INSERT INTO users (id, email, password_hash, name, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [adminId, config.initialAdmin.email, hash, config.initialAdmin.name, config.initialAdmin.role, true]
      );
      console.log(`[SEED] Created default super_admin: ${config.initialAdmin.email}`);
      if (!config.initialAdmin.password) {
        console.log('[SECURITY] Generated secure one-time initial admin password and stored hash.');
      }
    } else {
      adminId = existingUsers[0].id;
      console.log(`[SEED] Admin already exists (${config.initialAdmin.email}), skipping user creation.`);
    }

    // 2. Company Profile
    const [existingProfile] = await conn.query('SELECT id FROM company_profile LIMIT 1');
    if (existingProfile.length === 0) {
      await conn.query(
        `INSERT INTO company_profile (
          cin, bse_scrip_code, isin, company_name, short_name, tagline, trust_line,
          core_positioning, founded_year, email, phone, compliance_officer,
          compliance_designation, compliance_email, compliance_phone, reg_office,
          corp_office, rta_name, rta_historical_liaison, rta_address, rta_email,
          rta_phone, rta_website, sebi_scores_url, sebi_smart_odr_url, bse_portal_url,
          status, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
        [
          COMPANY_DETAILS.cin,
          COMPANY_DETAILS.bseScripCode,
          COMPANY_DETAILS.isin,
          COMPANY_DETAILS.name,
          COMPANY_DETAILS.shortName,
          COMPANY_DETAILS.tagline,
          COMPANY_DETAILS.trustLine,
          COMPANY_DETAILS.corePositioning,
          COMPANY_DETAILS.foundedYear,
          COMPANY_DETAILS.email,
          COMPANY_DETAILS.phone,
          COMPANY_DETAILS.complianceOfficer,
          COMPANY_DETAILS.complianceDesignation,
          COMPANY_DETAILS.complianceEmail,
          COMPANY_DETAILS.compliancePhone,
          COMPANY_DETAILS.regOffice,
          COMPANY_DETAILS.corpOffice,
          COMPANY_DETAILS.rtaName,
          COMPANY_DETAILS.rtaHistoricalLiaison || null,
          COMPANY_DETAILS.rtaAddress,
          COMPANY_DETAILS.rtaEmail,
          COMPANY_DETAILS.rtaPhone,
          COMPANY_DETAILS.rtaWebsite,
          COMPANY_DETAILS.sebiScoresUrl,
          COMPANY_DETAILS.sebiSmartOdrUrl,
          COMPANY_DETAILS.bsePortalUrl,
          adminId
        ]
      );
      console.log('[SEED] Company Profile seeded.');
    } else {
      console.log('[SEED] Company Profile already exists, skipping.');
    }

    // 3. Board of Directors
    let dirCount = 0;
    for (let i = 0; i < DIRECTORS_REGISTRY.length; i++) {
      const d = DIRECTORS_REGISTRY[i];
      const [existingDir] = await conn.query('SELECT id FROM directors WHERE id = ?', [d.id]);
      if (existingDir.length === 0) {
        await conn.query(
          `INSERT INTO directors (
            id, name, designation, category, din, appointment_date, term, bio,
            other_directorships, is_verified, approval_status, sort_order, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
          [
            d.id,
            d.name,
            d.designation,
            d.category,
            d.din,
            d.appointmentDate || null,
            d.term || null,
            d.bio,
            JSON.stringify(d.otherDirectorships || []),
            Boolean(d.verified),
            d.approvalStatus || 'Subject to Company / CS Confirmation',
            i
          ]
        );
        dirCount++;
      }
    }
    console.log(`[SEED] Seeded ${dirCount} directors.`);

    // 4. Board Committees & Members
    let commCount = 0;
    let memberCount = 0;
    for (let i = 0; i < BOARD_COMMITTEES_REGISTRY.length; i++) {
      const c = BOARD_COMMITTEES_REGISTRY[i];
      const [existingComm] = await conn.query('SELECT id FROM board_committees WHERE id = ?', [c.id]);
      if (existingComm.length === 0) {
        await conn.query(
          `INSERT INTO board_committees (
            id, name, short_name, mandate, composition_rule, statutory_reference,
            chairperson_name, chairperson_designation, chairperson_role, chairperson_category,
            meetings_frequency, key_responsibilities, sort_order, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
          [
            c.id,
            c.name,
            c.shortName,
            c.mandate,
            c.compositionRule,
            c.statutoryReference,
            c.chairperson.name,
            c.chairperson.designation,
            c.chairperson.role || 'Chairperson',
            c.chairperson.category,
            c.meetingsFrequency,
            JSON.stringify(c.keyResponsibilities || []),
            i
          ]
        );
        commCount++;

        // Seed members
        for (let mIdx = 0; mIdx < c.members.length; mIdx++) {
          const m = c.members[mIdx];
          await conn.query(
            `INSERT INTO committee_members (committee_id, name, designation, role, category, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [c.id, m.name, m.designation, m.role || 'Member', m.category, mIdx]
          );
          memberCount++;
        }
      }
    }
    console.log(`[SEED] Seeded ${commCount} committees and ${memberCount} members.`);

    // 5. Key Managerial Personnel
    let kmpCount = 0;
    for (let i = 0; i < KMP_CONTACTS_REGISTRY.length; i++) {
      const k = KMP_CONTACTS_REGISTRY[i];
      const [existingKmp] = await conn.query('SELECT id FROM kmp_contacts WHERE id = ?', [k.id]);
      if (existingKmp.length === 0) {
        await conn.query(
          `INSERT INTO kmp_contacts (
            id, role_title, name, designation, email, phone, address,
            authority_scope, statutory_reference, is_verified, sort_order, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
          [
            k.id,
            k.role,
            k.name,
            k.designation,
            k.email,
            k.phone,
            k.address,
            k.authorityScope,
            k.statutoryReference,
            k.id === 'kmp-cs',
            i
          ]
        );
        kmpCount++;
      }
    }
    console.log(`[SEED] Seeded ${kmpCount} KMP contacts.`);

    // 6. Regulation 46 Clauses
    let regCount = 0;
    for (let i = 0; i < REGULATION_46_MASTER_INDEX.length; i++) {
      const r = REGULATION_46_MASTER_INDEX[i];
      const [existingReg] = await conn.query('SELECT id FROM regulation_46_clauses WHERE clause = ?', [r.clause]);
      if (existingReg.length === 0) {
        await conn.query(
          `INSERT INTO regulation_46_clauses (
            clause, sub_regulation, title, requirement, category, website_location,
            target_route, target_category, status, action_text, legal_citation, sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            r.clause,
            r.subRegulation,
            r.title,
            r.requirement,
            r.category,
            r.websiteLocation,
            r.targetRoute,
            r.targetCategory || null,
            r.status,
            r.actionText,
            r.legalCitation,
            i
          ]
        );
        regCount++;
      }
    }
    console.log(`[SEED] Seeded ${regCount} Regulation 46 clauses.`);

    // 7. Statutory Documents Library
    let docCount = 0;
    for (const doc of STATUTORY_DOCUMENTS_LIBRARY) {
      const [existingDoc] = await conn.query('SELECT id FROM documents WHERE id = ?', [doc.id]);
      if (existingDoc.length === 0) {
        await conn.query(
          `INSERT INTO documents (
            id, title, category, financial_year, quarter, filing_date, bse_ack_number,
            file_size, file_type, description, source_type, file_url, external_url,
            is_available, sebi_reference, effective_date, version, is_statutory,
            status, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
          [
            doc.id,
            doc.title,
            doc.category,
            doc.financialYear,
            doc.quarter || 'N/A',
            doc.filingDate,
            doc.bseAckNumber,
            doc.fileSize,
            doc.fileType || 'PDF',
            doc.description,
            doc.sourceType || 'upload',
            doc.fileUrl || null,
            doc.externalUrl || null,
            Boolean(doc.isAvailable),
            doc.sebiReference || null,
            doc.effectiveDate || null,
            doc.version || 'Version 1.0',
            Boolean(doc.isStatutory ?? true),
            adminId
          ]
        );
        docCount++;
      }
    }
    console.log(`[SEED] Seeded ${docCount} statutory documents.`);

    // 8. Audit Log for Seed
    await conn.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
       VALUES (?, 'SEED_DATABASE', 'system', 'initial_seed', JSON_OBJECT('seeded_at', NOW()), '127.0.0.1')`,
      [adminId]
    );
  });

  console.log('[SEED] Institutional database seed completed successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeeds()
    .then(async () => {
      await closePool();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[SEED ERROR]', err);
      await closePool();
      process.exit(1);
    });
}
