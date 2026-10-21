import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  EnquiryItem, 
  AdminUser 
} from '../../types';
import { 
  ShieldAlert, 
  Inbox, 
  PhoneCall, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  X, 
  Edit3, 
  FileText,
  Mail,
  MapPin,
  Phone,
  Globe,
  AlertTriangle,
  Building2,
  Calendar,
  Eye,
  Archive,
  RotateCcw,
  Tag,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Check,
  History,
  Send
} from 'lucide-react';

interface AdminInvestorSupportProps {
  initialSubTab?: 'grievances' | 'enquiries' | 'rta_contact';
  enquiries: EnquiryItem[];
  loading: boolean;
  currentUser: AdminUser | null;
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: 'new' | 'in_progress' | 'resolved' | 'closed', notes?: string, followUpDate?: string) => Promise<void>;
  onNotify?: (type: 'success' | 'error', message: string) => void;
}

interface RtaContactData {
  rta_name: string;
  rta_address: string;
  rta_phone: string;
  rta_email: string;
  rta_website: string;
  compliance_officer: string;
  compliance_email: string;
  compliance_phone: string;
  grievance_email: string;
  reg_office: string;
  corp_office: string;
  sebi_scores_url: string;
  sebi_smart_odr_url: string;
  bse_portal_url: string;
  confirmations?: {
    rta_appointment: { status: string; description: string; primary: string; legacy: string };
    office_coordinates: { status: string; description: string; registered: string; corporate: string };
    grievance_email: { status: string; description: string; institutional: string; historical: string };
  };
}

export const AdminInvestorSupport: React.FC<AdminInvestorSupportProps> = ({
  initialSubTab = 'grievances',
  enquiries,
  loading: initialLoading,
  currentUser,
  onRefresh,
  onUpdateStatus,
  onNotify
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'grievances' | 'enquiries' | 'rta_contact'>(initialSubTab);
  
  // Search and Filters
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [recordCategory, setRecordCategory] = useState<'genuine' | 'test' | 'archived' | 'all'>('genuine');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Modals state
  const [viewingItem, setViewingItem] = useState<EnquiryItem | null>(null);
  const [viewingItemHistory, setViewingItemHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Status modal
  const [statusModalItem, setStatusModalItem] = useState<EnquiryItem | null>(null);
  const [newStatus, setNewStatus] = useState<'new' | 'in_progress' | 'resolved' | 'closed'>('in_progress');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [followUpDateInput, setFollowUpDateInput] = useState<string>('');
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Quick note modal
  const [noteModalItem, setNoteModalItem] = useState<EnquiryItem | null>(null);
  const [quickNote, setQuickNote] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);

  // Follow-up modal
  const [followUpModalItem, setFollowUpModalItem] = useState<EnquiryItem | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleNote, setScheduleNote] = useState<string>('');
  const [isSavingFollowUp, setIsSavingFollowUp] = useState<boolean>(false);

  // RTA & Contact state
  const [rtaData, setRtaData] = useState<RtaContactData | null>(null);
  const [rtaLoading, setRtaLoading] = useState<boolean>(false);
  const [rtaEditOpen, setRtaEditOpen] = useState<boolean>(false);
  const [rtaForm, setRtaForm] = useState<Partial<RtaContactData>>({});
  const [rtaSaving, setRtaSaving] = useState<boolean>(false);
  const [rtaError, setRtaError] = useState<string | null>(null);

  // Keep subTab in sync if parent changes initialSubTab
  useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const notify = useCallback((type: 'success' | 'error', message: string) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      alert(message);
    }
  }, [onNotify]);

  // Fetch live RTA data from API
  const fetchRtaData = useCallback(async () => {
    setRtaLoading(true);
    try {
      const token = localStorage.getItem('asl_admin_token');
      const res = await fetch('/api/enquiries/rta-contact', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (d.success && d.data) {
        setRtaData(d.data);
        setRtaForm(d.data);
      }
    } catch (err: any) {
      console.error('Failed to load RTA configuration:', err);
    } finally {
      setRtaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSubTab === 'rta_contact') {
      fetchRtaData();
    }
  }, [activeSubTab, fetchRtaData]);

  // Fetch history when viewing an item
  const openItemDetails = async (item: EnquiryItem) => {
    setViewingItem(item);
    setLoadingHistory(true);
    setViewingItemHistory([]);
    try {
      const token = localStorage.getItem('asl_admin_token');
      const res = await fetch(`/api/enquiries/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (d.success && d.data) {
        setViewingItem(d.data);
        setViewingItemHistory(d.history || []);
      }
    } catch (err) {
      console.error('Error fetching case history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Open status modal
  const handleOpenStatusModal = (item: EnquiryItem) => {
    setStatusModalItem(item);
    setNewStatus(item.status);
    setResolutionNotes(item.resolution_notes || item.admin_notes || '');
    setFollowUpDateInput(item.follow_up_date || '');
    setStatusError(null);
  };

  // Save status update
  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalItem) return;

    // Requirement 6 Guardrail: Require resolution notes if marking resolved
    if (newStatus === 'resolved' && statusModalItem.status !== 'resolved') {
      if (!resolutionNotes || resolutionNotes.trim().length < 5) {
        setStatusError('Resolution notes are mandatory before marking a case Resolved. Please detail the redressal actions taken, RTA response, or investor communication.');
        return;
      }
    }

    setIsUpdatingStatus(true);
    setStatusError(null);
    try {
      await onUpdateStatus(statusModalItem.id, newStatus, resolutionNotes, followUpDateInput);
      setStatusModalItem(null);
      // If we also had viewingItem open, refresh it
      if (viewingItem && viewingItem.id === statusModalItem.id) {
        openItemDetails({
          ...viewingItem,
          status: newStatus,
          resolution_notes: resolutionNotes,
          follow_up_date: followUpDateInput || null
        });
      }
    } catch (err: any) {
      setStatusError(err.message || 'Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Save quick note
  const handleSaveQuickNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalItem || !quickNote.trim()) return;

    setIsSavingNote(true);
    try {
      const token = localStorage.getItem('asl_admin_token');
      const res = await fetch(`/api/enquiries/${noteModalItem.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note: quickNote.trim() })
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Failed to save note.');

      notify('success', 'Internal note recorded.');
      setQuickNote('');
      setNoteModalItem(null);
      onRefresh();

      if (viewingItem && viewingItem.id === noteModalItem.id) {
        openItemDetails({ ...viewingItem, resolution_notes: d.notes });
      }
    } catch (err: any) {
      notify('error', err.message || 'Error recording note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Save follow-up schedule
  const handleSaveFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpModalItem) return;

    setIsSavingFollowUp(true);
    try {
      const token = localStorage.getItem('asl_admin_token');
      const res = await fetch(`/api/enquiries/${followUpModalItem.id}/follow-up`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          followUpDate: scheduleDate || null,
          notes: scheduleNote || undefined
        })
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Failed to schedule follow-up.');

      notify('success', d.message || 'Follow-up schedule updated.');
      setScheduleDate('');
      setScheduleNote('');
      setFollowUpModalItem(null);
      onRefresh();

      if (viewingItem && viewingItem.id === followUpModalItem.id) {
        openItemDetails({
          ...viewingItem,
          follow_up_date: d.followUpDate,
          resolution_notes: d.notes || viewingItem.resolution_notes
        });
      }
    } catch (err: any) {
      notify('error', err.message || 'Error updating follow-up schedule.');
    } finally {
      setIsSavingFollowUp(false);
    }
  };

  // Reclassify genuine vs test or archive
  const handleClassify = async (item: EnquiryItem, isTest: boolean, isArchived?: boolean) => {
    try {
      const token = localStorage.getItem('asl_admin_token');
      const res = await fetch(`/api/enquiries/${item.id}/classify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          is_test: isTest,
          is_archived: isArchived !== undefined ? isArchived : item.is_archived
        })
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Failed to reclassify record.');

      notify('success', d.message || 'Record classification updated.');
      onRefresh();
      if (viewingItem && viewingItem.id === item.id) {
        setViewingItem({ ...viewingItem, is_test: d.is_test, is_archived: d.is_archived });
      }
    } catch (err: any) {
      notify('error', err.message || 'Failed to reclassify record.');
    }
  };

  // Archive or Delete record
  const handleDeleteOrArchive = async (item: EnquiryItem) => {
    const isGenuineInvestor = item.type === 'investor' && !item.is_test;
    
    let confirmPrompt = 'Are you sure you want to archive this case? It will be safely moved out of active operational queues.';
    if (isGenuineInvestor && currentUser?.role === 'super_admin') {
      confirmPrompt = 'Archive this genuine investor grievance? (Archival preserves retention records). Click Cancel to permanently delete if confirmed.';
    }

    if (!window.confirm(confirmPrompt)) {
      // If super_admin cancelled archival prompt, ask if they want permanent deletion
      if (isGenuineInvestor && currentUser?.role === 'super_admin') {
        if (window.confirm('WARNING: Permanent deletion of a statutory shareholder complaint is strictly audited and non-reversible. Permanently delete?')) {
          try {
            const token = localStorage.getItem('asl_admin_token');
            const res = await fetch(`/api/enquiries/${item.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ confirmPermanent: true })
            });
            const d = await res.json();
            if (!res.ok || !d.success) throw new Error(d.error || 'Permanent deletion failed.');
            notify('success', 'Complaint permanently deleted.');
            onRefresh();
            setViewingItem(null);
            return;
          } catch (err: any) {
            notify('error', err.message || 'Delete failed.');
            return;
          }
        }
      }
      return;
    }

    // Default safe archival
    try {
      const token = localStorage.getItem('asl_admin_token');
      const res = await fetch(`/api/enquiries/${item.id}/classify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_archived: 1 })
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Archival failed.');
      notify('success', 'Case archived safely. Retention audit history intact.');
      onRefresh();
      if (viewingItem && viewingItem.id === item.id) {
        setViewingItem({ ...viewingItem, is_archived: 1 });
      }
    } catch (err: any) {
      notify('error', err.message || 'Error archiving case.');
    }
  };

  // Save RTA & Contact configuration
  const handleSaveRtaConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setRtaSaving(true);
    setRtaError(null);
    try {
      const token = localStorage.getItem('asl_admin_token');
      const res = await fetch('/api/enquiries/rta-contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(rtaForm)
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Failed to update RTA configuration.');

      notify('success', 'RTA & Contact configuration saved and synchronized.');
      setRtaEditOpen(false);
      fetchRtaData();
      // Dispatch event to refresh public site context
      window.dispatchEvent(new Event('company_profile_updated'));
    } catch (err: any) {
      setRtaError(err.message || 'Error saving contact configuration.');
    } finally {
      setRtaSaving(false);
    }
  };

  // Filter items for current tab
  const tabItems = useMemo(() => {
    return enquiries.filter((item) => {
      if (activeSubTab === 'grievances' && item.type !== 'investor') return false;
      if (activeSubTab === 'enquiries' && item.type !== 'business') return false;
      return true;
    });
  }, [enquiries, activeSubTab]);

  // Derived counts for current tab
  const stats = useMemo(() => {
    const genuineOnly = tabItems.filter(e => !e.is_test && !e.is_archived);
    const testOnly = tabItems.filter(e => e.is_test && !e.is_archived);
    const archivedOnly = tabItems.filter(e => e.is_archived);

    return {
      total: tabItems.length,
      genuineCount: genuineOnly.length,
      testCount: testOnly.length,
      archivedCount: archivedOnly.length,
      newCount: genuineOnly.filter(e => e.status === 'new').length,
      inProgressCount: genuineOnly.filter(e => e.status === 'in_progress').length,
      resolvedCount: genuineOnly.filter(e => e.status === 'resolved').length,
      closedCount: genuineOnly.filter(e => e.status === 'closed').length
    };
  }, [tabItems]);

  // Filtered items based on active UI filters
  const filteredItems = useMemo(() => {
    return tabItems.filter((item) => {
      // Classification filter
      if (recordCategory === 'genuine') {
        if (item.is_test || item.is_archived) return false;
      } else if (recordCategory === 'test') {
        if (!item.is_test || item.is_archived) return false;
      } else if (recordCategory === 'archived') {
        if (!item.is_archived) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      // Date range filter
      if (dateFrom && item.created_at) {
        const itemDate = item.created_at.split('T')[0].split(' ')[0];
        if (itemDate < dateFrom) return false;
      }
      if (dateTo && item.created_at) {
        const itemDate = item.created_at.split('T')[0].split(' ')[0];
        if (itemDate > dateTo) return false;
      }

      // Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesRef = item.reference_no?.toLowerCase().includes(q);
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesFolio = item.folio_or_dp_id?.toLowerCase().includes(q);
        const matchesDetails = item.details?.toLowerCase().includes(q);
        const matchesCompany = item.company_name?.toLowerCase().includes(q);
        if (!matchesRef && !matchesName && !matchesEmail && !matchesFolio && !matchesDetails && !matchesCompany) {
          return false;
        }
      }

      return true;
    });
  }, [tabItems, recordCategory, statusFilter, dateFrom, dateTo, search]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
            <Check className="w-3.5 h-3.5 text-slate-500" />
            <span>Closed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>In Progress</span>
          </span>
        );
      case 'new':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>New (Awaiting Review)</span>
          </span>
        );
    }
  };

  const getStatusExplanation = (status: string) => {
    switch (status) {
      case 'new': return 'Received from public portal; pending administrative review';
      case 'in_progress': return 'Under investigation or awaiting response from RTA / stakeholder';
      case 'resolved': return 'Redressal recorded and communicated to stakeholder';
      case 'closed': return 'Formally completed and verified';
      default: return '';
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. SubTab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="tab-btn-grievances"
            onClick={() => { setActiveSubTab('grievances'); setRecordCategory('genuine'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'grievances'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${activeSubTab === 'grievances' ? 'text-rose-400' : 'text-slate-500'}`} />
            <span>Investor Grievances</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-200">
              {enquiries.filter(e => e.type === 'investor' && !e.is_test && !e.is_archived).length} Genuine
            </span>
          </button>

          <button
            id="tab-btn-enquiries"
            onClick={() => { setActiveSubTab('enquiries'); setRecordCategory('genuine'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'enquiries'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Inbox className={`w-3.5 h-3.5 ${activeSubTab === 'enquiries' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>Investor & Mandate Enquiries</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-200">
              {enquiries.filter(e => e.type === 'business' && !e.is_test && !e.is_archived).length} Genuine
            </span>
          </button>

          <button
            id="tab-btn-rta"
            onClick={() => setActiveSubTab('rta_contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'rta_contact'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PhoneCall className={`w-3.5 h-3.5 ${activeSubTab === 'rta_contact' ? 'text-[#0D9488]' : 'text-slate-500'}`} />
            <span>RTA & Contact Information</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { onRefresh(); if (activeSubTab === 'rta_contact') fetchRtaData(); }}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${initialLoading || rtaLoading ? 'animate-spin text-[#0D9488]' : ''}`} />
            <span>Sync DB</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SUBTAB: GRIEVANCES & ENQUIRIES */}
      {/* ======================================================== */}
      {activeSubTab !== 'rta_contact' && (
        <div className="space-y-4">
          {/* Status Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>New / Awaiting Review</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-rose-600">{stats.newCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">Requires triage & initial response</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>In Progress</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-600">{stats.inProgressCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">Under investigation or RTA liaison</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Resolved</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600">{stats.resolvedCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">Redressal recorded with notes</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Closed</span>
                <Check className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-800">{stats.closedCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">Completed case files</div>
            </div>
          </div>

          {/* Filter Bar with Genuine vs Test Run separation & Date Filters */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search and Status */}
              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, tracking ref, email, folio..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488] font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New (Awaiting Review)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Genuine Submissions vs Audit Test Runs vs Archived */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs self-stretch md:self-auto overflow-x-auto">
                <button
                  onClick={() => setRecordCategory('genuine')}
                  className={`px-3 py-1 rounded font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    recordCategory === 'genuine'
                      ? 'bg-white text-[#0A1128] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Genuine ({stats.genuineCount})
                </button>
                <button
                  onClick={() => setRecordCategory('test')}
                  className={`px-3 py-1 rounded font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    recordCategory === 'test'
                      ? 'bg-white text-amber-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Audit Test Runs ({stats.testCount})
                </button>
                <button
                  onClick={() => setRecordCategory('archived')}
                  className={`px-3 py-1 rounded font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    recordCategory === 'archived'
                      ? 'bg-white text-slate-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Archived ({stats.archivedCount})
                </button>
                <button
                  onClick={() => setRecordCategory('all')}
                  className={`px-3 py-1 rounded font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    recordCategory === 'all'
                      ? 'bg-white text-[#0A1128] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({stats.total})
                </button>
              </div>
            </div>

            {/* Date Range Sub-Bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-500">Date Range:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md"
                  placeholder="From"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md"
                  placeholder="To"
                />
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => { setDateFrom(''); setDateTo(''); }}
                    className="text-slate-500 hover:text-slate-800 text-[11px] underline cursor-pointer"
                  >
                    Clear dates
                  </button>
                )}
              </div>

              <div className="text-[11px] text-slate-500">
                Showing <strong className="text-slate-800">{filteredItems.length}</strong> of{' '}
                <strong className="text-slate-800">{stats.total}</strong> records in database
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-[#FAFBFD] text-slate-600 font-semibold">
                    <th className="py-3 px-4">Tracking Code</th>
                    <th className="py-3 px-4">Stakeholder Details</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Query / Grievance Summary</th>
                    <th className="py-3 px-4">Status & Explanation</th>
                    <th className="py-3 px-4">Follow-up</th>
                    <th className="py-3 px-4">Date Filed</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-[#0D9488]" />
                        <span>Loading investor records from MySQL database...</span>
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <div className="font-semibold text-slate-600 text-sm">No records found</div>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                          No submissions matched your search or selected filters. Try clearing search filters or switching between Genuine and Audit Test view.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Tracking code */}
                        <td className="py-3 px-4 font-mono font-bold text-[#0A1128] align-top whitespace-nowrap">
                          {item.reference_no}
                          <div className="flex flex-col gap-1 mt-1">
                            {item.is_test ? (
                              <span className="text-[9px] font-sans font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 max-w-fit">
                                Audit Test Run
                              </span>
                            ) : (
                              <span className="text-[9px] font-sans font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 max-w-fit">
                                Genuine Complaint
                              </span>
                            )}
                            {item.is_archived ? (
                              <span className="text-[9px] font-sans font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300 max-w-fit">
                                Archived
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* 2. Stakeholder Details */}
                        <td className="py-3 px-4 align-top">
                          <div className="font-bold text-[#0A1128]">{item.name}</div>
                          <div className="text-[11px] text-slate-600 font-mono">{item.email}</div>
                          {item.phone && <div className="text-[10px] text-slate-400 font-mono">{item.phone}</div>}
                          {item.company_name && (
                            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                              {item.company_name}
                            </div>
                          )}
                        </td>

                        {/* 3. Classification */}
                        <td className="py-3 px-4 align-top">
                          <div className="font-semibold text-slate-700">
                            {item.type === 'investor' ? 'Shareholder Grievance' : 'Corporate Advisory'}
                          </div>
                          {item.folio_or_dp_id && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Folio/DP: {item.folio_or_dp_id}
                            </div>
                          )}
                          {item.grievance_category && (
                            <div className="text-[10px] text-rose-700 font-medium mt-0.5">
                              {item.grievance_category}
                            </div>
                          )}
                          {item.service_interest && (
                            <div className="text-[10px] text-indigo-700 font-medium mt-0.5">
                              {item.service_interest}
                            </div>
                          )}
                        </td>

                        {/* 4. Query text & resolution notes */}
                        <td className="py-3 px-4 max-w-xs align-top">
                          <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                            {item.details}
                          </p>
                          {(item.resolution_notes || item.admin_notes) && (
                            <div className="mt-1 text-[10px] text-[#0D9488] font-medium bg-teal-50/70 p-1.5 rounded border border-teal-100 line-clamp-2">
                              <strong>Note:</strong> {item.resolution_notes || item.admin_notes}
                            </div>
                          )}
                        </td>

                        {/* 5. Status with short explanation */}
                        <td className="py-3 px-4 align-top whitespace-nowrap">
                          {getStatusBadge(item.status)}
                          <div className="text-[10px] text-slate-400 mt-1 max-w-[140px] leading-tight">
                            {getStatusExplanation(item.status)}
                          </div>
                        </td>

                        {/* 6. Follow-up Date */}
                        <td className="py-3 px-4 align-top whitespace-nowrap font-mono text-[11px]">
                          {item.follow_up_date ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Calendar className="w-3 h-3 text-amber-600" />
                              <span>{item.follow_up_date}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">None</span>
                          )}
                        </td>

                        {/* 7. Date filed */}
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap align-top">
                          {new Date(item.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3 px-4 text-right align-top whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            <button
                              onClick={() => openItemDetails(item)}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="View full details and audit history"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenStatusModal(item)}
                              className="px-2 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors cursor-pointer"
                              title="Update workflow status"
                            >
                              Update Status
                            </button>
                            <button
                              onClick={() => { setNoteModalItem(item); setQuickNote(''); }}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Add internal note"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setFollowUpModalItem(item); setScheduleDate(item.follow_up_date || ''); setScheduleNote(''); }}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Schedule follow-up date"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleClassify(item, !item.is_test)}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title={item.is_test ? 'Mark as Genuine' : 'Mark as Audit Test'}
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrArchive(item)}
                              className="p-1 text-rose-500 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title={item.is_archived ? 'Archived record' : 'Archive or delete'}
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SUBTAB: RTA & OFFICIAL CONTACTS (DATABASE BACKED) */}
      {/* ======================================================== */}
      {activeSubTab === 'rta_contact' && (
        <div className="space-y-5">
          {/* Card: Pending Company / Secretarial Confirmation Audit Banner */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="text-sm font-bold text-amber-950">
                  Data Audit: Items Awaiting Formal Company / Secretarial Confirmation
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
                Action Required by Company Secretary
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              In accordance with statutory audit standards, conflicting records across legacy filings have been reconciled and isolated. No details are assumed without official evidence. The following items require formal board sign-off:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">1. RTA Appointment</span>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Pending Confirmation
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Primary:</strong> {rtaData?.rta_name || 'Bigshare Services Pvt. Ltd. (Mumbai)'}<br/>
                  <strong>Legacy Reference:</strong> Purva Sharegistry (India) Pvt. Ltd.<br/>
                  <em>Awaiting Tripartite Agreement & Form MR-3 sign-off.</em>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">2. Office Coordinates</span>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Pending Confirmation
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Registered Office:</strong> Sarthik Complex, Ahmedabad (RoC Ahmedabad)<br/>
                  <strong>Corporate Office:</strong> Ellora Park, Killa Pardi, Valsad vs Mumbai Branch<br/>
                  <em>Awaiting Form INC-22 board resolution.</em>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">3. Grievance Officer Email</span>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Pending Confirmation
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Institutional:</strong> {rtaData?.compliance_email || 'compliance@amarnathsecuritiesltd.com'}<br/>
                  <strong>Historical:</strong> amarnathsecurities@gmail.com<br/>
                  <em>Awaiting formal compliance officer mandate email confirmation.</em>
                </div>
              </div>
            </div>
          </div>

          {/* RTA & Portal Coordinates Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Official RTA Details */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0D9488]" />
                  <span>Registrar and Share Transfer Agent (RTA)</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    Live Database Record
                  </span>
                  <button
                    onClick={() => setRtaEditOpen(true)}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Coordinates</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FAFBFD] border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-sm text-[#0A1128]">
                  {rtaData?.rta_name || 'Bigshare Services Pvt. Ltd.'}
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{rtaData?.rta_address || 'Office No S6-2, 6th Floor, Pinnacle Business Park, Andheri (East), Mumbai - 400 093'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{rtaData?.rta_phone || '+91 22 6263 8200'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{rtaData?.rta_email || 'investor@bigshareonline.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a 
                    href={rtaData?.rta_website || 'https://www.bigshareonline.com'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#0D9488] font-semibold hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>{rtaData?.rta_website || 'www.bigshareonline.com'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Regulatory Grievance Escalation & Portals */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
              <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#C5A059]" />
                <span>Statutory Grievance Escalation & Portals</span>
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">SEBI SCORES 2.0 Portal</div>
                    <div className="text-[11px] text-slate-500">SEBI Centralized Grievance Redress System</div>
                  </div>
                  <a
                    href={rtaData?.sebi_scores_url || 'https://scores.sebi.gov.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 inline-flex items-center gap-1"
                  >
                    <span>scores.sebi.gov.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">SEBI SMART ODR Portal</div>
                    <div className="text-[11px] text-slate-500">Online Dispute Resolution Platform</div>
                  </div>
                  <a
                    href={rtaData?.sebi_smart_odr_url || 'https://smartodr.in'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 inline-flex items-center gap-1"
                  >
                    <span>smartodr.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">BSE Listing Centre Registry</div>
                    <div className="text-[11px] text-slate-500">Amarnath Securities Limited (Scrip: 538465)</div>
                  </div>
                  <a
                    href={rtaData?.bse_portal_url || 'https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnat/538465/'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 inline-flex items-center gap-1"
                  >
                    <span>BSE Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: VIEW FULL DETAILS & ACTION HISTORY */}
      {/* ======================================================== */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0D9488]" />
                <div>
                  <h3 className="text-sm font-bold text-[#0A1128]">
                    {viewingItem.type === 'investor' ? 'Investor Grievance Case File' : 'Corporate Advisory Mandate'}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{viewingItem.reference_no}</div>
                </div>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Classification flags */}
              <div className="flex items-center gap-2 flex-wrap">
                {viewingItem.is_test ? (
                  <span className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 rounded-lg border border-amber-300">
                    Automated Audit Test Run
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-300">
                    Genuine Investor Record
                  </span>
                )}
                {getStatusBadge(viewingItem.status)}
                {viewingItem.is_archived ? (
                  <span className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg border border-slate-300">
                    Archived
                  </span>
                ) : null}
              </div>

              {/* Stakeholder Details Box */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-sm">{viewingItem.name}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div><strong>Email:</strong> <span className="font-mono">{viewingItem.email}</span></div>
                  <div><strong>Phone:</strong> <span className="font-mono">{viewingItem.phone || 'N/A'}</span></div>
                  {viewingItem.folio_or_dp_id && (
                    <div><strong>Folio / DP ID:</strong> <span className="font-mono">{viewingItem.folio_or_dp_id}</span></div>
                  )}
                  {viewingItem.grievance_category && (
                    <div><strong>Category:</strong> <span>{viewingItem.grievance_category}</span></div>
                  )}
                  {viewingItem.company_name && (
                    <div><strong>Company:</strong> <span>{viewingItem.company_name}</span></div>
                  )}
                  {viewingItem.service_interest && (
                    <div><strong>Interest:</strong> <span>{viewingItem.service_interest}</span></div>
                  )}
                </div>
              </div>

              {/* Unabridged Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Submission Details
                </label>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 whitespace-pre-wrap leading-relaxed text-slate-700 font-sans">
                  {viewingItem.details}
                </div>
              </div>

              {/* Notes & Follow-up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Follow-up Scheduled</span>
                  </div>
                  <div className="text-slate-600 font-mono">
                    {viewingItem.follow_up_date || 'No follow-up scheduled'}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>Submission Timestamp</span>
                  </div>
                  <div className="text-slate-600 font-mono">
                    {new Date(viewingItem.created_at).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Internal / Resolution Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Internal & Resolution Notes</span>
                  <button
                    onClick={() => { setNoteModalItem(viewingItem); setQuickNote(''); }}
                    className="text-[11px] text-[#0D9488] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Append Note</span>
                  </button>
                </label>
                <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-200 text-slate-700 whitespace-pre-wrap">
                  {viewingItem.resolution_notes || viewingItem.admin_notes || (
                    <span className="text-slate-400 italic">No notes recorded yet.</span>
                  )}
                </div>
              </div>

              {/* Action History / Audit Trail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>Action History & Audit Trail</span>
                </label>
                {loadingHistory ? (
                  <div className="py-4 text-center text-slate-400">Loading audit history...</div>
                ) : viewingItemHistory.length === 0 ? (
                  <div className="text-slate-400 italic p-2 text-center bg-slate-50 rounded border border-slate-200">
                    No administrative transitions recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {viewingItemHistory.map((h, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-800">
                            {h.action.replace(/_/g, ' ')}
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            {h.details?.newStatus && (
                              <span>Status changed to <strong>{h.details.newStatus}</strong>. </span>
                            )}
                            {h.details?.resolutionNotes && (
                              <span>Notes: "{h.details.resolutionNotes}". </span>
                            )}
                            {h.details?.note && (
                              <span>Note: "{h.details.note}". </span>
                            )}
                            {h.details?.followUpDate && (
                              <span>Follow-up set to {h.details.followUpDate}. </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-slate-500">{h.userName}</div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            {new Date(h.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 border-t border-slate-200 bg-[#FAFBFD] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenStatusModal(viewingItem)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors cursor-pointer"
                >
                  Update Workflow Status
                </button>
                <button
                  onClick={() => { setFollowUpModalItem(viewingItem); setScheduleDate(viewingItem.follow_up_date || ''); setScheduleNote(''); }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Follow-up
                </button>
              </div>

              <button
                onClick={() => setViewingItem(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: UPDATE STATUS (WITH RESOLUTION GUARDRAIL) */}
      {/* ======================================================== */}
      {statusModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Triage & Update Workflow Status</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{statusModalItem.reference_no}</div>
              </div>
              <button
                onClick={() => setStatusModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-4">
              {statusError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{statusError}</span>
                </div>
              )}

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">{statusModalItem.name} ({statusModalItem.email})</div>
                <p className="text-slate-600 text-[11px] line-clamp-2">{statusModalItem.details}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Workflow Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                >
                  <option value="new">New — Received, awaiting review</option>
                  <option value="in_progress">In Progress — Investigation & RTA handling</option>
                  <option value="resolved">Resolved — Response/action recorded</option>
                  <option value="closed">Closed — Formally completed</option>
                </select>
                <div className="text-[11px] text-slate-500 mt-1">
                  {getStatusExplanation(newStatus)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Compliance & Resolution Notes {newStatus === 'resolved' ? '*' : '(Optional)'}</span>
                  {newStatus === 'resolved' && (
                    <span className="text-[10px] text-rose-600 font-bold">Required for Resolved status</span>
                  )}
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record verification details, RTA response, communication sent to investor, or action summary..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Next Follow-up Date (Optional)
                </label>
                <input
                  type="date"
                  value={followUpDateInput}
                  onChange={(e) => setFollowUpDateInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                <strong>Notice:</strong> Changing status records your staff identity and timestamp in the audit log. It does not imply legal closure under SEBI SCORES or statutory regulations until formal acknowledgement is issued.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalItem(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingStatus ? 'Saving to Database...' : 'Save Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD INTERNAL NOTE */}
      {/* ======================================================== */}
      {noteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <h3 className="text-sm font-bold text-[#0A1128]">Append Internal Note</h3>
              <button
                onClick={() => setNoteModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickNote} className="p-4 space-y-3">
              <div className="text-xs text-slate-600">
                Adding note to case: <strong className="text-slate-900 font-mono">{noteModalItem.reference_no}</strong> ({noteModalItem.name})
              </div>

              <textarea
                rows={4}
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Enter internal investigation update, RTA communication, or audit observation..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteModalItem(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingNote || !quickNote.trim()}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg disabled:opacity-50"
                >
                  {isSavingNote ? 'Recording...' : 'Record Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: SCHEDULE FOLLOW-UP */}
      {/* ======================================================== */}
      {followUpModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <h3 className="text-sm font-bold text-[#0A1128]">Schedule Case Follow-up</h3>
              <button
                onClick={() => setFollowUpModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowUp} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reminder Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={scheduleNote}
                  onChange={(e) => setScheduleNote(e.target.value)}
                  placeholder="e.g. Awaiting RTA demat confirmation; follow up with Bigshare helpdesk..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFollowUpModalItem(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingFollowUp}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg disabled:opacity-50"
                >
                  {isSavingFollowUp ? 'Saving...' : 'Set Follow-up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: EDIT RTA & CONTACT CONFIGURATION */}
      {/* ======================================================== */}
      {rtaEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Edit RTA & Official Contact Details</h3>
                <div className="text-xs text-slate-500 mt-0.5">Live Database Configuration</div>
              </div>
              <button
                onClick={() => setRtaEditOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRtaConfig} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {rtaError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{rtaError}</span>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>RTA Coordinates</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RTA Name *</label>
                  <input
                    type="text"
                    value={rtaForm.rta_name || ''}
                    onChange={(e) => setRtaForm({ ...rtaForm, rta_name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RTA Address *</label>
                  <textarea
                    rows={2}
                    value={rtaForm.rta_address || ''}
                    onChange={(e) => setRtaForm({ ...rtaForm, rta_address: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">RTA Phone</label>
                    <input
                      type="text"
                      value={rtaForm.rta_phone || ''}
                      onChange={(e) => setRtaForm({ ...rtaForm, rta_phone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">RTA Email</label>
                    <input
                      type="email"
                      value={rtaForm.rta_email || ''}
                      onChange={(e) => setRtaForm({ ...rtaForm, rta_email: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RTA Website URL</label>
                  <input
                    type="url"
                    value={rtaForm.rta_website || ''}
                    onChange={(e) => setRtaForm({ ...rtaForm, rta_website: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Compliance & Grievance Officer</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Compliance Officer Designation</label>
                  <input
                    type="text"
                    value={rtaForm.compliance_officer || ''}
                    onChange={(e) => setRtaForm({ ...rtaForm, compliance_officer: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Compliance Email</label>
                    <input
                      type="email"
                      value={rtaForm.compliance_email || ''}
                      onChange={(e) => setRtaForm({ ...rtaForm, compliance_email: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Compliance Phone</label>
                    <input
                      type="text"
                      value={rtaForm.compliance_phone || ''}
                      onChange={(e) => setRtaForm({ ...rtaForm, compliance_phone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Statutory Escalation Links</span>
                </h4>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">SEBI SCORES 2.0 URL</label>
                    <input
                      type="url"
                      value={rtaForm.sebi_scores_url || ''}
                      onChange={(e) => setRtaForm({ ...rtaForm, sebi_scores_url: e.target.value })}
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">SEBI SMART ODR URL</label>
                    <input
                      type="url"
                      value={rtaForm.sebi_smart_odr_url || ''}
                      onChange={(e) => setRtaForm({ ...rtaForm, sebi_smart_odr_url: e.target.value })}
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">BSE Portal Listing URL</label>
                    <input
                      type="url"
                      value={rtaForm.bse_portal_url || ''}
                      onChange={(e) => setRtaForm({ ...rtaForm, bse_portal_url: e.target.value })}
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                Saving will update the single source of truth in MySQL and automatically synchronize the public Contact and Investor Relations pages.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRtaEditOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rtaSaving}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg disabled:opacity-50"
                >
                  {rtaSaving ? 'Saving to Database...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
