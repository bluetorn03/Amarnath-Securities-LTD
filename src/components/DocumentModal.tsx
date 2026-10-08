import React from 'react';
import { InvestorDocument } from '../types';
import { COMPANY_DETAILS } from '../data/mockData';
import { 
  X, 
  Download, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  Hash, 
  ExternalLink,
  Layers,
  AlertCircle,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentModalProps {
  document: InvestorDocument | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  const resolvedSourceType = document.sourceType || 'upload';
  const isAvailable = document.isAvailable ?? Boolean(document.fileUrl);

  const getSourceTypeLabel = () => {
    switch (resolvedSourceType) {
      case 'upload':
        return 'Upload PDF';
      case 'file_url':
        return 'PDF File / URL';
      case 'external_url':
        return 'External URL';
      default:
        return 'Upload PDF';
    }
  };

  const handleNativeDownload = () => {
    if (!document.fileUrl || !isAvailable) return;
    const link = window.document.createElement('a');
    link.href = document.fileUrl;
    link.download = `${document.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60)}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleOpenPdf = () => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
        id="document-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-[#0A1128] my-8 font-sans"
          onClick={(e) => e.stopPropagation()}
          id="document-modal-container"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3 pr-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0D9488] shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-[#9A7B38] font-semibold">
                    {document.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#0D9488] font-semibold">
                    {document.financialYear}
                  </span>
                  {document.quarter && (
                    <span className="text-[11px] font-mono text-slate-500">
                      • {document.quarter}
                    </span>
                  )}
                  {/* CMS Source Type Badge */}
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>CMS Source: {getSourceTypeLabel()}</span>
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-[#0A1128] mt-1.5 leading-snug">
                  {document.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-[#0A1128] hover:bg-slate-200/70 transition-colors cursor-pointer"
              aria-label="Close modal"
              id="close-document-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-50/40 border-b border-slate-200 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#0D9488]" /> Dissemination Date
              </span>
              <span className="font-mono font-medium text-[#0A1128] mt-1">{document.filingDate}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <Hash className="w-3.5 h-3.5 text-[#9A7B38]" /> BSE Ack No.
              </span>
              <span className="font-mono font-medium text-slate-700 truncate mt-1" title={document.bseAckNumber}>
                {document.bseAckNumber}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-slate-500 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" /> SEBI LODR Clause
              </span>
              <span className="font-mono font-medium text-[#0A1128] mt-1">{document.sebiReference || 'Reg 30 LODR'}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-slate-500 font-medium">File Format & Size</span>
              <span className="font-mono font-medium text-slate-700 mt-1">{document.fileType} • {document.fileSize}</span>
            </div>
          </div>

          {/* Document Content / Preview / CMS Status */}
          <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
            {/* Availability Notification */}
            {!isAvailable ? (
              <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Physical Statutory Document Pending Upload (Company/CS Submission)</span>
                </div>
                <p className="text-amber-800/90 leading-relaxed">
                  This statutory record is listed pursuant to SEBI LODR disclosure requirements. The physical signed copy is currently being compiled from Company Secretarial archives for direct upload into the upcoming CMS repository. You may inspect exchange records on the official BSE Listing Portal below.
                </p>
              </div>
            ) : resolvedSourceType === 'external_url' ? (
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-blue-800">
                  <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>External Regulatory Portal Link</span>
                </div>
                <p className="text-blue-800/90 leading-relaxed">
                  This document is maintained directly on the official regulatory exchange portal. Use the action button below to open the authentic statutory record on BSE India.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200 text-teal-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-[#0D9488]">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Verified Document Ready for Viewing & Download</span>
                </div>
                <p className="text-teal-900/90 leading-relaxed">
                  Authentic statutory PDF document is verified and ready. You may preview the document in a new tab or trigger a direct download to your local drive.
                </p>
              </div>
            )}

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[#0D9488]' : 'bg-amber-500'}`}></div>
                  <span className="text-xs uppercase tracking-widest text-[#9A7B38] font-bold">
                    Statutory Filing Scope
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">BSE Scrip: 538465</span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {document.description}
              </p>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Regulatory Body:</span>
                  <span className="font-medium text-[#0A1128]">BSE Limited (Listing Centre)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Security Name:</span>
                  <span className="font-medium text-[#0A1128]">AMARNATH SECURITIES LIMITED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ISIN:</span>
                  <span className="font-mono text-[#0D9488] font-semibold">INE745P01010</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Corporate Identity (CIN):</span>
                  <span className="font-mono text-[#0A1128]">L67120GJ1994PLC023254</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">CMS Source Designation:</span>
                  <span className="font-mono text-slate-800 font-medium">{getSourceTypeLabel()}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 italic pt-1">
                Note: This filing has been archived under Regulation 46 of SEBI (LODR) Regulations, 2015 and remains available for public inspection.
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <a
              href={document.externalUrl || COMPANY_DETAILS.bsePortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0D9488] transition-colors"
              id="verify-bse-portal-link"
            >
              Verify on BSE Listing Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-slate-700 hover:text-[#0A1128] hover:bg-slate-200/60 border border-slate-200 transition-colors w-1/3 sm:w-auto text-center cursor-pointer"
                id="modal-cancel-btn"
              >
                Close
              </button>

              {/* Action Buttons depending on Source Type and Availability */}
              {resolvedSourceType === 'external_url' ? (
                <a
                  href={document.externalUrl || COMPANY_DETAILS.bsePortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#0A1128] hover:bg-[#0D9488] text-white shadow-xs transition-all w-2/3 sm:w-auto cursor-pointer"
                  id="modal-open-external-btn"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Official Document</span>
                </a>
              ) : isAvailable && document.fileUrl ? (
                <div className="flex items-center gap-2 w-2/3 sm:w-auto">
                  <button
                    onClick={handleOpenPdf}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                    id="modal-view-pdf-btn"
                    title="Open PDF in new tab"
                  >
                    <Eye className="w-4 h-4 text-[#0D9488]" />
                    <span>View PDF</span>
                  </button>
                  <button
                    onClick={handleNativeDownload}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#0A1128] hover:bg-[#0D9488] text-white shadow-xs transition-all cursor-pointer"
                    id="modal-download-btn"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF ({document.fileSize})</span>
                  </button>
                </div>
              ) : (
                <a
                  href={document.externalUrl || COMPANY_DETAILS.bsePortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all w-2/3 sm:w-auto cursor-pointer"
                  id="modal-bse-inspect-btn"
                  title="Inspect disclosure on BSE Listing Centre"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Inspect on BSE India</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
