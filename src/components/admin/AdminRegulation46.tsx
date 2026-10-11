import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MinusCircle, 
  ExternalLink, 
  FileText, 
  RefreshCw, 
  X, 
  Edit3, 
  ShieldCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface Reg46Item {
  id: number;
  clause: string;
  sub_regulation: string;
  title: string;
  requirement: string;
  category: string;
  website_location: string;
  target_route: string;
  target_category?: string | null;
  status: string;
  review_status?: 'Not Reviewed' | 'Pending Evidence' | 'Under Review' | 'Verified' | 'Not Applicable';
  responsible_reviewer?: string | null;
  internal_review_date?: string | null;
  evidence_link?: string | null;
  last_verified_date?: string | null;
  compliance_notes?: string | null;
  action_text: string;
  legal_citation: string;
}

interface AdminRegulation46Props {
  clauses: Reg46Item[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateClause: (id: number, data: Partial<Reg46Item> & { reason: string }) => Promise<void>;
  onNavigatePublicRoute?: (route: string) => void;
}

export const AdminRegulation46: React.FC<AdminRegulation46Props> = ({
  clauses,
  loading,
  onRefresh,
  onUpdateClause,
  onNavigatePublicRoute
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Edit Review Modal
  const [activeClause, setActiveClause] = useState<Reg46Item | null>(null);
  const [editStatus, setEditStatus] = useState<string>('Pending Evidence');
  const [editReviewer, setEditReviewer] = useState<string>('Company Secretary & Compliance Officer');
  const [editReviewDate, setEditReviewDate] = useState<string>('2026-10-15');
  const [editEvidenceLink, setEditEvidenceLink] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Compute Statistics
  const totalCount = clauses.length;
  const verifiedCount = clauses.filter((c) => c.review_status === 'Verified').length;
  const pendingCount = clauses.filter((c) => c.review_status === 'Pending Evidence' || (!c.review_status && c.status?.includes('Confirmation'))).length;
  const underReviewCount = clauses.filter((c) => c.review_status === 'Under Review').length;
  const naCount = clauses.filter((c) => c.review_status === 'Not Applicable' || c.status?.includes('Not Applicable')).length;

  const categories = useMemo(() => {
    const set = new Set(clauses.map((c) => c.category));
    return Array.from(set);
  }, [clauses]);

  const filteredClauses = useMemo(() => {
    return clauses.filter((c) => {
      if (statusFilter !== 'all') {
        const currentReviewStatus = c.review_status || (c.status.includes('Complied') ? 'Verified' : c.status.includes('Not Applicable') ? 'Not Applicable' : 'Pending Evidence');
        if (currentReviewStatus !== statusFilter) return false;
      }

      if (categoryFilter !== 'all' && c.category !== categoryFilter) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesClause = c.clause.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesReq = c.requirement.toLowerCase().includes(q);
        const matchesLocation = c.website_location.toLowerCase().includes(q);
        if (!matchesClause && !matchesTitle && !matchesReq && !matchesLocation) return false;
      }

      return true;
    });
  }, [clauses, statusFilter, categoryFilter, search]);

  const handleOpenEdit = (clause: Reg46Item) => {
    setActiveClause(clause);
    setEditStatus(clause.review_status || (clause.status.includes('Complied') ? 'Verified' : clause.status.includes('Not Applicable') ? 'Not Applicable' : 'Pending Evidence'));
    setEditReviewer(clause.responsible_reviewer || 'Company Secretary & Compliance Officer');
    setEditReviewDate(clause.internal_review_date || '2026-10-15');
    setEditEvidenceLink(clause.evidence_link || '');
    setEditNotes(clause.compliance_notes || '');
    setEditReason('');
    setUpdateError(null);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClause) return;

    if (!editReason.trim() && !editNotes.trim()) {
      setUpdateError('A reason/justification is required to verify or modify regulatory compliance status.');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    try {
      await onUpdateClause(activeClause.id, {
        review_status: editStatus as any,
        responsible_reviewer: editReviewer,
        internal_review_date: editReviewDate,
        evidence_link: editEvidenceLink,
        compliance_notes: editNotes,
        reason: editReason || editNotes
      });
      setActiveClause(null);
    } catch (err: any) {
      setUpdateError(err.message || 'Error updating compliance clause.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getReviewStatusBadge = (clause: Reg46Item) => {
    const status = clause.review_status || (clause.status?.includes('Complied') ? 'Verified' : clause.status?.includes('Not Applicable') ? 'Not Applicable' : 'Pending Evidence');

    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-300">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Under Review</span>
          </span>
        );
      case 'Not Applicable':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
            <MinusCircle className="w-3 h-3 text-slate-400" />
            <span>Not Applicable</span>
          </span>
        );
      case 'Pending Evidence':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Pending Evidence</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Requirements</div>
          <div className="text-xl font-extrabold text-[#0A1128] mt-1">{totalCount} Clauses</div>
          <div className="text-[10px] text-slate-400 mt-0.5">SEBI (LODR) Reg 46 Index</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Status</span>
          </div>
          <div className="text-xl font-extrabold text-[#0A1128] mt-1">{verifiedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Evidence Countersigned</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Pending Evidence</span>
          </div>
          <div className="text-xl font-extrabold text-[#0A1128] mt-1">{pendingCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Awaiting CS Confirmation</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Review</span>
          </div>
          <div className="text-xl font-extrabold text-[#0A1128] mt-1">{underReviewCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">In Active Secretarial Audit</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Not Applicable</span>
          </div>
          <div className="text-xl font-extrabold text-[#0A1128] mt-1">{naCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">E.g. Subsidiary Disclosures</div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#0D9488]" />
              <span>Regulation 46 Compliance Master Index</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {filteredClauses.length} items
            </span>
          </div>

          <button
            onClick={onRefresh}
            title="Reload checklist"
            className="self-end sm:self-auto p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clause (e.g. 46(2)(a)), keyword..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-700 cursor-pointer"
            >
              <option value="all">Status: All Review States</option>
              <option value="Verified">Status: Verified</option>
              <option value="Pending Evidence">Status: Pending Evidence</option>
              <option value="Under Review">Status: Under Review</option>
              <option value="Not Applicable">Status: Not Applicable</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-700 cursor-pointer"
            >
              <option value="all">Category: All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Clause</th>
                <th className="py-3 px-4">Title & Statutory Requirement</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Website Location</th>
                <th className="py-3 px-3">Reviewer & Dates</th>
                <th className="py-3 px-3">Review Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0D9488]" />
                    <span>Loading checklist items...</span>
                  </td>
                </tr>
              ) : filteredClauses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>No clauses found matching your search criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredClauses.map((clause) => (
                  <tr key={clause.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Clause Code */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      <span className="font-bold text-[#0A1128] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        Reg {clause.clause}
                      </span>
                      {clause.sub_regulation && (
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5 truncate max-w-[100px]">
                          {clause.sub_regulation}
                        </div>
                      )}
                    </td>

                    {/* Title & Requirement */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-semibold text-[#0A1128]">
                        {clause.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-light">
                        {clause.requirement}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        Citation: {clause.legal_citation}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {clause.category}
                      </span>
                    </td>

                    {/* Website Location & Route */}
                    <td className="py-3 px-3 text-[11px]">
                      <div className="font-medium text-slate-700">{clause.website_location}</div>
                      <div className="text-[10px] font-mono text-[#0D9488] flex items-center gap-1 mt-0.5">
                        <span>Route: #{clause.target_route}</span>
                      </div>
                    </td>

                    {/* Reviewer & Dates */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                      <div className="text-slate-700 font-medium truncate max-w-[140px]">
                        {clause.responsible_reviewer || 'Company Secretary'}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>Rev: {clause.internal_review_date || '2026-10-15'}</span>
                      </div>
                      {clause.last_verified_date && (
                        <div className="text-[10px] text-emerald-700 font-medium">
                          Verified: {clause.last_verified_date}
                        </div>
                      )}
                    </td>

                    {/* Review Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getReviewStatusBadge(clause)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(clause)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: UPDATE COMPLIANCE STATUS */}
      {/* ======================================================== */}
      {activeClause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                  <span>Update Compliance Status: Reg {activeClause.clause}</span>
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
                  {activeClause.title}
                </div>
              </div>
              <button
                onClick={() => setActiveClause(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-5 space-y-3.5">
              {updateError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{updateError}</span>
                </div>
              )}

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700">Statutory Requirement:</span>
                <p className="text-slate-600 text-[11px]">{activeClause.requirement}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Target Route: #{activeClause.target_route} • Location: {activeClause.website_location}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Controlled Compliance Status *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                >
                  <option value="Verified">Verified (Evidence Verified & Countersigned)</option>
                  <option value="Pending Evidence">Pending Evidence (Awaiting Formal Documents)</option>
                  <option value="Under Review">Under Review (Under Active Secretarial Audit)</option>
                  <option value="Not Applicable">Not Applicable (Exempt / Inactive Condition)</option>
                  <option value="Not Reviewed">Not Reviewed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Responsible Reviewer *
                  </label>
                  <input
                    type="text"
                    required
                    value={editReviewer}
                    onChange={(e) => setEditReviewer(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internal Review Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editReviewDate}
                    onChange={(e) => setEditReviewDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Evidence / Verification Link
                </label>
                <input
                  type="text"
                  value={editEvidenceLink}
                  onChange={(e) => setEditEvidenceLink(e.target.value)}
                  placeholder="e.g. /uploads/asl_directors_appointment_letters.pdf"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Status Change / Reviewer Notes *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="Mandatory regulatory reason for changing status (logged to audit trail)..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveClause(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />}
                  <span>{isUpdating ? 'Saving...' : 'Authorize Status Change'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
