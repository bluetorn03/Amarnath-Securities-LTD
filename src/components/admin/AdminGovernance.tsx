import React, { useState, useMemo } from 'react';
import { 
  Users2, 
  Network, 
  UserCheck, 
  Scale, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  RefreshCw, 
  X, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  Building,
  Archive,
  RotateCcw,
  Download,
  AlertTriangle,
  UploadCloud,
  Check,
  Eye,
  Search
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../types';

export interface DirectorItem {
  id: string;
  name: string;
  designation: string;
  category: string;
  din: string;
  appointment_date?: string;
  appointmentDate?: string;
  term?: string;
  bio: string;
  other_directorships?: string[];
  otherDirectorships?: string[];
  committee_memberships?: { committeeName: string; role: string }[];
  committeeMemberships?: { committeeName: string; role: string }[];
  is_verified: boolean;
  approval_status: string;
  status: string;
}

export interface CommitteeMemberItem {
  name: string;
  designation: string;
  role: 'Chairperson' | 'Member';
  category: string;
}

export interface CommitteeItem {
  id: string;
  name: string;
  short_name: string;
  shortName?: string;
  mandate: string;
  composition_rule: string;
  compositionRule?: string;
  statutory_reference: string;
  statutoryReference?: string;
  chairperson_name: string;
  chairperson_designation: string;
  chairperson_role: string;
  chairperson_category: string;
  chairperson?: {
    name: string;
    designation: string;
    role: string;
    category: string;
  };
  meetings_frequency: string;
  meetingsFrequency?: string;
  key_responsibilities?: string[];
  keyResponsibilities?: string[];
  members?: CommitteeMemberItem[];
  status?: string;
}

export interface KmpItem {
  id: string;
  role_title: string;
  role?: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  address?: string;
  authority_scope: string;
  authorityScope?: string;
  statutory_reference: string;
  statutoryReference?: string;
  is_verified: boolean;
  status?: string;
}

interface AdminGovernanceProps {
  initialSubTab?: 'directors' | 'committees' | 'kmp' | 'corporate_governance' | 'policies';
  currentUser: AdminUser | null;
  directors: DirectorItem[];
  committees: CommitteeItem[];
  kmpContacts: KmpItem[];
  documents?: any[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateDirector: (id: string, data: Partial<DirectorItem>) => Promise<void>;
  onCreateDirector: (data: any) => Promise<void>;
  onArchiveDirector?: (id: string) => Promise<void>;
  onRestoreDirector?: (id: string) => Promise<void>;
  onDeleteDirector: (id: string) => Promise<void>;
  onUpdateCommittee: (id: string, data: any) => Promise<void>;
  onCreateCommittee?: (data: any) => Promise<void>;
  onArchiveCommittee?: (id: string) => Promise<void>;
  onRestoreCommittee?: (id: string) => Promise<void>;
  onDeleteCommittee?: (id: string) => Promise<void>;
  onUpdateKmp: (id: string, data: Partial<KmpItem>) => Promise<void>;
  onCreateKmp?: (data: any) => Promise<void>;
  onArchiveKmp?: (id: string) => Promise<void>;
  onRestoreKmp?: (id: string) => Promise<void>;
  onDeleteKmp?: (id: string) => Promise<void>;
  onOpenDocument?: (doc: any) => void;
  onNavigateView?: (view: string) => void;
}

export const AdminGovernance: React.FC<AdminGovernanceProps> = ({
  initialSubTab = 'directors',
  currentUser,
  directors,
  committees,
  kmpContacts,
  documents = [],
  loading,
  onRefresh,
  onUpdateDirector,
  onCreateDirector,
  onArchiveDirector,
  onRestoreDirector,
  onDeleteDirector,
  onUpdateCommittee,
  onCreateCommittee,
  onArchiveCommittee,
  onRestoreCommittee,
  onDeleteCommittee,
  onUpdateKmp,
  onCreateKmp,
  onArchiveKmp,
  onRestoreKmp,
  onDeleteKmp,
  onOpenDocument,
  onNavigateView
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directors' | 'committees' | 'kmp' | 'corporate_governance' | 'policies'>(initialSubTab);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync if prop changes
  React.useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // Modal States - Director
  const [editDirector, setEditDirector] = useState<DirectorItem | null>(null);
  const [isNewDirector, setIsNewDirector] = useState<boolean>(false);
  const [dirFormData, setDirFormData] = useState<any>(null);
  const [isSavingDir, setIsSavingDir] = useState<boolean>(false);
  const [dirActionError, setDirActionError] = useState<string | null>(null);

  // Modal States - Committee
  const [editCommittee, setEditCommittee] = useState<CommitteeItem | null>(null);
  const [isNewCommittee, setIsNewCommittee] = useState<boolean>(false);
  const [commFormData, setCommFormData] = useState<any>(null);
  const [isSavingComm, setIsSavingComm] = useState<boolean>(false);
  const [commActionError, setCommActionError] = useState<string | null>(null);

  // Modal States - KMP
  const [editKmp, setEditKmp] = useState<KmpItem | null>(null);
  const [isNewKmp, setIsNewKmp] = useState<boolean>(false);
  const [kmpFormData, setKmpFormData] = useState<any>(null);
  const [isSavingKmp, setIsSavingKmp] = useState<boolean>(false);
  const [kmpActionError, setKmpActionError] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'director' | 'committee' | 'kmp';
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canEdit = currentUser?.role === 'super_admin' || currentUser?.role === 'compliance_officer' || currentUser?.role === 'editor';

  // Real Documents from Database for Corporate Governance & Policies
  const corporateGovernanceDocs = useMemo(() => {
    return documents.filter((d) => d.category === 'Corporate Governance');
  }, [documents]);

  const statutoryPolicyDocs = useMemo(() => {
    return documents.filter((d) => 
      d.category === 'Company Policies' || 
      d.category === 'MOA & AOA' || 
      d.category === 'Disclosures & Policies'
    );
  }, [documents]);

  // Filtered lists
  const filteredDirectors = useMemo(() => {
    return directors.filter((d) => {
      if (statusFilter !== 'all' && (d.status || 'published') !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.designation.toLowerCase().includes(q) ||
          d.din.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [directors, statusFilter, searchQuery]);

  const filteredCommittees = useMemo(() => {
    return committees.filter((c) => {
      if (statusFilter !== 'all' && (c.status || 'published') !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.short_name || '').toLowerCase().includes(q) ||
          (c.chairperson_name || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [committees, statusFilter, searchQuery]);

  const filteredKmp = useMemo(() => {
    return kmpContacts.filter((k) => {
      if (statusFilter !== 'all' && (k.status || 'published') !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          k.name.toLowerCase().includes(q) ||
          (k.role_title || '').toLowerCase().includes(q) ||
          k.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [kmpContacts, statusFilter, searchQuery]);

  // ==========================================
  // DIRECTORS HANDLERS
  // ==========================================
  const handleOpenAddDirector = () => {
    setIsNewDirector(true);
    setDirActionError(null);
    setEditDirector({
      id: '',
      name: '',
      designation: 'Independent Director',
      category: 'Non-Executive Independent Director',
      din: '',
      appointment_date: '',
      term: 'Term of 5 consecutive years',
      bio: '',
      other_directorships: [],
      committee_memberships: [],
      is_verified: false,
      approval_status: 'Subject to Company / CS Confirmation',
      status: 'published'
    });
    setDirFormData({
      name: '',
      designation: 'Independent Director',
      category: 'Non-Executive Independent Director',
      din: '',
      appointment_date: '',
      term: 'Term of 5 consecutive years',
      bio: '',
      other_directorships_text: '',
      committee_memberships_text: '',
      is_verified: false,
      approval_status: 'Subject to Company / CS Confirmation',
      status: 'published'
    });
  };

  const handleOpenEditDirector = (d: DirectorItem) => {
    setIsNewDirector(false);
    setDirActionError(null);
    setEditDirector(d);
    const otherDirs = d.other_directorships || d.otherDirectorships || [];
    const comms = d.committee_memberships || d.committeeMemberships || [];
    setDirFormData({
      name: d.name,
      designation: d.designation,
      category: d.category,
      din: d.din,
      appointment_date: d.appointment_date || d.appointmentDate || '',
      term: d.term || '',
      bio: d.bio,
      other_directorships_text: Array.isArray(otherDirs) ? otherDirs.join('\n') : '',
      committee_memberships_text: Array.isArray(comms) ? comms.map((c: any) => `${c.committeeName || c.name || ''} | ${c.role || 'Member'}`).join('\n') : '',
      is_verified: Boolean(d.is_verified),
      approval_status: d.approval_status,
      status: d.status || 'published'
    });
  };

  const handleSaveDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirFormData) return;
    setDirActionError(null);
    setIsSavingDir(true);

    try {
      const otherDirs = dirFormData.other_directorships_text
        ? dirFormData.other_directorships_text.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const comms = dirFormData.committee_memberships_text
        ? dirFormData.committee_memberships_text.split('\n').map((line: string) => {
            const parts = line.split('|').map((s: string) => s.trim());
            return {
              committeeName: parts[0] || 'Board Committee',
              role: parts[1] || 'Member'
            };
          }).filter((c: any) => Boolean(c.committeeName))
        : [];

      const payload = {
        name: dirFormData.name.trim(),
        designation: dirFormData.designation.trim(),
        category: dirFormData.category.trim(),
        din: dirFormData.din.trim(),
        appointment_date: dirFormData.appointment_date || null,
        appointmentDate: dirFormData.appointment_date || null,
        term: dirFormData.term || null,
        bio: dirFormData.bio.trim(),
        other_directorships: otherDirs,
        otherDirectorships: otherDirs,
        committee_memberships: comms,
        committeeMemberships: comms,
        is_verified: Boolean(dirFormData.is_verified),
        approval_status: dirFormData.approval_status || (dirFormData.is_verified ? 'Verified against MCA / BSE Records' : 'Subject to Company / CS Confirmation'),
        status: dirFormData.status || 'published'
      };

      if (isNewDirector) {
        await onCreateDirector(payload);
      } else if (editDirector) {
        await onUpdateDirector(editDirector.id, payload);
      }
      setEditDirector(null);
      setIsNewDirector(false);
    } catch (err: any) {
      setDirActionError(err.message || 'Failed to save director record.');
    } finally {
      setIsSavingDir(false);
    }
  };

  const handleArchiveDirectorAction = async (id: string) => {
    try {
      if (onArchiveDirector) {
        await onArchiveDirector(id);
      } else {
        await onUpdateDirector(id, { status: 'archived' });
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error archiving director.');
    }
  };

  const handleRestoreDirectorAction = async (id: string) => {
    try {
      if (onRestoreDirector) {
        await onRestoreDirector(id);
      } else {
        await onUpdateDirector(id, { status: 'published' });
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error restoring director.');
    }
  };

  // ==========================================
  // COMMITTEES HANDLERS
  // ==========================================
  const handleOpenAddCommittee = () => {
    setIsNewCommittee(true);
    setCommActionError(null);
    setEditCommittee({
      id: '',
      name: '',
      short_name: '',
      mandate: '',
      composition_rule: 'Minimum 3 directors with majority independent directors',
      statutory_reference: 'Section 177 Companies Act, 2013 & Regulation 18 SEBI LODR',
      chairperson_name: '',
      chairperson_designation: 'Independent Director',
      chairperson_role: 'Chairperson',
      chairperson_category: 'Non-Executive Independent Director',
      meetings_frequency: 'At least 4 meetings per year (Quarterly)',
      key_responsibilities: [],
      members: [],
      status: 'published'
    });
    setCommFormData({
      name: '',
      short_name: '',
      mandate: '',
      composition_rule: 'Minimum 3 directors with majority independent directors',
      statutory_reference: 'Section 177 Companies Act, 2013 & Regulation 18 SEBI LODR',
      chairperson_name: '',
      chairperson_designation: 'Independent Director',
      chairperson_role: 'Chairperson',
      chairperson_category: 'Non-Executive Independent Director',
      meetings_frequency: 'At least 4 meetings per year (Quarterly)',
      key_responsibilities_text: '',
      members: [
        { name: '', designation: 'Director', role: 'Member', category: 'Independent Director' }
      ],
      status: 'published'
    });
  };

  const handleOpenEditCommittee = (c: CommitteeItem) => {
    setIsNewCommittee(false);
    setCommActionError(null);
    setEditCommittee(c);
    const keyResp = c.key_responsibilities || c.keyResponsibilities || [];
    setCommFormData({
      name: c.name,
      short_name: c.short_name || c.shortName || '',
      mandate: c.mandate,
      composition_rule: c.composition_rule || c.compositionRule || '',
      statutory_reference: c.statutory_reference || c.statutoryReference || '',
      chairperson_name: c.chairperson_name || c.chairperson?.name || '',
      chairperson_designation: c.chairperson_designation || c.chairperson?.designation || 'Director',
      chairperson_role: c.chairperson_role || c.chairperson?.role || 'Chairperson',
      chairperson_category: c.chairperson_category || c.chairperson?.category || 'Independent Director',
      meetings_frequency: c.meetings_frequency || c.meetingsFrequency || '',
      key_responsibilities_text: Array.isArray(keyResp) ? keyResp.join('\n') : '',
      members: c.members && c.members.length > 0 ? JSON.parse(JSON.stringify(c.members)) : [],
      status: c.status || 'published'
    });
  };

  const handleSaveCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commFormData) return;
    setCommActionError(null);
    setIsSavingComm(true);

    try {
      const keyResp = commFormData.key_responsibilities_text
        ? commFormData.key_responsibilities_text.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const cleanMembers = (commFormData.members || [])
        .filter((m: any) => m && m.name && m.name.trim())
        .map((m: any) => ({
          name: m.name.trim(),
          designation: m.designation || 'Director',
          role: m.role || 'Member',
          category: m.category || 'Independent Director'
        }));

      const payload = {
        name: commFormData.name.trim(),
        short_name: commFormData.short_name.trim(),
        shortName: commFormData.short_name.trim(),
        mandate: commFormData.mandate.trim(),
        composition_rule: commFormData.composition_rule.trim(),
        statutory_reference: commFormData.statutory_reference.trim(),
        chairperson_name: commFormData.chairperson_name.trim(),
        chairperson_designation: commFormData.chairperson_designation.trim(),
        chairperson_role: commFormData.chairperson_role || 'Chairperson',
        chairperson_category: commFormData.chairperson_category || 'Independent Director',
        meetings_frequency: commFormData.meetings_frequency.trim(),
        key_responsibilities: keyResp,
        members: cleanMembers,
        status: commFormData.status || 'published'
      };

      if (isNewCommittee) {
        if (onCreateCommittee) {
          await onCreateCommittee(payload);
        } else {
          // Direct fallback API call
          const res = await fetch('/api/content/committees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('amarnath_admin_token')}` },
            body: JSON.stringify(payload)
          });
          const d = await res.json();
          if (!res.ok || !d.success) throw new Error(d.error || 'Failed to create committee.');
        }
      } else if (editCommittee) {
        await onUpdateCommittee(editCommittee.id, payload);
      }
      setEditCommittee(null);
      setIsNewCommittee(false);
      onRefresh();
    } catch (err: any) {
      setCommActionError(err.message || 'Failed to save committee record.');
    } finally {
      setIsSavingComm(false);
    }
  };

  const handleArchiveCommitteeAction = async (id: string) => {
    try {
      if (onArchiveCommittee) {
        await onArchiveCommittee(id);
      } else {
        await onUpdateCommittee(id, { status: 'archived' });
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error archiving committee.');
    }
  };

  const handleRestoreCommitteeAction = async (id: string) => {
    try {
      if (onRestoreCommittee) {
        await onRestoreCommittee(id);
      } else {
        await onUpdateCommittee(id, { status: 'published' });
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error restoring committee.');
    }
  };

  // ==========================================
  // KMP HANDLERS
  // ==========================================
  const handleOpenAddKmp = () => {
    setIsNewKmp(true);
    setKmpActionError(null);
    setEditKmp({
      id: '',
      role_title: '',
      name: '',
      designation: '',
      email: 'compliance@amarnathsecuritiesltd.com',
      phone: '+91 22 2523 0048',
      address: '',
      authority_scope: 'Authorized pursuant to Regulation 30(5) of SEBI LODR',
      statutory_reference: 'Section 203 Companies Act, 2013 & Regulation 30(5) SEBI LODR',
      is_verified: true,
      status: 'published'
    });
    setKmpFormData({
      role_title: '',
      name: '',
      designation: '',
      email: 'compliance@amarnathsecuritiesltd.com',
      phone: '+91 22 2523 0048',
      address: '',
      authority_scope: 'Authorized pursuant to Regulation 30(5) of SEBI LODR',
      statutory_reference: 'Section 203 Companies Act, 2013 & Regulation 30(5) SEBI LODR',
      is_verified: true,
      status: 'published'
    });
  };

  const handleOpenEditKmp = (k: KmpItem) => {
    setIsNewKmp(false);
    setKmpActionError(null);
    setEditKmp(k);
    setKmpFormData({
      role_title: k.role_title || k.role || '',
      name: k.name,
      designation: k.designation,
      email: k.email,
      phone: k.phone,
      address: k.address || '',
      authority_scope: k.authority_scope || k.authorityScope || '',
      statutory_reference: k.statutory_reference || k.statutoryReference || '',
      is_verified: Boolean(k.is_verified),
      status: k.status || 'published'
    });
  };

  const handleSaveKmp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kmpFormData) return;
    setKmpActionError(null);
    setIsSavingKmp(true);

    try {
      const payload = {
        role_title: kmpFormData.role_title.trim(),
        role: kmpFormData.role_title.trim(),
        name: kmpFormData.name.trim(),
        designation: kmpFormData.designation.trim(),
        email: kmpFormData.email.trim(),
        phone: kmpFormData.phone.trim(),
        address: kmpFormData.address ? kmpFormData.address.trim() : '',
        authority_scope: kmpFormData.authority_scope.trim(),
        authorityScope: kmpFormData.authority_scope.trim(),
        statutory_reference: kmpFormData.statutory_reference.trim(),
        is_verified: Boolean(kmpFormData.is_verified),
        status: kmpFormData.status || 'published'
      };

      if (isNewKmp) {
        if (onCreateKmp) {
          await onCreateKmp(payload);
        } else {
          const res = await fetch('/api/content/kmp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('amarnath_admin_token')}` },
            body: JSON.stringify(payload)
          });
          const d = await res.json();
          if (!res.ok || !d.success) throw new Error(d.error || 'Failed to create KMP contact.');
        }
      } else if (editKmp) {
        await onUpdateKmp(editKmp.id, payload);
      }
      setEditKmp(null);
      setIsNewKmp(false);
      onRefresh();
    } catch (err: any) {
      setKmpActionError(err.message || 'Failed to save KMP record.');
    } finally {
      setIsSavingKmp(false);
    }
  };

  const handleArchiveKmpAction = async (id: string) => {
    try {
      if (onArchiveKmp) {
        await onArchiveKmp(id);
      } else {
        await onUpdateKmp(id, { status: 'archived' });
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error archiving KMP.');
    }
  };

  const handleRestoreKmpAction = async (id: string) => {
    try {
      if (onRestoreKmp) {
        await onRestoreKmp(id);
      } else {
        await onUpdateKmp(id, { status: 'published' });
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error restoring KMP.');
    }
  };

  // ==========================================
  // SAFE DELETE HANDLER
  // ==========================================
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'director') {
        await onDeleteDirector(deleteTarget.id);
      } else if (deleteTarget.type === 'committee') {
        if (onDeleteCommittee) {
          await onDeleteCommittee(deleteTarget.id);
        } else {
          const res = await fetch(`/api/content/committees/${deleteTarget.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('amarnath_admin_token')}` }
          });
          const d = await res.json();
          if (!res.ok || !d.success) throw new Error(d.error || 'Failed to delete committee.');
        }
      } else if (deleteTarget.type === 'kmp') {
        if (onDeleteKmp) {
          await onDeleteKmp(deleteTarget.id);
        } else {
          const res = await fetch(`/api/content/kmp/${deleteTarget.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('amarnath_admin_token')}` }
          });
          const d = await res.json();
          if (!res.ok || !d.success) throw new Error(d.error || 'Failed to delete KMP.');
        }
      }
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete record.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Sub-Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveSubTab('directors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'directors'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users2 className={`w-3.5 h-3.5 ${activeSubTab === 'directors' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>Board of Directors ({directors.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('committees')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'committees'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Network className={`w-3.5 h-3.5 ${activeSubTab === 'committees' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>Board Committees ({committees.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('kmp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'kmp'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserCheck className={`w-3.5 h-3.5 ${activeSubTab === 'kmp' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>KMP Contacts ({kmpContacts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('corporate_governance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'corporate_governance'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scale className={`w-3.5 h-3.5 ${activeSubTab === 'corporate_governance' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>Corporate Governance ({corporateGovernanceDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('policies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'policies'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${activeSubTab === 'policies' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>Statutory Policies ({statutoryPolicyDocs.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Reload live database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar for Tabular Records */}
      {(activeSubTab === 'directors' || activeSubTab === 'committees' || activeSubTab === 'kmp') && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeSubTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
              {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md capitalize cursor-pointer transition-colors ${
                    statusFilter === st ? 'bg-white text-[#0A1128] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {canEdit && (
              <>
                {activeSubTab === 'directors' && (
                  <button
                    onClick={handleOpenAddDirector}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0D9488] hover:bg-[#0f766e] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Director</span>
                  </button>
                )}
                {activeSubTab === 'committees' && (
                  <button
                    onClick={handleOpenAddCommittee}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0D9488] hover:bg-[#0f766e] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Committee</span>
                  </button>
                )}
                {activeSubTab === 'kmp' && (
                  <button
                    onClick={handleOpenAddKmp}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0D9488] hover:bg-[#0f766e] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add KMP</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SUBTAB: BOARD OF DIRECTORS */}
      {/* ======================================================== */}
      {activeSubTab === 'directors' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Director Data Integrity Notice:</span> Unconfirmed appointments remain flagged as{' '}
              <strong className="underline">“Subject to Company / CS Confirmation”</strong> until physical DIN allotment and Form DIR-12 filings are verified. Changes made here synchronize directly with the public website when published.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDirectors.length === 0 ? (
              <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                No directors found matching current filter or search criteria.
              </div>
            ) : (
              filteredDirectors.map((dir) => {
                const comms = dir.committee_memberships || dir.committeeMemberships || [];
                const isArchived = dir.status === 'archived';
                const isDraft = dir.status === 'draft';

                return (
                  <div 
                    key={dir.id}
                    className={`bg-white rounded-xl border p-4 shadow-2xs flex flex-col justify-between space-y-3 transition-all ${
                      isArchived ? 'border-amber-200/80 bg-slate-50/60 opacity-80' : 'border-slate-200/90'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#0A1128]">{dir.name}</h3>
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                              isArchived 
                                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                : isDraft 
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {dir.status || 'published'}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-[#0D9488]">{dir.designation}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          dir.is_verified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {dir.is_verified ? 'Verified' : 'Pending CS Confirmation'}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 bg-[#FAFBFD] p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">DIN Number</span>
                          <span className="font-mono font-semibold text-slate-800">{dir.din}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                          <span className="font-medium text-slate-800 truncate block">{dir.category}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Appointment Date</span>
                          <span className="text-slate-800">{dir.appointment_date || dir.appointmentDate || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Term Duration</span>
                          <span className="text-slate-800 truncate block">{dir.term || 'As per Articles'}</span>
                        </div>
                      </div>

                      {comms && comms.length > 0 && (
                        <div className="mt-2.5 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Board Committees</span>
                          <div className="flex flex-wrap gap-1">
                            {comms.map((c: any, cIdx: number) => (
                              <span key={cIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {c.committeeName || c.name} ({c.role || 'Member'})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-3">
                        {dir.bio}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-400">ID: {dir.id}</span>
                      
                      <div className="flex items-center gap-1.5">
                        {canEdit && (
                          <>
                            <button
                              onClick={() => handleOpenEditDirector(dir)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Edit director details"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {isArchived ? (
                              <button
                                onClick={() => handleRestoreDirectorAction(dir.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="Restore to public website"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Restore</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleArchiveDirectorAction(dir.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="Archive from public website"
                              >
                                <Archive className="w-3 h-3" />
                                <span>Archive</span>
                              </button>
                            )}
                          </>
                        )}

                        {isSuperAdmin && (
                          <button
                            onClick={() => setDeleteTarget({ type: 'director', id: dir.id, title: dir.name })}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Safely delete director record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SUBTAB: BOARD COMMITTEES */}
      {/* ======================================================== */}
      {activeSubTab === 'committees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommittees.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No committees found matching current filter or search criteria.
            </div>
          ) : (
            filteredCommittees.map((comm) => {
              const isArchived = comm.status === 'archived';
              const isDraft = comm.status === 'draft';
              const chairpersonName = comm.chairperson_name || comm.chairperson?.name || '';
              const chairpersonCat = comm.chairperson_category || comm.chairperson?.category || 'Independent Director';

              return (
                <div 
                  key={comm.id} 
                  className={`bg-white rounded-xl border p-4 shadow-2xs flex flex-col justify-between space-y-3 transition-all ${
                    isArchived ? 'border-amber-200/80 bg-slate-50/60 opacity-80' : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0A1128]">{comm.name}</h3>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            isArchived 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : isDraft 
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {comm.status || 'published'}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#0D9488]">{comm.short_name || comm.shortName}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {comm.statutory_reference || comm.statutoryReference}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {comm.mandate}
                    </p>

                    <div className="mt-3 p-2.5 rounded-lg bg-[#FAFBFD] border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Chairperson:</span>
                        <strong className="text-slate-800">{chairpersonName} ({chairpersonCat})</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Meeting Frequency:</span>
                        <strong className="text-slate-800">{comm.meetings_frequency || comm.meetingsFrequency}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Total Members:</span>
                        <strong className="text-slate-800">{(comm.members?.length || 0)} Directors</strong>
                      </div>
                    </div>

                    {comm.members && comm.members.length > 0 && (
                      <div className="mt-2.5 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Committee Composition</div>
                        <div className="divide-y divide-slate-100 text-xs">
                          {comm.members.map((m, idx) => (
                            <div key={idx} className="py-1 flex items-center justify-between text-slate-600">
                              <span>{m.name}</span>
                              <span className="text-[10px] font-semibold text-slate-500">{m.role} • {m.category}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-400">ID: {comm.id}</span>
                    
                    <div className="flex items-center gap-1.5">
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleOpenEditCommittee(comm)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Composition</span>
                          </button>

                          {isArchived ? (
                            <button
                              onClick={() => handleRestoreCommitteeAction(comm.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Restore committee"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchiveCommitteeAction(comm.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Archive committee"
                            >
                              <Archive className="w-3 h-3" />
                              <span>Archive</span>
                            </button>
                          )}
                        </>
                      )}

                      {isSuperAdmin && (
                        <button
                          onClick={() => setDeleteTarget({ type: 'committee', id: comm.id, title: comm.name })}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Safely delete committee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SUBTAB: KEY MANAGERIAL PERSONNEL (KMP) */}
      {/* ======================================================== */}
      {activeSubTab === 'kmp' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKmp.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No KMP contacts found matching current filter or search criteria.
            </div>
          ) : (
            filteredKmp.map((kmp) => {
              const isArchived = kmp.status === 'archived';
              const isDraft = kmp.status === 'draft';

              return (
                <div 
                  key={kmp.id} 
                  className={`bg-white rounded-xl border p-4 shadow-2xs flex flex-col justify-between space-y-3 transition-all ${
                    isArchived ? 'border-amber-200/80 bg-slate-50/60 opacity-80' : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0A1128]">{kmp.name}</h3>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            isArchived 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : isDraft 
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {kmp.status || 'published'}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#0D9488]">{kmp.role_title || kmp.role}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {kmp.statutory_reference || kmp.statutoryReference}
                      </span>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-[#FAFBFD] border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Designation:</span>
                        <strong className="text-slate-800">{kmp.designation}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Official Email:</span>
                        <span className="font-mono text-slate-800">{kmp.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <span className="font-mono text-slate-800">{kmp.phone}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      <span className="font-bold text-slate-700">Scope of Authority: </span>
                      {kmp.authority_scope || kmp.authorityScope}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-400">ID: {kmp.id}</span>
                    
                    <div className="flex items-center gap-1.5">
                      {canEdit && (
                        <>
                          <button
                            onClick={() => handleOpenEditKmp(kmp)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Details</span>
                          </button>

                          {isArchived ? (
                            <button
                              onClick={() => handleRestoreKmpAction(kmp.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Restore KMP"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchiveKmpAction(kmp.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Archive KMP"
                            >
                              <Archive className="w-3 h-3" />
                              <span>Archive</span>
                            </button>
                          )}
                        </>
                      )}

                      {isSuperAdmin && (
                        <button
                          onClick={() => setDeleteTarget({ type: 'kmp', id: kmp.id, title: kmp.name })}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Safely delete KMP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SUBTAB: CORPORATE GOVERNANCE (REG 27) */}
      {/* ======================================================== */}
      {activeSubTab === 'corporate_governance' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#0A1128]">SEBI LODR Regulation 27(2) Compliance Filings</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic quarterly corporate governance reports synchronized directly with the Documents & Disclosures database.
              </p>
            </div>
            {onNavigateView && (
              <button
                onClick={() => onNavigateView('documents')}
                className="px-3 py-1.5 text-xs font-semibold bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New CG Report</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {corporateGovernanceDocs.length === 0 ? (
              <div className="py-6 text-center text-slate-500">
                No Corporate Governance reports currently in database. Upload via Documents module.
              </div>
            ) : (
              corporateGovernanceDocs.map((doc) => (
                <div key={doc.id} className="py-3.5 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold text-slate-800 text-xs sm:text-sm">{doc.title}</div>
                    <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                      BSE Ack: {doc.bseAckNumber || doc.bse_ack_number || 'BSE/CG/CONFIRMED'} • Filing Date: {doc.filingDate || doc.filing_date} • {doc.financialYear || doc.financial_year} ({doc.quarter})
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
                      {doc.status || 'Published'}
                    </span>
                    {onOpenDocument && (
                      <button
                        onClick={() => onOpenDocument(doc)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SUBTAB: STATUTORY POLICIES */}
      {/* ======================================================== */}
      {activeSubTab === 'policies' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#0A1128]">Statutory Policies & Charter Documents Library</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reusing the central Documents repository. Mandated under SEBI (LODR) Regulations 2015 and Companies Act 2013.
              </p>
            </div>
            {onNavigateView && (
              <button
                onClick={() => onNavigateView('documents')}
                className="px-3 py-1.5 text-xs font-semibold bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New Policy Document</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {statutoryPolicyDocs.length === 0 ? (
              <div className="col-span-2 py-6 text-center text-slate-500">
                No policy documents found in database.
              </div>
            ) : (
              statutoryPolicyDocs.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-[#FAFBFD] flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800 text-xs sm:text-sm">{p.title}</div>
                    <div className="text-[10px] font-mono text-[#0D9488] flex items-center gap-2">
                      <span>{p.sebiReference || p.sebi_reference || 'SEBI LODR'}</span>
                      <span>•</span>
                      <span>{p.version || 'Version 1.0'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      Adopted
                    </span>
                    {onOpenDocument && (
                      <button
                        onClick={() => onOpenDocument(p)}
                        className="p-1.5 text-slate-500 hover:text-[#0D9488] bg-white rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        title="View / Download Policy"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT DIRECTOR */}
      {/* ======================================================== */}
      {editDirector && dirFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">
                  {isNewDirector ? 'Add New Director Profile' : 'Edit Director Profile'}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {isNewDirector ? 'Genuinely dynamic database record' : `ID: ${editDirector.id}`}
                </div>
              </div>
              <button
                onClick={() => setEditDirector(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDirector} className="p-5 space-y-3.5 overflow-y-auto">
              {dirActionError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{dirActionError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Director Name *</label>
                  <input
                    type="text"
                    required
                    value={dirFormData.name}
                    onChange={(e) => setDirFormData({ ...dirFormData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">DIN Number *</label>
                  <input
                    type="text"
                    required
                    value={dirFormData.din}
                    onChange={(e) => setDirFormData({ ...dirFormData, din: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={dirFormData.designation}
                    onChange={(e) => setDirFormData({ ...dirFormData, designation: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={dirFormData.category}
                    onChange={(e) => setDirFormData({ ...dirFormData, category: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="text"
                    value={dirFormData.appointment_date}
                    onChange={(e) => setDirFormData({ ...dirFormData, appointment_date: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Term Duration</label>
                  <input
                    type="text"
                    value={dirFormData.term}
                    onChange={(e) => setDirFormData({ ...dirFormData, term: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Executive Biography *</label>
                <textarea
                  rows={3}
                  required
                  value={dirFormData.bio}
                  onChange={(e) => setDirFormData({ ...dirFormData, bio: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Board Committee Memberships (One per line: Committee Name | Role)
                </label>
                <textarea
                  rows={2}
                  placeholder="Audit Committee | Chairperson&#10;Nomination & Remuneration Committee | Member"
                  value={dirFormData.committee_memberships_text}
                  onChange={(e) => setDirFormData({ ...dirFormData, committee_memberships_text: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Other Directorships (One per line)
                </label>
                <textarea
                  rows={2}
                  value={dirFormData.other_directorships_text}
                  onChange={(e) => setDirFormData({ ...dirFormData, other_directorships_text: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0D9488]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Verification State</div>
                    <div className="text-[10px] text-slate-500">Only if Form DIR-12 verified</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={dirFormData.is_verified}
                    onChange={(e) => setDirFormData({ ...dirFormData, is_verified: e.target.checked })}
                    className="w-4 h-4 text-[#0D9488] rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publishing Status</label>
                  <select
                    value={dirFormData.status}
                    onChange={(e) => setDirFormData({ ...dirFormData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Private Admin Only)</option>
                    <option value="archived">Archived (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditDirector(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDir}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSavingDir ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />}
                  <span>{isSavingDir ? 'Saving...' : 'Save Reconciled Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT COMMITTEE */}
      {/* ======================================================== */}
      {editCommittee && commFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">
                  {isNewCommittee ? 'Add Board Committee' : 'Edit Committee Mandate & Members'}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {commFormData.short_name || 'Statutory Committee'}
                </div>
              </div>
              <button
                onClick={() => setEditCommittee(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCommittee} className="p-5 space-y-3.5 overflow-y-auto">
              {commActionError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{commActionError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Committee Name *</label>
                  <input
                    type="text"
                    required
                    value={commFormData.name}
                    onChange={(e) => setCommFormData({ ...commFormData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Name *</label>
                  <input
                    type="text"
                    required
                    value={commFormData.short_name}
                    onChange={(e) => setCommFormData({ ...commFormData, short_name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Statutory Citation *</label>
                <input
                  type="text"
                  required
                  value={commFormData.statutory_reference}
                  onChange={(e) => setCommFormData({ ...commFormData, statutory_reference: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mandate & Charter *</label>
                <textarea
                  rows={2}
                  required
                  value={commFormData.mandate}
                  onChange={(e) => setCommFormData({ ...commFormData, mandate: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chairperson Name *</label>
                  <input
                    type="text"
                    required
                    value={commFormData.chairperson_name}
                    onChange={(e) => setCommFormData({ ...commFormData, chairperson_name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chairperson Category</label>
                  <input
                    type="text"
                    value={commFormData.chairperson_category}
                    onChange={(e) => setCommFormData({ ...commFormData, chairperson_category: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Frequency *</label>
                <input
                  type="text"
                  required
                  value={commFormData.meetings_frequency}
                  onChange={(e) => setCommFormData({ ...commFormData, meetings_frequency: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Committee Members Management */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Committee Members</label>
                  <button
                    type="button"
                    onClick={() => {
                      setCommFormData({
                        ...commFormData,
                        members: [
                          ...(commFormData.members || []),
                          { name: '', designation: 'Director', role: 'Member', category: 'Independent Director' }
                        ]
                      });
                    }}
                    className="text-[11px] font-semibold text-[#0D9488] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {(!commFormData.members || commFormData.members.length === 0) ? (
                    <div className="text-center text-slate-400 text-xs py-2">No members added yet.</div>
                  ) : (
                    commFormData.members.map((m: any, mIdx: number) => (
                      <div key={mIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Member Name"
                          value={m.name}
                          onChange={(e) => {
                            const newM = [...commFormData.members];
                            newM[mIdx].name = e.target.value;
                            setCommFormData({ ...commFormData, members: newM });
                          }}
                          className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded"
                        />
                        <select
                          value={m.role}
                          onChange={(e) => {
                            const newM = [...commFormData.members];
                            newM[mIdx].role = e.target.value;
                            setCommFormData({ ...commFormData, members: newM });
                          }}
                          className="w-24 px-2 py-1 text-xs bg-white border border-slate-200 rounded"
                        >
                          <option value="Chairperson">Chairperson</option>
                          <option value="Member">Member</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const newM = commFormData.members.filter((_: any, idx: number) => idx !== mIdx);
                            setCommFormData({ ...commFormData, members: newM });
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Responsibilities (One per line)
                </label>
                <textarea
                  rows={2}
                  value={commFormData.key_responsibilities_text}
                  onChange={(e) => setCommFormData({ ...commFormData, key_responsibilities_text: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Publishing Status</label>
                <select
                  value={commFormData.status}
                  onChange={(e) => setCommFormData({ ...commFormData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="published">Published (Visible Publicly)</option>
                  <option value="draft">Draft (Admin Only)</option>
                  <option value="archived">Archived (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditCommittee(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingComm}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSavingComm ? 'Saving...' : 'Save Committee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT KMP */}
      {/* ======================================================== */}
      {editKmp && kmpFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">
                  {isNewKmp ? 'Add Key Managerial Personnel' : 'Edit KMP Contact Details'}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">{kmpFormData.role_title || 'Regulation 30(5) Designation'}</div>
              </div>
              <button
                onClick={() => setEditKmp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKmp} className="p-5 space-y-3.5 overflow-y-auto">
              {kmpActionError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{kmpActionError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Title / Statutory Position *</label>
                <input
                  type="text"
                  required
                  value={kmpFormData.role_title}
                  onChange={(e) => setKmpFormData({ ...kmpFormData, role_title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={kmpFormData.name}
                    onChange={(e) => setKmpFormData({ ...kmpFormData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={kmpFormData.designation}
                    onChange={(e) => setKmpFormData({ ...kmpFormData, designation: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={kmpFormData.email}
                    onChange={(e) => setKmpFormData({ ...kmpFormData, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={kmpFormData.phone}
                    onChange={(e) => setKmpFormData({ ...kmpFormData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scope of Authority *</label>
                <textarea
                  rows={2}
                  required
                  value={kmpFormData.authority_scope}
                  onChange={(e) => setKmpFormData({ ...kmpFormData, authority_scope: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Office Address</label>
                <input
                  type="text"
                  value={kmpFormData.address}
                  onChange={(e) => setKmpFormData({ ...kmpFormData, address: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Publishing Status</label>
                <select
                  value={kmpFormData.status}
                  onChange={(e) => setKmpFormData({ ...kmpFormData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="published">Published (Visible Publicly)</option>
                  <option value="draft">Draft (Admin Only)</option>
                  <option value="archived">Archived (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditKmp(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingKmp}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSavingKmp ? 'Saving...' : 'Save KMP Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SAFE DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-rose-200 overflow-hidden">
            <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <h3 className="text-sm font-bold text-rose-900">Confirm Authorized Permanent Deletion</h3>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-600">
              <p>
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-900">{deleteTarget.title}</strong>?
              </p>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                <strong>Regulatory Recommendation:</strong> Statutory records should typically be <em>Archived</em> rather than permanently removed to maintain historical regulatory compliance audit trails.
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
