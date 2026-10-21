import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useCompanyProfile } from '../context/CompanyProfileContext';
import { TextReveal } from '../components/TextReveal';
import { ScrollReveal } from '../components/ScrollReveal';
import { AmarnathLogo } from '../components/AmarnathLogo';
import { PrivacyModal } from '../components/PrivacyModal';
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
  const { profile: COMPANY_DETAILS } = useCompanyProfile();
  const [formType, setFormType] = useState<'business' | 'investor'>('business');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [businessConsent, setBusinessConsent] = useState(false);
  const [investorConsent, setInvestorConsent] = useState(false);

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

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessConsent) {
      setSubmitError('Please acknowledge the Privacy Notice and provide processing consent prior to transmitting this corporate mandate.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'business',
          name: businessForm.contactPerson,
          email: businessForm.email,
          phone: businessForm.phone,
          companyName: businessForm.companyName,
          serviceInterest: businessForm.serviceInterest,
          estimatedCapital: businessForm.estimatedCapital,
          details: businessForm.details || `Corporate engagement request for ${businessForm.serviceInterest}`
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }
      setSubmittedRef(data.referenceNo);
      setBusinessConsent(false);
      setBusinessForm({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        serviceInterest: 'Corporate Finance & Advisory',
        estimatedCapital: '₹10 Cr - ₹50 Cr',
        details: ''
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to submit enquiry. Please try again or email compliance@amarnathsecuritiesltd.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvestorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorConsent) {
      setSubmitError('Please acknowledge the Privacy Notice and provide processing consent prior to filing this grievance.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'investor',
          name: investorForm.shareholderName,
          email: investorForm.email,
          phone: investorForm.phone,
          folioOrDpId: investorForm.folioOrDpId,
          grievanceCategory: investorForm.category,
          details: investorForm.queryText || `Grievance filing: ${investorForm.category}`
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit grievance. Please try again.');
      }
      setSubmittedRef(data.referenceNo);
      setInvestorConsent(false);
      setInvestorForm({
        shareholderName: '',
        email: '',
        phone: '',
        folioOrDpId: '',
        category: 'Non-receipt of Annual Report / Financial Statements',
        queryText: ''
      });
    } catch (err: any) {
      setSubmitError(err.message || `Unable to submit grievance. Please contact RTA directly at ${COMPANY_DETAILS.rtaEmail || 'investor@bigshareonline.com'}.`);
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Main Grid: Forms on Left (Sticky), Corporate Coordinates on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Container: Sticky on desktop below sticky navbar (top-24), stops when parent grid ends */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-8 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-thin z-10">
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

              {submitError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <p className="font-semibold">Submission Notice</p>
                  <p>{submitError}</p>
                </div>
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
                      <label className="text-slate-700 font-medium">Area of Strategic Interest / Enquiry *</label>
                      <select
                        value={businessForm.serviceInterest}
                        onChange={(e) => setBusinessForm({ ...businessForm, serviceInterest: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0A1128] focus:outline-none focus:border-[#0D9488]"
                      >
                        <option value="Business Development">Business Development</option>
                        <option value="Mergers & Acquisitions">Mergers & Acquisitions</option>
                        <option value="Strategic Opportunities & Partnerships">Strategic Opportunities & Partnerships</option>
                        <option value="Corporate Evaluation & Advisory">Corporate Evaluation & Advisory</option>
                        <option value="General Corporate Enquiry">General Corporate Enquiry</option>
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

                  {/* Privacy & Consent Notice */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="business-privacy-consent"
                        required
                        checked={businessConsent}
                        onChange={(e) => setBusinessConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                      />
                      <label htmlFor="business-privacy-consent" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                        I consent to Amarnath Securities Limited collecting and processing the corporate details provided above solely for communicating regarding this advisory mandate, in accordance with the{' '}
                        <button
                          type="button"
                          onClick={() => setIsPrivacyOpen(true)}
                          className="text-[#0D9488] font-semibold underline hover:text-[#0A1128] cursor-pointer"
                        >
                          Privacy Notice
                        </button>.
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !businessConsent}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 ${
                        isSubmitting || !businessConsent
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-[#0A1128] hover:bg-[#0D9488] text-white cursor-pointer'
                      }`}
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

                  {/* Privacy & Consent Notice */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="investor-privacy-consent"
                        required
                        checked={investorConsent}
                        onChange={(e) => setInvestorConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#9A7B38] focus:ring-[#9A7B38] cursor-pointer"
                      />
                      <label htmlFor="investor-privacy-consent" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                        I consent to Amarnath Securities Limited and its Registrar & Share Transfer Agent processing my folio and contact data solely for investigating and resolving this statutory shareholder grievance, pursuant to the{' '}
                        <button
                          type="button"
                          onClick={() => setIsPrivacyOpen(true)}
                          className="text-[#9A7B38] font-semibold underline hover:text-[#0A1128] cursor-pointer"
                        >
                          Privacy Notice
                        </button>.
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !investorConsent}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 ${
                        isSubmitting || !investorConsent
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-[#9A7B38] hover:bg-[#B38F46] text-white cursor-pointer'
                      }`}
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
              {/* Corporate Headquarters & Physical Presence Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs aspect-16/9 bg-slate-100 group">
                <img
                  src="/images/contact-corporate-facade.webp"
                  alt="Amarnath Securities corporate headquarters exterior and investor liaison office"
                  width={1200}
                  height={675}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/80 via-[#0A1128]/20 to-transparent flex items-end p-5">
                  <div className="text-white space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#0D9488] font-bold block">
                      Institutional Coordinates
                    </span>
                    <p className="text-xs sm:text-sm font-display font-medium text-slate-100">
                      Corporate Headquarters & Registered Office
                    </p>
                  </div>
                </div>
              </div>

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
                    <span>Corporate Office</span>
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

              {/* Compliance Officer & Company Secretary Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2.5 text-[#0D9488] font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Company Secretary & Compliance Officer</span>
                </div>
                <div className="font-semibold text-[#0A1128] text-sm">{COMPANY_DETAILS.complianceOfficer}</div>
                <div className="text-xs text-slate-500 font-mono">{COMPANY_DETAILS.complianceDesignation}</div>
                <div className="space-y-1.5 pt-2 border-t border-slate-100 font-mono text-xs">
                  <div>
                    <span className="text-slate-500">Email: </span>
                    <a href={`mailto:${COMPANY_DETAILS.complianceEmail}`} className="text-[#0D9488] hover:underline font-semibold">
                      {COMPANY_DETAILS.complianceEmail}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone: </span>
                    <a href={`tel:${COMPANY_DETAILS.compliancePhone.replace(/\s+/g, '')}`} className="text-slate-800 hover:underline">
                      {COMPANY_DETAILS.compliancePhone}
                    </a>
                  </div>
                  <div className="text-slate-400 text-[10px] pt-1 font-sans">
                    Statutory liaison for Regulation 6 & Regulation 30 disclosures
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
                  <div className="pt-2 font-mono text-[11px] space-y-1">
                    <div>Tel: <a href={`tel:${COMPANY_DETAILS.rtaPhone.replace(/\s+/g, '')}`} className="text-slate-700 hover:text-[#0D9488]">{COMPANY_DETAILS.rtaPhone}</a></div>
                    <div>Email: <a href={`mailto:${COMPANY_DETAILS.rtaEmail}`} className="text-[#0D9488] font-semibold">{COMPANY_DETAILS.rtaEmail}</a></div>
                    <div>Web: <a href={COMPANY_DETAILS.rtaWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0D9488] hover:underline">{COMPANY_DETAILS.rtaWebsite}</a></div>
                  </div>
                </div>
              </div>

              {/* Official SEBI Portals: SCORES & SMART ODR */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B38] font-bold block">
                  Official Statutory Dispute Portals
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <a
                    href={COMPANY_DETAILS.sebiScoresUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col justify-between group"
                  >
                    <div>
                      <span className="font-semibold text-[#0A1128] block group-hover:text-[#0D9488]">SEBI SCORES 2.0</span>
                      <span className="text-[10px] text-slate-500">Centralized Grievance</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#0D9488] font-semibold mt-2">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>

                  <a
                    href={COMPANY_DETAILS.sebiSmartOdrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col justify-between group"
                  >
                    <div>
                      <span className="font-semibold text-[#0A1128] block group-hover:text-[#9A7B38]">SEBI SMART ODR</span>
                      <span className="text-[10px] text-slate-500">Online Resolution</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#9A7B38] font-semibold mt-2">
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
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
                  <span>BSE Listing Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
};
