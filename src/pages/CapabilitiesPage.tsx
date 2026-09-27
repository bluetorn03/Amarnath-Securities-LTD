import React from 'react';
import { PageRoute } from '../types';
import { CAPABILITIES, BUSINESS_ACTIVITIES_DATA } from '../data/mockData';
import { TextReveal } from '../components/TextReveal';
import { ScrollReveal } from '../components/ScrollReveal';
import { 
  Building2, 
  Landmark, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Coins, 
  CheckCircle2, 
  ArrowRight,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Scale
} from 'lucide-react';

interface CapabilitiesPageProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const CapabilitiesPage: React.FC<CapabilitiesPageProps> = ({ currentRoute, onNavigate }) => {
  // Determine if viewing a specific capability or general overview
  const getSelectedCapability = () => {
    if (currentRoute === 'capabilities/corporate-finance') return 'corporate-finance';
    if (currentRoute === 'capabilities/merchant-banking') return 'merchant-banking';
    if (currentRoute === 'capabilities/investment-banking') return 'investment-banking';
    if (currentRoute === 'capabilities/securities-services') return 'securities-services';
    if (currentRoute === 'capabilities/corporate-lending') return 'corporate-lending';
    return null;
  };

  const selectedCapId = getSelectedCapability();
  const selectedCap = CAPABILITIES.find(c => c.id === selectedCapId);

  const getCapabilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark': return <Landmark className="w-6 h-6 text-[#0D9488]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#9A7B38]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#0D9488]" />;
      case 'Layers': return <Layers className="w-6 h-6 text-[#2563EB]" />;
      case 'Coins': return <Coins className="w-6 h-6 text-[#9A7B38]" />;
      default: return <Building2 className="w-6 h-6 text-[#0D9488]" />;
    }
  };

  return (
    <div className="w-full bg-[#FAFBFD] text-[#0A1128] min-h-screen py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Strategic Evolution & Scope</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0A1128] tracking-tight">
            <TextReveal text="Business & Activities" delay={0.1} />
          </h1>
          <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p>
              Amarnath Securities Limited is focused on identifying and developing sustainable business opportunities across suitable sectors.
            </p>
            <p className="text-slate-600 text-sm">
              The Company has evolved from its historical presence in the financial services and NBFC sector and is now exploring opportunities beyond its earlier business activities.
            </p>
          </div>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          <button
            onClick={() => onNavigate('capabilities')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCapId === null
                ? 'bg-[#0A1128] text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
            }`}
          >
            Business & Activities (All)
          </button>
          {CAPABILITIES.map((cap) => (
            <button
              key={cap.id}
              onClick={() => onNavigate(cap.route)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCapId === cap.id
                  ? 'bg-[#0A1128] text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              {cap.title}
            </button>
          ))}
        </div>

        {/* =========================================================================
            DETAILED SINGLE CAPABILITY VIEW (when deep-linked or tab clicked)
           ========================================================================= */}
        {selectedCap ? (
          <div className="space-y-10">
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/90 space-y-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {getCapabilityIcon(selectedCap.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-[#9A7B38] font-semibold tracking-wider">Practice Division</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128] mt-0.5">
                      {selectedCap.title}
                    </h2>
                  </div>
                </div>

                {selectedCap.stats && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">{selectedCap.stats.label}</span>
                    <span className="text-2xl font-display font-bold text-[#0D9488]">{selectedCap.stats.value}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xs font-mono uppercase text-[#0D9488] font-semibold tracking-wider mb-2">Practice Overview</h3>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                      {selectedCap.fullDesc}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono uppercase text-[#9A7B38] font-semibold tracking-wider mb-3">Core Scope & Mandate Deliverables</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCap.keyOfferings.map((offering, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                          <span>{offering}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-xs font-mono uppercase text-[#0A1128] font-semibold tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#9A7B38]" />
                      <span>Target Stakeholder Profile</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedCap.clientFit}
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-[#0A1128] to-[#060B18] text-white border border-slate-800 space-y-4 shadow-md">
                    <h4 className="font-display font-semibold text-base text-white">
                      Corporate & Strategic Enquiry
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Reach out to our corporate office regarding business development opportunities, strategic collaborations, or shareholder relations.
                    </p>
                    <button
                      onClick={() => onNavigate('contact')}
                      className="w-full py-3 rounded-xl text-xs font-semibold text-[#0A1128] bg-[#0D9488] hover:bg-[#14B8A6] transition-colors shadow-xs cursor-pointer"
                    >
                      Contact Corporate Office
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
              ALL BUSINESS & ACTIVITIES OVERVIEW
             ========================================================================= */
          <ScrollReveal direction="up" distance={20}>
            <div className="space-y-16">
              {/* Four Clear Content Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {BUSINESS_ACTIVITIES_DATA.pillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-[#0D9488]/40 transition-all space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-teal-50 text-[#0D9488] border border-teal-200/60 font-bold">
                          PILLAR {pillar.pillarLetter}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {pillar.subtitle}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0A1128]">
                        {pillar.title}
                      </h3>

                      <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                        {pillar.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-mono uppercase text-[#9A7B38] font-semibold">Key Criteria & Dimensions</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        {pillar.keyFactors.map((kf, kfIdx) => (
                          <div key={kfIdx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                            <span>{kf}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Historical / Earlier Activities Context */}
              <div className="space-y-6 pt-4 border-t border-slate-200/80">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9A7B38] font-semibold">
                    <span>Corporate Evolution</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#0A1128]">
                    Historical Practice Disciplines & Institutional Background
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Having historically operated in the financial services and NBFC space, the Company has undertaken a strategic transition towards exploring opportunities beyond its earlier business activities. The disciplines below reflect our historical foundation and analytical background, which inform our evaluation of new corporate opportunities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CAPABILITIES.map((cap) => (
                    <div
                      key={cap.id}
                      onClick={() => onNavigate(cap.route)}
                      className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0D9488]/40 cursor-pointer flex flex-col justify-between group transition-all duration-300 shadow-2xs hover:shadow-sm"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-[#0D9488]/40 transition-colors">
                            {getCapabilityIcon(cap.iconName)}
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            Historical Context
                          </span>
                        </div>

                        <h4 className="font-display font-semibold text-base text-[#0A1128] group-hover:text-[#0D9488] transition-colors">
                          {cap.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {cap.shortDesc}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          {cap.keyOfferings.map((offering, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                              <span className="truncate">{offering}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        {cap.stats && (
                          <span className="font-mono text-[11px] text-[#9A7B38] font-semibold">{cap.stats.value}</span>
                        )}
                        <span className="text-[#0D9488] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto">
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Evaluation Framework */}
              <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#9A7B38] font-semibold">
                    Governance & Discipline
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#0A1128]">
                    Strategic Evaluation & Growth Governance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Every opportunity is evaluated through disciplined due diligence and adherence to statutory compliance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="font-mono text-xs text-[#0D9488] font-semibold">STAGE 01</span>
                    <h4 className="font-display font-semibold text-sm text-[#0A1128]">Commercial Viability</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Assessing operational scalability, strategic relevance, and long-term value creation potential.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="font-mono text-xs text-[#9A7B38] font-semibold">STAGE 02</span>
                    <h4 className="font-display font-semibold text-sm text-[#0A1128]">Due Diligence</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Conducting comprehensive financial, legal, operational and regulatory diligence.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="font-mono text-xs text-[#2563EB] font-semibold">STAGE 03</span>
                    <h4 className="font-display font-semibold text-sm text-[#0A1128]">Approvals & Governance</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Ensuring alignment with applicable laws, corporate approvals, and stakeholder interests.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="font-mono text-xs text-emerald-600 font-semibold">STAGE 04</span>
                    <h4 className="font-display font-semibold text-sm text-[#0A1128]">Statutory Disclosures</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Timely communication through the Company’s statutory disclosures and BSE filings.
                    </p>
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
