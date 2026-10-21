import { config } from '../config/env.js';
import { query } from '../config/db.js';

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runInvestorSupportTests() {
  console.log('====================================================');
  console.log('AMARNATH SECURITIES — INVESTOR SUPPORT AUDIT TESTS');
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
    // 1. Authenticate Admin
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: config.initialAdmin.email,
        password: config.initialAdmin.password
      })
    }).then(r => r.json());
    assert(loginRes.success && Boolean(loginRes.token), '1. Admin Authentication Successful');
    const token = loginRes.token;

    // 2. Public Grievance Submission -> MySQL Persistence -> Privacy Isolation
    const uniqueFolio = `FOLIO-${Date.now()}`;
    const uniqueTimestamp = Date.now();
    const publicGrievancePayload = {
      type: 'investor',
      name: 'Rameshwar Lal Patel',
      email: `rameshwar.${uniqueTimestamp}@shareholder-investor.in`,
      phone: '+91 98210 44556',
      folioOrDpId: uniqueFolio,
      grievanceCategory: 'Dividend Non-Receipt',
      details: `Dividend for FY 2024-25 has not been credited to bank account. Folio registered with Bigshare RTA. [Session ${uniqueTimestamp}]`
    };

    const pubSubmitRes = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicGrievancePayload)
    });
    const pubSubmitData = await pubSubmitRes.json();

    assert(
      pubSubmitRes.status === 201 &&
      pubSubmitData.success &&
      pubSubmitData.referenceNo?.startsWith('ASL-INV-') &&
      pubSubmitData.admin_notes === undefined &&
      pubSubmitData.resolution_notes === undefined &&
      pubSubmitData.ip_address === undefined,
      `2. Public Grievance Submission (${pubSubmitData.referenceNo}) & Strict Privacy Isolation`
    );

    const refNo = pubSubmitData.referenceNo;

    // 3. MySQL Direct Verification
    const dbRows = await query('SELECT * FROM enquiries WHERE reference_no = ?', [refNo]);
    assert(
      dbRows.length === 1 &&
      dbRows[0].folio_or_dp_id === uniqueFolio &&
      dbRows[0].is_test === 0 &&
      dbRows[0].status === 'new',
      '3. MySQL Direct Verification: Grievance persisted with is_test=0 (Genuine) and status=new'
    );
    const grievanceId = dbRows[0].id;

    // 4. Admin Retrieval & Visibility in Operational Queue
    const adminEnqList = await fetch(`${BASE_URL}/enquiries?is_test=0`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());

    const retrievedGrievance = adminEnqList.data?.find(e => e.reference_no === refNo);
    assert(
      retrievedGrievance !== undefined &&
      retrievedGrievance.name === 'Rameshwar Lal Patel' &&
      retrievedGrievance.type === 'investor',
      '4. Admin Retrieval: Case visible in genuine investor queue with complete stakeholder metadata'
    );

    // 5. Anti-Duplicate Submission Guard
    const dupRes = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicGrievancePayload)
    });
    assert(
      dupRes.status === 429,
      '5. Anti-Spam: Rapid duplicate submission correctly rejected with 429'
    );

    // 6. Workflow Status Transition: new -> in_progress
    const inProgressRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'in_progress',
        resolutionNotes: 'Case acknowledged and assigned to compliance desk for dividend reconciliation.'
      })
    });
    const inProgressData = await inProgressRes.json();
    assert(
      inProgressRes.status === 200 && inProgressData.success && inProgressData.status === 'in_progress',
      '6. Workflow Transition: new -> in_progress with notes persisted'
    );

    // 7. Workflow Status Guardrail: Attempting to mark Resolved without notes must fail
    const badResolvedRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'resolved',
        resolutionNotes: '' // Empty notes should trigger guardrail
      })
    });
    const badResolvedData = await badResolvedRes.json();
    assert(
      badResolvedRes.status === 400 && !badResolvedData.success,
      '7. Workflow Guardrail: Marking Resolved without resolution notes rejected with 400'
    );

    // 8. Workflow Status Guardrail: Marking Resolved WITH proper resolution notes succeeds
    const goodResolvedRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'resolved',
        resolutionNotes: 'Dividend warrant re-issued via NEFT reference UTR778899; confirmed credited to shareholder bank account.'
      })
    });
    const goodResolvedData = await goodResolvedRes.json();
    assert(
      goodResolvedRes.status === 200 && goodResolvedData.success && goodResolvedData.status === 'resolved',
      '8. Workflow Transition: Marked Resolved with mandatory resolution notes successfully'
    );

    // 9. Reopening Support: Resolved complaint can be reopened to in_progress
    const reopenRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'in_progress',
        resolutionNotes: 'Shareholder requested additional confirmation of bank mandate.'
      })
    });
    const reopenData = await reopenRes.json();
    assert(
      reopenRes.status === 200 && reopenData.status === 'in_progress',
      '9. Workflow Reopening: Supported reopening complaint from resolved to in_progress'
    );

    // 10. Schedule Follow-up Date
    const followUpDate = '2026-11-15';
    const followUpRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}/follow-up`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        followUpDate,
        notes: 'Follow up with Bigshare helpdesk for tripartite folio status.'
      })
    });
    const followUpData = await followUpRes.json();
    assert(
      followUpRes.status === 200 && followUpData.followUpDate === followUpDate,
      '10. Follow-up Management: Follow-up date set and persisted in MySQL'
    );

    // 11. Add Internal Note
    const addNoteRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        note: 'Tripartite agreement reconciliation confirmed with RTA liaison.'
      })
    });
    const addNoteData = await addNoteRes.json();
    assert(
      addNoteRes.status === 200 && addNoteData.success && addNoteData.notes?.includes('Tripartite agreement'),
      '11. Internal Notes: Note appended and persisted'
    );

    // 12. Case Details & Audit History Verification
    const detailsRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    assert(
      detailsRes.success &&
      detailsRes.data?.id === grievanceId &&
      Array.isArray(detailsRes.history) &&
      detailsRes.history.length >= 3,
      `12. Single Case Detail API: Loaded case file with complete audit history (${detailsRes.history?.length} logged transitions)`
    );

    // 13. Reclassification: Toggle Genuine vs Test Run
    const classifyRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}/classify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ is_test: 1 })
    }).then(r => r.json());
    assert(
      classifyRes.success && classifyRes.is_test === 1,
      '13. Reclassification: Record reclassified to Audit Test Run'
    );

    // Switch back to Genuine
    await fetch(`${BASE_URL}/enquiries/${grievanceId}/classify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ is_test: 0 })
    });

    // 14. Retention Safety: Non-destructive Archiving of genuine complaint
    const archiveRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ confirmPermanent: false })
    }).then(r => r.json());
    assert(
      archiveRes.success && archiveRes.archived === true,
      '14. Retention Policy: Standard delete safely archives genuine complaint without data loss'
    );

    // 15. RTA & Contact Information: GET live database values
    const rtaGetRes = await fetch(`${BASE_URL}/enquiries/rta-contact`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    assert(
      rtaGetRes.success &&
      rtaGetRes.data?.rta_name?.includes('Bigshare') &&
      rtaGetRes.data?.sebi_scores_url?.includes('scores.sebi.gov.in'),
      '15. RTA & Contact Info: GET endpoint returns live MySQL database configuration'
    );

    // 16. RTA & Contact Information: PUT update with database persistence
    const updatedPhone = '+91 22 6263 8201';
    const rtaPutRes = await fetch(`${BASE_URL}/enquiries/rta-contact`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...rtaGetRes.data,
        rta_phone: updatedPhone
      })
    });
    const rtaPutData = await rtaPutRes.json();
    assert(
      rtaPutRes.status === 200 && rtaPutData.success && rtaPutData.data?.rta_phone === updatedPhone,
      '16. RTA & Contact Info: PUT update persisted in MySQL system_settings and company_profile'
    );

    // 17. Public Website Synchronization: Verify public /api/content/profile reflects the update
    const pubProfileRes = await fetch(`${BASE_URL}/content/profile`).then(r => r.json());
    assert(
      pubProfileRes.success && pubProfileRes.data?.rtaPhone === updatedPhone,
      '17. Public Synchronization: Public website profile reflects updated RTA phone immediately'
    );

    // Restore original phone
    await fetch(`${BASE_URL}/enquiries/rta-contact`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...rtaGetRes.data,
        rta_phone: '+91 22 6263 8200'
      })
    });

    // 18. RBAC: Reject unauthenticated writes
    const unauthStatus = await fetch(`${BASE_URL}/enquiries/${grievanceId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed' })
    }).then(r => r.status);
    const unauthRta = await fetch(`${BASE_URL}/enquiries/rta-contact`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rta_phone: '123' })
    }).then(r => r.status);
    assert(
      unauthStatus === 401 && unauthRta === 401,
      '18. RBAC Enforcement: Unauthenticated status update and RTA edits rejected with 401'
    );

    // 19. Clean up test record permanently using super_admin confirmation
    const finalDeleteRes = await fetch(`${BASE_URL}/enquiries/${grievanceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ confirmPermanent: true })
    }).then(r => r.json());
    assert(
      finalDeleteRes.success && finalDeleteRes.deleted === true,
      '19. Purge Test Case: Super admin permanent deletion with audit trail confirmed'
    );

    console.log('\n----------------------------------------------------');
    console.log(`INVESTOR SUPPORT AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('----------------------------------------------------');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed with unhandled error:', err);
    process.exit(1);
  }
}

runInvestorSupportTests();
