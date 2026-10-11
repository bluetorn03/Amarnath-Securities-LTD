import React from 'react';
import { AdminViewId, AdminUser } from '../../types';
import { 
  Menu, 
  RefreshCw, 
  Key, 
  ExternalLink, 
  Activity, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface AdminHeaderProps {
  activeView: AdminViewId;
  collapsed: boolean;
  onToggleMobileDrawer: () => void;
  currentUser: AdminUser | null;
  onRefresh: () => void;
  refreshing: boolean;
  onChangePasswordClick?: () => void;
  onNavigatePublic: () => void;
  systemConnected?: boolean;
  dbPingMs?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeView,
  collapsed,
  onToggleMobileDrawer,
  currentUser,
  onRefresh,
  refreshing,
  onNavigatePublic
}) => {
  // Breadcrumb mappings
  const getBreadcrumb = (view: AdminViewId) => {
    switch (view) {
      case 'dashboard':
        return { group: 'Dashboard', title: 'Executive Operations Command Center' };
      case 'website_health':
        return { group: 'Settings & Administration', title: 'System & Website Health Telemetry' };
      case 'financial_results':
        return { group: 'Documents & Disclosures', title: 'Financial Results Disclosures' };
      case 'annual_reports':
        return { group: 'Documents & Disclosures', title: 'Annual Reports & Audited Accounts' };
      case 'shareholding_pattern':
        return { group: 'Documents & Disclosures', title: 'Shareholding Pattern (Reg 31)' };
      case 'bse_disclosures':
        return { group: 'Documents & Disclosures', title: 'BSE Disclosures & Intimations (Reg 30)' };
      case 'agm_egm_notices':
        return { group: 'Documents & Disclosures', title: 'AGM & Notices & Voting Disclosures' };
      case 'statutory_filings':
        return { group: 'Documents & Disclosures', title: 'Secretarial & Statutory Filings' };
      case 'newspaper_publications':
        return { group: 'Documents & Disclosures', title: 'Statutory Newspaper Publications (Reg 47)' };
      case 'reg46_checklist':
        return { group: 'Governance & Compliance', title: 'SEBI LODR Regulation 46 Master Checklist' };
      case 'directors':
        return { group: 'Governance & Compliance', title: 'Board & Committees (DIN Reconciliation)' };
      case 'committees':
        return { group: 'Governance & Compliance', title: 'Board Committees & Mandate Composition' };
      case 'kmp':
        return { group: 'Governance & Compliance', title: 'Key Managerial Personnel (KMP) Disclosures' };
      case 'corporate_governance':
        return { group: 'Governance & Compliance', title: 'Corporate Governance & Statutory Policies' };
      case 'policies':
        return { group: 'Governance & Compliance', title: 'Statutory Policies & Mandatory Codes' };
      case 'pages':
      case 'announcements':
      case 'contact_details':
      case 'document_library':
      case 'seo_metadata':
        return { group: 'Website Content', title: 'Website Content' };
      case 'grievances':
        return { group: 'Investor Support', title: 'Shareholder Grievance Redressal (Reg 13(3))' };
      case 'enquiries':
        return { group: 'Investor Support', title: 'Investor & Mandate Enquiries' };
      case 'rta_contact':
        return { group: 'Investor Support', title: 'RTA & Contact Information' };
      case 'users':
        return { group: 'Settings & Administration', title: 'Users & Roles Management (RBAC)' };
      case 'audit':
        return { group: 'Settings & Administration', title: 'Security & Administrative Audit Logs' };
      case 'notifications':
        return { group: 'Settings & Administration', title: 'Security & Notifications' };
      case 'system_health':
        return { group: 'Settings & Administration', title: 'System Health & Live Telemetry' };
      case 'backups':
        return { group: 'Settings & Administration', title: 'Backups & Recovery (SQL Snapshots)' };
      case 'settings':
        return { group: 'Settings & Administration', title: 'Institutional Settings & Company Profile' };
      default:
        return { group: 'Dashboard', title: 'Administrative Portal' };
    }
  };

  const breadcrumb = getBreadcrumb(activeView);

  return (
    <header 
      className={`h-16 fixed top-0 right-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
        collapsed ? 'left-0 sm:left-[74px]' : 'left-0 sm:left-[280px]'
      }`}
    >
      {/* Mobile Drawer Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileDrawer}
          className="sm:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <span>{breadcrumb.group}</span>
            <span>/</span>
            <span className="text-[#0D9488] font-bold">{breadcrumb.title}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-[#0A1128] tracking-tight truncate">
            {breadcrumb.title}
          </h1>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          title="Refresh real-time data from database"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-[#0A1128] transition-colors shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#0D9488]' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* View Public Portal */}
        <button
          onClick={onNavigatePublic}
          title="Open Public Investor Portal in view mode"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors shadow-2xs"
        >
          <span>Public Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
        </button>
      </div>
    </header>
  );
};
