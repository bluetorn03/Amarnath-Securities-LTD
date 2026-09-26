export type PageRoute = 
  | 'home'
  | 'about'
  | 'about/leadership'
  | 'about/governance'
  | 'about/corporate-info'
  | 'capabilities'
  | 'capabilities/corporate-finance'
  | 'capabilities/merchant-banking'
  | 'capabilities/investment-banking'
  | 'capabilities/securities-services'
  | 'capabilities/corporate-lending'
  | 'investor-relations'
  | 'investor-relations/financial-results'
  | 'investor-relations/annual-reports'
  | 'investor-relations/shareholding-pattern'
  | 'investor-relations/bse-disclosures'
  | 'investor-relations/regulation-46'
  | 'investor-relations/agm-notices'
  | 'investor-relations/governance'
  | 'investor-relations/policies'
  | 'investor-relations/grievance'
  | 'investor-relations/rta'
  | 'insights'
  | 'contact';

export type DocumentCategory = 
  | 'Financial Results'
  | 'Annual Reports'
  | 'Shareholding Pattern'
  | 'BSE Disclosures'
  | 'Regulation 46'
  | 'AGM / EGM / Notices'
  | 'Corporate Governance'
  | 'Company Policies'
  | 'Investor Grievance';

export interface InvestorDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  financialYear: string; // e.g. 'FY 2025-26'
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Annual' | 'N/A';
  filingDate: string;
  bseAckNumber: string;
  fileSize: string;
  fileType: 'PDF' | 'XBRL';
  description: string;
  downloadUrl?: string;
  sebiReference?: string;
}

export interface CapabilityItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  route: PageRoute;
  keyOfferings: string[];
  clientFit: string;
  stats?: { label: string; value: string };
  iconName: string;
}

export interface LeaderProfile {
  name: string;
  designation: string;
  category: 'Executive' | 'Non-Executive' | 'Independent' | 'KMP';
  dinOrMembership?: string;
  bio: string;
  committees?: string[];
}

export interface ShareholdingItem {
  category: string;
  shares: number;
  percentage: number;
  changeQoQ: string;
  color: string;
}

export interface MarketTickerData {
  scripCode: string;
  scripName: string;
  isin: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  week52High: number;
  week52Low: number;
  volume: string;
  marketCap: string;
  faceValue: number;
  industry: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}
