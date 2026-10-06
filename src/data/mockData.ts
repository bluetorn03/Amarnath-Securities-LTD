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
  corePositioning: 'Corporate Evolution, Strategic Opportunities & Sustainable Growth',
  cin: 'L67120GJ1994PLC023254',
  bseScripCode: '538465',
  isin: 'INE745P01010',
  foundedYear: '1994',
  email: 'contact.amarnathsecurities@gmail.com',
  phone: '+91 99309 82815',
  regOffice: '1/104, Sarthik Complex, Nr. Fun Republic, Satellite Road, Ahmedabad, Gujarat - 380015',
  corpOffice: 'Office A9, Ground Floor, Ellora Park, Near Damani Zapa, Killa Pardi, Valsad, Pardi, Gujarat, India, 396125',
  rtaName: 'Purva Sharegistry (India) Pvt. Ltd.',
  rtaAddress: 'Unit No. 9, Shiv Shakti Industrial Estate, J. R. Boricha Marg, Lower Parel (East), Mumbai - 400011',
  rtaEmail: 'support@purvashare.com',
  rtaPhone: '+91 99309 82815',
  sebiScoresUrl: 'https://scores.sebi.gov.in',
  bsePortalUrl: 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnath/538465/'
};

export const ABOUT_OVERVIEW_CONTENT = {
  title: 'About Amarnath Securities Limited',
  paragraphs: [
    'Amarnath Securities Limited is a publicly listed company incorporated in 1994, with its registered office in Ahmedabad, Gujarat, and its equity shares listed on BSE Limited.',
    'Over the years, the Company has evolved in response to changing business opportunities and market conditions. Having historically operated in the financial services and NBFC space, the Company has undertaken a strategic transition towards exploring opportunities beyond its earlier business activities.',
    'With a renewed focus on building sustainable businesses, the Company seeks to identify and develop opportunities across suitable sectors while maintaining a disciplined approach to governance, compliance and responsible management.'
  ],
  principlesTitle: 'Our approach is guided by three fundamental principles:',
  principles: [
    {
      title: 'Integrity',
      desc: 'conducting business with transparency and accountability.'
    },
    {
      title: 'Sustainable Growth',
      desc: 'identifying opportunities with a long-term perspective.'
    },
    {
      title: 'Responsible Governance',
      desc: 'maintaining appropriate standards of corporate governance, regulatory compliance and stakeholder accountability.'
    }
  ],
  closing: 'As a listed company, Amarnath Securities Limited remains committed to transparent communication with its shareholders and other stakeholders while continuing to evaluate opportunities for the Company’s future growth.'
};

export const BUSINESS_ACTIVITIES_DATA = {
  intro: 'Amarnath Securities Limited is focused on identifying and developing sustainable business opportunities across suitable sectors.\n\nThe Company has evolved from its historical presence in the financial services and NBFC sector and is now exploring opportunities beyond its earlier business activities.',
  pillars: [
    {
      id: 'business-development',
      pillarLetter: 'A',
      title: 'BUSINESS DEVELOPMENT',
      subtitle: 'Long-term value creation & commercial viability',
      paragraphs: [
        'Our focus is on evaluating businesses and opportunities that have the potential to create sustainable long-term value for the Company and its stakeholders.',
        'This includes assessing opportunities based on their commercial viability, scalability, strategic relevance and long-term potential.'
      ],
      keyFactors: [
        'Commercial Viability Assessment',
        'Scalability & Operating Potential',
        'Strategic Relevance Analysis',
        'Long-Term Value Creation'
      ]
    },
    {
      id: 'mergers-acquisitions',
      pillarLetter: 'B',
      title: 'MERGERS & ACQUISITIONS',
      subtitle: 'Strategic transactions, due diligence & diversification',
      paragraphs: [
        'The Company also evaluates and pursues suitable mergers, acquisitions, strategic investments and other corporate transactions that may support its growth and diversification objectives.',
        'Our approach to mergers and acquisitions includes identifying businesses and assets with strategic potential, conducting appropriate financial, legal, operational and regulatory due diligence, and assessing opportunities for long-term value creation.',
        'Any proposed transaction is evaluated based on its strategic fit, commercial viability, financial implications, regulatory requirements and potential benefits for the Company and its stakeholders. Mergers and acquisitions may be undertaken independently or in collaboration with strategic partners, subject to applicable laws, approvals and corporate governance requirements.'
      ],
      keyFactors: [
        'Rigorous Financial, Legal & Operational Due Diligence',
        'Strategic Fit & Diversification Alignment',
        'Independent or Partnered Collaboration',
        'Subject to Statutory Approvals & Governance'
      ]
    },
    {
      id: 'strategic-opportunities',
      pillarLetter: 'C',
      title: 'STRATEGIC OPPORTUNITIES',
      subtitle: 'Broad sector openness & collaborative initiatives',
      paragraphs: [
        'The Company remains open to opportunities across suitable sectors where its resources, management capabilities and strategic approach can contribute to sustainable business development.',
        'This may include organic growth initiatives, mergers and acquisitions, strategic investments, joint ventures, partnerships and other corporate development opportunities.'
      ],
      keyFactors: [
        'Organic Growth Initiatives',
        'Strategic Investments & Allocations',
        'Joint Ventures & Corporate Partnerships',
        'Cross-Sector Capability Deployment'
      ]
    },
    {
      id: 'responsible-growth',
      pillarLetter: 'D',
      title: 'RESPONSIBLE GROWTH',
      subtitle: 'Statutory disclosures, legal compliance & transparency',
      paragraphs: [
        'Every opportunity is evaluated with consideration to applicable laws and regulations, financial viability, governance requirements and the interests of the Company’s stakeholders.',
        'As the Company continues to evolve, details of its business activities, mergers and acquisitions and other material developments will be communicated through the Company’s statutory disclosures and regulatory filings.'
      ],
      keyFactors: [
        'Applicable Laws & Regulatory Adherence',
        'Financial Viability & Risk Governance',
        'Protection of Stakeholder Interests',
        'Timely BSE Statutory Disclosures'
      ]
    }
  ]
};

export const DISCLOSURES_POLICIES_OVERVIEW = {
  title: 'Disclosures & Policies',
  statement: 'Amarnath Securities Limited is committed to maintaining transparency and providing timely information to its shareholders and stakeholders in accordance with applicable laws, regulations and listing requirements.',
  frameworks: [
    { title: 'SEBI (LODR) Regulations, 2015', desc: 'Continuous statutory compliance under Regulations 30, 31, 33, 44 & 46' },
    { title: 'Companies Act, 2013 Compliance', desc: 'Secretarial adherence and corporate governance oversight' },
    { title: 'SEBI (PIT) Insider Trading Norms', desc: 'Code of conduct and fair disclosure practices for designated persons' },
    { title: 'Stakeholder Transparency', desc: 'Immediate dissemination of material events through BSE Limited' }
  ]
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
  industry: 'Public Listed Entity / Corporate Development'
};

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'corporate-finance',
    title: 'Corporate Finance & Advisory',
    shortDesc: 'Historical foundation in balance sheet structuring, financial evaluation, and corporate advisory principles.',
    fullDesc: 'Historically operating in corporate financial advisory, the Company developed foundational competencies in evaluating capital structures and corporate reorganization. As part of our strategic evolution, these advisory disciplines inform our evaluation of new corporate opportunities and long-term value generation.',
    route: 'capabilities/corporate-finance',
    iconName: 'Landmark',
    keyOfferings: [
      'Historical Balance Sheet Evaluation Principles',
      'Strategic Corporate Structure Assessment',
      'Financial Viability & Risk Diagnostic Review',
      'Governance Alignment & Compliance Frameworks'
    ],
    clientFit: 'Earlier financial services focus; now strategically informing corporate evaluation.',
    stats: { label: 'Disciplinary Context', value: 'Historical Advisory Background' }
  },
  {
    id: 'merchant-banking',
    title: 'Merchant Banking & Capital Markets',
    shortDesc: 'Earlier experience in capital market interfaces, statutory issue compliance, and valuation diligence.',
    fullDesc: 'Having historically engaged with Indian capital market frameworks and public issue compliance, the Company retains an institutional understanding of regulatory interfaces. Today, these insights support our governance discipline and transparent interaction with capital market stakeholders.',
    route: 'capabilities/merchant-banking',
    iconName: 'ShieldCheck',
    keyOfferings: [
      'Institutional Understanding of SEBI Guidelines',
      'Valuation Diligence & Independent Due Diligence Oversight',
      'Corporate Restructuring Evaluation',
      'BSE Platform Listing Interface Understanding'
    ],
    clientFit: 'Earlier capital market interface; supporting current governance rigor.',
    stats: { label: 'Market Tenure', value: 'Since 1994' }
  },
  {
    id: 'investment-banking',
    title: 'Strategic Transactions & Capital Sourcing',
    shortDesc: 'Experience in corporate transaction analysis, strategic syndication, and long-term corporate evaluation.',
    fullDesc: 'The Company draws upon earlier institutional interactions in structured transaction analysis. In our current strategic phase, transaction diligence is applied towards evaluating mergers, acquisitions, partnerships, and corporate development opportunities.',
    route: 'capabilities/investment-banking',
    iconName: 'TrendingUp',
    keyOfferings: [
      'Transaction Diligence & Strategic Fit Analysis',
      'Corporate Development Evaluation',
      'Partner Synergy & Joint Venture Assessment',
      'Statutory & Regulatory Due Diligence'
    ],
    clientFit: 'Strategic evaluation for corporate growth and sustainable diversification.',
    stats: { label: 'Strategic Orientation', value: 'Growth & Diversification' }
  },
  {
    id: 'securities-services',
    title: 'Securities Administration & Treasury Governance',
    shortDesc: 'Long-standing market presence in securities compliance, depository coordination, and fiduciary administration.',
    fullDesc: 'With continuous listing on the BSE since 1994, Amarnath Securities possesses comprehensive institutional experience in securities administration, electronic depository mechanics (NSDL & CDSL), and prudent treasury governance.',
    route: 'capabilities/securities-services',
    iconName: 'Layers',
    keyOfferings: [
      'Electronic Demat & Depository Connectivity (NSDL/CDSL)',
      'Fiduciary Governance & Shareholder Record Administration',
      'Capital Preservation & Treasury Oversight Guidelines',
      'Statutory Listing Discipline on BSE Limited'
    ],
    clientFit: 'Continuous corporate securities heritage and fiduciary stewardship.',
    stats: { label: 'BSE Listing Status', value: 'Scrip: 538465' }
  },
  {
    id: 'corporate-lending',
    title: 'Credit Assessment & Financial Evaluation',
    shortDesc: 'Historical background in credit assessment, liquidity review, and structured cash-flow analysis.',
    fullDesc: 'Having historically operated within the NBFC and lending space, the Company maintains foundational experience in credit risk evaluation and financial viability analysis. This analytical heritage serves as a prudent filter when evaluating new business initiatives.',
    route: 'capabilities/corporate-lending',
    iconName: 'Coins',
    keyOfferings: [
      'Historical Credit Evaluation Discipline',
      'Cash Flow Sensitivity & Solvency Assessment',
      'Risk-Weighted Commercial Appraisal',
      'Prudent Governance and Solvency Filters'
    ],
    clientFit: 'Earlier lending heritage; now providing analytical rigor for corporate opportunities.',
    stats: { label: 'Operational Heritage', value: 'Earlier NBFC Experience' }
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

  // Corporate Governance
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
    description: 'Compliance report on corporate governance pursuant to Regulation 27(2) of SEBI (LODR) Regulations, 2015 detailing board composition and committee meetings.',
    sebiReference: 'Reg 27(2) SEBI (LODR)'
  },
  {
    id: 'doc-cg-q2-26',
    title: 'Quarterly Corporate Governance Report for Quarter ended September 30, 2025',
    category: 'Corporate Governance',
    financialYear: 'FY 2025-26',
    quarter: 'Q2',
    filingDate: '14 Oct 2025',
    bseAckNumber: 'BSE/LODR/20251014/948210',
    fileSize: '620 KB',
    fileType: 'PDF',
    description: 'Quarterly governance compliance report including composition of board, audit committee, and secretarial compliance.',
    sebiReference: 'Reg 27(2) SEBI (LODR)'
  },
  {
    id: 'doc-cg-sec-audit-25',
    title: 'Secretarial Audit Report for Financial Year 2024-25 (Form MR-3)',
    category: 'Corporate Governance',
    financialYear: 'FY 2024-25',
    quarter: 'Annual',
    filingDate: '30 Aug 2025',
    bseAckNumber: 'BSE/LODR/20250830/881204',
    fileSize: '1.4 MB',
    fileType: 'PDF',
    description: 'Secretarial Audit Report issued by Practicing Company Secretary pursuant to Section 204(1) of the Companies Act, 2013 and Regulation 24A of SEBI LODR.',
    sebiReference: 'Sec 204 Companies Act & Reg 24A'
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
  { clause: '46(2)(j)', title: 'Email address for grievance redressal and other relevant details', status: 'Complied', linkText: 'contact.amarnathsecurities@gmail.com' },
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
    title: 'Navigating India’s Mid-Market Capital Dynamics: Corporate Structuring in 2026',
    category: 'Corporate Governance & Markets',
    date: 'February 2026',
    readTime: '5 min read',
    author: 'Amarnath Securities Corporate Secretariat',
    excerpt: 'How Indian mid-market enterprises weigh capital structures, sustainable growth avenues and strategic corporate transactions in a tighter governance environment.',
    content: `As the Indian economy sustains its robust momentum in 2026, mid-market enterprises face dynamic opportunities and operational considerations across varied sectors. Traditional bank credit lines, structured instruments, and equity transactions each present distinct governance and balance-sheet implications.

Corporate entities increasingly evaluate opportunities based on commercial viability, strategic alignment, and sustainable value creation. Careful assessment of capital structures and disciplined regulatory compliance remain central to long-term enterprise compounding.

Capital structure decisions are rarely binary. For most mid-market businesses the practical question is not whether to raise capital, but how the mix of debt, equity and internal accruals should evolve alongside the operating cycle. Over-leveraging compresses resilience during a downturn, while excessive dilution transfers value away from promoters and long-standing shareholders. The discipline lies in matching instrument tenor to the productive life of the asset it funds.

Governance quality has also become inseparable from access to capital. Lenders and institutional investors now examine disclosure practices, related-party frameworks and board independence before they examine a business plan. An entity with modest but consistently transparent reporting frequently secures better terms than a larger peer whose disclosures are irregular.

Diligence standards have hardened in step with that shift. Financial, legal, operational and regulatory reviews are conducted in parallel rather than sequentially, and their findings carry weight comparable to the headline valuation. Where an opportunity does not survive that scrutiny, the appropriate outcome is to decline it rather than to restructure the transaction around unresolved risk.

Amarnath Securities Limited observes these broader market developments with a focus on sustainable long-term value creation, responsible governance, and statutory transparency.`,
    keyTakeaways: [
      'Instrument tenor should be matched to the productive life of the asset being financed.',
      'Disclosure consistency influences the cost and availability of capital more than balance sheet size alone.',
      'Financial, legal, operational and regulatory diligence now run in parallel and set the pace of transactions.',
      'Declining an opportunity that fails diligence is a governance outcome, not a missed opportunity.'
    ],
    topics: ['Capital Structure', 'Mid-Market Finance', 'Corporate Governance', 'Due Diligence']
  },
  {
    id: 'insight-2',
    title: 'SEBI LODR 2026 Governance Norms: Elevating Disclosure Discipline for Listed Entities',
    category: 'Regulatory & Governance',
    date: 'January 2026',
    readTime: '6 min read',
    author: 'Secretarial & Compliance Division',
    excerpt: 'How enhanced materiality thresholds under Regulation 30 reshape disclosure protocols, response timelines and board-level oversight for listed entities.',
    content: `Regulatory architecture in India has undergone a transformative evolution. The enhanced materiality standards introduced by SEBI require listed entities to adopt structured protocols for identifying and disclosing quantitative and qualitative events within stringent hourly timelines.

Materiality is now defined both quantitatively and qualitatively. An event that is financially immaterial may still require disclosure if it affects the company’s reputation, operations or stakeholder confidence. In practice this places the judgement of the compliance function on record for every determination, which is why documented internal thresholds matter as much as the regulation itself.

The operative discipline is sequence. Disclosure obligations are triggered before a transaction is consummated rather than after it is announced, and the window between board approval and exchange dissemination is measured in hours. Listed entities therefore maintain calendarised disclosure protocols, designated spokespersons and single-point dissemination channels to BSE Limited.

For boards, the practical consequence is that compliance can no longer be treated as a quarterly exercise. Continuous obligations under Regulation 30 and periodic obligations under Regulations 31, 33 and 46 require an operating rhythm rather than a reporting deadline. Entities that treat disclosure as an ongoing process generally encounter fewer clarifications from the exchange and fewer restatements.

Investor grievance mechanisms form part of the same architecture. Prompt acknowledgement and closure of complaints, together with the quarterly statement filed under Regulation 13(3), are increasingly read alongside financial disclosures as indicators of how responsive a management is in practice.

For shareholders and institutional stakeholders, this translates into unprecedented transparency. Amarnath Securities Limited maintains strict compliance with Regulation 46 disclosures, ensuring that every financial result, board decision, and shareholding pattern is accessible to the investing public in real time.`,
    keyTakeaways: [
      'Materiality under Regulation 30 is judged qualitatively as well as quantitatively.',
      'Disclosure windows are measured in hours, so protocols must be calendarised rather than reactive.',
      'Continuous obligations call for an operating rhythm, not a quarterly reporting deadline.',
      'Grievance resolution statistics are read alongside financial disclosures as a governance signal.'
    ],
    topics: ['SEBI LODR', 'Regulation 30', 'Disclosure Obligations', 'Board Governance']
  },
  {
    id: 'insight-3',
    title: 'Corporate Treasury & Balance Sheet Prudence in Dynamic Macroeconomic Cycles',
    category: 'Corporate Strategy & Governance',
    date: 'December 2025',
    readTime: '4 min read',
    author: 'Corporate & Strategic Perspectives',
    excerpt: 'Liquidity frameworks, capital preservation buffers and the governance of treasury operations across changing economic cycles.',
    content: `Managing corporate balance sheets requires a disciplined balance between capital preservation, regulatory compliance, and operational liquidity. In dynamic macroeconomic cycles, entities prioritize solvency and prudent capital allocation.

Treasury policy is most useful precisely when conditions are least predictable. A framework that specifies approved instruments, counterparty limits, maturity bands and concentration ceilings allows a company to act deliberately when funding markets tighten, instead of negotiating its own principles under pressure.

Liquidity buffers serve a different purpose from investment yield. Reserving a defined proportion of surplus in instruments with a high certainty of settlement reduces the probability that an operating shortfall forces asset sales at depressed values. The cost of that buffer is the return foregone, and it is ordinarily outweighed by the cost of distressed funding that it avoids.

Working capital discipline and balance sheet structure are connected. Lengthening receivable cycles and inventory build-ups are early indicators that operating cash generation is diverging from reported profitability, and they typically precede rather than follow a liquidity event.

Governance oversight of treasury operations is equally material. Documented delegation thresholds, independent reconciliation of holdings and periodic review of exposures by the audit committee keep treasury discretion accountable and ensure that reported positions reflect those actually held.

Corporate entities and market participants increasingly evaluate balanced strategies to manage working capital and liquidity while adhering to statutory and prudential guidelines.`,
    keyTakeaways: [
      'Treasury frameworks are most valuable when funding conditions are least predictable.',
      'A liquidity buffer is an insurance cost measured against the return foregone, not a yield decision.',
      'Receivable and inventory cycles usually signal liquidity stress before reported profitability does.',
      'Delegation thresholds and independent reconciliation keep treasury discretion accountable.'
    ],
    topics: ['Treasury Management', 'Liquidity Risk', 'Balance Sheet Discipline', 'Risk Governance']
  }
];

export const FINANCIAL_HIGHLIGHTS_SUMMARY = [
  { metric: 'Paid-Up Equity Share Capital', value: '₹300.00 Lakhs', note: '30,00,000 Equity Shares of ₹10/- each' },
  { metric: 'Listing Status', value: 'BSE Listed (Scrip: 538465)', note: 'Continuous listing since 1994' },
  { metric: 'Demat Connectivity', value: 'NSDL & CDSL', note: 'ISIN: INE745P01010' },
  { metric: 'Corporate Identification', value: 'L67120GJ1994PLC023254', note: 'Registered with ROC Gujarat' },
  { metric: 'Governance & Disclosures', value: 'SEBI LODR Framework', note: 'Timely statutory BSE filings & investor grievance monitoring' },
];
