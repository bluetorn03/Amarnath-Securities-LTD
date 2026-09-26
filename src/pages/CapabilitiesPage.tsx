import React from 'react';
import { PageRoute } from '../types';
import { CAPABILITIES } from '../data/mockData';
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
  ArrowUpRight
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
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Capabilities & Strategic Advisory</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0A1128] tracking-tight">
            <TextReveal text="Institutional Capital Architecture & Advisory" delay={0.1} />
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Delivering bespoke corporate finance, merchant banking, capital raising, and structured credit solutions engineered for growth enterprises, institutional investors, and promoter groups.
          </p>
        </div>

        {/* Quick Tabs to Switch Between Capabilities */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          <button
            onClick={() => onNavigate('capabilities')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCapId === null
                ? 'bg-[#0A1128] text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-100'
            }`}
          >
            All Capabilities
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
                      Engage on {selectedCap.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Our transaction team conducts initial feasibility reviews within 48 hours for qualified corporate and institutional mandates.
                    </p>
                    <button
                      onClick={() => onNavigate('contact')}
                      className="w-full py-3 rounded-xl text-xs font-semibold text-[#0A1128] bg-[#0D9488] hover:bg-[#14B8A6] transition-colors shadow-xs cursor-pointer"
                    >
                      Schedule Advisory Discussion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
              ALL CAPABILITIES OVERVIEW GRID
             ========================================================================= */
          <ScrollReveal direction="up" distance={20}>
            <div className="space-y-12">
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
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 group-hover:bg-[#0D9488] group-hover:text-white group-hover:border-[#0D9488] text-slate-500 flex items-center justify-center transition-all duration-200">
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      <h3 className="font-display font-semibold text-lg text-[#0A1128] group-hover:text-[#0D9488] transition-colors">
                        {cap.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                      {cap.stats && (
                        <span className="font-mono text-[11px] text-[#9A7B38] font-semibold">{cap.stats.value}</span>
                      )}
                      <span className="text-[#0D9488] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto">
                        Explore Division <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Advisory Process & Execution Methodology */}
              <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#9A7B38] font-semibold">
                    Disciplined Execution
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#0A1128]">
                    The Amarnath Advisory Framework
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Every transaction follows our four-stage institutional diligence and execution lifecycle.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="font-mono text-xs text-[#0D9488] font-semibold">STAGE 01</span>
                    <h4 className="font-display font-semibold text-sm text-[#0A1128]">Diligence & Diagnostic</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Granular analysis of balance sheet covenants, cash flow sensitivity, and regulatory parameters.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="font-mono text-xs text-[#9A7B38] font-semibold">STAGE 02</span>
                    <h4 className="font-display font-semibold text-sm text-[#0A1128]">Capital Architecture</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Structuring instruments (senior debt, mezzanine, equity rights) to minimize overall weighted cost of capital.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="font-mono text-xs text-[#2563EB] font-semibold">STAGE 03</span>
                    <h4 className="font-display font-semibold text-sm text-[#0A1128]">Syndication & Placement</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Engaging aligned institutional lenders, domestic AIFs, and strategic investors under strict confidentiality.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="font-mono text-xs text-emerald-600 font-semibold">STAGE 04</span>
                    <h4 className="font-display font-semibold text-sm text-[#0A1128]">Closing & Governance</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Facilitating definitive documentation, escrow mechanics, and post-transaction statutory BSE disclosures.
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
