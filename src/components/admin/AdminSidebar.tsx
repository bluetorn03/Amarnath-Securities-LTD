import React, { useState, useEffect } from 'react';
import { 
  AdminViewId, 
  AdminUser 
} from '../../types';
import { AmarnathLogo } from '../AmarnathLogo';
import { 
  LayoutDashboard, 
  PieChart, 
  BookOpen, 
  Share2, 
  Building2, 
  Calendar, 
  FileCheck2, 
  Newspaper, 
  CheckSquare, 
  Users2, 
  UserCheck, 
  Scale, 
  Globe, 
  Megaphone, 
  MapPin, 
  Search, 
  ShieldAlert, 
  Inbox, 
  PhoneCall, 
  UserCog, 
  Shield, 
  FileSearch, 
  HardDrive, 
  Database, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  LogOut,
  ExternalLink,
  FolderOpen
} from 'lucide-react';

interface AdminSidebarProps {
  activeView: AdminViewId;
  onSelectView: (view: AdminViewId) => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigatePublic: () => void;
  metrics?: {
    publishedDocs?: number;
    draftDocs?: number;
    pendingGrievances?: number;
    reg46Pending?: number;
  };
}

interface SubNavItem {
  id: AdminViewId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SubNavItem[];
  badge?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeView,
  onSelectView,
  currentUser,
  onLogout,
  collapsed,
  onToggleCollapse,
  onNavigatePublic,
  metrics = {}
}) => {
  // Collapsible navigation groups
  const groups: NavGroup[] = [
    {
      id: 'documents',
      title: 'Documents & Disclosures',
      icon: FolderOpen,
      items: [
        { id: 'financial_results', label: 'Financial Results', icon: PieChart },
        { id: 'annual_reports', label: 'Annual Reports', icon: BookOpen },
        { id: 'shareholding_pattern', label: 'Shareholding Pattern', icon: Share2 },
        { id: 'bse_disclosures', label: 'BSE Disclosures', icon: Building2 },
        { id: 'agm_egm_notices', label: 'AGM & Notices', icon: Calendar },
        { id: 'statutory_filings', label: 'Statutory Filings', icon: FileCheck2 },
        { id: 'newspaper_publications', label: 'Newspaper Publications', icon: Newspaper },
      ]
    },
    {
      id: 'governance',
      title: 'Governance & Compliance',
      icon: Scale,
      badge: metrics.reg46Pending,
      items: [
        { 
          id: 'reg46_checklist', 
          label: 'Regulation 46', 
          icon: CheckSquare, 
          badge: metrics.reg46Pending, 
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' 
        },
        { id: 'directors', label: 'Board & Committees', icon: Users2 },
        { id: 'kmp', label: 'KMP', icon: UserCheck },
        { id: 'corporate_governance', label: 'Corporate Governance & Policies', icon: Scale },
      ]
    },
    {
      id: 'support',
      title: 'Investor Support',
      icon: ShieldAlert,
      badge: metrics.pendingGrievances,
      items: [
        { 
          id: 'grievances', 
          label: 'Investor Grievances', 
          icon: ShieldAlert,
          badge: metrics.pendingGrievances,
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300' 
        },
        { id: 'enquiries', label: 'Investor Enquiries', icon: Inbox },
        { id: 'rta_contact', label: 'RTA & Contact Information', icon: PhoneCall },
      ]
    },
    {
      id: 'settings_admin',
      title: 'Settings & Administration',
      icon: Settings,
      items: [
        { id: 'settings', label: 'Company Profile', icon: Building2 },
        { id: 'users', label: 'Users & Roles', icon: UserCog },
        { id: 'audit', label: 'Audit Logs', icon: FileSearch },
      ]
    }
  ];

  // Map each activeView to its parent group
  const getViewParentGroup = (view: AdminViewId): string | null => {
    for (const group of groups) {
      if (group.items.some(item => item.id === view)) {
        return group.id;
      }
    }
    return null;
  };

  const initialParent = getViewParentGroup(activeView);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    documents: initialParent === 'documents',
    governance: initialParent === 'governance',
    support: initialParent === 'support',
    settings_admin: initialParent === 'settings_admin'
  });

  // Auto-expand group when activeView changes
  useEffect(() => {
    const parent = getViewParentGroup(activeView);
    if (parent) {
      setExpandedGroups(prev => ({ ...prev, [parent]: true }));
    }
  }, [activeView]);

  const toggleGroup = (groupId: string) => {
    if (collapsed) {
      onToggleCollapse(); // expand sidebar if collapsed
    }
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Super Admin', bg: 'bg-[#C5A059]/15 text-[#8C6D23] border-[#C5A059]/40' };
      case 'compliance_officer':
        return { label: 'Compliance Officer', bg: 'bg-[#0D9488]/15 text-[#0F766E] border-[#0D9488]/40' };
      case 'editor':
        return { label: 'Editor', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'viewer':
      default:
        return { label: 'Viewer', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const roleInfo = getRoleBadge(currentUser?.role);

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-white border-r border-slate-200/90 transition-all duration-300 shadow-xs ${
        collapsed ? 'w-[74px]' : 'w-[280px]'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-slate-200/80 bg-[#FAFBFD] transition-all ${
        collapsed ? 'px-2 justify-between' : 'px-4 justify-between'
      }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 flex items-center justify-center">
            <AmarnathLogo 
              size={collapsed ? 26 : 36} 
              showText={!collapsed} 
              variant="light" 
              subtext="BSE: 538465 • LODR CMS" 
            />
          </div>
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
        
        {/* ITEM 1: Dashboard (Top-level Standalone Link) */}
        <button
          onClick={() => onSelectView('dashboard')}
          title={collapsed ? 'Dashboard' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group relative ${
            activeView === 'dashboard'
              ? 'bg-[#0A1128] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard
            className={`w-4 h-4 shrink-0 transition-colors ${
              activeView === 'dashboard'
                ? 'text-[#C5A059]'
                : 'text-slate-500 group-hover:text-slate-700'
            }`}
          />
          {!collapsed && (
            <span className="truncate text-left flex-1 font-sans">
              Dashboard
            </span>
          )}
          {activeView === 'dashboard' && !collapsed && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0"></span>
          )}
        </button>

        {/* Navigation Groups & Standalone Items */}
        {groups.map((group) => {
          const GroupIcon = group.icon;
          const isExpanded = Boolean(expandedGroups[group.id]);
          const isGroupActive = group.items.some(it => it.id === activeView);

          return (
            <React.Fragment key={group.id}>
              {/* Standalone Link: Website Content (Rendered before Settings & Administration) */}
              {group.id === 'settings_admin' && (
                <div className="pt-1">
                  <button
                    onClick={() => onSelectView('pages')}
                    title={collapsed ? 'Website Content' : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group relative ${
                      activeView === 'pages'
                        ? 'bg-[#0A1128] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                    }`}
                  >
                    <Globe
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        activeView === 'pages'
                          ? 'text-[#C5A059]'
                          : 'text-slate-500 group-hover:text-slate-700'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate text-left flex-1 font-sans">
                        Website Content
                      </span>
                    )}
                    {activeView === 'pages' && !collapsed && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0"></span>
                    )}
                  </button>
                </div>
              )}

              <div className="space-y-0.5 pt-1">
                {/* Group Header Button */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  title={collapsed ? group.title : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                    isGroupActive && !isExpanded
                      ? 'bg-slate-100 text-[#0A1128] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                <GroupIcon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isGroupActive
                      ? 'text-[#0D9488]'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!collapsed && (
                  <>
                    <span className="truncate text-left flex-1 font-sans">
                      {group.title}
                    </span>
                    {group.badge !== undefined && group.badge > 0 && !isExpanded && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {group.badge}
                      </span>
                    )}
                    <span className="text-slate-400 group-hover:text-slate-600 transition-transform">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </>
                )}
                {collapsed && group.badge !== undefined && group.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </button>

              {/* Sub-items (Shown ONLY when group is expanded and sidebar is not collapsed) */}
              {!collapsed && isExpanded && (
                <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l-2 border-slate-100 ml-4.5 my-0.5">
                  {group.items.map((subItem, sIdx) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeView === subItem.id;

                    return (
                      <button
                        key={`${subItem.id}-${sIdx}`}
                        onClick={() => onSelectView(subItem.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all group ${
                          isSubActive
                            ? 'bg-[#0A1128] text-white font-semibold shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <SubIcon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSubActive
                              ? 'text-[#C5A059]'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="truncate text-left flex-1">
                          {subItem.label}
                        </span>
                        {subItem.badge !== undefined && subItem.badge > 0 && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${
                              subItem.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {subItem.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
      </div>

      {/* Public Site Quick Link */}
      <div className="p-2.5 border-t border-slate-200/80 bg-[#FAFBFD]/60">
        <button
          onClick={onNavigatePublic}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-[#0D9488] hover:bg-teal-50/60 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Open Public Investor Relations Portal"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-[#0D9488]" />
          {!collapsed && (
            <span className="truncate flex-1 text-left font-medium">
              View Public Website
            </span>
          )}
        </button>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0A1128] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-[#C5A059]/30">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1 truncate">
              <div className="text-xs font-bold text-[#0A1128] truncate leading-tight">
                {currentUser?.name || 'Administrator'}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${roleInfo.bg}`}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            title="Terminate Administrative Session"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
