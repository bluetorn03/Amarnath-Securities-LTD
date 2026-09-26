import { 
  InvestorDocument, 
  CapabilityItem, 
  LeaderProfile, 
  ShareholdingItem, 
  MarketTickerData, 
  InsightArticle 
} from '../types';

export const COMPANY_DETAILS = {
  name: 'Amarnath Securities Limited',
  shortName: 'Amarnath Securities',
  tagline: 'Capital. Strategy. Opportunity.',
  trustLine: 'BSE Listed • Since 1994 • Scrip Code 538465',
  corePositioning: 'Financial Services, Strategic Advisory & Capital Solutions',
  cin: 'L67120GJ1994PLC023254',
  bseScripCode: '538465',
  isin: 'INE745P01010',
  foundedYear: '1994',
  email: 'Amarnathsecurities@gmail.com',
  phone: '+91 89280 80429',
  regOffice: '1/104, Sarthik Complex, Nr. Fun Republic, Satellite Road, Ahmedabad, Gujarat - 380015',
  corpOffice: 'Office No. 402, 4th Floor, Fortune Business Center, Bandra Kurla Complex (BKC) Link Road, Mumbai, Maharashtra - 400051',
  rtaName: 'Purva Sharegistry (India) Pvt. Ltd.',
  rtaAddress: 'Unit No. 9, Shiv Shakti Industrial Estate, J. R. Boricha Marg, Lower Parel (East), Mumbai - 400011',
  rtaEmail: 'support@purvashare.com',
  rtaPhone: '+91 22 2301 6761 / 8261',
  sebiScoresUrl: 'https://scores.sebi.gov.in',
  bsePortalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/'
};

export const MARKET_TICKER_DATA: MarketTickerData = {
  scripCode: '538465',
  scripName: 'AMARNATH',
  isin: 'INE745P01010',
  lastPrice: 18.45,
  change: +0.42,
  changePercent: +2.33,
  dayHigh: 18.90,
  dayLow: 17.85,
  week52High: 24.60,
  week52Low: 11.20,
  volume: '48,250',
  marketCap: '₹55.35 Cr',
  faceValue: 10.00,
  industry: 'Financial Services / Other Financial Services'
};

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'corporate-finance',
    title: 'Corporate Finance & Advisory',
    shortDesc: 'Strategic capital advisory, balance sheet optimization, and corporate structuring for mid-market leaders.',
    fullDesc: 'We assist corporations in navigating intricate financial lifecycles. Our corporate finance team structures bespoke solutions encompassing debt reorganization, capital recapitalization, strategic buyouts, and joint venture advisory, aligning financial mechanics with long-term growth visions.',
    route: 'capabilities/corporate-finance',
    iconName: 'Landmark',
    keyOfferings: [
      'Balance Sheet Restructuring & Solvency Advisory',
      'Capital Structure Optimization & Cost of Capital Rationalization',
      'Special Situations Advisory & Turnaround Structuring',
      'Cross-border Transaction Advisory & Regulatory Structuring'
    ],
    clientFit: 'Mid-to-large corporates and promoter-driven enterprises seeking structural balance-sheet agility.',
    stats: { label: 'Advisory Transactions Advised', value: '₹1,250+ Cr' }
  },
  {
    id: 'merchant-banking',
    title: 'Merchant Banking',
    shortDesc: 'Comprehensive issue management, valuation diligence, and regulatory interface for capital events.',
    fullDesc: 'Providing specialized merchant banking services designed to guide public and pre-IPO enterprises through statutory frameworks. From equity rights issues and preferential allotments to takeovers and buyback management under SEBI mandates.',
    route: 'capabilities/merchant-banking',
    iconName: 'ShieldCheck',
    keyOfferings: [
      'Rights Issues, Preferential Issues & QIP Management',
      'Takeover Code Advisory & Open Offer Management',
      'Fairness Opinions & Independent Business Valuations',
      'SEBI LODR Compliance & Listed Entity Delisting / Advisory'
    ],
    clientFit: 'Listed Indian entities and ambitious growth companies orchestrating market capital events.',
    stats: { label: 'Statutory Issuances Facilitated', value: '45+' }
  },
  {
    id: 'investment-banking',
    title: 'Investment Banking & Capital Raising',
    shortDesc: 'Originating, syndicating, and executing institutional equity and structured debt capital rounds.',
    fullDesc: 'We bridge growing enterprises with institutional pools of capital. Our investment banking syndicate originates and executes private placements, structured credit facilities, and promoter stake financing backed by rigorous market analysis.',
    route: 'capabilities/investment-banking',
    iconName: 'TrendingUp',
    keyOfferings: [
      'Private Equity & Institutional Growth Capital Syndication',
      'Structured Credit Facilities & Mezzanine Financing',
      'Promoter Financing & Loan Against Shares Advisory',
      'Strategic M&A Sourcing and Deal Execution'
    ],
    clientFit: 'Enterprises requiring ₹25 Cr to ₹250 Cr growth or liquidity capital across diverse sectors.',
    stats: { label: 'Institutional Network Reach', value: '180+ Funds' }
  },
  {
    id: 'securities-services',
    title: 'Securities & Investment Services',
    shortDesc: 'Institutional dealing, custody facilitation, and treasury yield management frameworks.',
    fullDesc: 'Serving institutions, family offices, and corporate treasuries with disciplined securities execution, specialized treasury portfolio advisory, and capital market intelligence built on thirty years of continuous market presence.',
    route: 'capabilities/securities-services',
    iconName: 'Layers',
    keyOfferings: [
      'Corporate Treasury Yield Optimization',
      'Block & Bulk Deal Facilitation on BSE Platform',
      'Demat, Custody & Depository Interface Coordination',
      'Market Liquidity Analysis & Risk Governance Models'
    ],
    clientFit: 'Family offices, corporate treasuries, and high-net-worth market participants.',
    stats: { label: 'Continuous Market Heritage', value: 'Since 1994' }
  },
  {
    id: 'corporate-lending',
    title: 'Corporate Lending & Financial Solutions',
    shortDesc: 'Custom liquidity facilities, bridge financing, and working capital advisory solutions.',
    fullDesc: 'Amarnath Securities structures targeted financing solutions that address specialized liquidity requirements. We design secured short-term facilities, bridge capital, and customized credit agreements tailored to cash-flow profiles.',
    route: 'capabilities/corporate-lending',
    iconName: 'Coins',
    keyOfferings: [
      'Structured Secured Corporate Advances',
      'Bridge Funding & Interim Liquidity Facilities',
      'Supply Chain & Receivables Finance Advisory',
      'Collateralized Term Credit Structuring'
    ],
    clientFit: 'Operating enterprises experiencing seasonal credit spikes or transition periods.',
    stats: { label: 'Average Turnaround Framework', value: '< 14 Days' }
  }
];

export const INVESTOR_DOCUMENTS: InvestorDocument[] = [
  // Financial Results
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
    sebiReference: 'Reg 33 SEBI (LODR)'
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
    sebiReference: 'Reg 33 SEBI (LODR)'
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
    sebiReference: 'Reg 33 SEBI (LODR)'
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
    sebiReference: 'Reg 33 & 52 SEBI (LODR)'
  },
  {
    id: 'doc-fr-q3-25',
    title: 'Unaudited Financial Results for Quarter & Nine Months ended December 31, 2024',
    category: 'Financial Results',
    financialYear: 'FY 2024-25',
    quarter: 'Q3',
    filingDate: '13 Feb 2025',
    bseAckNumber: 'BSE/LODR/20250213/419082',
    fileSize: '1.7 MB',
    fileType: 'PDF',
    description: 'Third quarter performance statement and auditor review.',
    sebiReference: 'Reg 33 SEBI (LODR)'
  },

  // Annual Reports
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
    sebiReference: 'Reg 34 SEBI (LODR)'
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
    sebiReference: 'Reg 34 SEBI (LODR)'
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
    sebiReference: 'Reg 34 SEBI (LODR)'
  },
  {
    id: 'doc-ar-2022',
    title: '28th Annual Report for the Financial Year 2021-22',
    category: 'Annual Reports',
    financialYear: 'FY 2021-22',
    quarter: 'Annual',
    filingDate: '02 Sep 2022',
    bseAckNumber: 'BSE/LODR/20220902/612048',
    fileSize: '4.1 MB',
    fileType: 'PDF',
    description: 'Annual corporate filings and financials for FY 2021-22.',
    sebiReference: 'Reg 34 SEBI (LODR)'
  },

  // Shareholding Pattern
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
    sebiReference: 'Reg 31 SEBI (LODR)'
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
    sebiReference: 'Reg 31 SEBI (LODR)'
  },
  {
    id: 'doc-shp-jun-25',
    title: 'Shareholding Pattern for the Quarter ended June 30, 2025',
    category: 'Shareholding Pattern',
    financialYear: 'FY 2025-26',
    quarter: 'Q1',
    filingDate: '14 Jul 2025',
    bseAckNumber: 'BSE/LODR/20250714/819203',
    fileSize: '810 KB',
    fileType: 'PDF',
    description: 'Quarterly shareholding filings under Clause 31.',
    sebiReference: 'Reg 31 SEBI (LODR)'
  },

  // BSE Disclosures
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
    sebiReference: 'Reg 30 SEBI (LODR)'
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
    sebiReference: 'SEBI (PIT) Regs'
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
    sebiReference: 'Reg 29 SEBI (LODR)'
  },

  // Regulation 46
  {
    id: 'doc-reg46-index',
    title: 'SEBI LODR Regulation 46 Compliance Master Repository 2025-26',
    category: 'Regulation 46',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '05 Jan 2026',
    bseAckNumber: 'BSE/LODR/20260105/998102',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    description: 'Statutory compliance index as mandated under Regulation 46(2) Clauses (a) through (z) of SEBI (LODR) Regulations, 2015.',
    sebiReference: 'Reg 46(2) SEBI (LODR)'
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
    sebiReference: 'Companies Act Sec 101'
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
    sebiReference: 'Reg 44 SEBI (LODR)'
  },

  // Company Policies
  {
    id: 'doc-pol-whistle',
    title: 'Vigil Mechanism / Whistle Blower Policy',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/01',
    fileSize: '890 KB',
    fileType: 'PDF',
    description: 'Framework providing adequate safeguards against victimization of employees and directors reporting genuine concerns.',
    sebiReference: 'Reg 22 SEBI (LODR)'
  },
  {
    id: 'doc-pol-rpt',
    title: 'Policy on Materiality and Dealing with Related Party Transactions',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/02',
    fileSize: '1.1 MB',
    fileType: 'PDF',
    description: 'Approved framework for identification, approval, and disclosure of transactions entered into with Related Parties.',
    sebiReference: 'Reg 23 SEBI (LODR)'
  },
  {
    id: 'doc-pol-insider',
    title: 'Code of Conduct to Regulate, Monitor & Report Trading by Designated Persons',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/03',
    fileSize: '1.3 MB',
    fileType: 'PDF',
    description: 'Code formulated in compliance with SEBI (Prohibition of Insider Trading) Regulations, 2015.',
    sebiReference: 'SEBI (PIT) Regs'
  },
  {
    id: 'doc-pol-materiality',
    title: 'Policy on Determination of Materiality for Disclosures',
    category: 'Company Policies',
    financialYear: 'FY 2025-26',
    quarter: 'Annual',
    filingDate: '15 Apr 2025',
    bseAckNumber: 'BSE/CORP/POL/04',
    fileSize: '780 KB',
    fileType: 'PDF',
    description: 'Quantitative and qualitative thresholds for disclosure of material events to BSE under Regulation 30.',
    sebiReference: 'Reg 30 SEBI (LODR)'
  },

  // Investor Grievance
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
    sebiReference: 'Reg 13(3) SEBI (LODR)'
  }
];

export const SHAREHOLDING_BREAKDOWN: ShareholdingItem[] = [
  { category: 'Promoter & Promoter Group', shares: 1485000, percentage: 49.50, changeQoQ: '0.00%', color: '#0D9488' },
  { category: 'Public - Non-Institutional (Bodies Corporate)', shares: 660000, percentage: 22.00, changeQoQ: '+0.50%', color: '#C5A880' },
  { category: 'Public - Individuals (Capital <= ₹2 Lakhs)', shares: 585000, percentage: 19.50, changeQoQ: '-0.30%', color: '#38BDF8' },
  { category: 'Public - Individuals (Capital > ₹2 Lakhs)', shares: 210000, percentage: 7.00, changeQoQ: '-0.20%', color: '#A78BFA' },
  { category: 'Clearing Members & NRIs', shares: 60000, percentage: 2.00, changeQoQ: '0.00%', color: '#94A3B8' },
];

export const REGULATION_46_CLAUSES = [
  { clause: '46(2)(a)', title: 'Details of its business', status: 'Complied', linkText: 'View Business Overview' },
  { clause: '46(2)(b)', title: 'Terms and conditions of appointment of independent directors', status: 'Complied', linkText: 'View Appointment Terms' },
  { clause: '46(2)(c)', title: 'Composition of various committees of board of directors', status: 'Complied', linkText: 'View Board Committees' },
  { clause: '46(2)(d)', title: 'Code of conduct of board of directors and senior-management personnel', status: 'Complied', linkText: 'View Code of Conduct' },
  { clause: '46(2)(e)', title: 'Details of establishment of vigil mechanism / Whistle Blower policy', status: 'Complied', linkText: 'View Vigil Policy' },
  { clause: '46(2)(f)', title: 'Criteria of making payments to non-executive directors', status: 'Complied', linkText: 'View Remuneration Criteria' },
  { clause: '46(2)(g)', title: 'Policy on dealing with related party transactions', status: 'Complied', linkText: 'View RPT Policy' },
  { clause: '46(2)(h)', title: 'Policy for determining material subsidiaries', status: 'Complied', linkText: 'View Material Subsidiary Policy' },
  { clause: '46(2)(i)', title: 'Details of familiarization programmes imparted to independent directors', status: 'Complied', linkText: 'View Familiarization Details' },
  { clause: '46(2)(j)', title: 'Email address for grievance redressal and other relevant details', status: 'Complied', linkText: 'Amarnathsecurities@gmail.com' },
  { clause: '46(2)(k)', title: 'Contact information of designated officials handling investor assistance', status: 'Complied', linkText: 'View Investor Contacts' },
  { clause: '46(2)(l)', title: 'Financial results including standalone and consolidated statements', status: 'Complied', linkText: 'View Financial Results' },
  { clause: '46(2)(m)', title: 'Shareholding pattern submitted under Regulation 31', status: 'Complied', linkText: 'View Shareholding Pattern' },
  { clause: '46(2)(s)', title: 'Separate audited financial statements of each subsidiary', status: 'N/A (No Subsidiaries)', linkText: 'Not Applicable' },
  { clause: '46(2)(z)', title: 'Schedule of analyst or institutional investor meet and presentations', status: 'Complied', linkText: 'View Transcripts & Notices' },
];

export const LEADERSHIP_TEAM: LeaderProfile[] = [
  {
    name: 'Board of Directors & Senior Management',
    designation: 'Managing Director & Key Executive Leadership',
    category: 'Executive',
    dinOrMembership: 'DIN: Approved by MCA / BSE',
    bio: 'Guided by seasoned capital market practitioners with over three decades of institutional experience in Indian securities markets, balance sheet structuring, and regulatory governance.',
    committees: ['Stakeholders Relationship Committee', 'Risk Management Committee']
  },
  {
    name: 'Independent Director & Audit Committee Chair',
    designation: 'Non-Executive Independent Director',
    category: 'Independent',
    dinOrMembership: 'Chartered Accountant / Corporate Governance Veteran',
    bio: 'Brings comprehensive oversight across statutory audit, financial reporting standards (Ind AS), internal financial controls, and SEBI compliance guidelines.',
    committees: ['Audit Committee (Chairman)', 'Nomination & Remuneration Committee']
  },
  {
    name: 'Independent Director & Legal Counsel',
    designation: 'Non-Executive Independent Director',
    category: 'Independent',
    dinOrMembership: 'Legal & Secretarial Governance Specialist',
    bio: 'Specializes in corporate law, SEBI Listing Regulations, corporate restructuring, shareholder advocacy, and statutory disclosures.',
    committees: ['Audit Committee', 'Stakeholders Relationship Committee (Chairman)']
  },
  {
    name: 'Company Secretary & Compliance Officer',
    designation: 'Key Managerial Personnel (KMP)',
    category: 'KMP',
    dinOrMembership: 'Associate Member of ICSI',
    bio: 'Appointed pursuant to Section 203 of the Companies Act, 2013 and Regulation 6 of SEBI LODR Regulations, 2015 to oversee investor grievance redressal and statutory BSE filings.',
    committees: ['Secretarial Liaison', 'Investor Relations Desk']
  }
];

export const INSIGHTS: InsightArticle[] = [
  {
    id: 'insight-1',
    title: 'Navigating India’s Mid-Market Capital Surge: The Role of Structured Financing in 2026',
    category: 'Market Advisory',
    date: 'February 2026',
    readTime: '5 min read',
    author: 'Amarnath Securities Research Desk',
    excerpt: 'How domestic capital markets and institutional syndicates are enabling mid-market Indian enterprises to access growth capital without diluting strategic promoter control.',
    content: `As the Indian economy sustains its robust momentum in 2026, mid-market enterprises face unique capital structuring challenges. Traditional bank credit lines often impose restrictive collateral mandates, while full equity dilution through early public rounds may prematurely cap promoter upside.

Here, structured corporate financing emerges as an indispensable bridge. By deploying bespoke hybrid instruments, structured debentures, and mezzanine capital, enterprises can fund expansion, execute tuck-in acquisitions, and optimize balance sheet cost-of-capital.

At Amarnath Securities Limited, our thirty-year market tenure equips us to navigate these nuances, aligning regulatory prudence under SEBI mandates with market liquidity.`
  },
  {
    id: 'insight-2',
    title: 'SEBI LODR 2026 Governance Norms: Elevating Disclosure Discipline for Listed Entities',
    category: 'Regulatory & Governance',
    date: 'January 2026',
    readTime: '6 min read',
    author: 'Secretarial & Compliance Division',
    excerpt: 'A comprehensive analysis of enhanced SEBI materiality thresholds under Regulation 30 and the imperative for real-time statutory disclosure integrity.',
    content: `Regulatory architecture in India has undergone a transformative evolution. The enhanced materiality standards introduced by SEBI require listed entities to adopt structured protocols for identifying and disclosing quantitative and qualitative events within stringent hourly timelines.

For shareholders and institutional stakeholders, this translates into unprecedented transparency. Amarnath Securities Limited maintains strict compliance with Regulation 46 disclosures, ensuring that every financial result, board decision, and shareholding pattern is accessible to the investing public in real time.`
  },
  {
    id: 'insight-3',
    title: 'Corporate Treasury Optimization in an Evolving Interest Rate Cycle',
    category: 'Treasury & Securities',
    date: 'December 2025',
    readTime: '4 min read',
    author: 'Treasury Solutions Group',
    excerpt: 'Balancing liquidity safety with alpha yields: Strategic liquidity frameworks for corporate treasuries and family offices.',
    content: `Managing corporate liquidity requires a delicate equilibrium between capital preservation, regulatory compliance, and yield generation. In dynamic macroeconomic cycles, passive cash holdings erode value through inflation drag.

By structuring laddered liquidity solutions and accessing prime institutional money market instruments on BSE platforms, corporate treasuries can maintain day-one solvency while securing enhanced yield spreads.`
  }
];

export const FINANCIAL_HIGHLIGHTS_SUMMARY = [
  { metric: 'Paid-Up Equity Share Capital', value: '₹300.00 Lakhs', note: '30,00,000 Equity Shares of ₹10/- each' },
  { metric: 'Listing Status', value: 'BSE Listed (Scrip: 538465)', note: 'Continuous listing since 1994' },
  { metric: 'Demat Connectivity', value: 'NSDL & CDSL', note: 'ISIN: INE745P01010' },
  { metric: 'Corporate Identification', value: 'L67120GJ1994PLC023254', note: 'Registered with ROC Gujarat' },
  { metric: 'Statutory Compliance Rating', value: '100% LODR Compliant', note: 'Zero pending investor complaints' },
];
