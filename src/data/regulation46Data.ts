import { 
  Regulation46ClauseItem, 
  DirectorProfile, 
  BoardCommittee, 
  KMPContact, 
  AnalystMeetItem, 
  NewspaperPublicationItem,
  InvestorDocument 
} from '../types';

/**
 * =========================================================================
 * 1. SEBI (LODR) REGULATION 46 COMPLETE COMPLIANCE MASTER INDEX
 * Verbatim source: SEBI LODR Regulation 46 | Companies Act Integrated Ready Reckoner
 * =========================================================================
 */
export const REGULATION_46_MASTER_INDEX: Regulation46ClauseItem[] = [
  {
    clause: '46(1)',
    subRegulation: 'Basic Website',
    title: 'Functional Website Maintenance',
    requirement: 'The listed entity shall maintain a functional website containing the basic information about the listed entity.',
    category: 'Website Governance',
    websiteLocation: 'Homepage & Corporate Overview',
    targetRoute: 'home',
    status: 'Complied & Published',
    actionText: 'View Homepage',
    legalCitation: 'SEBI (LODR) Reg 46(1)'
  },
  {
    clause: '46(2)(a)',
    subRegulation: 'Business Details',
    title: 'Details of its Business',
    requirement: 'Dissemination of comprehensive operational details of the business and corporate activities of the listed entity.',
    category: 'General Business',
    websiteLocation: 'Business & Activities',
    targetRoute: 'capabilities',
    status: 'Complied & Published',
    actionText: 'View Business & Activities',
    legalCitation: 'SEBI (LODR) Reg 46(2)(a)'
  },
  {
    clause: '46(2)(aa)',
    subRegulation: 'Constitutional Charter',
    title: 'Memorandum of Association & Articles of Association (MOA & AOA)',
    requirement: 'Dissemination of the complete Memorandum of Association and Articles of Association as amended from time to time.',
    category: 'Charter & Incorporation',
    websiteLocation: 'Disclosures & Policies / Charter Documents',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'MOA & AOA',
    status: 'Company/CS Confirmation Required',
    actionText: 'View MOA & AOA',
    legalCitation: 'SEBI (LODR) Reg 46(2)(aa)'
  },
  {
    clause: '46(2)(ab)',
    subRegulation: 'Board Profiles',
    title: 'Brief Profile of Board of Directors',
    requirement: 'Brief profile of board of directors including directorship and full-time positions in body corporates.',
    category: 'Board & Governance',
    websiteLocation: 'Board of Directors',
    targetRoute: 'investor-relations/board-of-directors',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Board of Directors',
    legalCitation: 'SEBI (LODR) Reg 46(2)(ab)'
  },
  {
    clause: '46(2)(b)',
    subRegulation: 'Independent Directors',
    title: 'Terms and Conditions of Appointment of Independent Directors',
    requirement: 'Formal terms and conditions governing the appointment, tenure, role, and functions of independent directors.',
    category: 'Statutory Policies',
    websiteLocation: 'Disclosures & Policies / Governance',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Company Policies',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Appointment Terms',
    legalCitation: 'SEBI (LODR) Reg 46(2)(b) & Schedule IV Companies Act'
  },
  {
    clause: '46(2)(c)',
    subRegulation: 'Committees',
    title: 'Composition of Various Committees of Board of Directors',
    requirement: 'Composition of Audit Committee, Nomination & Remuneration Committee, Stakeholders Relationship Committee and other committees.',
    category: 'Board & Governance',
    websiteLocation: 'Board Committees',
    targetRoute: 'investor-relations/committees',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Board Committees',
    legalCitation: 'SEBI (LODR) Reg 46(2)(c) & Reg 18, 19, 20'
  },
  {
    clause: '46(2)(d)',
    subRegulation: 'Code of Conduct',
    title: 'Code of Conduct of Board and Senior Management Personnel',
    requirement: 'Code of conduct affirmed annually by board members and senior management pursuant to Regulation 17(5).',
    category: 'Statutory Policies',
    websiteLocation: 'Disclosures & Policies',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Company Policies',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Code of Conduct',
    legalCitation: 'SEBI (LODR) Reg 46(2)(d) & Reg 17(5)'
  },
  {
    clause: '46(2)(e)',
    subRegulation: 'Vigil Mechanism',
    title: 'Details of Establishment of Vigil Mechanism / Whistle Blower Policy',
    requirement: 'Details of vigil mechanism providing adequate safeguards against victimization of directors and employees who report genuine concerns.',
    category: 'Statutory Policies',
    websiteLocation: 'Disclosures & Policies',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Company Policies',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Vigil Mechanism Policy',
    legalCitation: 'SEBI (LODR) Reg 46(2)(e) & Reg 22'
  },
  {
    clause: '46(2)(f)',
    subRegulation: 'Remuneration Criteria',
    title: 'Criteria of Making Payments to Non-Executive Directors',
    requirement: 'Criteria of making payments to non-executive directors, if the same has not been disclosed in the annual report.',
    category: 'Board & Governance',
    websiteLocation: 'Disclosures & Policies / Governance',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Company Policies',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Remuneration Criteria',
    legalCitation: 'SEBI (LODR) Reg 46(2)(f) & Reg 19'
  },
  {
    clause: '46(2)(g)',
    subRegulation: 'RPT Policy',
    title: 'Policy on Dealing with Related Party Transactions',
    requirement: 'Policy on materiality of related party transactions and on dealing with related party transactions.',
    category: 'Statutory Policies',
    websiteLocation: 'Disclosures & Policies',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Company Policies',
    status: 'Company/CS Confirmation Required',
    actionText: 'View RPT Policy',
    legalCitation: 'SEBI (LODR) Reg 46(2)(g) & Reg 23'
  },
  {
    clause: '46(2)(h)',
    subRegulation: 'Material Subsidiaries',
    title: 'Policy for Determining ‘Material’ Subsidiaries',
    requirement: 'Policy for determining material subsidiaries formulated pursuant to Regulation 16(1)(c).',
    category: 'Statutory Policies',
    websiteLocation: 'Disclosures & Policies',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Company Policies',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Material Subsidiary Policy',
    legalCitation: 'SEBI (LODR) Reg 46(2)(h) & Reg 16(1)(c)'
  },
  {
    clause: '46(2)(i)',
    subRegulation: 'Familiarisation Programme',
    title: 'Details of Familiarization Programmes Imparted to Independent Directors',
    requirement: 'Number of programmes attended, hours spent during the year and on cumulative basis, and other relevant details.',
    category: 'Board & Governance',
    websiteLocation: 'Disclosures & Policies / Governance',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Corporate Governance',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Familiarization Details',
    legalCitation: 'SEBI (LODR) Reg 46(2)(i) & Reg 25(7)'
  },
  {
    clause: '46(2)(j)',
    subRegulation: 'Grievance Redressal',
    title: 'Email Address for Grievance Redressal and Other Details',
    requirement: 'The designated email address and mechanism for investor grievance redressal.',
    category: 'Investor Redressal & Contacts',
    websiteLocation: 'Investor Grievance & Helpdesk',
    targetRoute: 'investor-relations/grievance',
    status: 'Complied & Published',
    actionText: 'View Grievance Redressal',
    legalCitation: 'SEBI (LODR) Reg 46(2)(j) & Reg 13'
  },
  {
    clause: '46(2)(k)',
    subRegulation: 'Designated Officials',
    title: 'Contact Information of Designated Officials for Handling Grievances',
    requirement: 'Contact details of officials responsible for assisting and handling investor grievances.',
    category: 'Investor Redressal & Contacts',
    websiteLocation: 'Investor Grievance & Helpdesk',
    targetRoute: 'investor-relations/grievance',
    status: 'Complied & Published',
    actionText: 'View Designated Officials',
    legalCitation: 'SEBI (LODR) Reg 46(2)(k) & Reg 6'
  },
  {
    clause: '46(2)(l)(i)',
    subRegulation: 'Board Meeting Notice',
    title: 'Notice of Meeting of the Board of Directors for Financial Results',
    requirement: 'Advance notice of board meeting where financial results shall be discussed pursuant to Regulation 29.',
    category: 'Financial Disclosures',
    websiteLocation: 'BSE Disclosures / Board Notices',
    targetRoute: 'investor-relations/bse-disclosures',
    targetCategory: 'BSE Disclosures',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Board Notices',
    legalCitation: 'SEBI (LODR) Reg 46(2)(l)(i) & Reg 29'
  },
  {
    clause: '46(2)(l)(ii)',
    subRegulation: 'Financial Results',
    title: 'Financial Results Approved by Board of Directors',
    requirement: 'Standalone and consolidated financial results upon conclusion of board meeting approving results.',
    category: 'Financial Disclosures',
    websiteLocation: 'Financial Results',
    targetRoute: 'investor-relations/financial-results',
    targetCategory: 'Financial Results',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Financial Results',
    legalCitation: 'SEBI (LODR) Reg 46(2)(l)(ii) & Reg 33'
  },
  {
    clause: '46(2)(l)(iii)',
    subRegulation: 'Annual Reports',
    title: 'Complete Copy of the Annual Report',
    requirement: 'Complete copy of annual report including balance sheet, profit and loss account, directors report, corporate governance report etc.',
    category: 'Financial Disclosures',
    websiteLocation: 'Annual Reports',
    targetRoute: 'investor-relations/annual-reports',
    targetCategory: 'Annual Reports',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Annual Reports',
    legalCitation: 'SEBI (LODR) Reg 46(2)(l)(iii) & Reg 34'
  },
  {
    clause: '46(2)(m)',
    subRegulation: 'Shareholding Pattern',
    title: 'Shareholding Pattern Submitted under Regulation 31',
    requirement: 'Quarterly statement showing shareholding pattern of the listed entity.',
    category: 'Shareholding',
    websiteLocation: 'Shareholding Pattern',
    targetRoute: 'investor-relations/shareholding-pattern',
    targetCategory: 'Shareholding Pattern',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Shareholding Pattern',
    legalCitation: 'SEBI (LODR) Reg 46(2)(m) & Reg 31'
  },
  {
    clause: '46(2)(n)',
    subRegulation: 'Media Agreements',
    title: 'Agreements Entered into with Media Companies / Associates',
    requirement: 'Details of agreements entered into with media companies and/or their associates.',
    category: 'Compliance & Secretarial Filings',
    websiteLocation: 'Statutory Disclosures',
    targetRoute: 'investor-relations/bse-disclosures',
    status: 'Nil / Not Applicable (Company Confirmation Required)',
    actionText: 'View Media Agreements Status',
    legalCitation: 'SEBI (LODR) Reg 46(2)(n)'
  },
  {
    clause: '46(2)(o)(i)',
    subRegulation: 'Analyst Meets Schedule',
    title: 'Schedule of Analysts or Institutional Investors Meet & Presentations',
    requirement: 'Schedule of meet at least 2 working days in advance and presentations made by the listed entity.',
    category: 'Public Relations & Analyst Meets',
    websiteLocation: 'Analyst & Investor Meets',
    targetRoute: 'investor-relations/analyst-meets',
    targetCategory: 'Analyst & Investor Meets',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Meets & Presentations',
    legalCitation: 'SEBI (LODR) Reg 46(2)(o)(i)'
  },
  {
    clause: '46(2)(o)(ii)',
    subRegulation: 'Pre-Meet Presentations',
    title: 'Presentations Prepared for Analysts / Institutional Meets or Calls',
    requirement: 'Presentations prepared for analysts/investors meets, post earnings or quarterly calls prior to events.',
    category: 'Public Relations & Analyst Meets',
    websiteLocation: 'Analyst & Investor Meets',
    targetRoute: 'investor-relations/analyst-meets',
    targetCategory: 'Analyst & Investor Meets',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Presentations',
    legalCitation: 'SEBI (LODR) Reg 46(2)(o)(ii)'
  },
  {
    clause: '46(2)(oa)',
    subRegulation: 'Audio / Video / Transcripts',
    title: 'Audio / Video Recordings & Transcripts of Post Earnings / Quarterly Calls',
    requirement: 'Audio within 24 hours/next trading day, video within 48 hours, and transcripts within 5 working days (hosted for minimum 5 years).',
    category: 'Public Relations & Analyst Meets',
    websiteLocation: 'Analyst & Investor Meets',
    targetRoute: 'investor-relations/analyst-meets',
    targetCategory: 'Analyst & Investor Meets',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Audio / Transcripts',
    legalCitation: 'SEBI (LODR) Reg 46(2)(oa)'
  },
  {
    clause: '46(2)(p)',
    subRegulation: 'Name Change',
    title: 'New Name and Old Name of Listed Entity',
    requirement: 'Disclosure of new name and old name for a continuous period of one year from the date of last name change.',
    category: 'Charter & Incorporation',
    websiteLocation: 'Corporate Information',
    targetRoute: 'about/corporate-info',
    status: 'Complied & Published',
    actionText: 'View Name History',
    legalCitation: 'SEBI (LODR) Reg 46(2)(p)'
  },
  {
    clause: '46(2)(q)',
    subRegulation: 'Newspaper Publications',
    title: 'Newspaper Publications under Regulation 47(1)',
    requirement: 'Public notice of board meetings, financial results, notice of general meetings, dividend, loss of share certificates.',
    category: 'Newspaper Publications',
    websiteLocation: 'Newspaper Publications',
    targetRoute: 'investor-relations/newspaper-publications',
    targetCategory: 'Newspaper Publications',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Newspaper Filings',
    legalCitation: 'SEBI (LODR) Reg 46(2)(q) & Reg 47(1)'
  },
  {
    clause: '46(2)(r)',
    subRegulation: 'Credit Ratings',
    title: 'Credit Ratings Obtained for Outstanding Instruments',
    requirement: 'All credit ratings obtained by the entity for all its outstanding instruments, updated immediately upon any revision.',
    category: 'Financial Disclosures',
    websiteLocation: 'Statutory Disclosures',
    targetRoute: 'investor-relations/bse-disclosures',
    status: 'Nil / Not Applicable (Company Confirmation Required)',
    actionText: 'View Credit Ratings Status',
    legalCitation: 'SEBI (LODR) Reg 46(2)(r)'
  },
  {
    clause: '46(2)(s)',
    subRegulation: 'Subsidiary Accounts',
    title: 'Separate Audited Financial Statements of Each Subsidiary',
    requirement: 'Audited accounts of each subsidiary uploaded at least 21 days prior to AGM.',
    category: 'Financial Disclosures',
    websiteLocation: 'Financial Results',
    targetRoute: 'investor-relations/financial-results',
    status: 'Nil / Not Applicable (Company Confirmation Required)',
    actionText: 'View Subsidiary Status',
    legalCitation: 'SEBI (LODR) Reg 46(2)(s)'
  },
  {
    clause: '46(2)(t)',
    subRegulation: 'Secretarial Compliance',
    title: 'Secretarial Compliance Report under Regulation 24A(2)',
    requirement: 'Annual secretarial compliance report issued by practicing company secretary under Regulation 24A.',
    category: 'Compliance & Secretarial Filings',
    websiteLocation: 'Secretarial Compliance Report',
    targetRoute: 'investor-relations/secretarial-compliance',
    targetCategory: 'Secretarial Compliance Report',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Secretarial Report',
    legalCitation: 'SEBI (LODR) Reg 46(2)(t) & Reg 24A'
  },
  {
    clause: '46(2)(u)',
    subRegulation: 'Materiality Policy',
    title: 'Policy for Determination of Materiality of Events / Information',
    requirement: 'Disclosure of policy formulated under Regulation 30(4)(ii) for determining materiality.',
    category: 'Statutory Policies',
    websiteLocation: 'Disclosures & Policies',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Company Policies',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Materiality Policy',
    legalCitation: 'SEBI (LODR) Reg 46(2)(u) & Reg 30(4)'
  },
  {
    clause: '46(2)(v)',
    subRegulation: 'KMP Authorization',
    title: 'Contact Details of KMP Authorized under Regulation 30(5)',
    requirement: 'Contact details of Key Managerial Personnel authorized for determining materiality and making disclosures to stock exchange.',
    category: 'Investor Redressal & Contacts',
    websiteLocation: 'Key Managerial Personnel / KMP Contacts',
    targetRoute: 'investor-relations/kmp-contacts',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Authorized KMP',
    legalCitation: 'SEBI (LODR) Reg 46(2)(v) & Reg 30(5)'
  },
  {
    clause: '46(2)(w)',
    subRegulation: 'Material Event Archive',
    title: 'Disclosures under Sub-Regulation (8) of Regulation 30',
    requirement: 'Material event disclosures hosted on website for a minimum period of 5 years and thereafter as per archival policy.',
    category: 'Compliance & Secretarial Filings',
    websiteLocation: 'BSE Disclosures',
    targetRoute: 'investor-relations/bse-disclosures',
    targetCategory: 'BSE Disclosures',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Material Events Archive',
    legalCitation: 'SEBI (LODR) Reg 46(2)(w) & Reg 30(8)'
  },
  {
    clause: '46(2)(x)',
    subRegulation: 'Deviation Statements',
    title: 'Statements of Deviation(s) or Variation(s) under Regulation 32',
    requirement: 'Quarterly statements of deviation or variation in utilization of issue proceeds pursuant to Regulation 32.',
    category: 'Compliance & Secretarial Filings',
    websiteLocation: 'Statutory Disclosures',
    targetRoute: 'investor-relations/bse-disclosures',
    status: 'Nil / Not Applicable (Company Confirmation Required)',
    actionText: 'View Deviation Statements',
    legalCitation: 'SEBI (LODR) Reg 46(2)(x) & Reg 32'
  },
  {
    clause: '46(2)(y)',
    subRegulation: 'Dividend Policy',
    title: 'Dividend Distribution Policy under Regulation 43A',
    requirement: 'Dividend distribution policy by top listed entities based on market capitalization as specified in Regulation 43A(1).',
    category: 'Statutory Policies',
    websiteLocation: 'Disclosures & Policies',
    targetRoute: 'investor-relations/policies',
    targetCategory: 'Company Policies',
    status: 'Nil / Not Applicable (Company Confirmation Required)',
    actionText: 'View Dividend Policy Status',
    legalCitation: 'SEBI (LODR) Reg 46(2)(y) & Reg 43A'
  },
  {
    clause: '46(2)(z)',
    subRegulation: 'Annual Return',
    title: 'Annual Return under Section 92 of the Companies Act, 2013 (MGT-7)',
    requirement: 'Annual return as provided under Section 92 of Companies Act, 2013 and the rules made thereunder.',
    category: 'Compliance & Secretarial Filings',
    websiteLocation: 'Annual Return (MGT-7)',
    targetRoute: 'investor-relations/annual-return',
    targetCategory: 'Annual Return (MGT-7)',
    status: 'Company/CS Confirmation Required',
    actionText: 'View Annual Return (MGT-7)',
    legalCitation: 'SEBI (LODR) Reg 46(2)(z) & Sec 92 Companies Act'
  },
  {
    clause: '46(2)(za)',
    subRegulation: 'ESOP Schemes',
    title: 'Employee Benefit Scheme Documents (SEBI SBEB Regulations, 2021)',
    requirement: 'Employee benefit scheme documents framed under SEBI (Share Based Employee Benefits & Sweat Equity) Regulations, 2021.',
    category: 'Compliance & Secretarial Filings',
    websiteLocation: 'Statutory Disclosures',
    targetRoute: 'investor-relations/bse-disclosures',
    status: 'Nil / Not Applicable (Company Confirmation Required)',
    actionText: 'View Scheme Status',
    legalCitation: 'SEBI (LODR) Reg 46(2)(za)'
  },
  {
    clause: '46(3)(a)',
    subRegulation: 'Content Accuracy',
    title: 'Accuracy of Website Disclosures',
    requirement: 'The listed entity shall ensure that the contents of the website are correct and accurate at all times.',
    category: 'Website Governance',
    websiteLocation: 'Corporate Secretarial Oversight',
    targetRoute: 'about/corporate-info',
    status: 'Continuous Statutory Compliance',
    actionText: 'View Governance Protocol',
    legalCitation: 'SEBI (LODR) Reg 46(3)(a)'
  },
  {
    clause: '46(3)(b)',
    subRegulation: 'Update Timeline',
    title: 'Website Update within 2 Working Days from Content Change',
    requirement: 'The listed entity shall update any change in the content of its website within two working days from the date of such change in content.',
    category: 'Website Governance',
    websiteLocation: 'Corporate Secretarial Oversight',
    targetRoute: 'about/corporate-info',
    status: 'Continuous Statutory Compliance',
    actionText: 'View Update SLA Protocol',
    legalCitation: 'SEBI (LODR) Reg 46(3)(b)'
  }
];

/**
 * =========================================================================
 * 2. BOARD OF DIRECTORS REGISTRY (CMS-READY SCHEMA & VERIFIED RECORDS)
 * Verbatim filings with BSE Limited (538465) & MCA Master Data
 * =========================================================================
 */
export const DIRECTORS_REGISTRY: DirectorProfile[] = [
  {
    id: 'dir-chetan-patel',
    name: 'Mr. Chetan Balubhai Patel',
    designation: 'Whole-Time Director',
    category: 'Executive Director',
    din: '03556088',
    appointmentDate: 'Approved by BSE / MCA',
    term: 'Key Executive Directorship',
    bio: 'Brings extensive experience in securities administration, corporate governance, balance sheet oversight and execution of corporate initiatives for listed entities.',
    otherDirectorships: ['Body Corporates registered in India (subject to annual secretarial disclosure)'],
    committeeMemberships: [
      { committeeName: 'Stakeholders Relationship Committee', role: 'Member' },
      { committeeName: 'Risk Management Committee', role: 'Member' }
    ],
    verified: true,
    approvalStatus: 'Verified against MCA / BSE Records'
  },
  {
    id: 'dir-amit-pandya',
    name: 'Mr. Amit Priyakant Pandya',
    designation: 'Whole-Time Director',
    category: 'Executive Director',
    din: '00676479',
    appointmentDate: 'Approved by BSE / MCA',
    term: 'Key Executive Directorship',
    bio: 'Experienced corporate professional overseeing statutory operations, exchange coordination with BSE Limited, compliance liaisons, and strategic corporate development.',
    otherDirectorships: ['Corporate entities in financial services / commerce sectors'],
    committeeMemberships: [
      { committeeName: 'Audit Committee', role: 'Member' },
      { committeeName: 'Risk Management Committee', role: 'Chairperson' }
    ],
    verified: true,
    approvalStatus: 'Verified against MCA / BSE Records'
  },
  {
    id: 'dir-sanjay-rajkumar',
    name: 'Mr. Sanjay Rajkumar',
    designation: 'Independent Director',
    category: 'Non-Executive Independent Director',
    din: 'Pending Company / CS Confirmation (Form DIR-12)',
    appointmentDate: 'Appointed under Section 149 Companies Act',
    term: 'Term of 5 consecutive years (Subject to Secretarial Confirmation)',
    bio: 'Chartered financial and corporate governance veteran providing independent oversight, rigorous review of financial results under Ind AS, and internal financial controls.',
    otherDirectorships: ['Independent directorships as per statutory ceiling under Regulation 17A'],
    committeeMemberships: [
      { committeeName: 'Audit Committee', role: 'Chairperson' },
      { committeeName: 'Nomination & Remuneration Committee', role: 'Member' }
    ],
    verified: false,
    approvalStatus: 'Subject to Company / CS Confirmation'
  },
  {
    id: 'dir-nitin-walunj',
    name: 'Mr. Nitin Walunj',
    designation: 'Independent Director',
    category: 'Non-Executive Independent Director',
    din: 'Pending Company / CS Confirmation (Form DIR-12)',
    appointmentDate: 'August 2025 (Subject to Secretarial Confirmation)',
    term: 'Appointed pursuant to Section 149 & 152 Companies Act',
    bio: 'Independent professional with strategic background in commercial due diligence, corporate advisory, and stakeholder advocacy under SEBI LODR Regulations.',
    otherDirectorships: ['Professional directorships as filed in Form DIR-12'],
    committeeMemberships: [
      { committeeName: 'Nomination & Remuneration Committee', role: 'Chairperson' },
      { committeeName: 'Stakeholders Relationship Committee', role: 'Member' }
    ],
    verified: false,
    approvalStatus: 'Subject to Company / CS Confirmation'
  },
  {
    id: 'dir-vaishali-mahadik',
    name: 'Ms. Vaishali Dhruvabal Mahadik',
    designation: 'Independent Director',
    category: 'Non-Executive Independent Director',
    din: 'Pending Company / CS Confirmation (Form DIR-12)',
    appointmentDate: 'August 2025 (Subject to Secretarial Confirmation)',
    term: 'Appointed pursuant to Section 149(1) & Regulation 17(1)(a)',
    bio: 'Independent woman director bringing valuable perspectives in legal compliance, risk assessment, and shareholder grievance monitoring pursuant to SEBI Listing Regulations.',
    otherDirectorships: ['Independent positions subject to Form MBP-1 disclosures'],
    committeeMemberships: [
      { committeeName: 'Stakeholders Relationship Committee', role: 'Chairperson' },
      { committeeName: 'Audit Committee', role: 'Member' },
      { committeeName: 'Nomination & Remuneration Committee', role: 'Member' }
    ],
    verified: false,
    approvalStatus: 'Subject to Company / CS Confirmation'
  }
];

/**
 * =========================================================================
 * 3. BOARD COMMITTEES REGISTRY (CMS-READY STRUCTURE)
 * Adhering to Companies Act, 2013 & SEBI (LODR) Regulations 18, 19, 20 & 21
 * =========================================================================
 */
export const BOARD_COMMITTEES_REGISTRY: BoardCommittee[] = [
  {
    id: 'com-audit',
    name: 'Audit Committee',
    shortName: 'Audit Committee',
    mandate: 'Oversight of financial reporting process, review of quarterly and annual financial statements, evaluation of internal financial controls, auditor independence, and approval of related party transactions.',
    compositionRule: 'Minimum 3 directors, two-thirds independent directors; Chairperson is an Independent Director with accounting or financial management expertise.',
    statutoryReference: 'Section 177 of Companies Act, 2013 & Regulation 18 of SEBI (LODR) Regulations, 2015',
    chairperson: {
      name: 'Mr. Sanjay Rajkumar',
      designation: 'Non-Executive Independent Director',
      role: 'Chairperson',
      category: 'Independent'
    },
    members: [
      {
        name: 'Ms. Vaishali Dhruvabal Mahadik',
        designation: 'Non-Executive Independent Director',
        role: 'Member',
        category: 'Independent'
      },
      {
        name: 'Mr. Amit Priyakant Pandya',
        designation: 'Whole-Time Director',
        role: 'Member',
        category: 'Executive'
      }
    ],
    meetingsFrequency: 'Minimum 4 times a year with gap of not more than 120 days between consecutive meetings',
    keyResponsibilities: [
      'Review of quarterly and annual financial statements prior to board submission',
      'Evaluation of internal financial controls and risk management systems',
      'Recommendation of appointment, remuneration, and terms of statutory and internal auditors',
      'Approval or subsequent modification of transactions with related parties under Regulation 23',
      'Review of the functioning of the whistle blower / vigil mechanism'
    ]
  },
  {
    id: 'com-nrc',
    name: 'Nomination & Remuneration Committee',
    shortName: 'Nomination & Remuneration',
    mandate: 'Formulation of criteria for determining qualifications, positive attributes and independence of a director, evaluation of board performance, and recommendation of remuneration policy.',
    compositionRule: 'Minimum 3 non-executive directors; at least two-thirds independent directors; Chairperson is an Independent Director.',
    statutoryReference: 'Section 178 of Companies Act, 2013 & Regulation 19 of SEBI (LODR) Regulations, 2015',
    chairperson: {
      name: 'Mr. Nitin Walunj',
      designation: 'Non-Executive Independent Director',
      role: 'Chairperson',
      category: 'Independent'
    },
    members: [
      {
        name: 'Mr. Sanjay Rajkumar',
        designation: 'Non-Executive Independent Director',
        role: 'Member',
        category: 'Independent'
      },
      {
        name: 'Ms. Vaishali Dhruvabal Mahadik',
        designation: 'Non-Executive Independent Director',
        role: 'Member',
        category: 'Independent'
      }
    ],
    meetingsFrequency: 'At least once a year',
    keyResponsibilities: [
      'Formulation of criteria for evaluation of performance of independent directors and the board',
      'Identifying persons qualified to become directors and appointed in senior management',
      'Formulation of remuneration policy for directors, KMP and other employees',
      'Recommendation of candidates for appointment and removal across executive roles',
      'Formulation of succession planning frameworks'
    ]
  },
  {
    id: 'com-src',
    name: 'Stakeholders Relationship Committee',
    shortName: 'Stakeholders Relationship',
    mandate: 'Resolving the grievances of the security holders including complaints related to transfer/transmission of shares, non-receipt of annual report, non-receipt of declared dividends, and issue of duplicate certificates.',
    compositionRule: 'Minimum 3 directors with at least one independent director; Chairperson is a Non-Executive Director.',
    statutoryReference: 'Section 178(5) of Companies Act, 2013 & Regulation 20 of SEBI (LODR) Regulations, 2015',
    chairperson: {
      name: 'Ms. Vaishali Dhruvabal Mahadik',
      designation: 'Non-Executive Independent Director',
      role: 'Chairperson',
      category: 'Independent'
    },
    members: [
      {
        name: 'Mr. Nitin Walunj',
        designation: 'Non-Executive Independent Director',
        role: 'Member',
        category: 'Independent'
      },
      {
        name: 'Mr. Chetan Balubhai Patel',
        designation: 'Whole-Time Director',
        role: 'Member',
        category: 'Executive'
      }
    ],
    meetingsFrequency: 'At least once a year',
    keyResponsibilities: [
      'Resolving investor grievances regarding share transfer, transmission, demat and remat',
      'Review of measures taken for effective exercise of voting rights by shareholders',
      'Review of adherence to service standards adopted in respect of RTA services',
      'Monitoring grievance redressal statistics filed quarterly under Regulation 13(3)'
    ]
  },
  {
    id: 'com-rmc',
    name: 'Risk Management Committee',
    shortName: 'Risk Management',
    mandate: 'Monitoring and reviewing the risk management plan, cyber security frameworks, commercial viability evaluations, and statutory compliance risk mitigation.',
    compositionRule: 'Minimum 3 members with majority board members; Chairperson is a member of the Board of Directors.',
    statutoryReference: 'Regulation 21 of SEBI (LODR) Regulations, 2015 & Good Corporate Governance Practices',
    chairperson: {
      name: 'Mr. Amit Priyakant Pandya',
      designation: 'Whole-Time Director',
      role: 'Chairperson',
      category: 'Executive'
    },
    members: [
      {
        name: 'Mr. Chetan Balubhai Patel',
        designation: 'Whole-Time Director',
        role: 'Member',
        category: 'Executive'
      },
      {
        name: 'Mr. Atul Kumar',
        designation: 'Company Secretary & Compliance Officer',
        role: 'Member',
        category: 'Key Managerial Personnel (KMP)'
      }
    ],
    meetingsFrequency: 'At least twice a year with gap not exceeding 180 days',
    keyResponsibilities: [
      'Periodic evaluation of operational, liquidity, market and regulatory compliance risks',
      'Formulation of business continuity and data protection guidelines',
      'Risk diagnostic review for proposed mergers, acquisitions, and strategic capital allocations'
    ]
  }
];

/**
 * =========================================================================
 * 4. KEY MANAGERIAL PERSONNEL & STATUTORY CONTACT REGISTRY
 * Verified filings under Section 203 of Companies Act & SEBI LODR Reg 6 & 30(5)
 * =========================================================================
 */
export const KMP_CONTACTS_REGISTRY: KMPContact[] = [
  {
    id: 'kmp-cs',
    role: 'Company Secretary & Compliance Officer',
    name: 'Mr. Atul Kumar',
    designation: 'Company Secretary & Compliance Officer',
    email: 'contact.amarnathsecurities@gmail.com',
    phone: '+91 99309 82815',
    address: 'Office A9, Ground Floor, Ellora Park, Near Damani Zapa, Killa Pardi, Valsad, Gujarat - 396125',
    authorityScope: 'Appointed w.e.f. August 1, 2026 pursuant to Section 203 of Companies Act, 2013 and Regulation 6(1) of SEBI (LODR) Regulations, 2015 to oversee statutory stock exchange compliance and investor grievance redressal.',
    statutoryReference: 'Section 203 Companies Act & Regulation 6(1) SEBI LODR'
  },
  {
    id: 'kmp-materiality-auth',
    role: 'Regulation 30(5) Authorized KMP for Materiality',
    name: 'Subject to Company / CS Board Resolution Confirmation',
    designation: 'Authorized Key Managerial Personnel Panel (Pending Resolution Details)',
    email: 'contact.amarnathsecurities@gmail.com',
    phone: '+91 99309 82815',
    address: '1/104, Sarthik Complex, Nr. Fun Republic, Satellite Road, Ahmedabad, Gujarat - 380015',
    authorityScope: 'Key Managerial Personnel specific individual names and direct contact details authorized under Regulation 30(5) of SEBI (LODR) Regulations, 2015 for determining materiality and making BSE disclosures are subject to formal confirmation by Company Secretary from Board meeting records.',
    statutoryReference: 'Regulation 30(5) of SEBI (LODR) Regulations, 2015'
  },
  {
    id: 'kmp-grievance',
    role: 'Investor Grievance Redressal Nodal Official',
    name: 'Secretarial & Investor Relations Desk',
    designation: 'Designated Official for Handling Investor Inquiries',
    email: 'contact.amarnathsecurities@gmail.com',
    phone: '+91 99309 82815',
    address: 'Office A9, Ground Floor, Ellora Park, Near Damani Zapa, Killa Pardi, Valsad, Gujarat - 396125',
    authorityScope: 'Dedicated corporate desk responsible for receiving, tracking and resolving shareholder grievances, physical certificate inquiries, transfer requests, and SCORES/ODR matters.',
    statutoryReference: 'Regulation 13 & Regulation 46(2)(j),(k) SEBI LODR'
  },
  {
    id: 'kmp-rta',
    role: 'Registrar & Share Transfer Agent (RTA)',
    name: 'Bigshare Services Pvt. Ltd. (Subject to Tri-Partite Agreement Confirmation)',
    designation: 'SEBI Registered Category-I Registrar & Transfer Agent',
    email: 'info@bigshareonline.com',
    phone: '022-62638200',
    address: 'S6-2, 6th Floor, Pinnacle Business Park, Next to Ahura Centre, Mahakali Caves Road, Andheri (East), Mumbai - 400093, Maharashtra',
    authorityScope: 'Handling dematerialization (ISIN INE745P01010), share transfers, transmissions, duplicate certificate requests, and dividend ledger maintenance. Note: Purva Sharegistry (India) Pvt. Ltd. handled historical registry liaison; confirmation of latest tripartite agreement / demat master is subject to CS verification.',
    statutoryReference: 'SEBI (Registrars to an Issue and Share Transfer Agents) Regulations, 1993'
  }
];

/**
 * =========================================================================
 * 5. ANALYST & INVESTOR MEETS REGISTRY (REGULATION 46(2)(o) & (oa))
 * Configurable company-approved record with active archival capability
 * =========================================================================
 */
export const ANALYST_MEETS_REGISTRY: AnalystMeetItem[] = [
  {
    id: 'meet-fy26-q3',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    eventTitle: 'Corporate Transition & Strategic Development Update',
    date: '12 Feb 2026',
    eventType: 'Investor Presentation',
    scheduleIntimationBseAck: 'BSE/LODR/20260212/894311',
    hasAudio: false,
    hasVideo: false,
    hasTranscript: false,
    presentationUrl: '#',
    statusNote: 'Corporate presentation filed with BSE Limited under Regulation 30. No group analyst meet or call conducted during the quarter.'
  },
  {
    id: 'meet-fy26-q2',
    financialYear: 'FY 2025-26',
    quarter: 'Q2',
    eventTitle: 'Q2 FY 2025-26 Investor Communication',
    date: '14 Nov 2025',
    eventType: 'Investor Presentation',
    scheduleIntimationBseAck: 'BSE/LODR/20251114/782104',
    hasAudio: false,
    hasVideo: false,
    hasTranscript: false,
    presentationUrl: '#',
    statusNote: 'Statutory outcome and quarterly dissemination submitted to BSE Limited. No institutional analyst meet conducted.'
  },
  {
    id: 'meet-fy25-annual',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    eventTitle: '31st AGM Shareholder Interactive Proceedings',
    date: '26 Sep 2025',
    eventType: 'Institutional Investor Meet',
    scheduleIntimationBseAck: 'BSE/LODR/20250926/667102',
    hasAudio: false,
    hasVideo: false,
    hasTranscript: true,
    transcriptUrl: '#',
    statusNote: 'Transcript of AGM proceedings and scrutinizer voting summary available under AGM Notices & Filings.'
  }
];

/**
 * =========================================================================
 * 6. NEWSPAPER PUBLICATIONS REGISTRY (REGULATION 47 & 46(2)(q))
 * Publications in English & Regional Newspapers
 * =========================================================================
 */
export const NEWSPAPER_PUBLICATIONS_REGISTRY: NewspaperPublicationItem[] = [
  {
    id: 'np-q3-fy26-results',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    publicationDate: '13 Feb 2026',
    newspaperName: 'Financial Express (English) & Western Times (Gujarati)',
    edition: 'Ahmedabad & Mumbai Editions',
    language: 'English & Regional (Gujarati)',
    noticeType: 'Financial Results Notice',
    fileSize: '1.2 MB',
    bseAck: 'BSE/NP/20260213/771092'
  },
  {
    id: 'np-q3-fy26-bm',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    publicationDate: '06 Feb 2026',
    newspaperName: 'Financial Express (English) & Western Times (Gujarati)',
    edition: 'Ahmedabad & Mumbai Editions',
    language: 'English & Regional (Gujarati)',
    noticeType: 'Board Meeting Prior Notice',
    fileSize: '840 KB',
    bseAck: 'BSE/NP/20260206/662091'
  },
  {
    id: 'np-q2-fy26-results',
    financialYear: 'FY 2025-26',
    quarter: 'Q2',
    publicationDate: '15 Nov 2025',
    newspaperName: 'Financial Express (English) & Western Times (Gujarati)',
    edition: 'Ahmedabad & Mumbai Editions',
    language: 'English & Regional (Gujarati)',
    noticeType: 'Financial Results Notice',
    fileSize: '1.1 MB',
    bseAck: 'BSE/NP/20251115/551048'
  },
  {
    id: 'np-agm-31-notice',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    publicationDate: '03 Sep 2025',
    newspaperName: 'Financial Express (English) & Western Times (Gujarati)',
    edition: 'Ahmedabad & Mumbai Editions',
    language: 'English & Regional (Gujarati)',
    noticeType: 'AGM Notice',
    fileSize: '1.5 MB',
    bseAck: 'BSE/NP/20250903/442019'
  },
  {
    id: 'np-aud-fy25-results',
    financialYear: 'FY 2024-25',
    quarter: 'Q4',
    publicationDate: '29 May 2025',
    newspaperName: 'Financial Express (English) & Western Times (Gujarati)',
    edition: 'Ahmedabad & Mumbai Editions',
    language: 'English & Regional (Gujarati)',
    noticeType: 'Financial Results Notice',
    fileSize: '1.4 MB',
    bseAck: 'BSE/NP/20250529/331084'
  }
];

/**
 * =========================================================================
 * 7. COMPREHENSIVE STATUTORY DOCUMENT LIBRARY (EXPANDED TO COVER ALL CLAUSES)
 * =========================================================================
 */
export const STATUTORY_DOCUMENTS_LIBRARY: InvestorDocument[] = [
  // MOA & AOA (Reg 46(2)(aa))
  {
    id: 'doc-moa-aoa',
    title: 'Memorandum of Association & Articles of Association (MOA & AOA)',
    category: 'MOA & AOA',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Jan 2026',
    bseAckNumber: 'BSE/CORP/MOA-AOA/2026',
    fileSize: '3.8 MB',
    fileType: 'PDF',
    description: 'Fundamental Constitutional Charter documents of Amarnath Securities Limited as registered with the Registrar of Companies, Gujarat.',
    sebiReference: 'Reg 46(2)(aa) SEBI (LODR)',
    effectiveDate: 'Incorporation 1994 (As amended)',
    version: 'Version 2.2',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // Statutory Policies (Reg 46(2)(b, d, e, f, g, h, u, y))
  {
    id: 'doc-pol-id-terms',
    title: 'Terms and Conditions of Appointment of Independent Directors',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '10 Aug 2025',
    bseAckNumber: 'BSE/CORP/POL/ID-TERMS',
    fileSize: '920 KB',
    fileType: 'PDF',
    description: 'Standard terms of appointment governing the role, responsibilities, tenure, code of conduct, and evaluation of Independent Directors pursuant to Schedule IV of the Companies Act, 2013 and Regulation 46(2)(b).',
    sebiReference: 'Reg 46(2)(b) SEBI (LODR) & Schedule IV',
    effectiveDate: '10 Aug 2025',
    version: 'Version 2.0',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-coc',
    title: 'Code of Conduct for Board of Directors and Senior Management Personnel',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/COC-01',
    fileSize: '1.0 MB',
    fileType: 'PDF',
    description: 'Standards of corporate integrity, conflict of interest avoidance, regulatory compliance, and fiduciary responsibility adopted pursuant to Regulation 17(5) and Regulation 46(2)(d).',
    sebiReference: 'Reg 46(2)(d) & Reg 17(5) SEBI (LODR)',
    effectiveDate: '15 Apr 2025',
    version: 'Version 3.1',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-vigil',
    title: 'Vigil Mechanism / Whistle Blower Policy',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/VM-02',
    fileSize: '890 KB',
    fileType: 'PDF',
    description: 'Framework providing adequate safeguards against victimization of employees and directors reporting genuine concerns and unethical behavior pursuant to Section 177(9) and Regulation 22.',
    sebiReference: 'Reg 46(2)(e) & Reg 22 SEBI (LODR)',
    effectiveDate: '15 Apr 2025',
    version: 'Version 2.0',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-ned-remun',
    title: 'Criteria of Making Payments to Non-Executive Directors',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/NED-03',
    fileSize: '750 KB',
    fileType: 'PDF',
    description: 'Criteria governing sitting fees, reimbursement of expenses, and performance evaluation for non-executive and independent directors pursuant to Regulation 46(2)(f).',
    sebiReference: 'Reg 46(2)(f) SEBI (LODR)',
    effectiveDate: '15 Apr 2025',
    version: 'Version 1.2',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-rpt',
    title: 'Policy on Materiality and Dealing with Related Party Transactions',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/RPT-04',
    fileSize: '1.1 MB',
    fileType: 'PDF',
    description: 'Framework for identification, threshold evaluation, prior Audit Committee approval, and periodic reporting of transactions entered into with Related Parties pursuant to Regulation 23.',
    sebiReference: 'Reg 46(2)(g) & Reg 23 SEBI (LODR)',
    effectiveDate: '15 Apr 2025',
    version: 'Version 2.1',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-mat-subsidiary',
    title: 'Policy for Determining ‘Material’ Subsidiaries',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/MS-05',
    fileSize: '720 KB',
    fileType: 'PDF',
    description: 'Criteria for identifying material subsidiaries based on income or net worth thresholds in compliance with Regulation 16(1)(c) and Regulation 46(2)(h).',
    sebiReference: 'Reg 46(2)(h) & Reg 16(1)(c) SEBI (LODR)',
    effectiveDate: '15 Apr 2025',
    version: 'Version 1.1',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-familiarisation',
    title: 'Details of Familiarization Programmes Imparted to Independent Directors',
    category: 'Corporate Governance',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    filingDate: '30 Aug 2025',
    bseAckNumber: 'BSE/CORP/CG/FAM-2025',
    fileSize: '680 KB',
    fileType: 'PDF',
    description: 'Dissemination detailing programmes attended, aggregate hours spent during the financial year and cumulatively by Independent Directors pursuant to Regulation 25(7) & 46(2)(i).',
    sebiReference: 'Reg 46(2)(i) & Reg 25(7) SEBI (LODR)',
    effectiveDate: '30 Aug 2025',
    version: 'FY 2024-25',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-materiality',
    title: 'Policy on Determination of Materiality for Disclosures (Regulation 30)',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/MAT-06',
    fileSize: '840 KB',
    fileType: 'PDF',
    description: 'Quantitative and qualitative thresholds, prompt disclosure protocols, and authorization under Regulation 30(4)(ii) & Regulation 46(2)(u).',
    sebiReference: 'Reg 46(2)(u) & Reg 30(4) SEBI (LODR)',
    effectiveDate: '15 Apr 2025',
    version: 'Version 2.0',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-archival',
    title: 'Policy on Preservation of Documents & Archival Policy',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/ARCH-07',
    fileSize: '760 KB',
    fileType: 'PDF',
    description: 'Rules for document classification, retention periods (permanent vs 8 years), and website archival protocol for minimum 5 years pursuant to Regulation 9 and Regulation 30(8).',
    sebiReference: 'Reg 9 & Reg 30(8) SEBI (LODR)',
    effectiveDate: '15 Apr 2025',
    version: 'Version 1.0',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-pol-pit',
    title: 'Code of Practices and Procedures for Fair Disclosure of UPSI (SEBI PIT)',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/PIT-08',
    fileSize: '950 KB',
    fileType: 'PDF',
    description: 'Code formulated under Regulation 8 of SEBI (Prohibition of Insider Trading) Regulations, 2015 to regulate, monitor and report trading by designated persons.',
    sebiReference: 'SEBI (PIT) Regulations, 2015',
    effectiveDate: '15 Apr 2025',
    version: 'Version 2.0',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // Annual Return (Section 92 / MGT-7) (Reg 46(2)(z))
  {
    id: 'doc-mgt7-fy25',
    title: 'Annual Return for the Financial Year 2024-25 (Form MGT-7)',
    category: 'Annual Return (MGT-7)',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    filingDate: '28 Oct 2025',
    bseAckNumber: 'ROC/GUJ/MGT7/2025/99120',
    fileSize: '2.8 MB',
    fileType: 'PDF',
    description: 'Statutory Annual Return prepared pursuant to Section 92(3) of the Companies Act, 2013 and Rule 12 of the Companies (Management and Administration) Rules, 2014.',
    sebiReference: 'Sec 92 Companies Act & Reg 46(2)(z)',
    effectiveDate: '31 Mar 2025',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-mgt7-fy24',
    title: 'Annual Return for the Financial Year 2023-24 (Form MGT-7)',
    category: 'Annual Return (MGT-7)',
    financialYear: 'FY 2023-24',
    quarter: 'Annual',
    filingDate: '25 Oct 2024',
    bseAckNumber: 'ROC/GUJ/MGT7/2024/88102',
    fileSize: '2.6 MB',
    fileType: 'PDF',
    description: 'Statutory Annual Return for FY 2023-24 under Section 92(3) of the Companies Act, 2013 detailing shareholding, indebtedness, and directorship changes.',
    sebiReference: 'Sec 92 Companies Act & Reg 46(2)(z)',
    effectiveDate: '31 Mar 2024',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // Secretarial Compliance Report (Regulation 24A) (Reg 46(2)(t))
  {
    id: 'doc-sec-comp-fy25',
    title: 'Annual Secretarial Compliance Report for FY 2024-25 (Regulation 24A)',
    category: 'Secretarial Compliance Report',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    filingDate: '28 May 2025',
    bseAckNumber: 'BSE/LODR/20250528/89104',
    fileSize: '1.3 MB',
    fileType: 'PDF',
    description: 'Annual Secretarial Compliance Report issued by Practicing Company Secretary pursuant to Regulation 24A(2) of SEBI LODR Regulations.',
    sebiReference: 'Reg 24A(2) & Reg 46(2)(t) SEBI (LODR)',
    effectiveDate: '31 Mar 2025',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-sec-comp-fy24',
    title: 'Annual Secretarial Compliance Report for FY 2023-24 (Regulation 24A)',
    category: 'Secretarial Compliance Report',
    financialYear: 'FY 2023-24',
    quarter: 'Annual',
    filingDate: '29 May 2024',
    bseAckNumber: 'BSE/LODR/20240529/77109',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    description: 'Secretarial compliance verification report on SEBI LODR adherence, circulars, and notifications issued by an independent PCS.',
    sebiReference: 'Reg 24A(2) & Reg 46(2)(t) SEBI (LODR)',
    effectiveDate: '31 Mar 2024',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // Newspaper Publications (Regulation 47 & 46(2)(q))
  {
    id: 'doc-np-q3-26',
    title: 'Newspaper Publication of Unaudited Financial Results for Q3 FY 2025-26',
    category: 'Newspaper Publications',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: '13 Feb 2026',
    bseAckNumber: 'BSE/NP/20260213/771092',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    description: 'Extracts of Unaudited Standalone Financial Results published in Financial Express (English national daily) and Western Times (Gujarati regional daily) pursuant to Regulation 47(1)(b).',
    sebiReference: 'Reg 47(1)(b) & Reg 46(2)(q) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-np-bm-notice-q3-26',
    title: 'Newspaper Notice of Board Meeting to consider Q3 Financial Results',
    category: 'Newspaper Publications',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: '06 Feb 2026',
    bseAckNumber: 'BSE/NP/20260206/662091',
    fileSize: '840 KB',
    fileType: 'PDF',
    description: 'Prior notice of meeting of the Board of Directors published in Financial Express and Western Times pursuant to Regulation 47(1)(a).',
    sebiReference: 'Reg 47(1)(a) & Reg 46(2)(q) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-np-q2-26',
    title: 'Newspaper Publication of Unaudited Financial Results for Q2 FY 2025-26',
    category: 'Newspaper Publications',
    financialYear: 'FY 2025-26',
    quarter: 'Q2',
    filingDate: '15 Nov 2025',
    bseAckNumber: 'BSE/NP/20251115/551048',
    fileSize: '1.1 MB',
    fileType: 'PDF',
    description: 'Extracts of Q2 financial results published in Financial Express and Western Times.',
    sebiReference: 'Reg 47(1)(b) & Reg 46(2)(q) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-np-agm31-notice',
    title: 'Newspaper Notice of 31st Annual General Meeting, Book Closure & e-Voting',
    category: 'Newspaper Publications',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    filingDate: '03 Sep 2025',
    bseAckNumber: 'BSE/NP/20250903/442019',
    fileSize: '1.5 MB',
    fileType: 'PDF',
    description: 'Notice of 31st AGM, cut-off dates, remote e-voting guidelines, and book closure published in national and regional newspapers.',
    sebiReference: 'Reg 47(1)(d) & Reg 46(2)(q) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // Financial Results (Existing verified entries + audit links)
  {
    id: 'doc-fr-q3-26',
    title: 'Unaudited Financial Results for Quarter & Nine Months ended December 31, 2025',
    category: 'Financial Results',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: '12 Feb 2026',
    bseAckNumber: 'BSE/LODR/20260212/894102',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    description: 'Standalone Unaudited Financial Results along with Limited Review Report by Statutory Auditors under Regulation 33 of SEBI (LODR) Regulations, 2015.',
    sebiReference: 'Reg 33 & Reg 46(2)(l)(ii) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'file_url',
    fileUrl: '/documents/amarnath-statutory-disclosure-sample.pdf',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: true,

  },
  {
    id: 'doc-fr-q2-26',
    title: 'Unaudited Financial Results for Quarter & Half Year ended September 30, 2025',
    category: 'Financial Results',
    financialYear: 'FY 2025-26',
    quarter: 'Q2',
    filingDate: '14 Nov 2025',
    bseAckNumber: 'BSE/LODR/20251114/782104',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    description: 'Standalone Financial Results along with Statement of Assets and Liabilities, Cash Flow Statement and Limited Review Report.',
    sebiReference: 'Reg 33 & Reg 46(2)(l)(ii) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-fr-q1-26',
    title: 'Unaudited Financial Results for Quarter ended June 30, 2025',
    category: 'Financial Results',
    financialYear: 'FY 2025-26',
    quarter: 'Q1',
    filingDate: '12 Aug 2025',
    bseAckNumber: 'BSE/LODR/20250812/654129',
    fileSize: '1.6 MB',
    fileType: 'PDF',
    description: 'First quarter financial statements and auditor review statement.',
    sebiReference: 'Reg 33 & Reg 46(2)(l)(ii) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-fr-aud-25',
    title: 'Audited Financial Results for the Quarter and Financial Year ended March 31, 2025',
    category: 'Financial Results',
    financialYear: 'FY 2024-25',
    quarter: 'Q4',
    filingDate: '28 May 2025',
    bseAckNumber: 'BSE/LODR/20250528/542109',
    fileSize: '3.4 MB',
    fileType: 'PDF',
    description: 'Comprehensive Audited Financial Statements, Independent Auditor Report, Declaration on Unmodified Opinion and Notes.',
    sebiReference: 'Reg 33 & Reg 46(2)(l)(ii) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // Annual Reports (Reg 46(2)(l)(iii))
  {
    id: 'doc-ar-2025',
    title: '31st Annual Report for the Financial Year 2024-25',
    category: 'Annual Reports',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    filingDate: '31 Aug 2025',
    bseAckNumber: 'BSE/LODR/20250831/992104',
    fileSize: '5.2 MB',
    fileType: 'PDF',
    description: 'Includes Directors Report, Management Discussion & Analysis, Corporate Governance Report, Secretarial Audit Report, and Audited Financial Accounts.',
    sebiReference: 'Reg 34 & Reg 46(2)(l)(iii) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-ar-2024',
    title: '30th Annual Report for the Financial Year 2023-24',
    category: 'Annual Reports',
    financialYear: 'FY 2023-24',
    quarter: 'Annual',
    filingDate: '01 Sep 2024',
    bseAckNumber: 'BSE/LODR/20240901/871032',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    description: 'Complete 30th milestone annual corporate disclosure and governance accounts.',
    sebiReference: 'Reg 34 & Reg 46(2)(l)(iii) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-ar-2023',
    title: '29th Annual Report for the Financial Year 2022-23',
    category: 'Annual Reports',
    financialYear: 'FY 2022-23',
    quarter: 'Annual',
    filingDate: '28 Aug 2023',
    bseAckNumber: 'BSE/LODR/20230828/731902',
    fileSize: '4.5 MB',
    fileType: 'PDF',
    description: 'Statutory Annual Report with Independent Audit certification.',
    sebiReference: 'Reg 34 & Reg 46(2)(l)(iii) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // Shareholding Pattern (Reg 46(2)(m))
  {
    id: 'doc-shp-dec-25',
    title: 'Shareholding Pattern for the Quarter ended December 31, 2025',
    category: 'Shareholding Pattern',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: '15 Jan 2026',
    bseAckNumber: 'BSE/LODR/20260115/104928',
    fileSize: '820 KB',
    fileType: 'PDF',
    description: 'Statement showing shareholding pattern under Regulation 31 of SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.',
    sebiReference: 'Reg 31 & Reg 46(2)(m) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-shp-sep-25',
    title: 'Shareholding Pattern for the Quarter ended September 30, 2025',
    category: 'Shareholding Pattern',
    financialYear: 'FY 2025-26',
    quarter: 'Q2',
    filingDate: '16 Oct 2025',
    bseAckNumber: 'BSE/LODR/20251016/948201',
    fileSize: '790 KB',
    fileType: 'PDF',
    description: 'Quarterly breakdown of promoter and non-promoter public shareholding.',
    sebiReference: 'Reg 31 & Reg 46(2)(m) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // BSE Disclosures (Regulation 30) (Reg 46(2)(l)(i), (w))
  {
    id: 'doc-bse-bm-feb26',
    title: 'Outcome of Board Meeting held on February 12, 2026',
    category: 'BSE Disclosures',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: '12 Feb 2026',
    bseAckNumber: 'BSE/LODR/20260212/894311',
    fileSize: '950 KB',
    fileType: 'PDF',
    description: 'Approval of Unaudited Financial Results for Q3 FY26 and other corporate compliance matters pursuant to Regulation 30.',
    sebiReference: 'Reg 30 & Reg 46(2)(w) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    fileUrl: '/documents/amarnath-statutory-disclosure-sample.pdf',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: true,

  },
  {
    id: 'doc-bse-closure-dec25',
    title: 'Intimation of Closure of Trading Window for Q3 FY 2025-26',
    category: 'BSE Disclosures',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: '30 Dec 2025',
    bseAckNumber: 'BSE/LODR/20251230/721094',
    fileSize: '420 KB',
    fileType: 'PDF',
    description: 'Closure of trading window for designated persons pursuant to SEBI (Prohibition of Insider Trading) Regulations, 2015.',
    sebiReference: 'SEBI (PIT) Regs & Reg 30',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-bse-prior-nov25',
    title: 'Prior Intimation of Board Meeting under Regulation 29',
    category: 'BSE Disclosures',
    financialYear: 'FY 2025-26',
    quarter: 'Q2',
    filingDate: '06 Nov 2025',
    bseAckNumber: 'BSE/LODR/20251106/619024',
    fileSize: '460 KB',
    fileType: 'PDF',
    description: 'Notice of meeting of Board of Directors to consider and approve Q2 financial statements.',
    sebiReference: 'Reg 29 & Reg 46(2)(l)(i) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // AGM / Notices
  {
    id: 'doc-agm-31-notice',
    title: 'Notice of 31st Annual General Meeting and e-Voting Information',
    category: 'AGM / EGM / Notices',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    filingDate: '02 Sep 2025',
    bseAckNumber: 'BSE/LODR/20250902/551209',
    fileSize: '1.9 MB',
    fileType: 'PDF',
    description: 'Notice convening the 31st AGM of members, explanatory statements under Section 102, e-voting instructions, and proxy form.',
    sebiReference: 'Companies Act Sec 101 & Reg 44',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },
  {
    id: 'doc-agm-31-voting',
    title: 'Consolidated Scrutinizer Report & Voting Results of 31st AGM',
    category: 'AGM / EGM / Notices',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    filingDate: '26 Sep 2025',
    bseAckNumber: 'BSE/LODR/20250926/667102',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    description: 'Scrutinizer report on remote e-voting and electronic voting during the 31st AGM with resolution passage details under Regulation 44.',
    sebiReference: 'Reg 44 SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  },

  // Corporate Governance (Reg 27(2))
  {
    id: 'doc-cg-q3-26',
    title: 'Quarterly Corporate Governance Report for Quarter ended December 31, 2025',
    category: 'Corporate Governance',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: '15 Jan 2026',
    bseAckNumber: 'BSE/LODR/20260115/104930',
    fileSize: '650 KB',
    fileType: 'PDF',
    description: 'Compliance report on corporate governance pursuant to Regulation 27(2) detailing board composition and committee meetings.',
    sebiReference: 'Reg 27(2) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'external_url',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: true,

  },

  // Investor Grievance Statement (Reg 13(3))
  {
    id: 'doc-griev-q3-26',
    title: 'Statement of Investor Complaints for Quarter ended December 31, 2025',
    category: 'Investor Grievance',
    financialYear: 'FY 2025-26',
    quarter: 'Q3',
    filingDate: '10 Jan 2026',
    bseAckNumber: 'BSE/LODR/20260110/118293',
    fileSize: '380 KB',
    fileType: 'PDF',
    description: 'Quarterly compliance statement under Regulation 13(3): Opening complaints: Nil, Received: 1, Resolved: 1, Pending: Nil.',
    sebiReference: 'Reg 13(3) SEBI (LODR)',
    isStatutory: true,
    sourceType: 'upload',
    externalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/',
    isAvailable: false,

  }
];
