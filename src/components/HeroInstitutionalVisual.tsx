import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { COMPANY_DETAILS, MARKET_TICKER_DATA } from '../data/mockData';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Layers, 
  Landmark, 
  ExternalLink,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const HeroInstitutionalVisual: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateIST = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    updateIST();
    const interval = setInterval(updateIST, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cycle active node highlight every 3.5 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const verifiedNodes = [
    {
      id: 0,
      title: 'BSE Listed Entity',
      badge: 'SCRIP: 538465',
      mainStat: `₹${MARKET_TICKER_DATA.lastPrice.toFixed(2)}`,
      subStat: '+2.41% Active Trading',
      detail: 'ISIN INE745P01010 • Demat Settled',
      icon: TrendingUp,
      accentColor: '#0D9488',
      pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 1,
      title: 'Capital Architecture',
      badge: 'PAID-UP ₹3.00 CR',
      mainStat: '30,00,000',
      subStat: 'Equity Shares @ ₹10 FV',
      detail: 'Authorized Capital: ₹3.50 Crore',
      icon: Coins,
      accentColor: '#9A7B38',
      pillBg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 2,
      title: 'Statutory Governance',
      badge: 'SEBI (LODR) 2015',
      mainStat: '100% SLA',
      subStat: 'Regulation 46 & 13(3) Verified',
      detail: 'SCORES Redressal: 0 Pending',
      icon: ShieldCheck,
      accentColor: '#0D9488',
      pillBg: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      id: 3,
      title: 'Corporate Identity',
      badge: 'SINCE 1994',
      mainStat: '30+ Years',
      subStat: 'RoC Ahmedabad, Gujarat',
      detail: `CIN: ${COMPANY_DETAILS.cin.slice(0, 10)}...`,
      icon: Landmark,
      accentColor: '#2563EB',
      pillBg: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Subtle Ambient Glow behind the card */}
      <div 
        className="absolute -inset-4 bg-gradient-to-tr from-[#0D9488]/15 via-[#9A7B38]/10 to-[#0A1128]/5 rounded-3xl blur-2xl opacity-70 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Main Container Card: Crisp White Surface with Refined Borders */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(10,17,40,0.08)] p-6 sm:p-7 overflow-hidden">
        {/* Top Operational Status Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-700 uppercase">
              BSE Electronic Gateway
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
            <Clock className="w-3 h-3 text-[#0D9488]" />
            <span>{currentTime || 'IST LIVE'}</span>
          </div>
        </div>

        {/* Central Core: Official Amarnath Emblem + Architectural Hub */}
        <div className="my-6 relative flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-slate-50 to-[#FAFBFD] border border-slate-100 shadow-inner">
          {/* Subtle concentric SVG ring pulses */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="w-48 h-48 rounded-full border border-[#0D9488]/15 animate-[spin_24s_linear_infinite]" />
            <div className="w-64 h-64 rounded-full border border-dashed border-slate-200/80 animate-[spin_40s_linear_infinite_reverse]" />
          </div>

          {/* Central Logo & Verified Identifier */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-20 flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(13,148,136,0.18)] transition-transform duration-300 hover:scale-105">
              <img
                src="/amarnath-logo.png"
                alt="Amarnath Securities Official Emblem"
                width={64}
                height={86}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <div>
              <span className="font-display font-bold text-xs tracking-wider text-[#0A1128] block">
                AMARNATH SECURITIES LIMITED
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#9A7B38] font-semibold uppercase">
                INCORPORATED 1994 • BSE: 538465
              </span>
            </div>
          </div>
        </div>

        {/* 4 Connected Institutional Data Capsules (2x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
          {verifiedNodes.map((node) => {
            const Icon = node.icon;
            const isActive = activeNode === node.id;

            return (
              <motion.div
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-white border-[#0D9488] shadow-[0_8px_20px_-6px_rgba(13,148,136,0.18)] ring-1 ring-[#0D9488]/20'
                    : 'bg-white/70 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${node.pillBg}`}>
                    {node.badge}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-bold text-base text-[#0A1128]">
                      {node.mainStat}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600 font-mono">
                      {node.subStat}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans truncate">
                    {node.detail}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Statutory Strip */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1 text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>SEBI Regulation 46 LODR Compliant</span>
          </div>
          <span className="text-slate-400">ISIN: INE745P01010</span>
        </div>
      </div>
    </div>
  );
};
