import React, { useState, useMemo } from 'react';
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
  FileCheck
} from 'lucide-react';

interface AdminInvestorSupportProps {
  initialSubTab?: 'grievances' | 'enquiries' | 'rta_contact';
  enquiries: EnquiryItem[];
  loading: boolean;
  currentUser: AdminUser | null;
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: 'new' | 'in_progress' | 'resolved' | 'closed', notes?: string) => Promise<void>;
}

export const AdminInvestorSupport: React.FC<AdminInvestorSupportProps> = ({
  initialSubTab = 'grievances',
  enquiries,
  loading,
  currentUser,
  onRefresh,
  onUpdateStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'grievances' | 'enquiries' | 'rta_contact'>(initialSubTab);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [testRunFilter, setTestRunFilter] = useState<'genuine' | 'test' | 'all'>('genuine');

  // Resolution Notes Modal
  const [activeItem, setActiveItem] = useState<EnquiryItem | null>(null);
  const [newStatus, setNewStatus] = useState<'new' | 'in_progress' | 'resolved' | 'closed'>('in_progress');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // Genuine vs Test counts
  const genuineList = useMemo(() => enquiries.filter(e => !e.is_test), [enquiries]);
  const testList = useMemo(() => enquiries.filter(e => e.is_test), [enquiries]);

  const filteredItems = useMemo(() => {
    return enquiries.filter((item) => {
      if (activeSubTab === 'grievances' && item.type !== 'investor') return false;
      if (activeSubTab === 'enquiries' && item.type !== 'business') return false;

      // Filter by genuine vs test
      if (testRunFilter === 'genuine' && item.is_test) return false;
      if (testRunFilter === 'test' && !item.is_test) return false;

      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesRef = item.reference_no.toLowerCase().includes(q);
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const matchesFolio = item.folio_or_dp_id?.toLowerCase().includes(q);
        const matchesDetails = item.details.toLowerCase().includes(q);
        if (!matchesRef && !matchesName && !matchesEmail && !matchesFolio && !matchesDetails) return false;
      }

      return true;
    });
  }, [enquiries, activeSubTab, statusFilter, testRunFilter, search]);

  const handleOpenStatusModal = (item: EnquiryItem) => {
    setActiveItem(item);
    setNewStatus(item.status);
    setResolutionNotes(item.resolution_notes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(activeItem.id, newStatus, resolutionNotes);
      setActiveItem(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="capitalize">{status}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>In Triage</span>
          </span>
        );
      case 'new':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>New Actionable</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. SubTab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveSubTab('grievances')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'grievances'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${activeSubTab === 'grievances' ? 'text-rose-400' : 'text-slate-500'}`} />
            <span>Shareholder Grievances ({enquiries.filter(e => e.type === 'investor' && !e.is_test).length} Genuine)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('enquiries')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'enquiries'
                ? 'bg-[#0A1128] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Inbox className={`w-3.5 h-3.5 ${activeSubTab === 'enquiries' ? 'text-[#C5A059]' : 'text-slate-500'}`} />
            <span>Investor & Mandate Enquiries ({enquiries.filter(e => e.type === 'business').length})</span>
          </button>

          <button
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

        <button
          onClick={onRefresh}
          className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          title="Reload enquiries list"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. SUBTAB: GRIEVANCES & ENQUIRIES TABLE */}
      {/* ======================================================== */}
      {activeSubTab !== 'rta_contact' && (
        <div className="space-y-4">
          {/* Filter Bar with Genuine vs Test Run separation */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, ref, email, folio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Genuine Submissions vs Audit Test Runs Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs self-stretch sm:self-auto">
              <button
                onClick={() => setTestRunFilter('genuine')}
                className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                  testRunFilter === 'genuine'
                    ? 'bg-white text-[#0A1128] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Genuine ({genuineList.length})
              </button>
              <button
                onClick={() => setTestRunFilter('test')}
                className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                  testRunFilter === 'test'
                    ? 'bg-white text-amber-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Audit Test Runs ({testList.length})
              </button>
              <button
                onClick={() => setTestRunFilter('all')}
                className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                  testRunFilter === 'all'
                    ? 'bg-white text-[#0A1128] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({enquiries.length})
              </button>
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
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date Filed</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Loading investor cases from database...
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No submissions matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#0A1128]">
                          {item.reference_no}
                          {item.is_test ? (
                            <span className="block text-[9px] font-sans font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 mt-1 max-w-fit">
                              Automated Test
                            </span>
                          ) : null}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#0A1128]">{item.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{item.email}</div>
                          {item.phone && <div className="text-[10px] text-slate-400 font-mono">{item.phone}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-700">
                            {item.type === 'investor' ? 'Shareholder Grievance' : 'Corporate Advisory'}
                          </div>
                          {item.folio_or_dp_id && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              Folio/DP: {item.folio_or_dp_id}
                            </div>
                          )}
                          {item.grievance_category && (
                            <div className="text-[10px] text-rose-700 font-medium">
                              {item.grievance_category}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-slate-600 line-clamp-2 text-xs">
                            {item.details}
                          </p>
                          {item.resolution_notes && (
                            <div className="mt-1 text-[10px] text-[#0D9488] font-medium bg-teal-50/60 p-1 rounded border border-teal-100">
                              Notes: {item.resolution_notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenStatusModal(item)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Triage
                          </button>
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
      {/* 3. SUBTAB: RTA & OFFICIAL CONTACTS + UNCONFIRMED AUDIT */}
      {/* ======================================================== */}
      {activeSubTab === 'rta_contact' && (
        <div className="space-y-5">
          {/* Card: Pending Company Confirmation Audit Banner */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
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
                  <strong>Primary:</strong> Bigshare Services Pvt. Ltd. (Mumbai)<br/>
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
                  <strong>Institutional:</strong> compliance@amarnathsecuritiesltd.com<br/>
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
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  SEBI Registered
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FAFBFD] border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-sm text-[#0A1128]">Bigshare Services Pvt. Ltd.</div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Office No S6-2, 6th Floor, Pinnacle Business Park, Next to Ahura Centre, Mahakali Caves Road, Andheri (East), Mumbai - 400 093, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">+91 22 6263 8200</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">investor@bigshareonline.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a 
                    href="https://www.bigshareonline.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#0D9488] font-semibold hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>www.bigshareonline.com</span>
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
                    <div className="font-semibold text-slate-800">SEBI SCORES Portal</div>
                    <div className="text-[11px] text-slate-500">SEBI Complaints Redress System</div>
                  </div>
                  <a
                    href="https://scores.sebi.gov.in"
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
                    <div className="text-[11px] text-slate-500">Securities Market Approach for Resolution Through ODR</div>
                  </div>
                  <a
                    href="https://smartodr.in"
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
                    <div className="text-[11px] text-slate-500">Amarnath Securities Limited (538465) Portal</div>
                  </div>
                  <a
                    href="https://www.bseindia.com/stock-share-price/amarnath-securities-ltd/amarnat/538465/"
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
      {/* MODAL: TRIAGE GRIEVANCE / ENQUIRY STATUS */}
      {/* ======================================================== */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Triage & Update Status</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{activeItem.reference_no}</div>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-3.5">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">{activeItem.name} ({activeItem.email})</div>
                <p className="text-slate-600 text-[11px]">{activeItem.details}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Workflow Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                >
                  <option value="new">New (Awaiting Review)</option>
                  <option value="in_progress">In Progress / In Triage</option>
                  <option value="resolved">Resolved (Redressal Sent)</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Compliance / Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record verification details, RTA response, or investor communication..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? 'Saving...' : 'Save Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
