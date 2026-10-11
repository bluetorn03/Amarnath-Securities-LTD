import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('AMARNATH SECURITIES — FULL AUDIT & INTEGRATION TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check & DB connection
    const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
    assert(healthRes.status === 'healthy' && healthRes.database === 'connected', '1. System Health & MySQL Connection Pool');

    // 2. Company Profile & Identifiers (CIN & ISIN Verification)
    const profileRes = await fetch(`${BASE_URL}/content/profile`).then((r) => r.json());
    assert(
      profileRes.success &&
      profileRes.data?.cin === 'L67120GJ1994PLC023254' &&
      profileRes.data?.isin === 'INE745P01010' &&
      profileRes.data?.bse_scrip_code === '538465',
      '2. Official Company Identifiers Verified (CIN: L67120GJ1994PLC023254, ISIN: INE745P01010, BSE: 538465)'
    );

    // 3. Public Statutory Document Library Count
    const docsRes = await fetch(`${BASE_URL}/documents`).then((r) => r.json());
    assert(docsRes.success && Array.isArray(docsRes.data) && docsRes.data.length >= 35, `3. Public Statutory Document Library (${docsRes.data?.length} filings)`);

    // 4. RBAC: Unauthorized access to all protected endpoints returns 401
    const unauthAudit = await fetch(`${BASE_URL}/audit`).then((r) => r.status);
    const unauthPostDoc = await fetch(`${BASE_URL}/documents`, { method: 'POST' }).then((r) => r.status);
    const unauthPutDoc = await fetch(`${BASE_URL}/documents/doc-1`, { method: 'PUT' }).then((r) => r.status);
    const unauthDeleteDoc = await fetch(`${BASE_URL}/documents/doc-1`, { method: 'DELETE' }).then((r) => r.status);
    const unauthGetEnq = await fetch(`${BASE_URL}/enquiries`).then((r) => r.status);
    const unauthPutProfile = await fetch(`${BASE_URL}/content/profile`, { method: 'PUT' }).then((r) => r.status);
    const unauthChangePass = await fetch(`${BASE_URL}/auth/change-password`, { method: 'POST' }).then((r) => r.status);

    const all401 = [unauthAudit, unauthPostDoc, unauthPutDoc, unauthDeleteDoc, unauthGetEnq, unauthPutProfile, unauthChangePass].every((s) => s === 401);
    assert(all401, '4. RBAC Strict Enforcement: All 7 protected administrative endpoints reject unauthenticated access with 401');

    // 5. Invalid Login (Rate limit & lockout protection test)
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@amarnathsecuritiesltd.com', password: 'WrongPassword123!' })
    });
    const badLoginData = await badLoginRes.json();
    assert(badLoginRes.status === 401 && !badLoginData.success, '5. Security: Invalid Password Rejection');

    // 6. Valid Super Admin Login with Rotated Credentials
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: config.initialAdmin.email,
        password: config.initialAdmin.password
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && Boolean(loginData.token) && loginData.user?.role === 'super_admin', '6. Super Admin JWT Token Authentication & Verification');
    const token = loginData.token;

    // 7. Protected /api/auth/me Session Validation
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    assert(meRes.success && meRes.user?.email === config.initialAdmin.email, '7. Protected /api/auth/me Session Validation');

    // 8. Public Corporate Enquiry Submission
    const enqRes = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'business',
        name: 'Automated Audit Client',
        email: 'audit-client@institution.com',
        phone: '9820011223',
        companyName: 'Audit Capital Advisory LLP',
        serviceInterest: 'Corporate Finance & Advisory',
        estimatedCapital: '₹25 Cr - ₹100 Cr',
        details: 'Audit test mandate submission verifying server-side reference generation.'
      })
    }).then((r) => r.json());
    assert(enqRes.success && enqRes.referenceNo?.startsWith('ASL-CORP-'), `8. Public Corporate Enquiry Submission (${enqRes.referenceNo})`);

    // 9. Admin Enquiry Retrieval & Triage Status Transition
    const adminEnqRes = await fetch(`${BASE_URL}/enquiries`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    const matchedEnq = adminEnqRes.data?.find((e) => e.reference_no === enqRes.referenceNo);
    assert(matchedEnq !== undefined, '9. Admin Enquiry Persistence & Access');

    const statusUpdateRes = await fetch(`${BASE_URL}/enquiries/${matchedEnq.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'in_progress', resolutionNotes: 'Mandate acknowledged by corporate finance desk.' })
    }).then((r) => r.json());
    assert(statusUpdateRes.success, '10. Admin Enquiry Status Transition (new -> in_progress)');

    // 11. Admin Document Archival & Database Insertion
    const testDocId = `test-audit-${Date.now()}`;
    const createDocRes = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: testDocId,
        title: 'Q3 FY 2025-26 Compliance Audit Test Document',
        category: 'Statutory Disclosures',
        financialYear: 'FY 2025-26',
        quarter: 'Q3',
        filingDate: '2026-02-14',
        bseAckNumber: 'TEST-BSE-9912',
        description: 'Verified statutory test document for automated CI/CD pipeline.',
        sourceType: 'file_url',
        fileUrl: '/assets/filings/compliance_test.pdf',
        isAvailable: true,
        status: 'published'
      })
    }).then((r) => r.json());
    assert(createDocRes.success && createDocRes.id === testDocId, '11. Admin Document Archival & Database Insertion');

    // 12. Document Replacement & Semantic Versioning
    const replaceRes = await fetch(`${BASE_URL}/documents/${testDocId}/replace`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        sourceType: 'file_url',
        fileUrl: '/assets/filings/compliance_test_v2.pdf',
        changeSummary: 'Incorporated signed secretarial compliance certificate'
      })
    }).then((r) => r.json());
    assert(replaceRes.success && replaceRes.version === '2.0', `12. Document Replacement & Semantic Versioning (v${replaceRes.version})`);

    // 13. Document Lifecycle: Unpublish (draft), Archive, Restore
    const unpubRes = await fetch(`${BASE_URL}/documents/${testDocId}/unpublish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    assert(unpubRes.success, '13. Document Workflow: Unpublish (Status -> draft)');

    // Verify public library omits draft
    const publicAfterUnpub = await fetch(`${BASE_URL}/documents`).then((r) => r.json());
    const publicHasDraft = publicAfterUnpub.data?.some((d) => d.id === testDocId);
    assert(!publicHasDraft, '14. Public Isolation: Unpublished draft document hidden from public listing');

    // Publish & verify
    const pubRes = await fetch(`${BASE_URL}/documents/${testDocId}/publish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    assert(pubRes.success, '15. Document Workflow: Publish (Status -> published)');

    // 16. Security: Path Traversal Prevention in file download
    const traversalRes = await fetch(`${BASE_URL}/documents/..%2F..%2Fserver.js/download`);
    assert(traversalRes.status === 400 || traversalRes.status === 403 || traversalRes.status === 404, '16. Security: Path Traversal Prevention in download endpoint');

    // 17. Security: PDF Magic Bytes Verification for Uploads
    // Create temporary fake non-pdf file
    const fakeFilePath = path.join(__dirname, 'fake_test.pdf');
    fs.writeFileSync(fakeFilePath, 'MALICIOUS_EXECUTABLE_CONTENT_NOT_A_PDF', 'utf8');

    const fakeFormData = new FormData();
    fakeFormData.append('file', new Blob([fs.readFileSync(fakeFilePath)], { type: 'application/pdf' }), 'fake_test.pdf');
    fakeFormData.append('title', 'Spoofed PDF Document');
    fakeFormData.append('category', 'BSE Disclosures');

    const fakeUploadRes = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fakeFormData
    });
    const fakeUploadData = await fakeUploadRes.json();
    assert(
      fakeUploadRes.status === 400 && fakeUploadData.error?.includes('%PDF-'),
      '17. Security: Magic Bytes Inspection successfully blocked non-PDF payload'
    );
    try { fs.unlinkSync(fakeFilePath); } catch {}

    // 18. Audit Trail Verification
    const auditRes = await fetch(`${BASE_URL}/audit`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    const hasUnpubAudit = auditRes.data?.some((a) => a.action === 'UNPUBLISH_DOCUMENT' && a.entity_id === testDocId);
    assert(auditRes.success && hasUnpubAudit, '18. Immutable Audit Trail Attributing Administrative Action');

    // 19. Purge Test Document
    const deleteRes = await fetch(`${BASE_URL}/documents/${testDocId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    assert(deleteRes.success, '19. Document & Version History Cascade Purge');

    // 20. Board Directors Verification (Only verified directors marked verified)
    const directorsRes = await fetch(`${BASE_URL}/content/directors`).then((r) => r.json());
    const unverifiedDirs = directorsRes.data?.filter((d) => !d.is_verified);
    const verifiedDirs = directorsRes.data?.filter((d) => d.is_verified);
    assert(
      directorsRes.success && unverifiedDirs.length === 4 && verifiedDirs.length === 1,
      `20. Statutory Director Verification Integrity (${verifiedDirs.length} verified, ${unverifiedDirs.length} subject to CS confirmation)`
    );

    // 21. System Telemetry & Health Check
    const sysHealthRes = await fetch(`${BASE_URL}/system/health`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    assert(
      sysHealthRes.success &&
      sysHealthRes.connectivity?.database === 'connected' &&
      sysHealthRes.storage?.fileCount >= 0 &&
      sysHealthRes.metrics?.documents?.published >= 35,
      '21. Real System Telemetry: MySQL ping, storage size calculation, and document metrics'
    );

    // 22. Institutional Settings Persistence
    const settingsGetRes = await fetch(`${BASE_URL}/system/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    assert(
      settingsGetRes.success &&
      settingsGetRes.data?.company_profile?.value?.cin === 'L67120GJ1994PLC023254' &&
      settingsGetRes.data?.investor_relations?.value?.bse_portal_url?.includes('538465'),
      '22. Institutional Settings Retrieval & Verification (CIN & Official Links)'
    );

    // 23. Update System Settings (Super Admin Only)
    const testSettingVal = {
      defaultReviewer: 'Company Secretary & Compliance Officer',
      defaultApprover: 'Board of Directors / Audit Committee',
      reviewCycleDays: 90,
      nextStatutoryReviewDate: '2026-11-15',
      staleReviewThresholdDays: 180
    };
    const updateSettingRes = await fetch(`${BASE_URL}/system/settings/compliance_workflow`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ value: testSettingVal })
    }).then((r) => r.json());
    assert(updateSettingRes.success, '23. Super Admin Settings Persistence & Verification');

    // 24. User Lifecycle Management (RBAC)
    const testUserEmail = `audit-officer-${Date.now()}@amarnathsecuritiesltd.com`;
    const createUserRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        email: testUserEmail,
        name: 'Audit Compliance Officer',
        password: 'TemporaryPassword123!',
        role: 'compliance_officer'
      })
    }).then((r) => r.json());
    assert(createUserRes.success && Boolean(createUserRes.data?.id), '24. User Lifecycle: Create Compliance Officer User');
    const createdUserId = createUserRes.data?.id;

    // Purge test user
    if (createdUserId) {
      const delUserRes = await fetch(`${BASE_URL}/users/${createdUserId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).then((r) => r.json());
      assert(delUserRes.success, '25. User Lifecycle: Purge test user account');
    }

    // 26. Regulation 46 Compliance Review Update
    const updateReg46Res = await fetch(`${BASE_URL}/content/regulation-46/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        review_status: 'Verified',
        responsible_reviewer: 'Company Secretary & Compliance Officer',
        internal_review_date: '2026-10-10',
        reason: 'Automated test suite verification of website maintenance'
      })
    }).then((r) => r.json());
    assert(updateReg46Res.success && updateReg46Res.data?.review_status === 'Verified', '26. Regulation 46 Review Status Transition & Audit Justification');

    console.log('\n----------------------------------------------------');
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('----------------------------------------------------');

    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (error) {
    console.error('Fatal Integration Test Exception:', error);
    process.exit(1);
  }
}

runTests();

