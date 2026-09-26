import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentModalProps {
  document: InvestorDocument | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!document) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      // Generate actual downloadable blob text simulation
      const element = window.document.createElement('a');
      const fileContent = `========================================================================
AMARNATH SECURITIES LIMITED
CIN: ${COMPANY_DETAILS.cin} | BSE Scrip Code: ${COMPANY_DETAILS.bseScripCode}
Registered Office: ${COMPANY_DETAILS.regOffice}
========================================================================

DOCUMENT: ${document.title}
CATEGORY: ${document.category}
FINANCIAL YEAR: ${document.financialYear} ${document.quarter ? `(${document.quarter})` : ''}
DATE OF FILING: ${document.filingDate}
BSE ACKNOWLEDGEMENT NO: ${document.bseAckNumber}
STATUTORY COMPLIANCE: ${document.sebiReference || 'SEBI (LODR) Regulations, 2015'}

SUMMARY:
${document.description}

This document has been disseminated in compliance with the provisions of SEBI
(Listing Obligations and Disclosure Requirements) Regulations, 2015 and submitted
electronically to BSE Limited via the Listing Centre portal.

For Amarnath Securities Limited
Compliance Officer & Company Secretary
========================================================================`;

      const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${document.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)}.txt`;
      window.document.body.appendChild(element);
      element.click();
      window.document.body.removeChild(element);

      setTimeout(() => setDownloadSuccess(false), 3500);
    }, 750);
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
                </div>
                <h3 className="font-display font-semibold text-lg text-[#0A1128] mt-1 leading-snug">
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
              <span className="text-slate-500 font-medium">File Specification</span>
              <span className="font-mono font-medium text-slate-700 mt-1">{document.fileType} • {document.fileSize}</span>
            </div>
          </div>

          {/* Document Content / Simulated Viewer */}
          <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0D9488]"></div>
                  <span className="text-xs uppercase tracking-widest text-[#9A7B38] font-bold">
                    Statutory Filing Preview
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
              </div>

              <div className="text-xs text-slate-500 italic pt-1">
                Note: This filing has been archived under Regulation 46 of SEBI (LODR) Regulations, 2015 and remains available for public inspection.
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <a
              href={COMPANY_DETAILS.bsePortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0D9488] transition-colors"
            >
              Verify on BSE Listing Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-slate-700 hover:text-[#0A1128] hover:bg-slate-200/60 border border-slate-200 transition-colors w-1/2 sm:w-auto text-center cursor-pointer"
                id="modal-cancel-btn"
              >
                Close
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#0A1128] hover:bg-[#0D9488] text-white shadow-xs transition-all w-1/2 sm:w-auto cursor-pointer"
                id="modal-download-btn"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Preparing...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download {document.fileType} ({document.fileSize})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
