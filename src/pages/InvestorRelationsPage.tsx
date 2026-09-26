import React, { useState, useMemo } from 'react';
import { PageRoute, InvestorDocument } from '../types';
import { 
  INVESTOR_DOCUMENTS, 
  COMPANY_DETAILS, 
  MARKET_TICKER_DATA, 
  SHAREHOLDING_BREAKDOWN, 
  REGULATION_46_CLAUSES 
} from '../data/mockData';
import { TextReveal } from '../components/TextReveal';
import { ScrollReveal } from '../components/ScrollReveal';
import { 
  Search, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Building,
  Mail,
  Layers
} from 'lucide-react';

interface InvestorRelationsPageProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onOpenDocument: (doc: InvestorDocument) => void;
}

export const InvestorRelationsPage: React.FC<InvestorRelationsPageProps> = ({
  currentRoute,
  onNavigate,
  onOpenDocument,
}) => {
  // Map route to active category tab if user navigated via direct link
  const initialCategory = useMemo(() => {
    switch (currentRoute) {
      case 'investor-relations/financial-results': return 'Financial Results';
      case 'investor-relations/annual-reports': return 'Annual Reports';
      case 'investor-relations/shareholding-pattern': return 'Shareholding Pattern';
      case 'investor-relations/bse-disclosures': return 'BSE Disclosures';
      case 'investor-relations/regulation-46': return 'Regulation 46';
      case 'investor-relations/agm-notices': return 'AGM / EGM / Notices';
      case 'investor-relations/policies': return 'Company Policies';
      case 'investor-relations/grievance': return 'Investor Grievance';
      case 'investor-relations/rta': return 'RTA';
      default: return 'All';
    }
  }, [currentRoute]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Update selectedCategory if route changes
  React.useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const categories = [
    'All',
    'Financial Results',
    'Annual Reports',
    'Shareholding Pattern',
    'BSE Disclosures',
    'Regulation 46',
    'AGM / EGM / Notices',
    'Company Policies',
    'Investor Grievance',
    'RTA'
  ];

  const financialYears = [
    'All',
    'FY 2025-26',
    'FY 2024-25',
    'FY 2023-24',
    'FY 2022-23',
    'FY 2021-22'
  ];

  const quarters = ['All', 'Q1', 'Q2', 'Q3', 'Q4', 'Annual'];

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return INVESTOR_DOCUMENTS.filter((doc) => {
      // Category filter
      if (selectedCategory !== 'All' && selectedCategory !== 'RTA' && doc.category !== selectedCategory) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'All' && doc.financialYear !== selectedYear) {
        return false;
      }

      // Quarter filter
      if (selectedQuarter !== 'All' && doc.quarter !== selectedQuarter) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(query);
        const matchDesc = doc.description.toLowerCase().includes(query);
        const matchAck = doc.bseAckNumber.toLowerCase().includes(query);
        const matchCat = doc.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchAck && !matchCat) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedYear, selectedQuarter, searchQuery]);

  return (
    <div className="w-full bg-[#FAFBFD] text-[#0A1128] min-h-screen py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SEBI LODR Compliance & Shareholder Relations</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0A1128] tracking-tight">
              <TextReveal text="Investor Relations Centre" delay={0.1} />
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Timely statutory filings, audited financials, corporate disclosures, and shareholder services for Amarnath Securities Limited (BSE: 538465).
            </p>
          </div>

          {/* Quick BSE Stat Capsule */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-4 shrink-0 font-mono text-xs shadow-2xs">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 font-semibold">BSE Scrip 538465</span>
              <span className="text-[#0A1128] font-bold text-base">₹{MARKET_TICKER_DATA.lastPrice.toFixed(2)}</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 font-semibold">ISIN Code</span>
              <span className="text-[#9A7B38] font-semibold">{COMPANY_DETAILS.isin}</span>
            </div>
            <a
              href={COMPANY_DETAILS.bsePortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#0A1128] transition-colors ml-2 cursor-pointer"
              title="Open BSE Portal"
            >
              <ExternalLink className="w-4 h-4 text-[#0D9488]" />
            </a>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                // Sync URL cleanly
                if (cat === 'All') onNavigate('investor-relations');
                else if (cat === 'Financial Results') onNavigate('investor-relations/financial-results');
                else if (cat === 'Annual Reports') onNavigate('investor-relations/annual-reports');
                else if (cat === 'Shareholding Pattern') onNavigate('investor-relations/shareholding-pattern');
                else if (cat === 'BSE Disclosures') onNavigate('investor-relations/bse-disclosures');
                else if (cat === 'Regulation 46') onNavigate('investor-relations/regulation-46');
                else if (cat === 'AGM / EGM / Notices') onNavigate('investor-relations/agm-notices');
                else if (cat === 'Company Policies') onNavigate('investor-relations/policies');
                else if (cat === 'Investor Grievance') onNavigate('investor-relations/grievance');
                else if (cat === 'RTA') onNavigate('investor-relations/rta');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0A1128] text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-700 hover:text-[#0A1128] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* =========================================================================
            SPECIAL VIEW: REGULATION 46 SEBI LODR MASTER INDEX
           ========================================================================= */}
        {selectedCategory === 'Regulation 46' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9A7B38] uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                <span>Statutory Mandate Index</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0A1128]">
                SEBI (LODR) Regulation 46 Compliance Repository
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                Pursuant to Regulation 46(2) of the Securities and Exchange Board of India (Listing Obligations and Disclosure Requirements) Regulations, 2015, listed entities are required to maintain a functional website containing the prescribed disclosures.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                      <th className="py-3 px-4 sm:px-6">Clause Ref</th>
                      <th className="py-3 px-4 sm:px-6">Prescribed Disclosure Requirement</th>
                      <th className="py-3 px-4 sm:px-6">Compliance Status</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Access Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {REGULATION_46_CLAUSES.map((clause, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-mono text-[#0D9488] font-semibold whitespace-nowrap">
                          Reg {clause.clause}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-[#0A1128] font-medium">
                          {clause.title}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono ${
                            clause.status.includes('Complied')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{clause.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => {
                              if (clause.clause.includes('46(2)(l)')) onNavigate('investor-relations/financial-results');
                              else if (clause.clause.includes('46(2)(m)')) onNavigate('investor-relations/shareholding-pattern');
                              else if (clause.clause.includes('46(2)(c)')) onNavigate('about/governance');
                              else onNavigate('investor-relations/policies');
                            }}
                            className="text-xs font-mono text-[#9A7B38] hover:text-[#0D9488] transition-colors inline-flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <span>{clause.linkText}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SPECIAL VIEW: SHAREHOLDING PATTERN BREAKDOWN
           ========================================================================= */}
        {selectedCategory === 'Shareholding Pattern' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Visual Breakdown */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-[#0A1128]">
                      Quarterly Shareholding Distribution
                    </h3>
                    <span className="text-xs text-slate-500">Quarter ended December 31, 2025 (Regulation 31)</span>
                  </div>
                  <span className="text-xs font-mono text-[#0D9488] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded font-semibold">
                    Total: 30,00,000 Shares
                  </span>
                </div>

                {/* Visual Proportion Bar */}
                <div className="h-6 w-full rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
                  {SHAREHOLDING_BREAKDOWN.map((item, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      title={`${item.category}: ${item.percentage}%`}
                      className="h-full transition-all hover:opacity-80"
                    />
                  ))}
                </div>

                {/* Breakdown List */}
                <div className="space-y-3 font-sans text-xs">
                  {SHAREHOLDING_BREAKDOWN.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-800 font-medium">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="text-slate-500">{item.shares.toLocaleString()} Shares</span>
                        <span className="text-[#0A1128] font-bold">{item.percentage.toFixed(2)}%</span>
                        <span className={`text-[10px] font-semibold ${item.changeQoQ.startsWith('+') ? 'text-emerald-600' : item.changeQoQ.startsWith('-') ? 'text-amber-600' : 'text-slate-400'}`}>
                          {item.changeQoQ}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Capital Structure */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 flex flex-col justify-between shadow-2xs">
                <div className="space-y-4">
                  <h3 className="font-display font-semibold text-lg text-[#0A1128]">
                    Share Capital Parameters
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Authorized Capital:</span>
                      <span className="text-[#0A1128] font-semibold">₹3,50,00,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Paid-Up Equity Capital:</span>
                      <span className="text-[#0D9488] font-bold">₹3,00,00,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Face Value:</span>
                      <span className="text-slate-700">₹10.00 per share</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Total Issued Shares:</span>
                      <span className="text-[#0A1128] font-semibold">30,00,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Promoter Holding:</span>
                      <span className="text-[#9A7B38] font-bold">49.50%</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">Public Float:</span>
                      <span className="text-slate-700">50.50%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const shpDoc = INVESTOR_DOCUMENTS.find(d => d.category === 'Shareholding Pattern');
                      if (shpDoc) onOpenDocument(shpDoc);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#0A1128] hover:bg-[#0D9488] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Latest BSE Clause 31 Filing</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SPECIAL VIEW: INVESTOR GRIEVANCE & ESCALATION MATRIX
           ========================================================================= */}
        {selectedCategory === 'Investor Grievance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Complaints Status Box */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="text-xs font-mono uppercase text-[#0D9488] tracking-wider flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Regulation 13(3) LODR Status</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-[#0A1128]">
                  Complaints Redressal Record
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Pending at beginning of Quarter:</span>
                    <span className="text-[#0A1128] font-semibold">0</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Received during Quarter:</span>
                    <span className="text-[#0A1128] font-semibold">1</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Disposed of during Quarter:</span>
                    <span className="text-emerald-600 font-bold">1</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Remaining Unresolved:</span>
                    <span className="text-emerald-600 font-bold">0</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                  ✓ 100% resolution compliance within SEBI mandated 21-day window.
                </div>
              </div>

              {/* Nodal Officer Contact */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="text-xs font-mono uppercase text-[#9A7B38] tracking-wider flex items-center gap-1.5 font-semibold">
                  <Mail className="w-4 h-4" />
                  <span>Designated Compliance Officer</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-[#0A1128]">
                  Investor Grievance Redressal Desk
                </h3>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    Shareholders may direct all statutory grievances, transmission requests, and queries to the Company Secretary & Compliance Officer.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-xs">
                    <div>Email: <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-[#0D9488] font-semibold">{COMPANY_DETAILS.email}</a></div>
                    <div>Phone: <a href={`tel:${COMPANY_DETAILS.phone}`} className="text-[#0A1128]">{COMPANY_DETAILS.phone}</a></div>
                    <div className="text-slate-500 text-[10px]">Response SLA: Within 48 business hours</div>
                  </div>
                </div>
              </div>

              {/* SEBI SCORES Portal Notice */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-[#2563EB] tracking-wider flex items-center gap-1.5 font-semibold">
                    <ExternalLink className="w-4 h-4" />
                    <span>SEBI SCORES 2.0</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#0A1128]">
                    SEBI Complaints Redress System
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Investors not satisfied with the company's response may lodge complaints directly on the SEBI SCORES Portal.
                  </p>
                </div>

                <a
                  href={COMPANY_DETAILS.sebiScoresUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#0A1128] text-white hover:bg-[#0D9488] transition-colors flex items-center justify-center gap-1.5 text-center cursor-pointer shadow-xs"
                >
                  <span>Visit SEBI SCORES Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SPECIAL VIEW: REGISTRAR & SHARE TRANSFER AGENT (RTA)
           ========================================================================= */}
        {selectedCategory === 'RTA' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* RTA Information */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0D9488]">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-[#9A7B38] font-semibold">SEBI Registered Category-I RTA</span>
                    <h3 className="font-display font-bold text-xl text-[#0A1128]">
                      {COMPANY_DETAILS.rtaName}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs text-slate-600">
                  <p className="leading-relaxed">
                    Purva Sharegistry (India) Pvt. Ltd. acts as the Registrar and Share Transfer Agent for Amarnath Securities Limited, handling both electronic dematerialized records and legacy physical shares.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
                    <div>
                      <strong className="text-[#0A1128] block font-sans">Office Address:</strong>
                      <span className="text-slate-700">{COMPANY_DETAILS.rtaAddress}</span>
                    </div>
                    <div>
                      <strong className="text-[#0A1128] block font-sans">Email Address:</strong>
                      <a href={`mailto:${COMPANY_DETAILS.rtaEmail}`} className="text-[#0D9488] font-semibold">{COMPANY_DETAILS.rtaEmail}</a>
                    </div>
                    <div>
                      <strong className="text-[#0A1128] block font-sans">Telephone Contact:</strong>
                      <span className="text-slate-700">{COMPANY_DETAILS.rtaPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical to Demat Step-by-Step Guidance */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-2xs">
                <h3 className="font-display font-semibold text-lg text-[#0A1128] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#0D9488]" />
                  <span>Mandatory Dematerialization Guidelines</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Pursuant to SEBI notifications, requests for effecting transfer of securities shall not be processed unless the securities are held in the dematerialized form with a depository (NSDL or CDSL).
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-mono text-[#0D9488] font-bold">01.</span>
                    <span className="text-slate-700">Submit original share certificates along with Demat Request Form (DRF) to your Depository Participant (DP).</span>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-mono text-[#9A7B38] font-bold">02.</span>
                    <span className="text-slate-700">DP generates an electronic Demat Request Number (DRN) and dispatches documents to Purva Sharegistry.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-mono text-[#2563EB] font-bold">03.</span>
                    <span className="text-slate-700">Upon signature & ownership verification, shares are credited electronically to your demat account under ISIN INE745P01010.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CORE DOCUMENT SEARCH & FILTER REPOSITORY
           ========================================================================= */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search filings, keyword, or BSE ack..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                  id="document-search-input"
                />
              </div>

              {/* Year & Quarter Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                {/* Year Select */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-mono">Year:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#0A1128] focus:outline-none focus:border-[#0D9488]"
                    id="year-filter-select"
                  >
                    {financialYears.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>

                {/* Quarter Select */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-mono">Quarter:</span>
                  <select
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#0A1128] focus:outline-none focus:border-[#0D9488]"
                    id="quarter-filter-select"
                  >
                    {quarters.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-white text-[#0A1128] shadow-2xs font-semibold' : 'text-slate-600 hover:text-[#0A1128]'
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                      viewMode === 'cards' ? 'bg-white text-[#0A1128] shadow-2xs font-semibold' : 'text-slate-600 hover:text-[#0A1128]'
                    }`}
                  >
                    Cards
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {(selectedCategory !== 'All' || selectedYear !== 'All' || selectedQuarter !== 'All' || searchQuery !== '') && (
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Active Filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="bg-teal-50 text-[#0D9488] px-2.5 py-0.5 rounded-lg font-mono text-[11px] border border-teal-200 font-semibold">
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedYear !== 'All' && (
                  <span className="bg-amber-50 text-[#9A7B38] px-2.5 py-0.5 rounded-lg font-mono text-[11px] border border-amber-200 font-semibold">
                    Year: {selectedYear}
                  </span>
                )}
                {selectedQuarter !== 'All' && (
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg font-mono text-[11px] border border-slate-200">
                    Quarter: {selectedQuarter}
                  </span>
                )}
                {searchQuery !== '' && (
                  <span className="bg-slate-100 text-[#0A1128] px-2.5 py-0.5 rounded-lg font-mono text-[11px] border border-slate-200">
                    Query: "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedYear('All');
                    setSelectedQuarter('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 ml-2 font-medium cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>

          {/* Results List */}
          {filteredDocuments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="font-display font-semibold text-lg text-[#0A1128]">No documents matched your criteria</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try expanding your year or quarter filter, or resetting search keywords to view all archived statutory disseminations.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedYear('All');
                  setSelectedQuarter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0A1128] text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* Tabular Document View */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                      <th className="py-3 px-4 sm:px-6">Document Title & Details</th>
                      <th className="py-3 px-4 sm:px-6">Category</th>
                      <th className="py-3 px-4 sm:px-6">Period</th>
                      <th className="py-3 px-4 sm:px-6">Filing Date</th>
                      <th className="py-3 px-4 sm:px-6">BSE Ack No.</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredDocuments.map((doc) => (
                      <tr 
                        key={doc.id} 
                        onClick={() => onOpenDocument(doc)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-4 sm:px-6 max-w-md">
                          <div className="font-medium text-[#0A1128] group-hover:text-[#0D9488] transition-colors leading-snug">
                            {doc.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {doc.description}
                          </div>
                        </td>

                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-[#9A7B38] font-semibold">
                            {doc.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-mono text-slate-600">
                          {doc.financialYear} {doc.quarter ? `(${doc.quarter})` : ''}
                        </td>

                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-mono text-slate-500">
                          {doc.filingDate}
                        </td>

                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-mono text-slate-500 truncate max-w-[140px]" title={doc.bseAckNumber}>
                          {doc.bseAckNumber}
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDocument(doc);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-[#0D9488] text-[#0D9488] hover:text-white border border-teal-200/80 transition-all font-semibold font-mono text-[11px] cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF ({doc.fileSize})</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Card Document View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onOpenDocument(doc)}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0D9488]/40 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-[#9A7B38] font-semibold">
                        {doc.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {doc.filingDate}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-base text-[#0A1128] group-hover:text-[#0D9488] transition-colors leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">{doc.financialYear}</span>
                    <span className="text-[#0D9488] font-medium flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>View ({doc.fileSize})</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
