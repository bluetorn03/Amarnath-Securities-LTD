import React from 'react';
import { PageRoute } from '../types';
import { COMPANY_DETAILS, LEADERSHIP_TEAM } from '../data/mockData';
import { AmarnathLogo } from '../components/AmarnathLogo';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { TextReveal } from '../components/TextReveal';
import { ScrollReveal } from '../components/ScrollReveal';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Scale, 
  FileText, 
  Award,
  ExternalLink,
  MapPin,
  Landmark
} from 'lucide-react';

interface AboutPageProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ currentRoute, onNavigate }) => {
  // Determine active tab from route
  const getSubTab = () => {
    if (currentRoute === 'about/leadership') return 'leadership';
    if (currentRoute === 'about/governance') return 'governance';
    if (currentRoute === 'about/corporate-info') return 'corporate-info';
    return 'overview';
  };

  const activeTab = getSubTab();

  return (
    <div className="w-full bg-[#FAFBFD] text-[#0A1128] min-h-screen py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Heritage & Identity</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0A1128] tracking-tight">
            <TextReveal text="Institutional Legacy Built on Capital Discipline" delay={0.1} />
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Incorporated in 1994 and listed on the BSE Limited, Amarnath Securities Limited stands as a testament to disciplined corporate governance, financial stewardship, and strategic advisory.
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Company Overview', route: 'about' as PageRoute },
            { id: 'leadership', label: 'Leadership', route: 'about/leadership' as PageRoute },
            { id: 'governance', label: 'Governance', route: 'about/governance' as PageRoute },
            { id: 'corporate-info', label: 'Corporate Information', route: 'about/corporate-info' as PageRoute },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.route)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0A1128] text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================================
            TAB 1: COMPANY OVERVIEW
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Story & Evolution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                  Three Decades of Presence in Indian Securities & Capital Markets
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Founded in 1994, Amarnath Securities Limited was conceived during the seminal era of Indian financial liberalization. Over thirty years, the company has witnessed the transformative evolution of the Bombay Stock Exchange (BSE), the advent of electronic depositories (NSDL & CDSL), and the implementation of modern statutory standards under SEBI LODR.
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Today, Amarnath Securities provides specialized corporate finance advisory, merchant banking interface, capital syndication, and disciplined treasury support to enterprises that value long-term financial integrity.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                    <div className="font-display text-2xl font-bold text-[#9A7B38]">1994</div>
                    <div className="text-[11px] font-mono uppercase text-slate-500 mt-1 font-semibold">Incorporation</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                    <div className="font-display text-2xl font-bold text-[#0D9488]">538465</div>
                    <div className="text-[11px] font-mono uppercase text-slate-500 mt-1 font-semibold">BSE Scrip Code</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-center shadow-2xs">
                    <div className="font-display text-2xl font-bold text-[#2563EB]">
                      <AnimatedCounter end={3000000} duration={1800} />
                    </div>
                    <div className="text-[11px] font-mono uppercase text-slate-500 mt-1 font-semibold">Equity Shares</div>
                  </div>
                </div>
              </div>

              {/* Mission / Vision Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#0D9488] font-semibold text-sm">
                    <Award className="w-5 h-5" />
                    <span>Our Strategic Vision</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    To be the premier corporate advisory and capital architecture partner for mid-market Indian enterprises, renowned for fiduciary excellence, transactional precision, and enduring stakeholder trust.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#9A7B38] font-semibold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Governance Commitment</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Upholding the highest benchmarks of statutory compliance, transparent BSE disclosures, and active protection of minority shareholder rights in adherence to SEBI LODR 2015.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values Strip */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
              <h3 className="font-display text-xl font-bold text-[#0A1128] text-center">
                Foundational Principles of Capital Stewardship
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2 p-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-[#0D9488]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-semibold text-base text-[#0A1128]">Integrity & Disclosures</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full, unreserved, and timely statutory disclosures ensuring all market participants operate with symmetrical information.
                  </p>
                </div>

                <div className="space-y-2 p-4 border-y md:border-y-0 md:border-x border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-[#9A7B38]">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-semibold text-base text-[#0A1128]">Fiduciary Discipline</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Capital allocation aligned with long-term solvency, downside protection, and sustainable stakeholder return.
                  </p>
                </div>

                <div className="space-y-2 p-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#2563EB]">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-semibold text-base text-[#0A1128]">Prudent Structuring</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Structuring transactions with customized risk boundaries that withstand macroeconomic and rate cycle volatility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: LEADERSHIP
           ========================================================================= */}
        {activeTab === 'leadership' && (
          <div className="space-y-8">
            <div className="space-y-2 max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Board of Directors & Key Managerial Personnel
              </h2>
              <p className="text-slate-600 text-sm">
                In strict compliance with Regulation 17 of SEBI (LODR) Regulations, 2015, the Board comprises qualified Executive and Independent Directors with diverse functional expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LEADERSHIP_TEAM.map((leader, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-teal-50 text-[#0D9488] border border-teal-200/60 font-semibold">
                        {leader.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{leader.dinOrMembership}</span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#0A1128]">
                      {leader.name}
                    </h3>
                    <div className="text-xs text-[#9A7B38] font-semibold tracking-wide">
                      {leader.designation}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                      {leader.bio}
                    </p>
                  </div>

                  {leader.committees && (
                    <div className="pt-4 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Board Committees</span>
                      <div className="flex flex-wrap gap-1.5">
                        {leader.committees.map((com, cIdx) => (
                          <span key={cIdx} className="text-xs bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-slate-700">
                            {com}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Note on Regulatory Balance */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-start gap-3 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0A1128]">Compliance Confirmation:</strong> The composition of the Board of Directors complies with Section 149 of the Companies Act, 2013 and Regulation 17 of SEBI (LODR) Regulations, 2015 with appropriate balance of executive, non-executive, and independent directors.
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: GOVERNANCE
           ========================================================================= */}
        {activeTab === 'governance' && (
          <div className="space-y-8">
            <div className="space-y-2 max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                Corporate Governance Framework & Committees
              </h2>
              <p className="text-slate-600 text-sm">
                Our governance philosophy is anchored in transparency, equitable treatment of all shareholders, independent audit oversight, and accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#0D9488] font-semibold text-base font-display">
                  <Scale className="w-5 h-5" />
                  <span>Audit Committee</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Constituted under Section 177 of the Companies Act, 2013 and Regulation 18 of SEBI (LODR) Regulations, 2015. Comprises majority independent directors overseeing financial reporting, internal controls, statutory auditor independence, and related party disclosures.
                </p>
                <div className="text-xs font-mono text-[#9A7B38] font-semibold pt-2 border-t border-slate-100">
                  Composition: 3 Directors (Majority Independent)
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#9A7B38] font-semibold text-base font-display">
                  <Users className="w-5 h-5" />
                  <span>Nomination & Remuneration Committee</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Formulated pursuant to Section 178 of the Companies Act, 2013 and Regulation 19 of SEBI LODR. Evaluates board appointments, key managerial appointments, performance criteria, and independent director remuneration policies.
                </p>
                <div className="text-xs font-mono text-[#0D9488] font-semibold pt-2 border-t border-slate-100">
                  Composition: 100% Non-Executive Directors
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#2563EB] font-semibold text-base font-display">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Stakeholders Relationship Committee</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chaired by a Non-Executive Director pursuant to Regulation 20 of SEBI (LODR) Regulations, 2015. Specifically monitors investor complaints, transfer/transmission of shares, demat requests, and unresolved grievances.
                </p>
                <div className="text-xs font-mono text-slate-600 font-semibold pt-2 border-t border-slate-100">
                  Complaint Redressal Rate: 100%
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#0A1128] font-semibold text-base font-display">
                  <FileText className="w-5 h-5 text-[#0D9488]" />
                  <span>Risk Management Committee</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Regularly evaluates operational, statutory, liquidity, and credit risks across financial advisory and lending transactions, ensuring balanced risk-weighted decision architecture.
                </p>
                <div className="text-xs font-mono text-[#9A7B38] font-semibold pt-2 border-t border-slate-100">
                  Quarterly Risk Review Protocol
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('investor-relations/policies')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#0D9488] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Access Mandatory Corporate Governance Policies</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: CORPORATE INFORMATION
           ========================================================================= */}
        {activeTab === 'corporate-info' && (
          <ScrollReveal direction="up" distance={20}>
            <div className="space-y-8">
              {/* Brand Identity Ribbon */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
                <AmarnathLogo size={44} showText={true} variant="light" subtext="REGULATION 46 LODR COMPLIANT" />
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500">ISIN: </span>
                    <span className="text-[#0D9488] font-semibold">{COMPANY_DETAILS.isin}</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500">BSE Scrip: </span>
                    <span className="text-[#9A7B38] font-semibold">{COMPANY_DETAILS.bseScripCode}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-w-2xl">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                  Statutory Corporate Information & Regulators
                </h2>
                <p className="text-slate-600 text-sm">
                  Official registration parameters, stock exchange identifiers, professional auditors, and designated corporate offices.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Statutory Parameters Table */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                  <h3 className="font-display font-semibold text-base text-[#9A7B38]">
                    Company Identification & Listing
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Legal Name:</span>
                      <span className="text-[#0A1128] font-sans font-semibold">AMARNATH SECURITIES LIMITED</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Corporate Identity Number (CIN):</span>
                      <span className="text-[#0D9488] font-semibold">{COMPANY_DETAILS.cin}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">BSE Scrip Code:</span>
                      <span className="text-[#0A1128] font-semibold">{COMPANY_DETAILS.bseScripCode}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">BSE Scrip ID:</span>
                      <span className="text-[#0A1128] font-semibold">AMARNATH</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">ISIN (Demat Code):</span>
                      <span className="text-[#9A7B38] font-semibold">{COMPANY_DETAILS.isin}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Date of Incorporation:</span>
                      <span className="text-slate-700">1994 (RoC - Ahmedabad, Gujarat)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Authorized Share Capital:</span>
                      <span className="text-[#0A1128] font-semibold">₹3,50,00,000 (35,00,000 Equity Shares)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">Paid-Up Equity Capital:</span>
                      <span className="text-[#0A1128] font-semibold">₹3,00,00,000 (30,00,000 Equity Shares)</span>
                    </div>
                  </div>
                </div>

                {/* Statutory Advisors & Registrar */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-2xs">
                  <h3 className="font-display font-semibold text-base text-[#0D9488]">
                    Registrar, Advisors & Registered Offices
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[#9A7B38] font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Registrar & Share Transfer Agent (RTA)</span>
                      </div>
                      <div className="text-[#0A1128] font-medium">{COMPANY_DETAILS.rtaName}</div>
                      <div className="text-slate-600">{COMPANY_DETAILS.rtaAddress}</div>
                      <div className="text-slate-500">Email: {COMPANY_DETAILS.rtaEmail} | Tel: {COMPANY_DETAILS.rtaPhone}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[#0D9488] font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Registered Office</span>
                      </div>
                      <div className="text-slate-700">{COMPANY_DETAILS.regOffice}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[#2563EB] font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Corporate & Operational Office</span>
                      </div>
                      <div className="text-slate-700">{COMPANY_DETAILS.corpOffice}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-700 font-mono text-[11px]">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block text-[10px] font-semibold">Statutory Auditor</span>
                        Chartered Accountants (Empanelled)
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 block text-[10px] font-semibold">Secretarial Auditor</span>
                        Practicing Company Secretary
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};
