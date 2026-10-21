/** Route for an individual insight article, e.g. `insights/insight-1`. */
export type InsightRoute = `insights/${string}`;

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
  | 'investor-relations/board-of-directors'
  | 'investor-relations/committees'
  | 'investor-relations/agm-notices'
  | 'investor-relations/governance'
  | 'investor-relations/policies'
  | 'investor-relations/disclosures-policies'
  | 'investor-relations/newspaper-publications'
  | 'investor-relations/annual-return'
  | 'investor-relations/secretarial-compliance'
  | 'investor-relations/analyst-meets'
  | 'investor-relations/kmp-contacts'
  | 'investor-relations/grievance'
  | 'investor-relations/rta'
  | 'insights'
  | InsightRoute
  | 'contact'
  | 'admin';

export type DocumentCategory = 
  | 'Financial Results'
  | 'Annual Reports'
  | 'Shareholding Pattern'
  | 'BSE Disclosures'
  | 'Regulation 46'
  | 'AGM / EGM / Notices'
  | 'Corporate Governance'
  | 'Company Policies'
  | 'Disclosures & Policies'
  | 'Investor Grievance'
  | 'Newspaper Publications'
  | 'Annual Return (MGT-7)'
  | 'Secretarial Compliance Report'
  | 'Statutory Disclosures'
  | 'MOA & AOA'
  | 'Analyst & Investor Meets';

export type DocumentSourceType = 'upload' | 'file_url' | 'external_url';

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
  // CMS Readiness Fields (Database / Backend / Admin CMS ready)
  sourceType: DocumentSourceType; // 'upload' | 'file_url' | 'external_url'
  fileUrl?: string; // Direct link to hosted or uploaded PDF
  externalUrl?: string; // External statutory filing link (e.g. BSE Listing Centre)
  isAvailable: boolean; // true if physical/verified file exists; false if awaiting Company/CS submission
  sebiReference?: string;
  effectiveDate?: string;
  version?: string;
  isStatutory?: boolean;
  status?: 'draft' | 'review' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export type Reg46Category = 
  | 'General Business'
  | 'Charter & Incorporation'
  | 'Board & Governance'
  | 'Statutory Policies'
  | 'Financial Disclosures'
  | 'Shareholding'
  | 'Public Relations & Analyst Meets'
  | 'Newspaper Publications'
  | 'Compliance & Secretarial Filings'
  | 'Investor Redressal & Contacts'
  | 'Website Governance';

export type Reg46Status = 
  | 'Complied & Published'
  | 'Maintained in Library'
  | 'Active Disclosure'
  | 'Company/CS Confirmation Required'
  | 'Subject to Company / CS Confirmation'
  | 'Nil / Not Applicable (Company Confirmation Required)'
  | 'Continuous Statutory Compliance';

export interface Regulation46ClauseItem {
  clause: string; // e.g. '46(2)(a)'
  subRegulation?: string;
  title: string;
  requirement: string;
  category: Reg46Category;
  websiteLocation: string;
  targetRoute: PageRoute;
  targetCategory?: string;
  status: Reg46Status;
  actionText: string;
  legalCitation: string;
  internalNote?: string;
}

export interface DirectorProfile {
  id: string;
  name: string;
  designation: string;
  category: 'Executive Director' | 'Non-Executive Independent Director' | 'Non-Executive Director' | 'Key Managerial Personnel (KMP)';
  din: string;
  appointmentDate?: string;
  term?: string;
  bio: string;
  otherDirectorships: string[];
  committeeMemberships: {
    committeeName: string;
    role: 'Chairperson' | 'Member';
  }[];
  verified: boolean;
  approvalStatus: string;
}

export interface BoardCommitteeMember {
  name: string;
  designation: string;
  role: 'Chairperson' | 'Member';
  category: string;
  din?: string;
}

export interface BoardCommittee {
  id: string;
  name: string;
  shortName: string;
  mandate: string;
  compositionRule: string;
  statutoryReference: string;
  chairperson: BoardCommitteeMember;
  members: BoardCommitteeMember[];
  meetingsFrequency: string;
  keyResponsibilities: string[];
}

export interface KMPContact {
  id: string;
  role: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  address?: string;
  authorityScope: string;
  statutoryReference: string;
}

export interface AnalystMeetItem {
  id: string;
  financialYear: string;
  quarter: string;
  eventTitle: string;
  date: string;
  eventType: 'Analyst Meet' | 'Institutional Investor Meet' | 'Earnings Call' | 'Investor Presentation';
  scheduleIntimationBseAck?: string;
  hasAudio: boolean;
  hasVideo: boolean;
  hasTranscript: boolean;
  presentationUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  transcriptUrl?: string;
  statusNote: string;
}

export interface NewspaperPublicationItem {
  id: string;
  financialYear: string;
  quarter: string;
  publicationDate: string;
  newspaperName: string;
  edition: string;
  language: string;
  noticeType: 'Financial Results Notice' | 'Board Meeting Prior Notice' | 'AGM Notice' | 'Loss of Share Certificates / Transfer' | 'Other Notice';
  fileSize: string;
  bseAck: string;
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
  /** Short summary points rendered in the article's takeaways panel. */
  keyTakeaways: string[];
  /** Thematic tags listed beneath the article body. */
  topics: string[];
}

export type AdminRole = 'super_admin' | 'compliance_officer' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  failedLoginAttempts?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLogItem {
  id: number;
  user_name: string | null;
  user_email: string | null;
  user_role?: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  ip_address: string;
  created_at: string;
  formatted_ist?: string;
  details: any;
}

export interface EnquiryItem {
  id: string;
  reference_no: string;
  type: 'business' | 'investor';
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  service_interest: string | null;
  estimated_capital: string | null;
  folio_or_dp_id: string | null;
  grievance_category: string | null;
  details: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  resolution_notes?: string | null;
  admin_notes?: string | null;
  follow_up_date?: string | null;
  is_archived?: boolean | number;
  assigned_to?: string | null;
  updated_by?: string | null;
  is_test?: boolean | number;
  ip_address: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentVersionItem {
  id: number;
  version: string;
  file_url: string;
  file_size: string;
  source_type: string;
  change_summary: string;
  created_by_name: string | null;
  created_at: string;
}

export interface SystemHealthData {
  service: string;
  version: string;
  timestamp: string;
  connectivity: {
    database: 'connected' | 'disconnected';
    pingMs: number;
    storageMounted: boolean;
    status: 'healthy' | 'degraded';
  };
  systemTelemetry: {
    uptimeSeconds: number;
    memoryUsageMb: string;
    nodeVersion: string;
    platform: string;
    freeMemMb: string;
    totalMemMb: string;
  };
  storage: {
    uploadDir: string;
    fileCount: number;
    storageSizeBytes: number;
    storageSizeDisplay: string;
    maxCapacityMb: number;
    usagePercentage: string;
  };
  backupStatus: {
    totalBackupsCount: number;
    latestBackup: {
      filename: string;
      sizeBytes: number;
      sizeDisplay: string;
      createdAt: string;
    } | null;
  };
  metrics: {
    documents: {
      total: number;
      published: number;
      draft: number;
      review: number;
      archived: number;
    };
    regulation46: {
      total: number;
      active?: number;
      verified: number;
      pendingEvidence: number;
      underReview: number;
      notApplicable: number;
      complianceScore: number;
    };
    enquiries: {
      total: number;
      grievances: number;
      genuineGrievances?: number;
      genuineEnquiries?: number;
      testAuditRuns?: number;
      pendingNew: number;
      inProgress: number;
      resolved: number;
    };
    users: {
      total: number;
      active: number;
    };
  };
}

export interface DatabaseBackupItem {
  filename: string;
  sizeBytes: number;
  sizeDisplay: string;
  createdAt: string;
  encrypted?: boolean;
  encryptionType?: string;
  status: 'available';
}

export type AdminViewId = 
  // Overview
  | 'dashboard'
  | 'website_health'
  // Investor Relations
  | 'financial_results'
  | 'annual_reports'
  | 'shareholding_pattern'
  | 'bse_disclosures'
  | 'agm_egm_notices'
  | 'statutory_filings'
  | 'newspaper_publications'
  // Governance & Compliance
  | 'reg46_checklist'
  | 'directors'
  | 'committees'
  | 'kmp'
  | 'corporate_governance'
  | 'policies'
  // Website Content
  | 'pages'
  | 'announcements'
  | 'contact_details'
  | 'document_library'
  | 'seo_metadata'
  // Investor Support
  | 'grievances'
  | 'enquiries'
  | 'rta_contact'
  // Administration
  | 'users'
  | 'audit'
  | 'notifications'
  | 'system_health'
  | 'backups'
  | 'settings';


