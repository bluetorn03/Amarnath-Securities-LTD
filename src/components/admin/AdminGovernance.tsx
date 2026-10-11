import React, { useState } from 'react';
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
  Building
} from 'lucide-react';
import { AdminRole, AdminUser } from '../../types';

interface DirectorItem {
  id: string;
  name: string;
  designation: string;
  category: string;
  din: string;
  appointment_date?: string;
  term?: string;
  bio: string;
  other_directorships?: string[];
  is_verified: boolean;
  approval_status: string;
  status: string;
}

interface CommitteeMemberItem {
  name: string;
  designation: string;
  role: 'Chairperson' | 'Member';
  category: string;
}

interface CommitteeItem {
  id: string;
  name: string;
  short_name: string;
  mandate: string;
  composition_rule: string;
  statutory_reference: string;
  chairperson_name: string;
  chairperson_designation: string;
  chairperson_role: string;
  chairperson_category: string;
  meetings_frequency: string;
  key_responsibilities?: string[];
  members?: CommitteeMemberItem[];
}

interface KmpItem {
  id: string;
  role_title: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  address?: string;
  authority_scope: string;
  statutory_reference: string;
  is_verified: boolean;
}

interface AdminGovernanceProps {
  initialSubTab?: 'directors' | 'committees' | 'kmp' | 'corporate_governance' | 'policies';
  currentUser: AdminUser | null;
  directors: DirectorItem[];
  committees: CommitteeItem[];
  kmpContacts: KmpItem[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateDirector: (id: string, data: Partial<DirectorItem>) => Promise<void>;
  onCreateDirector: (data: any) => Promise<void>;
  onDeleteDirector: (id: string) => Promise<void>;
  onUpdateCommittee: (id: string, data: any) => Promise<void>;
  onUpdateKmp: (id: string, data: Partial<KmpItem>) => Promise<void>;
}

export const AdminGovernance: React.FC<AdminGovernanceProps> = ({
  initialSubTab = 'directors',
  currentUser,
  directors,
  committees,
  kmpContacts,
  loading,
  onRefresh,
  onUpdateDirector,
  onCreateDirector,
  onDeleteDirector,
  onUpdateCommittee,
  onUpdateKmp
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directors' | 'committees' | 'kmp' | 'corporate_governance' | 'policies'>(initialSubTab);

  // Sync if prop changes
  React.useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // Edit Director Modal
  const [editDirector, setEditDirector] = useState<DirectorItem | null>(null);
  const [dirFormData, setDirFormData] = useState<any>(null);
  const [isSavingDir, setIsSavingDir] = useState<boolean>(false);

  // Edit KMP Modal
  const [editKmp, setEditKmp] = useState<KmpItem | null>(null);
  const [kmpFormData, setKmpFormData] = useState<any>(null);
  const [isSavingKmp, setIsSavingKmp] = useState<boolean>(false);

  // Edit Committee Modal
  const [editCommittee, setEditCommittee] = useState<CommitteeItem | null>(null);
  const [commFormData, setCommFormData] = useState<any>(null);
  const [isSavingComm, setIsSavingComm] = useState<boolean>(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canEdit = currentUser?.role === 'super_admin' || currentUser?.role === 'compliance_officer' || currentUser?.role === 'editor';

  const handleOpenEditDirector = (d: DirectorItem) => {
    setEditDirector(d);
    setDirFormData({
      name: d.name,
      designation: d.designation,
      category: d.category,
      din: d.din,
      appointment_date: d.appointment_date || '',
      term: d.term || '',
      bio: d.bio,
      is_verified: d.is_verified,
      approval_status: d.approval_status
    });
  };

  const handleSaveDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDirector || !dirFormData) return;
    setIsSavingDir(true);
    try {
      await onUpdateDirector(editDirector.id, dirFormData);
      setEditDirector(null);
    } finally {
      setIsSavingDir(false);
    }
  };

  const handleOpenEditKmp = (k: KmpItem) => {
    setEditKmp(k);
    setKmpFormData({
      role_title: k.role_title,
      name: k.name,
      designation: k.designation,
      email: k.email,
      phone: k.phone,
      authority_scope: k.authority_scope,
      statutory_reference: k.statutory_reference,
      is_verified: k.is_verified
    });
  };

  const handleSaveKmp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editKmp || !kmpFormData) return;
    setIsSavingKmp(true);
    try {
      await onUpdateKmp(editKmp.id, kmpFormData);
      setEditKmp(null);
    } finally {
      setIsSavingKmp(false);
    }
  };

  const handleOpenEditCommittee = (c: CommitteeItem) => {
    setEditCommittee(c);
    setCommFormData({
      name: c.name,
      short_name: c.short_name,
      mandate: c.mandate,
      composition_rule: c.composition_rule,
      statutory_reference: c.statutory_reference,
      chairperson_name: c.chairperson_name,
      chairperson_designation: c.chairperson_designation,
      meetings_frequency: c.meetings_frequency
    });
  };

  const handleSaveCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCommittee || !commFormData) return;
    setIsSavingComm(true);
    try {
      await onUpdateCommittee(editCommittee.id, commFormData);
      setEditCommittee(null);
    } finally {
      setIsSavingComm(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Sub-Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveSubTab('directors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'corporate_governance'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scale className={`w-3.5 h-3.5 ${activeSubTab === 'corporate_governance' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>Corporate Governance (Reg 27)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('policies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'policies'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${activeSubTab === 'policies' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>Statutory Policies (9)</span>
          </button>
        </div>

        <button
          onClick={onRefresh}
          className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          title="Reload governance records"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. SUBTAB: BOARD OF DIRECTORS */}
      {/* ======================================================== */}
      {activeSubTab === 'directors' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Director Data Integrity Notice:</span> Unconfirmed appointments must remain flagged as{' '}
              <strong className="underline">“Subject to Company / CS Confirmation”</strong> until physical DIN allotment and DIR-12 filings are verified. Do not infer missing directorship records.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {directors.map((dir) => (
              <div 
                key={dir.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#0A1128]">{dir.name}</h3>
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
                      <span className="text-slate-800">{dir.appointment_date || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Term Duration</span>
                      <span className="text-slate-800 truncate block">{dir.term || 'As per Articles'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3">
                    {dir.bio}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">ID: {dir.id}</span>
                  {canEdit && (
                    <button
                      onClick={() => handleOpenEditDirector(dir)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit & Reconcile</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SUBTAB: BOARD COMMITTEES */}
      {/* ======================================================== */}
      {activeSubTab === 'committees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {committees.map((comm) => (
            <div key={comm.id} className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1128]">{comm.name}</h3>
                    <div className="text-[11px] font-mono text-[#0D9488]">{comm.short_name}</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {comm.statutory_reference}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {comm.mandate}
                </p>

                <div className="mt-3 p-2.5 rounded-lg bg-[#FAFBFD] border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Chairperson:</span>
                    <strong className="text-slate-800">{comm.chairperson_name} ({comm.chairperson_category})</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Meeting Frequency:</span>
                    <strong className="text-slate-800">{comm.meetings_frequency}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Members:</span>
                    <strong className="text-slate-800">{(comm.members?.length || 0) + 1} Directors</strong>
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

              {canEdit && (
                <div className="pt-2 border-t border-slate-100 text-right">
                  <button
                    onClick={() => handleOpenEditCommittee(comm)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Composition</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SUBTAB: KEY MANAGERIAL PERSONNEL (KMP) */}
      {/* ======================================================== */}
      {activeSubTab === 'kmp' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kmpContacts.map((kmp) => (
            <div key={kmp.id} className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1128]">{kmp.name}</h3>
                    <div className="text-xs font-semibold text-[#0D9488]">{kmp.role_title}</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {kmp.statutory_reference}
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
                  {kmp.authority_scope}
                </div>
              </div>

              {canEdit && (
                <div className="pt-2 border-t border-slate-100 text-right">
                  <button
                    onClick={() => handleOpenEditKmp(kmp)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Details</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SUBTAB: CORPORATE GOVERNANCE (REG 27) */}
      {/* ======================================================== */}
      {activeSubTab === 'corporate_governance' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0A1128]">SEBI LODR Regulation 27(2) Compliance Reports</h3>
              <p className="text-xs text-slate-500 mt-0.5">Quarterly Corporate Governance filings submitted to BSE Listing Centre</p>
            </div>
            <span className="text-xs font-semibold text-[#0D9488] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Active Filings
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Corporate Governance Report — Quarter Ended 31 December 2025 (Q3)</div>
                <div className="text-slate-400 text-[11px] font-mono mt-0.5">BSE Ack: BSE/CG/Q3/2025-26 • Filing Date: 15-Jan-2026</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                Complied & Filed
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Corporate Governance Report — Quarter Ended 30 September 2025 (Q2)</div>
                <div className="text-slate-400 text-[11px] font-mono mt-0.5">BSE Ack: BSE/CG/Q2/2025-26 • Filing Date: 14-Oct-2025</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                Complied & Filed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SUBTAB: STATUTORY POLICIES */}
      {/* ======================================================== */}
      {activeSubTab === 'policies' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0A1128]">Mandatory Statutory Policies & Disclosures</h3>
              <p className="text-xs text-slate-500 mt-0.5">Mandated under SEBI (LODR) Regulations 2015 and Companies Act 2013</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              9 Adopted Codes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { title: 'Code of Conduct for Board & Senior Management', reg: 'Reg 17(5)' },
              { title: 'Vigil Mechanism & Whistleblower Policy', reg: 'Reg 22' },
              { title: 'Policy for Determining Material Subsidiaries', reg: 'Reg 16(1)(c)' },
              { title: 'Policy on Materiality of Related Party Transactions', reg: 'Reg 23(1)' },
              { title: 'Policy on Preservation of Documents & Archival', reg: 'Reg 9 & 30(8)' },
              { title: 'Familiarisation Programme for Independent Directors', reg: 'Reg 25(7)' },
              { title: 'Code of Fair Disclosure of Unpublished Price Sensitive Info (UPSI)', reg: 'PIT Reg 8' },
              { title: 'Policy on Diversity of Board of Directors', reg: 'Reg 19(4)' },
              { title: 'Policy on Prevention of Sexual Harassment (POSH)', reg: 'POSH Act 2013' }
            ].map((p, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-[#FAFBFD] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{p.title}</div>
                  <div className="text-[10px] font-mono text-[#0D9488] mt-0.5">{p.reg}</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  Adopted
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT DIRECTOR */}
      {/* ======================================================== */}
      {editDirector && dirFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Edit Director Profile</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">DIN: {editDirector.din}</div>
              </div>
              <button
                onClick={() => setEditDirector(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDirector} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Director Name *</label>
                  <input
                    type="text"
                    required
                    value={dirFormData.name}
                    onChange={(e) => setDirFormData({ ...dirFormData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">DIN Number *</label>
                  <input
                    type="text"
                    required
                    value={dirFormData.din}
                    onChange={(e) => setDirFormData({ ...dirFormData, din: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
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
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={dirFormData.category}
                    onChange={(e) => setDirFormData({ ...dirFormData, category: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
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
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Term Duration</label>
                  <input
                    type="text"
                    value={dirFormData.term}
                    onChange={(e) => setDirFormData({ ...dirFormData, term: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
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
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Statutory Verification State</div>
                  <div className="text-[11px] text-slate-500">Enable only when formal DIR-12 and consent letter are verified</div>
                </div>
                <input
                  type="checkbox"
                  checked={dirFormData.is_verified}
                  onChange={(e) => setDirFormData({ ...dirFormData, is_verified: e.target.checked })}
                  className="w-4 h-4 text-[#0D9488] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditDirector(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDir}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
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
      {/* MODAL: EDIT KMP */}
      {/* ======================================================== */}
      {editKmp && kmpFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Edit KMP Contact Details</h3>
                <div className="text-xs text-slate-500 mt-0.5">{kmpFormData.role_title}</div>
              </div>
              <button
                onClick={() => setEditKmp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKmp} className="p-5 space-y-3.5">
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

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditKmp(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingKmp}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSavingKmp ? 'Saving...' : 'Save KMP Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT COMMITTEE */}
      {/* ======================================================== */}
      {editCommittee && commFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Edit Committee Mandate</h3>
                <div className="text-xs text-slate-500 mt-0.5">{editCommittee.name}</div>
              </div>
              <button
                onClick={() => setEditCommittee(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCommittee} className="p-5 space-y-3.5">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Committee Mandate *</label>
                <textarea
                  rows={3}
                  required
                  value={commFormData.mandate}
                  onChange={(e) => setCommFormData({ ...commFormData, mandate: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
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

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCommittee(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingComm}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSavingComm ? 'Saving...' : 'Save Committee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
