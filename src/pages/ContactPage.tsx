import React, { useState } from 'react';
import { PageRoute } from '../types';
import { COMPANY_DETAILS } from '../data/mockData';
import { TextReveal } from '../components/TextReveal';
import { ScrollReveal } from '../components/ScrollReveal';
import { AmarnathLogo } from '../components/AmarnathLogo';
import { 
  Building2, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate: _onNavigate }) => {
  const [formType, setFormType] = useState<'business' | 'investor'>('business');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceInterest: 'Corporate Finance & Advisory',
    estimatedCapital: '₹10 Cr - ₹50 Cr',
    details: ''
  });

  // Investor grievance form state
  const [investorForm, setInvestorForm] = useState({
    shareholderName: '',
    email: '',
    phone: '',
    folioOrDpId: '',
    category: 'Non-receipt of Annual Report / Financial Statements',
    queryText: ''
  });

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ref = `ASL-CORP-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRef(ref);
      setBusinessForm({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        serviceInterest: 'Corporate Finance & Advisory',
        estimatedCapital: '₹10 Cr - ₹50 Cr',
        details: ''
      });
    }, 800);
  };

  const handleInvestorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ref = `ASL-INV-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRef(ref);
      setInvestorForm({
        shareholderName: '',
        email: '',
        phone: '',
        folioOrDpId: '',
        category: 'Non-receipt of Annual Report / Financial Statements',
        queryText: ''
      });
    }, 800);
  };

  return (
    <div className="w-full bg-[#FAFBFD] text-[#0A1128] min-h-screen py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Corporate Liaison & Investor Helpdesk</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0A1128] tracking-tight">
            <TextReveal text="Connect with Amarnath Securities" delay={0.1} />
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Whether initiating a strategic capital mandate or seeking statutory shareholder assistance, our team provides prompt institutional engagement.
          </p>
        </div>

        {/* Main Grid: Forms on Left, Corporate Coordinates on Right */}
        <ScrollReveal direction="up" distance={20}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Container */}
            <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-8">
              {/* Form Toggle Tabs */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <button
                  onClick={() => {
                    setFormType('business');
                    setSubmittedRef(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    formType === 'business'
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-[#0A1128] hover:bg-slate-200 border border-slate-200'
                  }`}
                  id="tab-business-enquiry"
                >
                  Business & Advisory Enquiry
                </button>

                <button
                  onClick={() => {
                    setFormType('investor');
                    setSubmittedRef(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    formType === 'investor'
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-[#0A1128] hover:bg-slate-200 border border-slate-200'
                  }`}
                  id="tab-investor-desk"
                >
                  Investor Grievance & Helpdesk
                </button>
              </div>

              {/* Submission Confirmation Alert */}
              {submittedRef && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2"
                >
                  <div className="flex items-center gap-2 font-semibold text-sm text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Communication Dispatched Successfully</span>
                  </div>
                  <p>
                    Your reference identifier is <strong className="font-mono text-emerald-900">{submittedRef}</strong>. Our designated desk has acknowledged this transmission and will respond within 24–48 business hours.
                  </p>
                  <button
                    onClick={() => setSubmittedRef(null)}
                    className="text-[11px] underline text-emerald-700 hover:text-emerald-900 pt-1 cursor-pointer font-medium"
                  >
                    Submit another communication
                  </button>
                </motion.div>
              )}

              {/* BUSINESS ENQUIRY FORM */}
              {formType === 'business' && (
                <form onSubmit={handleBusinessSubmit} className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Company / Entity Name *</label>
                      <input
                        type="text"
                        required
                        value={businessForm.companyName}
                        onChange={(e) => setBusinessForm({ ...businessForm, companyName: e.target.value })}
                        placeholder="e.g. Apex Industrial Systems Ltd."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Principal Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={businessForm.contactPerson}
                        onChange={(e) => setBusinessForm({ ...businessForm, contactPerson: e.target.value })}
                        placeholder="e.g. Rajesh Shah (Director / CFO)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={businessForm.email}
                        onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Telephone / Mobile *</label>
                      <input
                        type="tel"
                        required
                        value={businessForm.phone}
                        onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Area of Advisory / Solution *</label>
                      <select
                        value={businessForm.serviceInterest}
                        onChange={(e) => setBusinessForm({ ...businessForm, serviceInterest: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] focus:outline-none focus:border-[#0D9488]"
                      >
                        <option value="Corporate Finance & Advisory">Corporate Finance & Advisory</option>
                        <option value="Merchant Banking">Merchant Banking & Rights Issue</option>
                        <option value="Investment Banking & Capital Raising">Investment Banking & Debt Syndication</option>
                        <option value="Securities & Investment Services">Securities & Treasury Services</option>
                        <option value="Corporate Lending & Financial Solutions">Corporate Lending / Bridge Finance</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Approx. Transaction Size</label>
                      <select
                        value={businessForm.estimatedCapital}
                        onChange={(e) => setBusinessForm({ ...businessForm, estimatedCapital: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] focus:outline-none focus:border-[#0D9488]"
                      >
                        <option value="₹5 Cr - ₹25 Cr">₹5 Cr - ₹25 Cr</option>
                        <option value="₹25 Cr - ₹100 Cr">₹25 Cr - ₹100 Cr</option>
                        <option value="₹100 Cr - ₹250 Cr">₹100 Cr - ₹250 Cr</option>
                        <option value="₹250 Cr+">Above ₹250 Cr</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-medium">Mandate Summary / Objectives *</label>
                    <textarea
                      required
                      rows={4}
                      value={businessForm.details}
                      onChange={(e) => setBusinessForm({ ...businessForm, details: e.target.value })}
                      placeholder="Briefly describe your company's balance sheet objectives, debt restructuring needs, or capital raising timeline..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl text-sm font-semibold bg-[#0A1128] hover:bg-[#0D9488] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Mandate...</span>
                      ) : (
                        <>
                          <span>Submit Corporate Advisory Request</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* INVESTOR GRIEVANCE FORM */}
              {formType === 'investor' && (
                <form onSubmit={handleInvestorSubmit} className="space-y-4 text-xs font-sans">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0" />
                    <span>Submissions are monitored by the Compliance Officer pursuant to Regulation 13 of SEBI (LODR) Regulations, 2015.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Shareholder / Investor Name *</label>
                      <input
                        type="text"
                        required
                        value={investorForm.shareholderName}
                        onChange={(e) => setInvestorForm({ ...investorForm, shareholderName: e.target.value })}
                        placeholder="As registered in demat/physical folio"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Folio No. / DP ID & Client ID *</label>
                      <input
                        type="text"
                        required
                        value={investorForm.folioOrDpId}
                        onChange={(e) => setInvestorForm({ ...investorForm, folioOrDpId: e.target.value })}
                        placeholder="e.g. IN300XXX-12345678 or Folio 00123"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Registered Email Address *</label>
                      <input
                        type="email"
                        required
                        value={investorForm.email}
                        onChange={(e) => setInvestorForm({ ...investorForm, email: e.target.value })}
                        placeholder="shareholder@email.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium">Contact Number *</label>
                      <input
                        type="tel"
                        required
                        value={investorForm.phone}
                        onChange={(e) => setInvestorForm({ ...investorForm, phone: e.target.value })}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-medium">Nature of Grievance / Query *</label>
                    <select
                      value={investorForm.category}
                      onChange={(e) => setInvestorForm({ ...investorForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] focus:outline-none focus:border-[#0D9488]"
                    >
                      <option value="Non-receipt of Annual Report / Financial Statements">Non-receipt of Annual Report / Financial Statements</option>
                      <option value="Dematerialization / Remat of Shares Query">Dematerialization / Remat of Shares Query</option>
                      <option value="Transmission / Name Correction in Share Records">Transmission / Name Correction in Share Records</option>
                      <option value="Dividend / Unclaimed Amount Status">Dividend / Unclaimed Amount Status</option>
                      <option value="Change of Address / Bank Mandate Updating">Change of Address / Bank Mandate Updating</option>
                      <option value="Other Statutory Clarifications">Other Statutory Clarifications</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-medium">Details of Query / Grievance *</label>
                    <textarea
                      required
                      rows={4}
                      value={investorForm.queryText}
                      onChange={(e) => setInvestorForm({ ...investorForm, queryText: e.target.value })}
                      placeholder="Provide certificate numbers, DRN numbers or relevant background..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl text-sm font-semibold bg-[#9A7B38] hover:bg-[#B38F46] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Filing with Compliance Desk...</span>
                      ) : (
                        <>
                          <span>Submit Investor Redressal Request</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Institutional Contacts & Offices */}
            <div className="lg:col-span-5 space-y-6">
              {/* Registered Office */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2.5 text-[#0D9488] font-semibold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Registered Office (Gujarat)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {COMPANY_DETAILS.regOffice}
                </p>
                <div className="text-[11px] font-mono text-slate-500">
                  Registrar of Companies: RoC Ahmedabad, Gujarat
                </div>
              </div>

              {/* Corporate Office */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-[#9A7B38] font-semibold text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>Corporate & Operations Center</span>
                  </div>
                  <AmarnathLogo size={28} variant="light" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {COMPANY_DETAILS.corpOffice}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-slate-100 font-mono text-xs">
                  <div>
                    <span className="text-slate-500">Official Email: </span>
                    <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-[#0D9488] hover:underline font-semibold">
                      {COMPANY_DETAILS.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500">Telephone Desk: </span>
                    <a href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, '')}`} className="text-[#0A1128] hover:underline">
                      {COMPANY_DETAILS.phone}
                    </a>
                  </div>
                  <div className="text-slate-400 text-[11px] pt-1">
                    Operating Hours: Mon – Fri (10:00 AM – 6:00 PM IST)
                  </div>
                </div>
              </div>

              {/* RTA Information */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2.5 text-[#2563EB] font-semibold text-sm">
                  <Building className="w-4 h-4" />
                  <span>Registrar & Share Transfer Agent (RTA)</span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="font-semibold text-[#0A1128]">{COMPANY_DETAILS.rtaName}</div>
                  <div>{COMPANY_DETAILS.rtaAddress}</div>
                  <div className="pt-2 font-mono text-[11px]">
                    <div>Tel: {COMPANY_DETAILS.rtaPhone}</div>
                    <div>Email: <a href={`mailto:${COMPANY_DETAILS.rtaEmail}`} className="text-[#0D9488] font-semibold">{COMPANY_DETAILS.rtaEmail}</a></div>
                  </div>
                </div>
              </div>

              {/* Regulatory Confirmation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[#0A1128] font-semibold block">BSE Scrip: 538465</span>
                  <span>Active Electronic Listing</span>
                </div>
                <a
                  href={COMPANY_DETAILS.bsePortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0D9488] hover:text-[#0A1128] flex items-center gap-1 font-mono text-[11px] font-semibold"
                >
                  <span>BSE Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
