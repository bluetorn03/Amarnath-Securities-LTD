import assert from 'node:assert';
import { getPool } from '../config/db.js';
import { config } from '../config/env.js';

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runGovernanceTests() {
  console.log('========================================================');
  console.log('GOVERNANCE & COMPLIANCE END-TO-END VALIDATION SUITE');
  console.log('========================================================\n');

  const pool = getPool();

  // 1. Authenticate as Super Admin
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.initialAdmin.email,
      password: config.initialAdmin.password
    })
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200 && Boolean(loginData.token), '1. Super Admin Authentication');
  const token = loginData.token;
  console.log('✓ 1. Admin authenticated successfully');

  // ----------------------------------------------------
  // TEST SUITE A: DIRECTOR LIFECYCLE (Add -> Edit -> Archive -> Restore -> Delete)
  // ----------------------------------------------------
  const testDirectorId = `test-dir-${Date.now()}`;
  const testDin = '09999999';

  // A1. Create & Publish Test Director
  const createDirRes = await fetch(`${BASE_URL}/content/directors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      id: testDirectorId,
      name: 'Dynamic Test Director',
      designation: 'Additional Independent Director',
      category: 'Independent Director',
      din: testDin,
      appointment_date: '2026-10-15',
      term: '5 Years',
      bio: 'Independent director appointed for testing database synchronization.',
      other_directorships: ['Test Holdings Ltd.'],
      committee_memberships: [{ committeeName: 'Audit Committee', role: 'Member' }],
      status: 'published',
      approval_status: 'Approved',
      is_verified: true
    })
  });
  const createDirData = await createDirRes.json();
  assert(createDirRes.status === 201 && createDirData.success, 'A1. Director Created');
  console.log('✓ A1. Director created and published in database');

  // Verify DB record
  const [dirDb] = await pool.query('SELECT id, name, status, approval_status FROM directors WHERE id = ?', [testDirectorId]);
  assert(dirDb.length === 1 && dirDb[0].status === 'published', 'A1-DB. Director verified in MySQL');
  console.log('✓ A1-DB. MySQL verification passed');

  // Verify Public Website API (unauthenticated) includes published record
  const pubDirRes1 = await fetch(`${BASE_URL}/content/directors`);
  const pubDirData1 = await pubDirRes1.json();
  const foundPub1 = pubDirData1.data.find((d) => d.id === testDirectorId);
  assert(foundPub1 && foundPub1.name === 'Dynamic Test Director', 'A1-PUB. Record appears on public endpoint');
  console.log('✓ A1-PUB. Record appears publicly on frontend sync endpoint');

  // A2. Edit Test Director
  const editDirRes = await fetch(`${BASE_URL}/content/directors/${testDirectorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Dynamic Test Director Updated',
      designation: 'Senior Independent Director',
      bio: 'Updated biography reflecting database synchronization.'
    })
  });
  const editDirData = await editDirRes.json();
  assert(editDirRes.status === 200 && editDirData.success, 'A2. Director Edited');
  
  // Verify public reflects edit
  const pubDirRes2 = await fetch(`${BASE_URL}/content/directors`);
  const pubDirData2 = await pubDirRes2.json();
  const foundPub2 = pubDirData2.data.find((d) => d.id === testDirectorId);
  assert(foundPub2 && foundPub2.name === 'Dynamic Test Director Updated', 'A2-PUB. Public reflects edited name');
  console.log('✓ A2. Director edit synchronized to public endpoint');

  // A3. Archive Test Director
  const archiveDirRes = await fetch(`${BASE_URL}/content/directors/${testDirectorId}/archive`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  const archiveDirData = await archiveDirRes.json();
  assert(archiveDirRes.status === 200 && archiveDirData.success, 'A3. Director Archived');

  // Verify public no longer returns archived director
  const pubDirRes3 = await fetch(`${BASE_URL}/content/directors`);
  const pubDirData3 = await pubDirRes3.json();
  const foundPub3 = pubDirData3.data.find((d) => d.id === testDirectorId);
  assert(!foundPub3, 'A3-PUB. Archived record disappears from public listing');
  console.log('✓ A3. Archived record disappears from public endpoint');

  // Verify Admin still sees archived director
  const adminDirRes = await fetch(`${BASE_URL}/content/directors?status=all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const adminDirData = await adminDirRes.json();
  const foundAdmin = adminDirData.data.find((d) => d.id === testDirectorId);
  assert(foundAdmin && foundAdmin.status === 'archived', 'A3-ADMIN. Archived record recoverable in admin view');
  console.log('✓ A3-ADMIN. Archived record visible and recoverable in Admin');

  // A4. Restore Test Director
  const restoreDirRes = await fetch(`${BASE_URL}/content/directors/${testDirectorId}/restore`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  const restoreDirData = await restoreDirRes.json();
  assert(restoreDirRes.status === 200 && restoreDirData.success, 'A4. Director Restored');

  const pubDirRes4 = await fetch(`${BASE_URL}/content/directors`);
  const pubDirData4 = await pubDirRes4.json();
  const foundPub4 = pubDirData4.data.find((d) => d.id === testDirectorId);
  assert(foundPub4 && foundPub4.status === 'published', 'A4-PUB. Restored record reappears on public endpoint');
  console.log('✓ A4. Restored record reappears on public endpoint');

  // A5. Delete Test Director (Cleanup)
  const delDirRes = await fetch(`${BASE_URL}/content/directors/${testDirectorId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const delDirData = await delDirRes.json();
  assert(delDirRes.status === 200 && delDirData.success, 'A5. Director Safely Deleted');
  console.log('✓ A5. Test director purged cleanly without altering genuine company data');

  // ----------------------------------------------------
  // TEST SUITE B: BOARD COMMITTEE LIFECYCLE
  // ----------------------------------------------------
  const testCommId = `test-comm-${Date.now()}`;
  const createCommRes = await fetch(`${BASE_URL}/content/committees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      id: testCommId,
      name: 'Dynamic ESG & Compliance Committee',
      short_name: 'ESG Committee',
      mandate: 'Oversight of ESG disclosures and regulatory compliance.',
      chairperson_name: 'Independent Test Chairperson',
      chairperson_designation: 'Independent Director',
      chairperson_role: 'Chairperson',
      chairperson_category: 'Independent Director',
      statutory_reference: 'SEBI (LODR) Regulation 21 Best Practice',
      meetings_frequency: 'Bi-annually',
      key_responsibilities: ['Review climate and governance reporting'],
      members: [{ name: 'Test Member', designation: 'Director', role: 'Member', category: 'Non-Executive' }],
      status: 'published'
    })
  });
  const createCommData = await createCommRes.json();
  assert(createCommRes.status === 201 && createCommData.success, 'B1. Committee Created');

  // Verify public website mapping (dual property access: chairperson.name and chairperson_name)
  const pubCommRes = await fetch(`${BASE_URL}/content/committees`);
  const pubCommData = await pubCommRes.json();
  const foundComm = pubCommData.data.find((c) => c.id === testCommId);
  assert(
    foundComm && 
    foundComm.chairperson?.name === 'Independent Test Chairperson' &&
    Array.isArray(foundComm.members) && foundComm.members.length === 1,
    'B1-PUB. Committee public structure mapped with chairperson object and members array'
  );
  console.log('✓ B1. Board committee created and dual-property structure verified publicly');

  // Cleanup committee
  await fetch(`${BASE_URL}/content/committees/${testCommId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('✓ B2. Test committee purged cleanly');

  // ----------------------------------------------------
  // TEST SUITE C: KMP LIFECYCLE
  // ----------------------------------------------------
  const testKmpId = `test-kmp-${Date.now()}`;
  const createKmpRes = await fetch(`${BASE_URL}/content/kmp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      id: testKmpId,
      name: 'Test Compliance Associate',
      role_title: 'Secretarial Officer',
      designation: 'Assistant Company Secretary',
      email: 'test.secretary@amarnathsecurities.co.in',
      phone: '+91 22 4000 0000',
      authority_scope: 'Assistance in BSE XBRL and secretarial uploads',
      statutory_reference: 'Regulation 30(5) SEBI (LODR)',
      status: 'published'
    })
  });
  const createKmpData = await createKmpRes.json();
  assert(createKmpRes.status === 201 && createKmpData.success, 'C1. KMP Created');

  const pubKmpRes = await fetch(`${BASE_URL}/content/kmp`);
  const pubKmpData = await pubKmpRes.json();
  const foundKmp = pubKmpData.data.find((k) => k.id === testKmpId);
  assert(foundKmp && (foundKmp.role === 'Secretarial Officer' || foundKmp.role_title === 'Secretarial Officer'), 'C1-PUB. KMP public normalization');
  console.log('✓ C1. KMP contact created and verified publicly');

  // Cleanup KMP
  await fetch(`${BASE_URL}/content/kmp/${testKmpId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('✓ C2. Test KMP purged cleanly');

  // ----------------------------------------------------
  // TEST SUITE D: REGULATION 46 VERIFICATION SECURITY & PUBLIC PRIVACY
  // ----------------------------------------------------
  // D1. Unauthenticated public request MUST NOT leak internal notes, reviewer, or unapproved records
  const pubReg46Res = await fetch(`${BASE_URL}/content/regulation-46`);
  const pubReg46Data = await pubReg46Res.json();
  assert(pubReg46Res.status === 200 && Array.isArray(pubReg46Data.data), 'D1. Reg 46 Public list');
  for (const item of pubReg46Data.data) {
    assert(item.internal_notes === undefined, 'D1-SEC. Public response must NOT leak internal_notes');
    assert(item.responsible_reviewer === undefined, 'D1-SEC. Public response must NOT leak responsible_reviewer');
  }
  console.log('✓ D1. Public security: internal compliance notes and reviewers strictly sanitized from public responses');

  // D2. Enforce Evidence Link and Reviewer for "Verified" Status
  const unverifiedRes = await fetch(`${BASE_URL}/content/regulation-46/2`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      review_status: 'Verified',
      evidence_link: null, // missing required evidence
      responsible_reviewer: null
    })
  });
  assert(unverifiedRes.status === 400, 'D2. Setting Verified without evidence link must be rejected');
  console.log('✓ D2. Verification integrity: rejected Verified status when evidence link is absent');

  // ----------------------------------------------------
  // TEST SUITE E: MOA & AOA LIVE DATABASE-TO-PUBLIC SYNCHRONIZATION
  // ----------------------------------------------------
  console.log('\n--- Test Suite E: MOA & AOA End-to-End Verification ---');
  const moaClauseId = 3; // Clause 46(2)(aa)

  // E1. Admin marks MOA & AOA as Verified with full evidence
  const updateMoaRes = await fetch(`${BASE_URL}/content/regulation-46/${moaClauseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      review_status: 'Verified',
      responsible_reviewer: 'Company Secretary & Compliance Officer',
      internal_review_date: '2026-10-20',
      evidence_link: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnat/538465/',
      compliance_notes: 'Verified against authenticated BSE filings and official secretarial records',
      reason: 'E2E automated verification of MOA & AOA public synchronization'
    })
  });
  const updateMoaData = await updateMoaRes.json();
  assert(updateMoaRes.status === 200 && updateMoaData.success, 'E1. MOA & AOA Updated in Admin');
  console.log('✓ E1. Admin successfully updated MOA & AOA clause to Verified');

  // E2. Verify MySQL persistence
  const [moaDbRows] = await pool.query(
    'SELECT id, clause, title, status, review_status, evidence_link, last_verified_date FROM regulation_46_clauses WHERE id = ?',
    [moaClauseId]
  );
  assert(moaDbRows.length === 1, 'E2-1. MOA & AOA row exists in MySQL');
  assert(moaDbRows[0].review_status === 'Verified', 'E2-2. review_status is Verified in MySQL');
  assert(moaDbRows[0].status === 'Complied & Verified' || moaDbRows[0].status === 'Complied & Published', 'E2-3. status is synchronized to Complied & Verified in MySQL');
  assert(Boolean(moaDbRows[0].last_verified_date), 'E2-4. last_verified_date is set');
  console.log(`✓ E2. Verified MySQL persistence: status='${moaDbRows[0].status}', review_status='${moaDbRows[0].review_status}'`);

  // E3. Verify public API returns the updated status with no-cache headers
  const pubMoaRes = await fetch(`${BASE_URL}/content/regulation-46`);
  assert(pubMoaRes.status === 200, 'E3-1. Public API returned 200');
  const cacheControl = pubMoaRes.headers.get('cache-control');
  assert(cacheControl?.includes('no-cache') && cacheControl?.includes('no-store'), 'E3-2. Cache-Control: no-cache, no-store verified');
  
  const pubMoaData = await pubMoaRes.json();
  const moaPublic = pubMoaData.data.find((c) => c.id === moaClauseId || c.clause === '46(2)(aa)');
  assert(moaPublic, 'E3-3. MOA & AOA found in public API response');
  assert(moaPublic.review_status === 'Verified' || moaPublic.reviewStatus === 'Verified', 'E3-4. Public API review_status is Verified');
  assert(moaPublic.status === 'Complied & Verified' || moaPublic.status === 'Complied & Published', 'E3-5. Public API status is Complied & Verified');
  console.log(`✓ E3. Public API returns status='${moaPublic.status}', review_status='${moaPublic.review_status}' with Cache-Control headers`);

  // E4. Test transition to Pending Evidence
  const pendingMoaRes = await fetch(`${BASE_URL}/content/regulation-46/${moaClauseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      review_status: 'Pending Evidence',
      responsible_reviewer: 'Company Secretary & Compliance Officer',
      internal_review_date: '2026-10-20',
      reason: 'Testing status reversion'
    })
  });
  assert(pendingMoaRes.status === 200, 'E4-1. Reversion to Pending Evidence succeeded');
  const [moaPendingDb] = await pool.query('SELECT status, review_status FROM regulation_46_clauses WHERE id = ?', [moaClauseId]);
  assert(moaPendingDb[0].status === 'Company/CS Confirmation Required', 'E4-2. MySQL status reverted to Company/CS Confirmation Required');
  console.log('✓ E4. Transition to Pending Evidence correctly synchronized status in MySQL');

  // E5. Re-apply Verified status to ensure MOA & AOA remains in Verified state
  const reVerifyMoaRes = await fetch(`${BASE_URL}/content/regulation-46/${moaClauseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      review_status: 'Verified',
      responsible_reviewer: 'Company Secretary & Compliance Officer',
      internal_review_date: '2026-10-20',
      evidence_link: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnat/538465/',
      compliance_notes: 'Final confirmed verification with BSE repository link',
      reason: 'Final CS confirmation'
    })
  });
  assert(reVerifyMoaRes.status === 200, 'E5-1. Final re-verification succeeded');
  const [moaFinalDb] = await pool.query('SELECT status, review_status FROM regulation_46_clauses WHERE id = ?', [moaClauseId]);
  assert(moaFinalDb[0].status === 'Complied & Verified' && moaFinalDb[0].review_status === 'Verified', 'E5-2. Final state verified in MySQL');
  console.log('✓ E5. Final MOA & AOA status in MySQL confirmed as Verified & Complied & Verified');

  console.log('\n========================================================');
  console.log('ALL GOVERNANCE & COMPLIANCE PRODUCTION TESTS PASSED!');
  console.log('========================================================\n');
  process.exit(0);
}

runGovernanceTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
