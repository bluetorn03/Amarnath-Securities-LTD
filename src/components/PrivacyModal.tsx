import React from 'react';
import { X, Shield, Lock, FileText, CheckCircle2, AlertCircle, Building2, UserCheck } from 'lucide-react';
import { useCompanyProfile } from '../context/CompanyProfileContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useCompanyProfile();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[88vh] bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-policy-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 bg-[#0A1128] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 id="privacy-policy-title" className="font-display text-lg font-bold text-white tracking-tight">
                Privacy Notice & Data Processing Disclosures
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Amarnath Securities Limited • CIN: {profile.cin}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Privacy Notice"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed scrollbar-thin">
          {/* Statutory Disclaimer & Overview Banner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-950">Statutory Notice & Scope:</strong>
              <p className="mt-0.5 text-amber-900/90 leading-normal">
                This notice sets forth the data collection, privacy safeguards, and processing controls implemented by Amarnath Securities Limited (&quot;the Company&quot;). Full legal certification under the Digital Personal Data Protection Act, 2023 (DPDP) remains subject to central government rule notifications and independent legal review.
              </p>
            </div>
          </div>

          {/* Section 1: Data Fiduciary Identity */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold text-[#0A1128] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>1. Identity of Data Fiduciary</span>
            </h4>
            <p>
              <strong>Amarnath Securities Limited</strong> (BSE Scrip Code: 538465, CIN: {profile.cin}, ISIN: {profile.isin}), having its Registered Office at {profile.regOffice}, acts as the Data Fiduciary for personal data submitted through this portal.
            </p>
          </div>

          {/* Section 2: Data Categories Collected */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold text-[#0A1128] flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>2. Specific Data Categories Collected</span>
            </h4>
            <p>We process only such personal data as is directly provided by you for verified business or statutory purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>Corporate Advisory Enquiries:</strong> Name, professional email address, telephone/mobile number, company name, area of strategic interest, and transaction mandate background.
              </li>
              <li>
                <strong>Shareholder Grievances:</strong> Shareholder name, registered email, contact telephone, Folio Number or DP ID / Client ID, grievance classification, and details of enquiry under Regulation 13 of SEBI (LODR) Regulations, 2015.
              </li>
              <li>
                <strong>Technical Telemetry:</strong> Aggregate, deduplicated page visits. Web telemetry masks the client host IP address to protect individual browsing confidentiality.
              </li>
            </ul>
          </div>

          {/* Section 3: Purpose of Processing */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold text-[#0A1128] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>3. Lawful Purposes of Processing</span>
            </h4>
            <p>Your personal data is collected and processed exclusively for:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Evaluating and responding to commercial corporate advisory and strategic mandates.</li>
              <li>Facilitating prompt resolution and secretarial recording of investor grievances pursuant to SEBI (LODR) Regulations, 2015.</li>
              <li>Maintaining immutable audit logs for regulatory accountability and preventing system abuse.</li>
              <li><strong>Zero Commercial Monetization:</strong> We do NOT sell, rent, monetize, or disclose personal data to advertising networks or third-party marketing brokers.</li>
            </ul>
          </div>

          {/* Section 4: Data Security & Administrative Access */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold text-[#0A1128] flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>4. Data Security & Role-Based Access Controls (RBAC)</span>
            </h4>
            <p>
              We implement comprehensive technical and organizational safeguards:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>All database connections are managed via parameterized SQL queries with zero untrusted concatenation to prevent SQL injection.</li>
              <li>Administrative access to enquiries and investor records is strictly restricted using encrypted JWT sessions and role-based permissions (Super Admin and Compliance Officer only).</li>
              <li>System audit trails record administrative actions with an automated 1-year data hygiene retention policy.</li>
              <li>Encrypted HTTPS transmission and Content Security Policy (CSP) headers protect client sessions.</li>
            </ul>
          </div>

          {/* Section 5: Data Retention & Principal Rights */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold text-[#0A1128] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>5. Data Retention & Data Principal Rights</span>
            </h4>
            <p>
              Corporate enquiries are retained for active communication and subsequent statutory review. Shareholder grievance filings are archived in accordance with statutory SEBI secretarial preservation periods.
            </p>
            <p>
              As a Data Principal, you are entitled to request clarification regarding your submitted data, seek correction of inaccurate contact records, or request administrative erasure, subject to mandatory statutory and secretarial record-keeping obligations.
            </p>
          </div>

          {/* Section 6: Grievance Redressal & Contact Officer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
            <strong className="text-slate-900 block font-semibold">Grievance Redressal & Data Privacy Contact:</strong>
            <p>Company Secretary & Compliance Officer</p>
            <p>Amarnath Securities Limited</p>
            <p>Registered Office: {profile.regOffice}</p>
            <p>Email: <a href={`mailto:${profile.complianceEmail}`} className="text-teal-700 font-medium underline">{profile.complianceEmail}</a> | Official: <a href={`mailto:${profile.email}`} className="text-teal-700 font-medium underline">{profile.email}</a></p>
            <p>Telephone: <span className="font-mono">{profile.compliancePhone || profile.phone}</span></p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <span className="text-[11px] text-slate-600 font-mono">
            Last Updated: October 2026 • Version 2.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0A1128] hover:bg-teal-700 text-white transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
