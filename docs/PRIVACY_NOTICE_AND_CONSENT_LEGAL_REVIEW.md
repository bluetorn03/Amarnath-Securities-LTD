# AMARNATH SECURITIES LIMITED
**CIN**: `L67120GJ1994PLC023254` | **BSE Scrip Code**: `538465` | **ISIN**: `INE745P01010`  
**Registered Office**: 1/104, Sarthik Complex, Sarkhej - Gandhinagar Hwy, Satellite, Ahmedabad, Gujarat 380015  
**Corporate Office**: 1104, A Wing, Naman Midtown, Senapati Bapat Marg, Elphinstone Road, Mumbai 400013  

---

## INSTITUTIONAL DATA PRIVACY NOTICE & AFFIRMATIVE CONSENT DRAFT
### For Formal Review and Minuted Approval by Company Secretary & Legal Counsel

> [!IMPORTANT]
> **STATUTORY STATUS: PENDING LEGAL APPROVAL**  
> In compliance with institutional governance standards, this document contains the draft Privacy Notice, affirmative consent clauses, and data principal rights architecture implemented on the Amarnath Securities Limited portal. Formal certification under the Digital Personal Data Protection (DPDP) Act, 2023 remains strictly **PENDING** until formal sign-off and minuted confirmation by the Company Secretary and Legal Counsel.

---

### PART 1: COMPREHENSIVE PRIVACY NOTICE
*(Rendered on the Public Website via the "Privacy Notice & Data Rights" Modal and Footer Link)*

#### 1. Identity of the Data Fiduciary
**Amarnath Securities Limited** (hereinafter referred to as "the Company", "we", "us", or "our"), incorporated under the Companies Act, 1956 and listed on the BSE Limited, acts as a **Data Fiduciary** in relation to any personal data collected via its institutional website (`https://amarnathsecuritiesltd.com`) and associated digital services.

- **Corporate Identity Number (CIN)**: `L67120GJ1994PLC023254`
- **Exchange Listing**: BSE Limited (`Scrip Code: 538465`)
- **Official Compliance Email**: `compliance@amarnathsecuritiesltd.com` / `investors@amarnathsecuritiesltd.com`

---

#### 2. Categories of Personal Data Collected
We collect and process personal data strictly necessary for legitimate statutory, corporate, and investor relations purposes:

1. **Investor Support & Grievances**:
   - Full Legal Name
   - Email Address & Contact Telephone Number
   - Demat Account Number / DP ID / Folio Number
   - Nature of Grievance (e.g., Transfer of Shares, Non-receipt of Dividend, Annual Report requests)
   - Supporting documentation voluntarily uploaded by the shareholder
2. **Corporate & Business Enquiries**:
   - Contact Person Name & Official Designation
   - Corporate Email Address & Phone Number
   - Entity / Company Name
   - Service Interest & Estimated Capital / Transaction Scope
3. **Automated Technical Telemetry**:
   - Anonymized Network IP Address (the final octet is masked, e.g., `198.51.100.0/24`, to ensure data principals cannot be directly identified)
   - User-Agent, browser type, and timestamp of access for cybersecurity incident monitoring and rate limiting.

---

#### 3. Specific Lawful Purposes & Legal Bases of Processing
The Company processes personal data under the following lawful grounds:
- **Statutory & Regulatory Obligations**: Fulfilling mandatory investor grievance redressal obligations under Regulation 13 of the Securities and Exchange Board of India (Listing Obligations and Disclosure Requirements) Regulations, 2015 ("SEBI LODR").
- **Statutory Corporate Communications**: Compliance with Sections 20, 101, and 136 of the Companies Act, 2013 regarding delivery of notices, financial statements, and corporate resolutions.
- **Explicit Affirmative Consent**: Processing corporate and commercial inquiries upon explicit, voluntary submission by the data principal.

---

#### 4. Retention Schedule
- **Investor Grievance Records**: Retained for a mandatory statutory period of **seven (7) years** from resolution in alignment with SEBI LODR Regulation 13 and Companies (Management and Administration) Rules, 2014.
- **Corporate & Business Enquiries**: Retained for **one (1) year** from date of resolution or business correspondence termination, after which records are purged.
- **Server Telemetry & Audit Logs**: Retained in encrypted storage for **one (1) year** for cybersecurity audit verification before cryptographic purging.

---

#### 5. Data Principal Rights Under Indian Law
Subject to statutory verification and regulatory archiving mandates, data principals possess the following rights:
1. **Right to Access & Summary**: The right to request a summary of personal data held by the Company.
2. **Right to Correction & Erasure**: The right to request correction of inaccurate, misleading, or outdated personal data.
3. **Right of Grievance Redressal**: The right to direct grievances regarding data processing directly to the designated Grievance Officer.
4. **Right to Nominate**: The right to nominate an authorized representative in accordance with DPDP provisions in the event of death or incapacity.

---

#### 6. Information Security & Technical Safeguards
To safeguard personal and financial data, the Company maintains institutional-grade technical controls:
- **At-Rest Encryption**: Database snapshots and sensitive archives are encrypted using authenticated **AES-256-GCM** with isolated cryptographic keys.
- **In-Transit Encryption**: All communication is enforced over **HTTPS / TLS 1.3** with strict Content Security Policy (`CSP`), `X-Frame-Options: DENY`, and strict CORS origin validation.
- **Access Controls & Auditability**: Role-Based Access Control (`RBAC`) enforced via cryptographically signed JWT tokens with immutable append-only audit logging.

---

#### 7. Grievance Redressal Mechanism & Officer Coordinates
In accordance with Information Technology Act, 2000, SEBI regulations, and the DPDP Act, 2023, data principals may direct privacy inquiries or grievances to:

**Institutional Grievance Officer**:
- **Designation**: Compliance Officer & Grievance Redressal Head
- **Entity**: Amarnath Securities Limited
- **Postal Address**: 1104, A Wing, Naman Midtown, Senapati Bapat Marg, Elphinstone Road, Mumbai 400013
- **Dedicated Email**: `compliance@amarnathsecuritiesltd.com`
- **Investor Helpline**: `+91-22-4002-4000`

**Escalation Portals**:
- **SEBI SCORES 2.0**: `https://scores.sebi.gov.in`
- **SEBI SMART ODR**: `https://smartodr.in`
- **BSE Investor Portal**: `https://www.bseindia.com/investors`

---

### PART 2: AFFIRMATIVE CONSENT WORDING
*(Enforced on Contact & Grievance Submission Forms before Submit Button Activation)*

#### 1. General Corporate Enquiry Form
```
[ ] I hereby consent to Amarnath Securities Limited collecting and processing my contact details solely to evaluate and respond to this institutional corporate enquiry in accordance with the Company Privacy Notice. I understand that my data will not be sold or shared with unauthorized commercial third parties.
```
- **UI Behavior**: Submit button is disabled (`disabled={!consentChecked}`) until explicit affirmative tick is registered.

#### 2. Investor Grievance Redressal Form
```
[ ] I confirm that I am a bonafide shareholder or authorized representative of Amarnath Securities Limited (BSE: 538465). I expressly consent to the processing of my folio/demat identifiers by the Company and its Registrar and Share Transfer Agent (Bigshare Services Pvt. Ltd.) strictly for statutory grievance redressal under SEBI (LODR) Regulations, 2015.
```
- **UI Behavior**: Submit button is disabled (`disabled={!consentChecked}`) until explicit affirmative tick is registered.

---

### PART 3: FORMAL LEGAL CONFIRMATION SIGN-OFF SHEET
*(To be completed by the Company Secretary / Legal Counsel)*

| Review Item | Legal Counsel Assessment | Status |
|---|---|:---:|
| Identification of Data Fiduciary (CIN, Scrip, ISIN) | Validated against MCA master data and BSE records | [ ] APPROVED |
| Lawful Basis: SEBI LODR Reg 13 Alignment | Statutory requirement for investor grievance logs | [ ] APPROVED |
| Retention Schedules (7-Year LODR vs. 1-Year Commercial) | Aligned with Companies Act retention mandates | [ ] APPROVED |
| Affirmative Consent Checkbox Mechanics | Unbundled, affirmative, clear language verified | [ ] APPROVED |
| Grievance Officer & Escalation Coordinates (SCORES/SMART ODR) | Contact coordinates verified active | [ ] APPROVED |
| **Formal DPDP Compliance Certification** | **Subject to Board / Minuted Committee Review** | **[ ] PENDING LEGAL REVIEW** |

**Reviewing Authority**:  
Name: _________________________________________________  
Designation: **Company Secretary & Compliance Officer / Legal Counsel**  
Signature: _____________________________________________  
Date: ________________________  
