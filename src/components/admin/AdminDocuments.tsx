import React, { useState, useMemo } from 'react';
import { 
  InvestorDocument, 
  DocumentCategory, 
  DocumentVersionItem, 
  AdminUser 
} from '../../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Eye, 
  Download, 
  RefreshCw, 
  Edit3, 
  History, 
  Archive, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ExternalLink, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  FileUp,
  FileCheck2
} from 'lucide-react';

interface AdminDocumentsProps {
  documents: InvestorDocument[];
  loading: boolean;
  currentUser: AdminUser | null;
  onRefresh: () => void;
  categoryFilterOverride?: string;
  onOpenUploadModal: () => void;
  // Lifecycle API callbacks
  onApproveDoc: (id: string) => Promise<void>;
  onPublishDoc: (id: string) => Promise<void>;
  onUnpublishDoc: (id: string) => Promise<void>;
  onArchiveDoc: (id: string) => Promise<void>;
  onRestoreDoc: (id: string) => Promise<void>;
  onDeleteDoc: (id: string) => Promise<void>;
  onUpdateMetadata: (id: string, metadata: any) => Promise<void>;
  onReplaceFile: (id: string, file: File, summary: string) => Promise<void>;
}

const ITEMS_PER_PAGE = 8;

export const AdminDocuments: React.FC<AdminDocumentsProps> = ({
  documents,
  loading,
  currentUser,
  onRefresh,
  categoryFilterOverride,
  onOpenUploadModal,
  onApproveDoc,
  onPublishDoc,
  onUnpublishDoc,
  onArchiveDoc,
  onRestoreDoc,
  onDeleteDoc,
  onUpdateMetadata,
  onReplaceFile
}) => {
  // Search & Filter State
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(categoryFilterOverride || 'All');
  const [fyFilter, setFyFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active Modals
  const [previewDoc, setPreviewDoc] = useState<InvestorDocument | null>(null);
  const [editDoc, setEditDoc] = useState<InvestorDocument | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isUpdatingEdit, setIsUpdatingEdit] = useState<boolean>(false);

  const [replaceDoc, setReplaceDoc] = useState<InvestorDocument | null>(null);
  const [replaceFileObj, setReplaceFileObj] = useState<File | null>(null);
  const [replaceSummary, setReplaceSummary] = useState<string>('');
  const [isReplacing, setIsReplacing] = useState<boolean>(false);

  const [versionDoc, setVersionDoc] = useState<InvestorDocument | null>(null);
  const [versionList, setVersionList] = useState<DocumentVersionItem[]>([]);
  const [loadingVersions, setLoadingVersions] = useState<boolean>(false);

  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<InvestorDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [archiveConfirmDoc, setArchiveConfirmDoc] = useState<InvestorDocument | null>(null);
  const [isArchiving, setIsArchiving] = useState<boolean>(false);

  // Sync category filter if override prop changes
  React.useEffect(() => {
    if (categoryFilterOverride) {
      setCategoryFilter(categoryFilterOverride);
    }
  }, [categoryFilterOverride]);

  // Filtered List
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (categoryFilter !== 'All') {
        if (categoryFilter === 'Statutory Filings') {
          const statutoryCategories = ['Secretarial Compliance Report', 'Annual Return (MGT-7)', 'MOA & AOA', 'Statutory Disclosures'];
          if (!statutoryCategories.includes(doc.category)) return false;
        } else if (doc.category !== categoryFilter) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'published' && doc.status !== 'published') return false;
        if (statusFilter === 'review' && doc.status !== 'review') return false;
        if (statusFilter === 'draft' && doc.status !== 'draft') return false;
        if (statusFilter === 'archived' && doc.status !== 'archived') return false;
      }

      // FY filter
      if (fyFilter !== 'All' && doc.financialYear !== fyFilter) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesCategory = doc.category.toLowerCase().includes(q);
        const matchesAck = doc.bseAckNumber.toLowerCase().includes(q);
        const matchesDesc = doc.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesAck && !matchesDesc) return false;
      }

      return true;
    });
  }, [documents, categoryFilter, statusFilter, fyFilter, search]);

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDocs, currentPage]);

  // Fetch Version History for a Document
  const handleOpenVersions = async (doc: InvestorDocument) => {
    setVersionDoc(doc);
    setLoadingVersions(true);
    try {
      const res = await fetch(`/api/documents/${doc.id}/versions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('asl_admin_token')}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVersionList(data.data);
      }
    } catch (err) {
      console.error('Error fetching version history:', err);
    } finally {
      setLoadingVersions(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (doc: InvestorDocument) => {
    setEditDoc(doc);
    setEditFormData({
      title: doc.title,
      category: doc.category,
      financialYear: doc.financialYear,
      quarter: doc.quarter || 'N/A',
      filingDate: doc.filingDate,
      bseAckNumber: doc.bseAckNumber,
      description: doc.description || '',
      externalUrl: doc.externalUrl || '',
      sebiReference: doc.sebiReference || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoc || !editFormData) return;
    setIsUpdatingEdit(true);
    try {
      await onUpdateMetadata(editDoc.id, editFormData);
      setEditDoc(null);
    } finally {
      setIsUpdatingEdit(false);
    }
  };

  // Handle Replace File
  const handleConfirmReplace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceDoc || !replaceFileObj) return;
    setIsReplacing(true);
    try {
      await onReplaceFile(replaceDoc.id, replaceFileObj, replaceSummary || 'Statutory filing revised');
      setReplaceDoc(null);
      setReplaceFileObj(null);
      setReplaceSummary('');
    } finally {
      setIsReplacing(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmDoc) return;
    setIsDeleting(true);
    try {
      await onDeleteDoc(deleteConfirmDoc.id);
      setDeleteConfirmDoc(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Published</span>
          </span>
        );
      case 'review':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Under Review</span>
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
            <Archive className="w-3 h-3 text-slate-500" />
            <span>Archived</span>
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <Edit3 className="w-3 h-3 text-blue-600" />
            <span>Draft</span>
          </span>
        );
    }
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isComplianceOfficer = currentUser?.role === 'compliance_officer' || isSuperAdmin;
  const canEdit = currentUser?.role === 'editor' || isComplianceOfficer;

  return (
    <div className="space-y-5">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0A1128]">
              {categoryFilter !== 'All' ? categoryFilter : 'Document Repository'}
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {filteredDocs.length} {filteredDocs.length === 1 ? 'filing' : 'filings'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={onOpenUploadModal}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                <span>Upload New Filing</span>
              </button>
            )}
            <button
              onClick={onRefresh}
              title="Reload document list"
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0D9488]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search title, ack no, description..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488] focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488] text-slate-700 cursor-pointer"
            >
              <option value="all">Status: All Lifecycle States</option>
              <option value="published">Status: Published</option>
              <option value="review">Status: Under Review</option>
              <option value="draft">Status: Draft</option>
              <option value="archived">Status: Archived</option>
            </select>
          </div>

          {/* Category Filter (if not locked by specific route) */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488] text-slate-700 cursor-pointer"
            >
              <option value="All">Category: All Categories</option>
              <option value="Financial Results">Financial Results</option>
              <option value="Annual Reports">Annual Reports</option>
              <option value="Shareholding Pattern">Shareholding Pattern</option>
              <option value="BSE Disclosures">BSE Disclosures</option>
              <option value="AGM / EGM / Notices">AGM / EGM / Notices</option>
              <option value="Statutory Filings">Statutory Filings (MGT-7, Secretarial, MOA)</option>
              <option value="Newspaper Publications">Newspaper Publications</option>
              <option value="Company Policies">Company Policies</option>
              <option value="Corporate Governance">Corporate Governance</option>
            </select>
          </div>

          {/* Financial Year Filter */}
          <div>
            <select
              value={fyFilter}
              onChange={(e) => { setFyFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488] text-slate-700 cursor-pointer"
            >
              <option value="All">Period: All Financial Years</option>
              <option value="FY 2025-26">FY 2025-26</option>
              <option value="FY 2024-25">FY 2024-25</option>
              <option value="FY 2023-24">FY 2023-24</option>
              <option value="FY 2022-23">FY 2022-23</option>
              <option value="FY 2021-22">FY 2021-22</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Documents Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3">Filing Date</th>
                <th className="py-3 px-3">BSE Ack</th>
                <th className="py-3 px-3">File / Size</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0D9488]" />
                    <span>Loading verified statutory documents...</span>
                  </td>
                </tr>
              ) : paginatedDocs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>No regulatory filings found matching the selected filters.</span>
                  </td>
                </tr>
              ) : (
                paginatedDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Title */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-[#0A1128] line-clamp-1 group-hover:text-[#0D9488] transition-colors">
                        {doc.title}
                      </div>
                      {doc.description && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-light">
                          {doc.description}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {doc.category}
                      </span>
                    </td>

                    {/* Period */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      <div>{doc.financialYear}</div>
                      {doc.quarter && doc.quarter !== 'N/A' && (
                        <div className="text-[10px] text-slate-400">{doc.quarter}</div>
                      )}
                    </td>

                    {/* Filing Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-600">
                      {doc.filingDate}
                    </td>

                    {/* BSE Ack */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[10px] text-slate-500">
                      {doc.bseAckNumber || '—'}
                    </td>

                    {/* File / Size */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                      <div className="font-medium text-slate-700">{doc.fileType || 'PDF'}</div>
                      <div className="text-[10px] text-slate-400">{doc.fileSize || 'Pending'}</div>
                    </td>

                    {/* Version */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenVersions(doc)}
                        className="text-[10px] font-mono font-semibold text-[#0D9488] hover:underline flex items-center gap-1"
                        title="View semantic version history"
                      >
                        <History className="w-3 h-3" />
                        <span>{doc.version || 'v1.0'}</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Preview */}
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          title="Preview statutory PDF"
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Replace File */}
                        {canEdit && (
                          <button
                            onClick={() => { setReplaceDoc(doc); setReplaceFileObj(null); setReplaceSummary(''); }}
                            title="Replace Document File (Semantic Version Bump)"
                            className="p-1 text-slate-400 hover:text-[#0D9488] hover:bg-teal-50 rounded transition-colors"
                          >
                            <FileUp className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit Metadata */}
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            title="Edit Filing Metadata"
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Workflow State Transitions */}
                        {isComplianceOfficer && doc.status === 'draft' && (
                          <button
                            onClick={() => onPublishDoc(doc.id)}
                            title="Approve & Publish to Registry"
                            className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isComplianceOfficer && doc.status === 'published' && (
                          <button
                            onClick={() => setArchiveConfirmDoc(doc)}
                            title="Archive from Active Public Listing"
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isComplianceOfficer && doc.status === 'archived' && (
                          <button
                            onClick={() => onRestoreDoc(doc.id)}
                            title="Restore to Published State"
                            className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete (Super Admin only) */}
                        {isSuperAdmin && (
                          <button
                            onClick={() => setDeleteConfirmDoc(doc)}
                            title="Delete filing permanently"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Footer */}
        <div className="p-3 bg-[#FAFBFD] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{paginatedDocs.length}</strong> of{' '}
            <strong className="text-slate-800">{filteredDocs.length}</strong> filings
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: PREVIEW DOCUMENT MODAL */}
      {/* ======================================================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div className="min-w-0 pr-4">
                <h3 className="text-sm font-bold text-[#0A1128] truncate">{previewDoc.title}</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  BSE: {previewDoc.bseAckNumber || 'N/A'} • {previewDoc.version || 'v1.0'} • {previewDoc.financialYear}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {previewDoc.fileUrl && (
                  <a
                    href={previewDoc.fileUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Download</span>
                  </a>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-2 overflow-hidden flex items-center justify-center">
              {previewDoc.fileUrl ? (
                <iframe
                  src={previewDoc.fileUrl}
                  title={previewDoc.title}
                  className="w-full h-full rounded border border-slate-300 bg-white"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-slate-200 max-w-md">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800">No Direct File Uploaded</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    This filing is registered as a statutory reference. Use the Replace File action to upload a countersigned PDF.
                  </p>
                  {previewDoc.externalUrl && (
                    <a
                      href={previewDoc.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] hover:underline"
                    >
                      <span>Open External Reference</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: VERSION HISTORY MODAL */}
      {/* ======================================================== */}
      {versionDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#0D9488]" />
                  <span>Version Audit History</span>
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 truncate max-w-lg">
                  {versionDoc.title}
                </div>
              </div>
              <button
                onClick={() => setVersionDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
              {loadingVersions ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-[#0D9488]" />
                  <span>Loading version records...</span>
                </div>
              ) : versionList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <span>Version history initialized at Version 1.0 (Initial regulatory filing).</span>
                </div>
              ) : (
                versionList.map((ver) => (
                  <div key={ver.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0A1128] bg-white px-2 py-0.5 rounded border border-slate-200">
                        Version {ver.version}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(ver.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">
                      {ver.change_summary || 'Regulatory revision'}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>Attributed: {ver.created_by_name || 'Administrator'}</span>
                      {ver.file_url && (
                        <a
                          href={ver.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0D9488] font-semibold hover:underline flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download this version</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#FAFBFD] border-t border-slate-200 text-right">
              <button
                onClick={() => setVersionDoc(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: REPLACE DOCUMENT FILE MODAL */}
      {/* ======================================================== */}
      {replaceDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128] flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-[#0D9488]" />
                  <span>Replace Document File</span>
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
                  {replaceDoc.title}
                </div>
              </div>
              <button
                onClick={() => setReplaceDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReplace} className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                  <span>Semantic Version Increment</span>
                </div>
                <p className="text-[11px] text-teal-800">
                  Replacing the file automatically creates an immutable version snapshot of the current file and increments the document to the next version.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Statutory PDF Document *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setReplaceFileObj(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0A1128] file:text-white hover:file:bg-[#121c3b] cursor-pointer border border-slate-200 rounded-lg p-1.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason / Regulatory Change Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={replaceSummary}
                  onChange={(e) => setReplaceSummary(e.target.value)}
                  placeholder="e.g. Countersigned audit report replacing unconfirmed draft"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplaceDoc(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReplacing || !replaceFileObj}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {isReplacing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#C5A059]" />}
                  <span>{isReplacing ? 'Uploading...' : 'Confirm & Bump Version'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: EDIT METADATA MODAL */}
      {/* ======================================================== */}
      {editDoc && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFBFD]">
              <div>
                <h3 className="text-sm font-bold text-[#0A1128]">Edit Filing Metadata</h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">{editDoc.id}</div>
              </div>
              <button
                onClick={() => setEditDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  >
                    <option value="Financial Results">Financial Results</option>
                    <option value="Annual Reports">Annual Reports</option>
                    <option value="Shareholding Pattern">Shareholding Pattern</option>
                    <option value="BSE Disclosures">BSE Disclosures</option>
                    <option value="AGM / EGM / Notices">AGM / EGM / Notices</option>
                    <option value="Secretarial Compliance Report">Secretarial Compliance Report</option>
                    <option value="Annual Return (MGT-7)">Annual Return (MGT-7)</option>
                    <option value="MOA & AOA">MOA & AOA</option>
                    <option value="Newspaper Publications">Newspaper Publications</option>
                    <option value="Company Policies">Company Policies</option>
                    <option value="Corporate Governance">Corporate Governance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Financial Year *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.financialYear}
                    onChange={(e) => setEditFormData({ ...editFormData, financialYear: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Filing Date *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.filingDate}
                    onChange={(e) => setEditFormData({ ...editFormData, filingDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">BSE Ack Number *</label>
                  <input
                    type="text"
                    value={editFormData.bseAckNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, bseAckNumber: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditDoc(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingEdit}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#121c3b] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUpdatingEdit ? 'Saving...' : 'Save Metadata'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deleteConfirmDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 p-5 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A1128]">Delete Regulatory Filing</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete <strong className="text-slate-800 font-semibold">{deleteConfirmDoc.title}</strong>? All associated version snapshots and statutory records will be purged. This action is irreversible.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmDoc(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL 6: ARCHIVE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {archiveConfirmDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 p-5 space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A1128]">Archive Regulatory Document</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to archive <strong className="text-slate-800 font-semibold">{archiveConfirmDoc.title}</strong>? It will be removed from the active public portal but retained in the statutory audit archive.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setArchiveConfirmDoc(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsArchiving(true);
                  try {
                    await onArchiveDoc(archiveConfirmDoc.id);
                    setArchiveConfirmDoc(null);
                  } finally {
                    setIsArchiving(false);
                  }
                }}
                disabled={isArchiving}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isArchiving ? 'Archiving...' : 'Confirm Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
