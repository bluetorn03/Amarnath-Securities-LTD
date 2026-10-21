import React, { useState, useMemo, useEffect } from 'react';
import { PageRoute, InvestorDocument, Reg46Category } from '../types';
import { 
  INVESTOR_DOCUMENTS, 
  MARKET_TICKER_DATA, 
  SHAREHOLDING_BREAKDOWN, 
  REGULATION_46_MASTER_INDEX,
  DIRECTORS_REGISTRY,
  BOARD_COMMITTEES_REGISTRY,
  KMP_CONTACTS_REGISTRY,
  ANALYST_MEETS_REGISTRY,
  NEWSPAPER_PUBLICATIONS_REGISTRY,
  DISCLOSURES_POLICIES_OVERVIEW 
} from '../data/mockData';
import { useCompanyProfile } from '../context/CompanyProfileContext';
import { TextReveal } from '../components/TextReveal';
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
  Layers,
  Scale,
  Users,
  Phone,
  Calendar,
  AlertCircle,
  Video,
  Mic,
  Newspaper,
  BookOpen,
  UserCheck,
  Building2,
  FileCheck2,
  HelpCircle,
  Info
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
  const { profile: COMPANY_DETAILS } = useCompanyProfile();
  // Map incoming route to active category tab
  const getInitialTab = (route: PageRoute): string => {
    switch (route) {
      case 'investor-relations/regulation-46': return 'Regulation 46 Index';
      case 'investor-relations/board-of-directors': return 'Board of Directors';
      case 'investor-relations/committees': return 'Board Committees';
      case 'investor-relations/financial-results': return 'Financial Results';
      case 'investor-relations/annual-reports': return 'Annual Reports';
      case 'investor-relations/shareholding-pattern': return 'Shareholding Pattern';
      case 'investor-relations/bse-disclosures': return 'BSE Disclosures';
      case 'investor-relations/newspaper-publications': return 'Newspaper Publications';
      case 'investor-relations/annual-return': return 'Annual Return (MGT-7)';
      case 'investor-relations/secretarial-compliance': return 'Secretarial Compliance';
      case 'investor-relations/policies':
      case 'investor-relations/disclosures-policies': return 'Policies & Charters';
      case 'investor-relations/analyst-meets': return 'Analyst & Investor Meets';
      case 'investor-relations/kmp-contacts': return 'Key Managerial Personnel';
      case 'investor-relations/governance': return 'Corporate Governance';
      case 'investor-relations/grievance': return 'Investor Grievance & SCORES';
      case 'investor-relations/rta': return 'RTA & Dematerialization';
      default: return 'All Filings';
    }
  };

  const [activeTab, setActiveTab] = useState<string>(() => getInitialTab(currentRoute));
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('All');
  const [documentCategoryFilter, setDocumentCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Regulation 46 Index specific filters
  const [reg46CategoryFilter, setReg46CategoryFilter] = useState<string>('All');
  const [reg46SearchQuery, setReg46SearchQuery] = useState<string>('');

  // Synchronize when currentRoute changes from external navigation
  useEffect(() => {
    setActiveTab(getInitialTab(currentRoute));
  }, [currentRoute]);

  const categories = [
    { id: 'All Filings', label: 'All Filings', route: 'investor-relations' as PageRoute },
    { id: 'Regulation 46 Index', label: 'Regulation 46 Compliance', badge: 'SEBI LODR', route: 'investor-relations/regulation-46' as PageRoute },
    { id: 'Board of Directors', label: 'Board of Directors', route: 'investor-relations/board-of-directors' as PageRoute },
    { id: 'Board Committees', label: 'Board Committees', route: 'investor-relations/committees' as PageRoute },
    { id: 'Policies & Charters', label: 'Policies & Disclosures', route: 'investor-relations/policies' as PageRoute },
    { id: 'Financial Results', label: 'Financial Results', route: 'investor-relations/financial-results' as PageRoute },
    { id: 'Annual Reports', label: 'Annual Reports', route: 'investor-relations/annual-reports' as PageRoute },
    { id: 'Shareholding Pattern', label: 'Shareholding Pattern', route: 'investor-relations/shareholding-pattern' as PageRoute },
    { id: 'BSE Disclosures', label: 'BSE Disclosures (Reg 30)', route: 'investor-relations/bse-disclosures' as PageRoute },
    { id: 'Newspaper Publications', label: 'Newspaper Publications (Reg 47)', route: 'investor-relations/newspaper-publications' as PageRoute },
    { id: 'Annual Return (MGT-7)', label: 'Annual Return (MGT-7)', route: 'investor-relations/annual-return' as PageRoute },
    { id: 'Secretarial Compliance', label: 'Secretarial Compliance (Reg 24A)', route: 'investor-relations/secretarial-compliance' as PageRoute },
    { id: 'Analyst & Investor Meets', label: 'Analyst & Investor Meets', route: 'investor-relations/analyst-meets' as PageRoute },
    { id: 'Corporate Governance', label: 'Corporate Governance', route: 'investor-relations/governance' as PageRoute },
    { id: 'Key Managerial Personnel', label: 'Key Managerial Personnel (Reg 30(5))', route: 'investor-relations/kmp-contacts' as PageRoute },
    { id: 'Investor Grievance & SCORES', label: 'Investor Grievance & Redressal', route: 'investor-relations/grievance' as PageRoute },
    { id: 'RTA & Dematerialization', label: 'Registrar & Transfer Agent (RTA)', route: 'investor-relations/rta' as PageRoute },
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

  // Live states initialized with verified repository baseline
  const [liveDocuments, setLiveDocuments] = useState<InvestorDocument[]>(INVESTOR_DOCUMENTS);
  const [liveDirectors, setLiveDirectors] = useState<any[]>(DIRECTORS_REGISTRY);
  const [liveCommittees, setLiveCommittees] = useState<any[]>(BOARD_COMMITTEES_REGISTRY);
  const [liveKmp, setLiveKmp] = useState<any[]>(KMP_CONTACTS_REGISTRY);
  const [liveReg46, setLiveReg46] = useState<any[]>(REGULATION_46_MASTER_INDEX);
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setIsLoadingDocs(true);

    // 1. Live Documents
    fetch('/api/documents', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLiveDocuments(data.data);
        }
      })
      .catch((err) => console.warn('API document fetch fallback:', err))
      .finally(() => {
        if (active) setIsLoadingDocs(false);
      });

    // 2. Live Directors
    fetch('/api/content/directors', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLiveDirectors(data.data);
        }
      })
      .catch((err) => console.warn('API directors fetch fallback:', err));

    // 3. Live Committees
    fetch('/api/content/committees', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLiveCommittees(data.data);
        }
      })
      .catch((err) => console.warn('API committees fetch fallback:', err));

    // 4. Live KMP Contacts
    fetch('/api/content/kmp', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLiveKmp(data.data);
        }
      })
      .catch((err) => console.warn('API KMP fetch fallback:', err));

    // 5. Live Regulation 46 Clauses
    fetch('/api/content/regulation-46', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLiveReg46(data.data);
        }
      })
      .catch((err) => console.warn('API Regulation 46 fetch fallback:', err));

    return () => { active = false; };
  }, []);

  // Filtered documents for the Document Library
  const filteredDocuments = useMemo(() => {
    return liveDocuments.filter((doc) => {
      // If a specific subtab is active, constrain to that category
      if (activeTab === 'Financial Results' && doc.category !== 'Financial Results') return false;
      if (activeTab === 'Annual Reports' && doc.category !== 'Annual Reports') return false;
      if (activeTab === 'Shareholding Pattern' && doc.category !== 'Shareholding Pattern') return false;
      if (activeTab === 'BSE Disclosures' && doc.category !== 'BSE Disclosures') return false;
      if (activeTab === 'Newspaper Publications' && doc.category !== 'Newspaper Publications') return false;
      if (activeTab === 'Annual Return (MGT-7)' && doc.category !== 'Annual Return (MGT-7)') return false;
      if (activeTab === 'Secretarial Compliance' && doc.category !== 'Secretarial Compliance Report') return false;
      if (activeTab === 'Corporate Governance' && doc.category !== 'Corporate Governance') return false;
      if (activeTab === 'Policies & Charters' && (doc.category !== 'Company Policies' && doc.category !== 'MOA & AOA' && doc.category !== 'Disclosures & Policies')) return false;

      // Dropdown filter within 'All Filings'
      if (activeTab === 'All Filings' && documentCategoryFilter !== 'All') {
        if (doc.category !== documentCategoryFilter) return false;
      }

      // Year filter
      if (selectedYear !== 'All' && doc.financialYear !== selectedYear) return false;

      // Quarter filter
      if (selectedQuarter !== 'All' && doc.quarter !== selectedQuarter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(query);
        const matchDesc = doc.description.toLowerCase().includes(query);
        const matchAck = doc.bseAckNumber.toLowerCase().includes(query);
        const matchCat = doc.category.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchAck && !matchCat) return false;
      }

      return true;
    });
  }, [liveDocuments, activeTab, documentCategoryFilter, selectedYear, selectedQuarter, searchQuery]);

  // Filtered Regulation 46 Master Clauses
  const filteredReg46Clauses = useMemo(() => {
    return liveReg46.filter((clause) => {
      if (reg46CategoryFilter !== 'All' && clause.category !== reg46CategoryFilter) {
        return false;
      }
      if (reg46SearchQuery.trim() !== '') {
        const q = reg46SearchQuery.toLowerCase();
        const matchClause = (clause.clause || '').toLowerCase().includes(q);
        const matchTitle = (clause.title || '').toLowerCase().includes(q);
        const matchReq = (clause.requirement || '').toLowerCase().includes(q);
        const matchLoc = (clause.websiteLocation || clause.website_location || '').toLowerCase().includes(q);
        const matchCit = (clause.legalCitation || clause.legal_citation || '').toLowerCase().includes(q);
        if (!matchClause && !matchTitle && !matchReq && !matchLoc && !matchCit) {
          return false;
        }
      }
      return true;
    });
  }, [liveReg46, reg46CategoryFilter, reg46SearchQuery]);

  const handleTabChange = (cat: typeof categories[0]) => {
    setActiveTab(cat.id);
    onNavigate(cat.route);
  };

  return (
    <div className="w-full bg-[#FAFBFD] text-[#0A1128] min-h-screen py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Institutional Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SEBI (LODR) Regulation 46 • Investor Relations & Statutory Disclosures</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0A1128] tracking-tight">
              <TextReveal text="Investor Relations & Compliance Hub" delay={0.1} />
            </h1>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Amarnath Securities Limited is dedicated to transparent communication with its shareholders and regulatory bodies. This portal disseminates all mandatory website disclosures prescribed under Regulation 46 of SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015 and the Companies Act, 2013.
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
              title="Open Official BSE Portal"
            >
              <ExternalLink className="w-4 h-4 text-[#0D9488]" />
            </a>
          </div>
        </div>

        {/* Capital Markets & Regulatory Governance Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs bg-slate-900">
          <div className="relative aspect-21/9 sm:aspect-28/9 min-h-[160px] sm:min-h-[200px] overflow-hidden">
            <img
              src="/images/investor-relations-exchange.webp"
              alt="Institutional securities exchange architecture representing BSE listing and SEBI Regulation 46 compliance"
              width={1200}
              height={675}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128]/95 via-[#0A1128]/75 to-transparent flex items-center p-6 sm:p-8">
              <div className="max-w-xl space-y-1.5 text-white">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#9A7B38] font-bold">
                  <span>BSE SCRIP: 538465</span>
                  <span>•</span>
                  <span>ESTD 1994</span>
                  <span>•</span>
                  <span className="text-[#0D9488]">SEBI LODR COMPLIANT</span>
                </div>
                <h2 className="font-display text-lg sm:text-2xl font-bold text-white tracking-tight">
                  Statutory Transparency & Capital Markets Governance
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed hidden sm:block">
                  Disseminating mandatory filings, audited financial results, shareholding patterns, and compliance policies in full adherence to SEBI Regulation 46.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Master Navigation Pills / Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin border-b border-slate-200">
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0A1128] text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-700 hover:text-[#0A1128] hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isSelected ? 'bg-amber-400 text-slate-900' : 'bg-teal-50 text-[#0D9488] border border-teal-200'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            SECTION 1: DEDICATED REGULATION 46 COMPLIANCE MASTER INDEX
            ========================================================================= */}
        {activeTab === 'Regulation 46 Index' && (
          <div className="space-y-6">
            {/* Header & Stat Summary */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9A7B38] uppercase tracking-wider font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                    <span>Statutory Compliance Matrix • SEBI LODR Regulation 46</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                    Regulation 46 Website Disclosures Master Index
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Pursuant to Regulation 46(1), 46(2) Clauses (a) through (za), and 46(3) of the Securities and Exchange Board of India (Listing Obligations and Disclosure Requirements) Regulations, 2015, listed entities are mandated to disseminate continuous disclosures under a separate section on their website.
                  </p>
                </div>

                {/* Audit Capsule Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-lg font-bold text-[#0A1128]">{liveReg46.length}</div>
                    <div className="text-[10px] text-slate-500 uppercase">Clauses Audited</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-lg font-bold text-emerald-700">100%</div>
                    <div className="text-[10px] text-emerald-600 uppercase">Scope Mapped</div>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-center col-span-2 sm:col-span-1">
                    <div className="text-lg font-bold text-[#0D9488]">2 Days</div>
                    <div className="text-[10px] text-[#0D9488] uppercase">Update SLA (Reg 46(3))</div>
                  </div>
                </div>
              </div>

              {/* Regulatory Notice Banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Verification Transparency:</strong> Compliance statuses reflect current verified secretarial records and statutory filings submitted electronically to BSE Limited. Items subject to upcoming company filings or secretarial records are clearly demarcated.
                </span>
              </div>
            </div>

            {/* Filter & Search Bar for Reg 46 Index */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={reg46SearchQuery}
                  onChange={(e) => setReg46SearchQuery(e.target.value)}
                  placeholder="Search clause (e.g. 46(2)(a), business, independent, RPT)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                  id="reg46-search-input"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xs text-slate-500 font-mono shrink-0">Category Filter:</span>
                <select
                  value={reg46CategoryFilter}
                  onChange={(e) => setReg46CategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A1128] focus:outline-none focus:border-[#0D9488]"
                  id="reg46-category-select"
                >
                  <option value="All">All Categories ({liveReg46.length})</option>
                  <option value="General Business">General Business</option>
                  <option value="Charter & Incorporation">Charter & Incorporation</option>
                  <option value="Board & Governance">Board & Governance</option>
                  <option value="Statutory Policies">Statutory Policies</option>
                  <option value="Financial Disclosures">Financial Disclosures</option>
                  <option value="Shareholding">Shareholding</option>
                  <option value="Public Relations & Analyst Meets">Public Relations & Analyst Meets</option>
                  <option value="Newspaper Publications">Newspaper Publications</option>
                  <option value="Compliance & Secretarial Filings">Compliance & Secretarial Filings</option>
                  <option value="Investor Redressal & Contacts">Investor Redressal & Contacts</option>
                  <option value="Website Governance">Website Governance</option>
                </select>

                {(reg46CategoryFilter !== 'All' || reg46SearchQuery !== '') && (
                  <button
                    onClick={() => {
                      setReg46CategoryFilter('All');
                      setReg46SearchQuery('');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 cursor-pointer shrink-0"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Master Compliance Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                      <th className="py-3 px-4 sm:px-6 w-32">Clause Ref</th>
                      <th className="py-3 px-4 sm:px-6">Prescribed Requirement & Statutory Mandate</th>
                      <th className="py-3 px-4 sm:px-6 w-48">Website Location</th>
                      <th className="py-3 px-4 sm:px-6 w-52">Compliance Status</th>
                      <th className="py-3 px-4 sm:px-6 text-right w-40">Direct Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredReg46Clauses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No Regulation 46 clauses matched your search query or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredReg46Clauses.map((item, idx) => {
                        const isVerified = item.review_status === 'Verified' || item.reviewStatus === 'Verified';
                        const isComplied = isVerified || (item.status && (item.status.includes('Complied') || item.status.includes('Verified') || item.status.includes('Continuous')));
                        const isLibrary = item.status && (item.status.includes('Library') || item.status.includes('Active'));
                        const isConditional = !isComplied && !isLibrary;

                        const displayStatus = isVerified
                          ? (item.status && (item.status.includes('Continuous') || item.status.includes('Complied') || item.status.includes('Verified')) ? item.status : 'Complied & Verified')
                          : (item.status || 'Company/CS Confirmation Required');

                        return (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                            {/* Clause Reference */}
                            <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap align-top">
                              <span className="font-bold text-[#0D9488]">Reg {item.clause}</span>
                              <span className="block text-[10px] text-slate-400 font-sans mt-0.5">{item.legalCitation}</span>
                            </td>

                            {/* Requirement */}
                            <td className="py-3.5 px-4 sm:px-6 align-top">
                              <div className="font-semibold text-[#0A1128] text-xs sm:text-sm group-hover:text-[#0D9488] transition-colors">
                                {item.title}
                              </div>
                              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                                {item.requirement}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                  {item.category}
                                </span>
                              </div>
                            </td>

                            {/* Website Location */}
                            <td className="py-3.5 px-4 sm:px-6 align-top">
                              <span className="font-medium text-slate-700 block">
                                {item.websiteLocation}
                              </span>
                            </td>

                            {/* Compliance Status Badge */}
                            <td className="py-3.5 px-4 sm:px-6 align-top">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium ${
                                isComplied
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isLibrary
                                  ? 'bg-teal-50 text-[#0D9488] border border-teal-200'
                                  : 'bg-amber-50 text-[#9A7B38] border border-amber-200'
                              }`}>
                                {isComplied ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                ) : isLibrary ? (
                                  <FileCheck2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                                ) : (
                                  <HelpCircle className="w-3.5 h-3.5 text-[#9A7B38] shrink-0" />
                                )}
                                <span>{displayStatus}</span>
                              </span>
                            </td>

                            {/* Action Link */}
                            <td className="py-3.5 px-4 sm:px-6 text-right align-top whitespace-nowrap">
                              <button
                                onClick={() => {
                                  // Direct navigation or opening modal
                                  if (item.targetRoute.startsWith('investor-relations/')) {
                                    const subTab = getInitialTab(item.targetRoute);
                                    setActiveTab(subTab);
                                    onNavigate(item.targetRoute);
                                  } else {
                                    onNavigate(item.targetRoute);
                                  }
                                }}
                                className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#9A7B38] hover:text-[#0D9488] transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                              >
                                <span>{item.actionText}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: BOARD OF DIRECTORS (REGULATION 46(2)(ab) & REGULATION 17)
            ========================================================================= */}
        {activeTab === 'Board of Directors' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9A7B38] uppercase tracking-wider font-semibold">
                <Users className="w-4 h-4 text-[#0D9488]" />
                <span>Regulation 46(2)(ab) & Companies Act, 2013</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Board of Directors & Senior Leadership
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                The Board of Directors comprises professionals with extensive expertise across securities markets, corporate governance, legal secretarial practice, and financial management. Structured in accordance with Section 149 of the Companies Act, 2013 and Regulation 17 of SEBI (LODR) Regulations, 2015.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-xs font-mono text-[#0D9488] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Director Identification Numbers (DIN) & Corporate Records</span>
              </div>
            </div>

            {/* Directors Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveDirectors.map((director) => {
                const committeeMemberships = Array.isArray(director.committeeMemberships)
                  ? director.committeeMemberships
                  : Array.isArray(director.committee_memberships)
                  ? director.committee_memberships
                  : [];
                const otherDirectorships = Array.isArray(director.otherDirectorships)
                  ? director.otherDirectorships
                  : Array.isArray(director.other_directorships)
                  ? director.other_directorships
                  : [];
                const appointmentDate = director.appointmentDate || director.appointment_date || 'N/A';

                return (
                  <div
                    key={director.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0D9488]/50 shadow-2xs transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-teal-50 text-[#0D9488] border border-teal-200 font-semibold">
                          {director.category}
                        </span>
                        <span className="text-xs font-mono text-slate-500 font-medium">
                          DIN: <strong className="text-slate-800">{director.din}</strong>
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-xl text-[#0A1128]">
                          {director.name}
                        </h3>
                        <div className="text-xs text-[#9A7B38] font-semibold tracking-wide mt-0.5">
                          {director.designation}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                        {director.bio}
                      </p>

                      {/* Appointment & Term Details */}
                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Appointment</span>
                          <span className="text-slate-700 font-medium">{appointmentDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Tenure</span>
                          <span className="text-slate-700 font-medium">{director.term}</span>
                        </div>
                      </div>
                    </div>

                    {/* Committees & Directorships */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1.5">
                          Committee Memberships
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {committeeMemberships.length > 0 ? (
                            committeeMemberships.map((com: any, cIdx: number) => (
                              <span
                                key={cIdx}
                                className={`text-xs px-2.5 py-0.5 rounded-lg border font-mono ${
                                  (com.role || com.member_role) === 'Chairperson'
                                    ? 'bg-amber-50 text-[#9A7B38] border-amber-200 font-semibold'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                {com.committeeName || com.committee_name || com.name} ({com.role || com.member_role || 'Member'})
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 font-mono italic">None</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                          Other Directorships / Positions
                        </span>
                        {otherDirectorships.length > 0 ? (
                          <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                            {otherDirectorships.map((od: string, odIdx: number) => (
                              <li key={odIdx}>{od}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono italic">Nil</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 3: BOARD COMMITTEES (REGULATION 46(2)(c) & REGULATIONS 18-21)
            ========================================================================= */}
        {activeTab === 'Board Committees' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#0D9488] uppercase tracking-wider font-semibold">
                <Scale className="w-4 h-4 text-[#0D9488]" />
                <span>Regulation 46(2)(c) • Statutory Board Committee Governance</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Board Committees & Composition
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                In strict adherence to the Companies Act, 2013 and SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015, the Board has constituted specialized committees with clear charters and independent director majorities.
              </p>
            </div>

            {/* Committees Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {liveCommittees.map((committee) => {
                const chairperson = committee.chairperson || {
                  name: committee.chairperson_name || 'Designated Chairperson',
                  designation: committee.chairperson_designation || 'Chairperson',
                  role: committee.chairperson_role || 'Chairperson',
                  category: committee.chairperson_category || 'Independent Director'
                };
                const members = Array.isArray(committee.members) ? committee.members : [];
                const keyResponsibilities = Array.isArray(committee.keyResponsibilities)
                  ? committee.keyResponsibilities
                  : Array.isArray(committee.key_responsibilities)
                  ? committee.key_responsibilities
                  : [];
                const statutoryRef = committee.statutoryReference || committee.statutory_reference || 'Regulation 18-21 SEBI (LODR)';
                const meetingFreq = committee.meetingsFrequency || committee.meetings_frequency || 'Quarterly / Need basis';

                return (
                  <div
                    key={committee.id}
                    className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-display font-bold text-xl text-[#0A1128]">
                          {committee.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-[#0D9488] border border-teal-200 font-semibold">
                          Statutory Mandate
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 font-mono">
                        <strong>Legal Citation:</strong> {statutoryRef}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {committee.mandate}
                      </p>

                      {/* Chairperson Card */}
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B38] font-bold">
                          Committee Chairperson
                        </span>
                        <div className="font-display font-semibold text-sm text-[#0A1128]">
                          {chairperson.name}
                        </div>
                        <div className="text-xs text-slate-600">
                          {chairperson.designation} ({chairperson.category})
                        </div>
                      </div>

                      {/* Members List */}
                      <div className="space-y-2">
                        <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                          Committee Members
                        </span>
                        <div className="space-y-2 font-sans text-xs">
                          {members.length > 0 ? (
                            members.map((member: any, mIdx: number) => (
                              <div
                                key={mIdx}
                                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                              >
                                <div>
                                  <span className="font-semibold text-[#0A1128] block">{member.name}</span>
                                  <span className="text-slate-500 text-[11px]">{member.designation}</span>
                                </div>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                                  {member.role} • {member.category}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-mono text-xs italic">
                              No additional members registered
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Responsibilities & Meeting Rhythm */}
                    <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                          Meeting Frequency
                        </span>
                        <span className="text-slate-700 font-medium">{meetingFreq}</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1.5">
                          Key Responsibilities
                        </span>
                        {keyResponsibilities.length > 0 ? (
                          <ul className="list-disc list-inside text-slate-600 space-y-1">
                            {keyResponsibilities.map((resp: string, rIdx: number) => (
                              <li key={rIdx}>{resp}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400 font-mono italic">Mandated under board charter</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: POLICIES & CHARTERS (REGULATION 46(2)(b, d, e, f, g, h, u, y, aa))
            ========================================================================= */}
        {activeTab === 'Policies & Charters' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#0D9488] uppercase tracking-wider font-semibold">
                <BookOpen className="w-4 h-4 text-[#0D9488]" />
                <span>Statutory Policies, Codes of Conduct & Charter Documents</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Statutory Policies & Corporate Disclosures Library
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                Complete repository of governance codes, charter documents, and statutory policies formulated under SEBI (LODR) Regulations, 2015 and the Companies Act, 2013.
              </p>
            </div>

            {/* Document Library for Policies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments
                .filter((d) => d.category === 'Company Policies' || d.category === 'MOA & AOA' || d.category === 'Disclosures & Policies')
                .map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onOpenDocument(doc)}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#0D9488]/40 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-[#9A7B38] font-semibold">
                          {doc.category}
                        </span>
                        {doc.version && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {doc.version}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-semibold text-base text-[#0A1128] group-hover:text-[#0D9488] transition-colors leading-snug">
                        {doc.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3">
                        {doc.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500 text-[11px]">{doc.sebiReference || 'SEBI LODR'}</span>
                      <span className={`font-semibold flex items-center gap-1 group-hover:underline ${doc.isAvailable ? 'text-[#0D9488]' : 'text-amber-700'}`}>
                        {doc.isAvailable ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                        <span>{doc.isAvailable ? `View / Download (${doc.fileSize})` : 'Awaiting CS Upload'}</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: NEWSPAPER PUBLICATIONS (REGULATION 47 & 46(2)(q))
            ========================================================================= */}
        {activeTab === 'Newspaper Publications' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#0D9488] uppercase tracking-wider font-semibold">
                <Newspaper className="w-4 h-4 text-[#0D9488]" />
                <span>SEBI LODR Regulation 47 & Regulation 46(2)(q)</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Statutory Newspaper Publications
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                Pursuant to Regulation 47(1) of SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015, the Company publishes notices of Board meetings, quarterly financial results, AGM notices and book closures in one English national daily and one regional language daily (Gujarati).
              </p>
            </div>

            {/* Newspaper Publication Cards / Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                      <th className="py-3 px-4 sm:px-6">Publication Detail</th>
                      <th className="py-3 px-4 sm:px-6">Newspapers & Edition</th>
                      <th className="py-3 px-4 sm:px-6">Period</th>
                      <th className="py-3 px-4 sm:px-6">Publication Date</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {NEWSPAPER_PUBLICATIONS_REGISTRY.map((np) => (
                      <tr key={np.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-medium text-[#0A1128] block text-sm">{np.noticeType}</span>
                          <span className="text-[11px] font-mono text-slate-500">Ref: {np.bseAck}</span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-medium text-slate-800">{np.newspaperName}</span>
                          <span className="block text-[11px] text-slate-500">{np.edition}</span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-mono text-slate-600">
                          {np.financialYear} ({np.quarter})
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-mono text-slate-500">
                          {np.publicationDate}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              // Find matching document or trigger modal
                              const matchedDoc: InvestorDocument = INVESTOR_DOCUMENTS.find(d => d.bseAckNumber === np.bseAck) || {
                                id: np.id,
                                title: `${np.noticeType} - ${np.newspaperName}`,
                                category: 'Newspaper Publications',
                                financialYear: np.financialYear,
                                quarter: np.quarter as any,
                                filingDate: np.publicationDate,
                                bseAckNumber: np.bseAck,
                                fileSize: np.fileSize,
                                fileType: 'PDF',
                                description: `Statutory publication of ${np.noticeType} in ${np.newspaperName} (${np.edition}) pursuant to Regulation 47 of SEBI (LODR) Regulations, 2015.`,
                                sebiReference: 'Reg 47(1) SEBI LODR',
                                sourceType: 'upload',
                                externalUrl: COMPANY_DETAILS.bsePortalUrl,
                                isAvailable: false
                              };
                              onOpenDocument(matchedDoc);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-[#0D9488] text-[#0D9488] hover:text-white border border-teal-200/80 transition-all font-semibold font-mono text-[11px] cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>View PDF ({np.fileSize})</span>
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
            SECTION 6: ANALYST & INVESTOR MEETS (REGULATION 46(2)(o) & (oa))
            ========================================================================= */}
        {activeTab === 'Analyst & Investor Meets' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9A7B38] uppercase tracking-wider font-semibold">
                <Users className="w-4 h-4 text-[#0D9488]" />
                <span>SEBI LODR Regulation 46(2)(o) & Regulation 46(2)(oa)</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Analyst & Institutional Investor Meets
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                Mandatory disclosure repository for schedule of analyst/institutional meetings (advance intimation at least 2 working days), investor presentations, audio recordings (within 24 hours), video recordings (within 48 hours), and transcripts (within 5 working days).
              </p>

              {/* Secretarial Status Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
                <Info className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                <div>
                  <strong>Secretarial Statement:</strong> The Company discloses all presentations made to analysts and institutional investors to BSE Limited prior to commencement of events. Where no group analyst calls or quarterly earnings calls are conducted, the Company maintains this archive with explicit quarterly confirmation.
                </div>
              </div>
            </div>

            {/* Meet Records List */}
            <div className="space-y-4">
              {ANALYST_MEETS_REGISTRY.map((meet) => (
                <div
                  key={meet.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-[#0D9488] border border-teal-200 font-semibold">
                        {meet.eventType}
                      </span>
                      <span className="font-mono text-xs text-slate-500">{meet.financialYear} ({meet.quarter})</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">Date: {meet.date}</span>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-[#0A1128]">
                    {meet.eventTitle}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {meet.statusNote}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
                    <span className={`flex items-center gap-1 ${meet.hasAudio ? 'text-[#0D9488]' : 'text-slate-400'}`}>
                      <Mic className="w-3.5 h-3.5" /> Audio: {meet.hasAudio ? 'Available' : 'N/A'}
                    </span>
                    <span className={`flex items-center gap-1 ${meet.hasVideo ? 'text-[#0D9488]' : 'text-slate-400'}`}>
                      <Video className="w-3.5 h-3.5" /> Video: {meet.hasVideo ? 'Available' : 'N/A'}
                    </span>
                    <span className={`flex items-center gap-1 ${meet.hasTranscript ? 'text-[#0D9488]' : 'text-slate-400'}`}>
                      <FileText className="w-3.5 h-3.5" /> Transcript: {meet.hasTranscript ? 'Available' : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 7: KEY MANAGERIAL PERSONNEL (REGULATION 30(5) & REGULATION 46(2)(v))
            ========================================================================= */}
        {activeTab === 'Key Managerial Personnel' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#0D9488] uppercase tracking-wider font-semibold">
                <UserCheck className="w-4 h-4 text-[#0D9488]" />
                <span>Regulation 30(5) & Regulation 46(2)(v) SEBI LODR</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Key Managerial Personnel Authorized for Materiality
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                Pursuant to Regulation 30(5) of the Securities and Exchange Board of India (Listing Obligations and Disclosure Requirements) Regulations, 2015, the contact details of the Key Managerial Personnel (KMP) authorized for determining the materiality of an event or information and for making disclosures to BSE Limited are published below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveKmp.map((kmp) => {
                const role = kmp.role || kmp.role_title || 'Authorized KMP';
                const authorityScope = kmp.authorityScope || kmp.authority_scope || 'Determination of Materiality under Regulation 30(5)';
                const statutoryRef = kmp.statutoryReference || kmp.statutory_reference || 'Regulation 30(5) SEBI (LODR) Regulations, 2015';

                return (
                  <div
                    key={kmp.id}
                    className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-slate-100 text-[#9A7B38] font-semibold border border-slate-200">
                        {role}
                      </span>

                      <h3 className="font-display font-bold text-lg text-[#0A1128]">
                        {kmp.name}
                      </h3>

                      <div className="text-xs text-[#0D9488] font-semibold font-mono">
                        {kmp.designation}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {authorityScope}
                      </p>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#0D9488]" />
                          <span>Email: <a href={`mailto:${kmp.email}`} className="text-[#0D9488] font-semibold hover:underline">{kmp.email}</a></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#9A7B38]" />
                          <span>Tel: <a href={`tel:${(kmp.phone || '').replace(/\s+/g, '')}`} className="text-slate-800 hover:underline">{kmp.phone}</a></span>
                        </div>
                        {kmp.address && (
                          <div className="text-[11px] text-slate-500 pt-1 font-sans">
                            {kmp.address}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                      Mandate: {statutoryRef}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 8: INVESTOR GRIEVANCE & SEBI SCORES / SMART ODR
            ========================================================================= */}
        {activeTab === 'Investor Grievance & SCORES' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#0D9488] uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                <span>SEBI LODR Regulation 13(3) & Regulation 46(2)(j),(k)</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Investor Grievance Redressal & Official SEBI Portals
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                The Company maintains an institutional grievance handling mechanism. In addition, investors may lodge grievances with market regulator SEBI through the SCORES 2.0 portal or initiate conciliation/arbitration through the SEBI SMART Online Dispute Resolution (ODR) portal.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Complaints Status Box */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="text-xs font-mono uppercase text-[#0D9488] tracking-wider flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Regulation 13(3) LODR Status</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-[#0A1128]">
                  Quarterly Complaints Record
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
                  ✓ Statutory redressal protocol monitored quarterly under SEBI (LODR) Regulation 13(3).
                </div>
              </div>

              {/* Official SEBI SCORES Portal */}
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
                    SEBI SCORES facilitates centralised tracking of complaints online. If a grievance is not resolved satisfactorily by the Company/RTA within 30 days, investors may approach SEBI.
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

              {/* Official SEBI SMART ODR Portal */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-[#9A7B38] tracking-wider flex items-center gap-1.5 font-semibold">
                    <ExternalLink className="w-4 h-4" />
                    <span>SEBI SMART ODR</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#0A1128]">
                    Online Dispute Resolution
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    SEBI circular dated July 31, 2023 on Online Resolution of Disputes in the Indian Securities Market establishes conciliation and online arbitration through SMART ODR.
                  </p>
                </div>

                <a
                  href={COMPANY_DETAILS.sebiSmartOdrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#9A7B38] text-white hover:bg-[#0D9488] transition-colors flex items-center justify-center gap-1.5 text-center cursor-pointer shadow-xs"
                >
                  <span>Visit SMART ODR Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 9: RTA & DEMATERIALIZATION (REGULATION 46(2)(k))
            ========================================================================= */}
        {activeTab === 'RTA & Dematerialization' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#0D9488] uppercase tracking-wider font-semibold">
                <Building className="w-4 h-4 text-[#0D9488]" />
                <span>Registrar & Share Transfer Agent • Depository Connectivity</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Registrar & Share Transfer Agent (RTA)
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                Share transfer, transmission, dematerialization, and shareholder ledger administration are managed by SEBI registered Category-I Registrar & Share Transfer Agent.
              </p>
            </div>

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
                    Bigshare Services Pvt. Ltd. (along with legacy secretarial coordinate Purva Sharegistry) acts as the Registrar and Share Transfer Agent for Amarnath Securities Limited, handling both electronic dematerialized records and legacy physical shares.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
                    <div>
                      <strong className="text-[#0A1128] block font-sans">Office Address:</strong>
                      <span className="text-slate-700">{COMPANY_DETAILS.rtaAddress}</span>
                    </div>
                    <div>
                      <strong className="text-[#0A1128] block font-sans">Email Address:</strong>
                      <a href={`mailto:${COMPANY_DETAILS.rtaEmail}`} className="text-[#0D9488] font-semibold hover:underline">{COMPANY_DETAILS.rtaEmail}</a>
                    </div>
                    <div>
                      <strong className="text-[#0A1128] block font-sans">Telephone Contact:</strong>
                      <a href={`tel:${COMPANY_DETAILS.rtaPhone.replace(/\s+/g, '')}`} className="text-slate-700 hover:text-[#0D9488] transition-colors">{COMPANY_DETAILS.rtaPhone}</a>
                    </div>
                    <div>
                      <strong className="text-[#0A1128] block font-sans">Website:</strong>
                      <a href={COMPANY_DETAILS.rtaWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0D9488] hover:underline">{COMPANY_DETAILS.rtaWebsite}</a>
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
                    <span className="text-slate-700">DP generates an electronic Demat Request Number (DRN) and dispatches documents to the RTA.</span>
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
            SECTION 10: SHAREHOLDING PATTERN BREAKDOWN (REGULATION 31 & 46(2)(m))
            ========================================================================= */}
        {activeTab === 'Shareholding Pattern' && (
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
                      <span className="text-[#9A7B38] font-bold">49.50% (CS Confirmation Req.)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Public Float:</span>
                      <span className="text-slate-700">50.50%</span>
                    </div>
                    <div className="pt-2 text-[10px] text-amber-700 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 font-sans">
                      * Note: Shareholding pattern distribution is subject to Company / CS confirmation against latest BSE XBRL filing. Recent filings report transition to 100% public holding / nil promoter holding.
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
            SECTION 11: DOCUMENT & FILING LIBRARY (UNIVERSAL REPOSITORY VIEW)
            Applicable for: All Filings, Financial Results, Annual Reports, 
            BSE Disclosures, Annual Return (MGT-7), Secretarial Compliance
            ========================================================================= */}
        {activeTab !== 'Regulation 46 Index' && 
         activeTab !== 'Board of Directors' && 
         activeTab !== 'Board Committees' && 
         activeTab !== 'Key Managerial Personnel' && 
         activeTab !== 'Investor Grievance & SCORES' && 
         activeTab !== 'RTA & Dematerialization' && 
         activeTab !== 'Analyst & Investor Meets' && 
         activeTab !== 'Newspaper Publications' && (
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
                    placeholder="Search documents, keyword, or BSE ack..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0A1128] placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-colors"
                    id="document-search-input"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  {/* Category filter if on 'All Filings' tab */}
                  {activeTab === 'All Filings' && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500 font-mono">Category:</span>
                      <select
                        value={documentCategoryFilter}
                        onChange={(e) => setDocumentCategoryFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0A1128] focus:outline-none focus:border-[#0D9488]"
                        id="document-category-filter"
                      >
                        <option value="All">All Categories</option>
                        <option value="Financial Results">Financial Results</option>
                        <option value="Annual Reports">Annual Reports</option>
                        <option value="Shareholding Pattern">Shareholding Pattern</option>
                        <option value="BSE Disclosures">BSE Disclosures</option>
                        <option value="Newspaper Publications">Newspaper Publications</option>
                        <option value="Annual Return (MGT-7)">Annual Return (MGT-7)</option>
                        <option value="Secretarial Compliance Report">Secretarial Compliance Report</option>
                        <option value="Corporate Governance">Corporate Governance</option>
                        <option value="Company Policies">Company Policies</option>
                        <option value="MOA & AOA">MOA & AOA</option>
                      </select>
                    </div>
                  )}

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
              {(selectedYear !== 'All' || selectedQuarter !== 'All' || documentCategoryFilter !== 'All' || searchQuery !== '') && (
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Active Filters:</span>
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
                  {documentCategoryFilter !== 'All' && (
                    <span className="bg-teal-50 text-[#0D9488] px-2.5 py-0.5 rounded-lg font-mono text-[11px] border border-teal-200 font-semibold">
                      Category: {documentCategoryFilter}
                    </span>
                  )}
                  {searchQuery !== '' && (
                    <span className="bg-slate-100 text-[#0A1128] px-2.5 py-0.5 rounded-lg font-mono text-[11px] border border-slate-200">
                      Query: "{searchQuery}"
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedYear('All');
                      setSelectedQuarter('All');
                      setDocumentCategoryFilter('All');
                      setSearchQuery('');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 ml-2 font-medium cursor-pointer"
                  >
                    Reset all
                  </button>
                </div>
              )}
            </div>

            {/* Results Rendering */}
            {filteredDocuments.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="font-display font-semibold text-lg text-[#0A1128]">No documents matched your criteria</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try expanding your year or quarter filter, or resetting search keywords to view all archived statutory disseminations.
                </p>
                <button
                  onClick={() => {
                    setSelectedYear('All');
                    setSelectedQuarter('All');
                    setDocumentCategoryFilter('All');
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
                        <th className="py-3 px-4 sm:px-6">Document Title & Statutory Summary</th>
                        <th className="py-3 px-4 sm:px-6">Category</th>
                        <th className="py-3 px-4 sm:px-6">Period</th>
                        <th className="py-3 px-4 sm:px-6">Filing Date</th>
                        <th className="py-3 px-4 sm:px-6">BSE Ack / Reg</th>
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
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all font-semibold font-mono text-[11px] cursor-pointer ${
                                doc.isAvailable
                                  ? 'bg-teal-50 hover:bg-[#0D9488] text-[#0D9488] hover:text-white border-teal-200/80'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200/80'
                              }`}
                            >
                              {doc.isAvailable ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                              <span>{doc.isAvailable ? `PDF (${doc.fileSize})` : 'Awaiting CS Upload'}</span>
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
                      <span className={`font-semibold flex items-center gap-1 group-hover:underline ${doc.isAvailable ? 'text-[#0D9488]' : 'text-amber-700'}`}>
                        {doc.isAvailable ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                        <span>{doc.isAvailable ? `View (${doc.fileSize})` : 'Awaiting CS Upload'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
