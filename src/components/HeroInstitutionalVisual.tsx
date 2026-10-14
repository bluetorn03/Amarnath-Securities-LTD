import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MARKET_TICKER_DATA } from '../data/mockData';
import { useCompanyProfile } from '../context/CompanyProfileContext';
import { PageRoute } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Scale,
  Sparkles,
  BarChart3,
  Layers,
  FileCheck
} from 'lucide-react';

interface HeroInstitutionalVisualProps {
  onNavigate?: (route: PageRoute) => void;
}

type TabType = 'strategy' | 'capital' | 'governance';

export const HeroInstitutionalVisual: React.FC<HeroInstitutionalVisualProps> = ({ onNavigate }) => {
  const { profile: COMPANY_DETAILS } = useCompanyProfile();
  const [activeTab, setActiveTab] = useState<TabType>('strategy');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Live IST clock & market session calculator
  useEffect(() => {
    const updateIST = () => {
      const now = new Date();
      // IST time string
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentTime(timeStr + ' IST');

      // Check Indian market hours (Mon-Fri 09:15 - 15:30 IST)
      const istHours = (now.getUTCHours() + 5.5) % 24;
      const day = now.getUTCDay(); // 0 is Sunday, 6 is Saturday
      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && istHours >= 9.25 && istHours <= 15.5;
      setIsMarketOpen(isOpen);
    };

    updateIST();
    const interval = setInterval(updateIST, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smooth auto-cycling through the 3 tabs (pauses on hover)
  const tabs: TabType[] = ['strategy', 'capital', 'governance'];
  useEffect(() => {
    if (isHovered) {
      setProgress(0);
      return;
    }

    const DURATION = 6000;
    const TICK = 60;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += TICK;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));

      if (elapsed >= DURATION) {
        elapsed = 0;
        setProgress(0);
        setActiveTab((prev) => {
          const nextIdx = (tabs.indexOf(prev) + 1) % tabs.length;
          return tabs[nextIdx];
        });
      }
    }, TICK);

    return () => clearInterval(timer);
  }, [isHovered, activeTab]);

  return (
    <div 
      className="relative w-full max-w-lg lg:max-w-xl mx-auto select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Multi-Layer Atmospheric Lighting */}
      <div 
        className="absolute -inset-3 bg-gradient-to-tr from-[#0D9488]/15 via-[#9A7B38]/12 to-[#0A1128]/8 rounded-3xl blur-2xl opacity-75 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Main Terminal Enclosure: Crisp Multi-layer Institutional Container */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(10,17,40,0.08)] overflow-hidden transition-all duration-300 hover:border-slate-300">
        
        {/* TOP STATUS BAR: Live BSE Gateway Beacon + IST Clock */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isMarketOpen ? 'bg-emerald-400' : 'bg-teal-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isMarketOpen ? 'bg-emerald-500' : 'bg-[#0D9488]'}`} />
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-800 tracking-wide uppercase">
              <span>BSE: 538465</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#9A7B38] font-semibold text-[10px]">CORP. TERMINAL</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold border ${
              isMarketOpen 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {isMarketOpen ? 'LIVE MARKET' : 'DEMAT SETTLED'}
            </span>
            <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
              <Clock className="w-3 h-3 text-[#0D9488]" />
              <span>{currentTime || 'IST LIVE'}</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE NAVIGATION TABS: 3 Executive Operational Modes */}
        <div className="relative px-4 pt-3.5 pb-2 bg-[#FAFBFD] border-b border-slate-100">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200/70 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('strategy'); setProgress(0); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all duration-200 text-center cursor-pointer ${
                activeTab === 'strategy'
                  ? 'bg-white text-[#0A1128] shadow-2xs font-bold border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'strategy' ? 'text-[#0D9488]' : 'text-slate-400'}`} />
              <span className="truncate">Strategy</span>
            </button>

            <button
              onClick={() => { setActiveTab('capital'); setProgress(0); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all duration-200 text-center cursor-pointer ${
                activeTab === 'capital'
                  ? 'bg-white text-[#0A1128] shadow-2xs font-bold border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <BarChart3 className={`w-3.5 h-3.5 ${activeTab === 'capital' ? 'text-[#9A7B38]' : 'text-slate-400'}`} />
              <span className="truncate">Capital Base</span>
            </button>

            <button
              onClick={() => { setActiveTab('governance'); setProgress(0); }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all duration-200 text-center cursor-pointer ${
                activeTab === 'governance'
                  ? 'bg-white text-[#0A1128] shadow-2xs font-bold border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'governance' ? 'text-[#0D9488]' : 'text-slate-400'}`} />
              <span className="truncate">Governance</span>
            </button>
          </div>

          {/* Subtle Dynamic Progress Line for Auto-Cycle */}
          <div className="h-0.5 w-full bg-slate-200/60 mt-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0D9488] to-[#9A7B38] transition-all duration-75 ease-linear"
              style={{ width: `${isHovered ? 0 : progress}%` }}
            />
          </div>
        </div>

        {/* DYNAMIC CONTENT AREA (Transitions smoothly per tab) */}
        <div className="p-5 sm:p-6 min-h-[320px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeTab === 'strategy' && (
              <motion.div
                key="strategy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Brand Identity Hub */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-200/80 flex items-center justify-center shadow-2xs shrink-0">
                      <img
                        src="/amarnath-logo.png"
                        alt="Amarnath Logo"
                        className="w-6 h-7 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#0A1128]">
                        Strategic Evolution Directives
                      </h4>
                      <p className="text-[11px] font-mono text-[#9A7B38] font-semibold">
                        INCORPORATED 1994 • THREE DECADES OF STEWARDSHIP
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block font-mono text-[10px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-bold">
                    CORE FOCUS
                  </span>
                </div>

                {/* 3 Strategic Capability Cards */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/70 hover:border-[#0D9488]/40 transition-all shadow-2xs group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                        <span className="font-semibold text-xs text-[#0A1128] group-hover:text-[#0D9488] transition-colors">
                          M&A Evaluation & Transactions
                        </span>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        Due Diligence
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-3.5">
                      Rigorous financial, legal and operational diligence to assess strategic transactions and enterprise compounding opportunities.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/70 hover:border-[#0D9488]/40 transition-all shadow-2xs group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
                        <span className="font-semibold text-xs text-[#0A1128] group-hover:text-[#9A7B38] transition-colors">
                          Sustainable Business Expansion
                        </span>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                        Scalability
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-3.5">
                      Transitioning beyond historical activities towards identifying viable, long-term commercial opportunities across high-potential sectors.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/70 hover:border-[#0D9488]/40 transition-all shadow-2xs group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                        <span className="font-semibold text-xs text-[#0A1128] group-hover:text-[#0D9488] transition-colors">
                          Disciplined Governance & Risk
                        </span>
                      </div>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        Fiduciary
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pl-3.5">
                      Prudent capital stewardship with comprehensive board oversight, risk evaluation, and full SEBI LODR transparency.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'capital' && (
              <motion.div
                key="capital"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0A1128]">
                      Capital Architecture & Market Metrics
                    </h4>
                    <p className="text-[11px] font-mono text-[#9A7B38] font-semibold">
                      BSE LISTED • ISIN: INE745P01010 • DEMAT SETTLED
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    SCRIP: 538465
                  </span>
                </div>

                {/* 3 Metric Capsules */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                    <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                      Paid-Up Equity
                    </div>
                    <div className="font-display font-bold text-base sm:text-lg text-[#0A1128] mt-0.5">
                      ₹3.00 Cr
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                      30L Shares @ ₹10
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                    <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                      Authorized Base
                    </div>
                    <div className="font-display font-bold text-base sm:text-lg text-[#0A1128] mt-0.5">
                      ₹3.50 Cr
                    </div>
                    <div className="text-[9px] font-mono text-emerald-600 font-semibold mt-0.5">
                      85.7% Issued
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                    <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                      Market Cap
                    </div>
                    <div className="font-display font-bold text-base sm:text-lg text-[#9A7B38] mt-0.5">
                      ₹5.54 Cr
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                      BSE Scrip 538465
                    </div>
                  </div>
                </div>

                {/* 52-Week Price Spectrum Gauge */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-500 font-semibold">52W Range Spectrum:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      Last: ₹{MARKET_TICKER_DATA.lastPrice.toFixed(2)} (+{MARKET_TICKER_DATA.changePercent}%)
                    </span>
                  </div>

                  {/* Gradient Visual Track */}
                  <div className="relative w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden my-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-amber-400 to-emerald-500 rounded-full" />
                    {/* Indicator Pin */}
                    <div 
                      className="absolute top-0 bottom-0 w-2.5 bg-[#0A1128] rounded-full shadow-md border-2 border-white"
                      style={{ left: '54%' }}
                    />
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mt-1">
                    <span>52W Low: ₹{MARKET_TICKER_DATA.week52Low}</span>
                    <span className="text-slate-400">• Current Trading Band •</span>
                    <span>52W High: ₹{MARKET_TICKER_DATA.week52High}</span>
                  </div>
                </div>

                {/* Settlement Note */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
                    Dematerialized Equity: 100% Settled
                  </span>
                  <span className="text-slate-400">Electronic Transfer Active</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'governance' && (
              <motion.div
                key="governance"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0A1128]">
                      Governance & Regulatory Compliance
                    </h4>
                    <p className="text-[11px] font-mono text-[#9A7B38] font-semibold">
                      SEBI (LODR) 2015 • REGULATION 46 DISCLOSURES
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-bold">
                    100% COMPLIANT
                  </span>
                </div>

                {/* 4 Governance Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#0D9488] font-bold">
                      <span>SEBI Reg 46 LODR</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
                    </div>
                    <div className="font-semibold text-xs text-[#0A1128]">
                      Statutory Disclosures
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Full repository of quarterly results, corporate policies and board charters published.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#9A7B38] font-bold">
                      <span>SCORES / ODR</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B38]" />
                    </div>
                    <div className="font-semibold text-xs text-[#0A1128]">
                      Investor Grievances: 0
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Zero pending shareholder complaints registered on SEBI SCORES portal.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-600 font-bold">
                      <span>Registrar (RTA)</span>
                      <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="font-semibold text-xs text-[#0A1128]">
                      Purva Sharegistry
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Lower Parel, Mumbai. Dedicated demat & dividend processing agency.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-600 font-bold">
                      <span>RoC Gujarat</span>
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="font-semibold text-xs text-[#0A1128]">
                      Ahmedabad Registry
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      CIN: {COMPANY_DETAILS.cin.slice(0, 14)}... • Active compliance standing.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-200/60 flex items-center justify-between text-[11px] font-mono text-teal-900">
                  <span className="font-semibold">Independent Board & Audit Oversight</span>
                  <span className="text-teal-700">Audit & Stakeholder Committees</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTTOM QUICK-ACTION STATUTORY BAR */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Verified BSE Corporate Portal</span>
            </div>

            {onNavigate && (
              <button
                onClick={() => {
                  if (activeTab === 'strategy') onNavigate('capabilities');
                  else if (activeTab === 'capital') onNavigate('investor-relations/shareholding-pattern');
                  else onNavigate('investor-relations/regulation-46');
                }}
                className="inline-flex items-center gap-1 font-semibold text-xs text-[#0D9488] hover:text-[#0F766E] transition-colors group cursor-pointer"
              >
                <span>
                  {activeTab === 'strategy' ? 'Explore Activities' : activeTab === 'capital' ? 'Shareholding Pattern' : 'View Reg 46 Filings'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
