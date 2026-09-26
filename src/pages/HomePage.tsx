import React, { useState } from 'react';
import { PageRoute, InvestorDocument } from '../types';
import { 
  COMPANY_DETAILS, 
  CAPABILITIES, 
  INVESTOR_DOCUMENTS, 
  MARKET_TICKER_DATA, 
  LEADERSHIP_TEAM,
  INSIGHTS,
  FINANCIAL_HIGHLIGHTS_SUMMARY
} from '../data/mockData';
import { AmarnathLogo } from '../components/AmarnathLogo';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { MagneticButton } from '../components/MagneticButton';
import { TextReveal } from '../components/TextReveal';
import { ScrollReveal } from '../components/ScrollReveal';
import { TypewriterLoop } from '../components/TypewriterLoop';
import { HeroInstitutionalVisual } from '../components/HeroInstitutionalVisual';
import { InfiniteMarquee } from '../components/InfiniteMarquee';
import { StickyCardStack, StackCardItem } from '../components/StickyCardStack';
import { 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  FileText, 
  ChevronRight,
  ExternalLink,
  Award,
  Layers,
  Landmark,
  Coins,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Quote,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenDocument: (doc: InvestorDocument) => void;
}

// Stable reference for hero typewriter phrases to prevent unnecessary re-initializations
const HERO_TYPEWRITER_PHRASES = [
  'Corporate Finance & Advisory',
  'Merchant Banking Services',
  'Capital Raising & Investment Solutions',
  'Strategic Financial Advisory'
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenDocument }) => {
  const [selectedNeedTab, setSelectedNeedTab] = useState<'corporates' | 'institutions' | 'promoters' | 'treasuries'>('corporates');

  // Filter latest 4 corporate disclosures
  const latestDisclosures = INVESTOR_DOCUMENTS.filter(
    d => d.category === 'BSE Disclosures' || d.category === 'Financial Results'
  ).slice(0, 4);

  // Stacked cards data for sticky storytelling in Capabilities/Methodology
  const stackItems: StackCardItem[] = [
    {
      id: 'cap-1',
      stepNumber: '01 / ADVISORY',
      title: 'Corporate Finance & Capital Structuring',
      category: 'Balance Sheet Agility',
      description: 'Engineering resilient debt and equity architectures tailored to operational cycles, capex expansions, and liquidity optimization.',
      keyPoints: [
        'Consortium Loan Syndication',
        'Balance Sheet De-leveraging',
        'Working Capital Rationalization',
        'Structured Debt Placement'
      ],
      statBadge: { label: 'Ticket Range', value: '₹20 - ₹200 Cr' },
      route: 'capabilities/corporate-finance'
    },
    {
      id: 'cap-2',
      stepNumber: '02 / MERCHANT BANKING',
      title: 'Merchant Banking & Capital Markets',
      category: 'Public & Private Issues',
      description: 'Managing statutory capital transactions from preliminary due diligence and SEBI LODR disclosures to depository allocation.',
      keyPoints: [
        'Rights Issues & Preferential Allotments',
        'Independent Corporate Valuations',
        'BSE Scrip Compliance Management',
        'Takeover Regulations (SAST) Advisory'
      ],
      statBadge: { label: 'BSE Scrip', value: '538465' },
      route: 'capabilities/merchant-banking'
    },
    {
      id: 'cap-3',
      stepNumber: '03 / INSTITUTIONAL',
      title: 'Investment Banking & Capital Raising',
      category: 'Syndicate & Growth Liquidity',
      description: 'Connecting mid-market enterprises with domestic institutional investors, private credit funds, and family offices for expansion rounds.',
      keyPoints: [
        'Private Equity / Credit Placement',
        'Promoter Equity Financing',
        'Institutional Roadshow Management',
        'BSE Block Deal Coordination'
      ],
      statBadge: { label: 'Syndicate Reach', value: '180+ Funds' },
      route: 'capabilities/investment-banking'
    },
    {
      id: 'cap-4',
      stepNumber: '04 / GOVERNANCE',
      title: 'Securities Services & Treasury Frameworks',
      category: 'Yield & Fiduciary Rigor',
      description: 'Building institutional-grade yield and liquidity parameters for corporate treasuries, prioritizing capital preservation over volatility.',
      keyPoints: [
        'Secondary Fixed Income Allocation',
        'Yield Optimization Frameworks',
        'Depository & Custodian Coordination',
        'Risk-Weighted Solvency Monitoring'
      ],
      statBadge: { label: 'Risk Protocol', value: 'Zero Speculation' },
      route: 'capabilities/securities-services'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans bg-white text-[#0A1128] overflow-x-hidden">
      {/* =========================================================================
          SECTION 1: HERO (WHITE BACKGROUND • FULL VIEWPORT HEIGHT)
          Two-column layout: Left = Brand Copy + Infinite Typewriter, Right = Verified Visual
         ========================================================================= */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-white px-4 sm:px-8 py-12 lg:py-16">
        {/* Subtle Ambient Decorative Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-[#0D9488]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-[#9A7B38]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* HERO LEFT COLUMN */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Elite Institutional Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAFBFD] border border-slate-200/90 shadow-2xs text-xs sm:text-sm font-mono tracking-wide text-slate-700"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[#9A7B38] font-bold">BSE LISTED: 538465</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">ESTABLISHED 1994</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#0D9488] font-semibold hidden sm:inline">SEBI LODR COMPLIANT</span>
            </motion.div>

            {/* Core Brand Title */}
            <div className="space-y-2 w-full">
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0A1128] leading-[1.12]">
                <TextReveal text="AMARNATH SECURITIES LIMITED" delay={0.1} stagger={0.05} />
              </h1>

              {/* Dynamic Typewriter Highlight - Fully reliable on Desktop, Laptop, Tablet & Mobile */}
              <div className="pt-2 min-h-[46px] flex items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mr-2.5 shrink-0 select-none">
                  FOCUS:
                </span>
                <TypewriterLoop
                  phrases={HERO_TYPEWRITER_PHRASES}
                  className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-[#9A7B38] tracking-wide"
                  cursorClassName="text-[#0D9488]"
                />
              </div>
            </div>

            {/* Verified Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
              className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed font-normal"
            >
              Institutional financial services, strategic corporate advisory, and capital solutions. Advancing enterprises through disciplined capital allocation, merchant banking, and regulatory stewardship since 1994.
            </motion.p>

            {/* Dual CTAs with Micro-interactions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2"
            >
              <MagneticButton
                onClick={() => onNavigate('capabilities')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#0A1128] hover:bg-[#0D9488] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
                id="hero-explore-capabilities"
              >
                <span>Explore Capabilities</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>

              <button
                onClick={() => onNavigate('investor-relations')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#0D9488] shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
                id="hero-investor-centre"
              >
                <span>Investor Centre</span>
                <ExternalLink className="w-4 h-4 text-[#9A7B38] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>

            {/* Hero Stock Data Pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="w-full max-w-xl p-3 px-5 rounded-xl bg-[#FAFBFD] border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400">BSE PRICE:</span>
                <span className="font-bold text-[#0A1128] text-sm">₹{MARKET_TICKER_DATA.lastPrice.toFixed(2)}</span>
                <span className="text-emerald-600 font-semibold">(+{MARKET_TICKER_DATA.changePercent}%)</span>
              </div>
              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">52W:</span>
                <span className="text-slate-700">₹{MARKET_TICKER_DATA.week52Low} - ₹{MARKET_TICKER_DATA.week52High}</span>
              </div>
              <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-slate-400">MCAP:</span>
                <span className="text-[#9A7B38] font-semibold">{MARKET_TICKER_DATA.marketCap}</span>
              </div>
            </motion.div>
          </div>

          {/* HERO RIGHT COLUMN: Meaningful Institutional Visual */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <HeroInstitutionalVisual />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: WARM IVORY / SOFT BEIGE RHYTHM
          Seamless Marquee + Animated Statistics Counters
         ========================================================================= */}
      <div className="bg-[#FAF7F2] border-y border-[#EDE8DF]">
        {/* Infinite Seamless GPU Marquee */}
        <InfiniteMarquee />

        {/* Bento Statistics Grid with Replaying Animated Counters */}
        <section className="py-12 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" distance={20}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {/* Metric 1: 30+ Years */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between group hover:border-[#0D9488]/50 transition-all shadow-2xs hover:shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#0D9488] flex items-center justify-between font-semibold">
                    <span>Legacy & Stewardship</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9488] transition-colors" />
                  </div>
                  <div className="my-3">
                    <div className="text-3xl sm:text-4xl font-display font-bold text-[#0A1128] tracking-tight">
                      <AnimatedCounter end={30} suffix="+" duration={1600} />{' '}
                      <span className="text-lg font-sans font-normal text-slate-500">Years</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-sans">
                    Continuous Market Presence • Founded 1994
                  </div>
                </div>

                {/* Metric 2: 538465 BSE Scrip Code */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between group hover:border-[#9A7B38]/50 transition-all shadow-2xs hover:shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#9A7B38] flex items-center justify-between font-semibold">
                    <span>BSE Listed Scrip</span>
                    <Award className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9A7B38] transition-colors" />
                  </div>
                  <div className="my-3">
                    <div className="text-3xl sm:text-4xl font-display font-bold text-[#0A1128] tracking-tight">
                      <AnimatedCounter end={538465} duration={1800} formatNumber={false} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-sans">
                    BSE Scrip Code: AMARNATH
                  </div>
                </div>

                {/* Metric 3: 100% LODR Compliance */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between group hover:border-[#0D9488]/50 transition-all shadow-2xs hover:shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#0D9488] flex items-center justify-between font-semibold">
                    <span>Statutory Rigor</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D9488] transition-colors" />
                  </div>
                  <div className="my-3">
                    <div className="text-3xl sm:text-4xl font-display font-bold text-[#0A1128] tracking-tight">
                      <AnimatedCounter end={100} suffix="%" duration={1600} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-sans">
                    LODR Compliance • Zero Pending Grievances
                  </div>
                </div>

                {/* Metric 4: 1994 Inception */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between group hover:border-[#9A7B38]/50 transition-all shadow-2xs hover:shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#9A7B38] flex items-center justify-between font-semibold">
                    <span>Incorporation Year</span>
                    <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9A7B38] transition-colors" />
                  </div>
                  <div className="my-3">
                    <div className="text-3xl sm:text-4xl font-display font-bold text-[#0A1128] tracking-tight">
                      <AnimatedCounter end={1994} duration={1600} formatNumber={false} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    RoC Gujarat • ISIN: INE745P01010
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>

      {/* =========================================================================
          SECTION 3: WHITE RHYTHM
          Institutional Credo / Board Declaration Quote Block
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-white border-b border-slate-200/70">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <ScrollReveal scale={0.97} distance={15}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FAFBFD] border border-slate-200 text-[#9A7B38] mx-auto shadow-2xs">
              <Quote className="w-6 h-6 rotate-180" />
            </div>
            <blockquote className="mt-4 font-editorial text-2xl sm:text-3xl md:text-4xl text-[#0A1128] leading-snug font-normal tracking-wide">
              “Capital allocation is not merely a transaction; it is an enduring commitment to <span className="italic text-[#9A7B38]">fiduciary integrity</span>, governance prudence, and sustainable enterprise compounding.”
            </blockquote>
            <div className="pt-4 text-xs font-mono text-slate-500 uppercase tracking-widest font-semibold">
              — Board of Directors & Advisory Committee • Amarnath Securities Limited
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: VERY LIGHT COOL GRAY RHYTHM
          About Amarnath Securities (Directional Reveals: Left & Right)
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (Enters from left) */}
            <ScrollReveal direction="left" distance={30} className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Institutional Heritage</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0A1128] leading-tight">
                Architecting Strategic Capital & Value Preservation for Three Decades
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Amarnath Securities Limited is a BSE-listed non-banking financial and corporate advisory institution. Operating at the confluence of capital markets, corporate finance, and statutory governance, we serve enterprises, institutional funds, and family offices seeking disciplined capital stewardship.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs hover:border-[#0D9488]/40 transition-colors">
                  <div className="flex items-center gap-2 text-[#9A7B38] font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                    <span>Statutory Rigor</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Uncompromising adherence to SEBI regulations, Companies Act provisions, and BSE disclosure integrity.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs hover:border-[#0D9488]/40 transition-colors">
                  <div className="flex items-center gap-2 text-[#9A7B38] font-semibold text-sm">
                    <TrendingUp className="w-4 h-4 text-[#0D9488]" />
                    <span>Capital Structuring</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tailoring debt, equity syndication, and balance sheet agility to foster sustainable enterprise growth.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D9488] hover:text-[#0F766E] transition-colors group cursor-pointer"
                >
                  <span>Learn more about our governance & heritage</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </ScrollReveal>

            {/* Right Card / Statutory Credentials (Enters from right) */}
            <ScrollReveal direction="right" distance={30} className="lg:col-span-5">
              <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <AmarnathLogo size={36} variant="light" />
                    <div>
                      <h3 className="font-display font-semibold text-sm text-[#0A1128]">Statutory Credentials</h3>
                      <span className="text-[11px] font-mono text-[#9A7B38] font-semibold">ROC Gujarat Registry</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-[#0D9488] border border-teal-200 font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {FINANCIAL_HIGHLIGHTS_SUMMARY.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-500">{item.metric}</span>
                      <div className="text-right">
                        <span className="text-[#0A1128] font-bold">{item.value}</span>
                        <div className="text-[10px] text-slate-400">{item.note}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('about/corporate-info')}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold text-center text-slate-700 hover:text-[#0A1128] bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    View Full Corporate Filing Details
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHITE RHYTHM
          Pinned / Sticky Storytelling: Stacked Capabilities
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Heading */}
          <ScrollReveal direction="up" distance={20}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9A7B38] font-semibold">
                  <span>Strategic Capabilities & Disciplines</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0A1128]">
                  Stacked Institutional Competencies
                </h2>
                <p className="text-slate-600 text-sm">
                  Scroll through our specialized practice areas engineered to address complex corporate lifecycles, structured debt, and regulatory capital mandates.
                </p>
              </div>

              <button
                onClick={() => onNavigate('capabilities')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D9488] hover:text-[#0A1128] transition-colors shrink-0 cursor-pointer"
              >
                <span>View All Capabilities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          {/* Sticky Stacked Cards Component */}
          <StickyCardStack
            items={stackItems}
            onNavigate={onNavigate}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: WARM IVORY / SOFT BEIGE RHYTHM
          Explore by Stakeholder Need (Tabs)
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-[#FAF7F2] border-b border-[#EDE8DF]">
        <div className="max-w-7xl mx-auto space-y-10">
          <ScrollReveal direction="up" distance={20}>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
                Strategic Alignment
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0A1128]">
                Tailored Solutions Across Stakeholder Profiles
              </h2>
              <p className="text-slate-600 text-sm">
                Discover how Amarnath Securities structures bespoke capital solutions and advisory frameworks for your specific organizational context.
              </p>
            </div>
          </ScrollReveal>

          {/* Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 border-b border-slate-200/80 pb-4">
            {[
              { id: 'corporates', label: 'For Operating Corporates' },
              { id: 'institutions', label: 'For Institutions & Funds' },
              { id: 'promoters', label: 'For Promoters & Growth Entities' },
              { id: 'treasuries', label: 'For Treasuries & Family Offices' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedNeedTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedNeedTab === tab.id
                    ? 'bg-[#0A1128] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-[#0A1128] hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Box on Pure White Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            {selectedNeedTab === 'corporates' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <div className="text-xs font-mono text-[#9A7B38] uppercase tracking-wider font-semibold">
                    Balance Sheet & Capital Expansion
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A1128]">
                    Unlocking Capital Agility & Refinancing Optimization
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Operating corporates frequently encounter seasonal credit constraints, expansion capital bottlenecks, and debt covenant rigidities. We design structured credit facilities, debt rationalization plans, and bridge liquidity solutions that preserve operational momentum.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Term Loan & Working Capital Syndication</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Balance Sheet Optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Special Situations Restructuring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Commercial Paper & Debenture Issuance</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-[#FAFBFD] border border-slate-200 space-y-4 text-center shadow-2xs">
                  <span className="text-xs font-mono text-slate-500 uppercase">Typical Mandate Size</span>
                  <div className="text-3xl font-display font-bold text-[#9A7B38]">₹20 Cr - ₹200 Cr</div>
                  <p className="text-xs text-slate-500">
                    End-to-end execution with lender consortiums and institutional investors.
                  </p>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#0A1128] text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                  >
                    Consult Corporate Finance Desk
                  </button>
                </div>
              </div>
            )}

            {selectedNeedTab === 'institutions' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <div className="text-xs font-mono text-[#9A7B38] uppercase tracking-wider font-semibold">
                    Institutional Co-Investment & Origination
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A1128]">
                    Sourcing High-Conviction Mid-Market Deal Flow
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We partner with domestic and offshore institutional funds, credit funds, and AIFs seeking vetted private placement opportunities, structured debt deals, and secondary market block transactions with rigorous downside protection.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Proprietary Mid-Market Deal Sourcing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Independent Valuation & Due Diligence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>BSE Platform Block Deal Execution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Post-Closing Governance Monitoring</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-[#FAFBFD] border border-slate-200 space-y-4 text-center shadow-2xs">
                  <span className="text-xs font-mono text-slate-500 uppercase">Institutional Syndicate</span>
                  <div className="text-3xl font-display font-bold text-[#0D9488]">180+ Funds</div>
                  <p className="text-xs text-slate-500">
                    Network spanning domestic AIFs, NBFCs, and global family offices.
                  </p>
                  <button
                    onClick={() => onNavigate('capabilities/investment-banking')}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#0A1128] text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                  >
                    View Investment Banking Practice
                  </button>
                </div>
              </div>
            )}

            {selectedNeedTab === 'promoters' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <div className="text-xs font-mono text-[#9A7B38] uppercase tracking-wider font-semibold">
                    Promoter Equity & Growth Realization
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A1128]">
                    Non-Dilutive Growth Capital & Strategic Stake Financing
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Founders and promoter groups require agile liquidity to exercise preferential warrants, consolidate shareholding, or fund subsidiary capex without prematurely diluting voting control.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Promoter Stake Consolidation Advisory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Preferential Allotment & Rights Structuring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>SEBI Takeover & SAST Compliance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Succession & Inter-Generational Holding</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-[#FAFBFD] border border-slate-200 space-y-4 text-center shadow-2xs">
                  <span className="text-xs font-mono text-slate-500 uppercase">Equity Protection</span>
                  <div className="text-3xl font-display font-bold text-[#9A7B38]">100% Focused</div>
                  <p className="text-xs text-slate-500">
                    Structured to protect promoter control and long-term voting integrity.
                  </p>
                  <button
                    onClick={() => onNavigate('capabilities/merchant-banking')}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#0A1128] text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                  >
                    Merchant Banking Overview
                  </button>
                </div>
              </div>
            )}

            {selectedNeedTab === 'treasuries' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <div className="text-xs font-mono text-[#9A7B38] uppercase tracking-wider font-semibold">
                    Corporate Treasury & Family Wealth
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A1128]">
                    Disciplined Yield Frameworks & Capital Preservation
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Protecting liquid surpluses while generating predictable risk-adjusted yield spreads. We build regulatory-compliant treasury frameworks utilizing high-grade money market instruments and structured debt.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Treasury Yield Optimization Frameworks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Secondary Fixed Income Allocation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Custodian & Depository Coordination</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                      <span>Risk-Weighted Solvency Monitoring</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-[#FAFBFD] border border-slate-200 space-y-4 text-center shadow-2xs">
                  <span className="text-xs font-mono text-slate-500 uppercase">Risk Philosophy</span>
                  <div className="text-3xl font-display font-bold text-[#0D9488]">Zero Speculation</div>
                  <p className="text-xs text-slate-500">
                    Institutional-grade security and liquidity prioritized over volatility.
                  </p>
                  <button
                    onClick={() => onNavigate('capabilities/securities-services')}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#0A1128] text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                  >
                    Securities Services Overview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHITE RHYTHM
          Investor Centre Highlight & Latest Statutory Disclosures
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal direction="up" distance={20}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Investor Relations & Transparency</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0A1128]">
                  Statutory Filings, Disclosures & Investor Centre
                </h2>
                <p className="text-slate-600 text-sm">
                  Empowering shareholders with complete transparency, timely BSE disseminations, and full adherence to SEBI Listing Regulations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('investor-relations')}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#0D9488] hover:bg-[#0F766E] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                  id="home-open-investor-hub"
                >
                  <span>Enter Investor Centre</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Filing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestDisclosures.map((doc, idx) => (
              <ScrollReveal key={doc.id} delay={idx * 0.08} direction="up" distance={15}>
                <div
                  onClick={() => onOpenDocument(doc)}
                  className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 hover:border-[#0D9488]/40 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-sm h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white text-[#9A7B38] font-semibold border border-slate-200/60">
                        {doc.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {doc.filingDate}
                      </span>
                    </div>

                    <h3 className="font-display font-medium text-sm text-[#0A1128] group-hover:text-[#0D9488] transition-colors line-clamp-2">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-500">
                      {doc.fileType} • {doc.fileSize}
                    </span>
                    <span className="text-[#0D9488] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <Download className="w-3.5 h-3.5" />
                      <span>View</span>
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Statutory Links Fast Ribbon */}
          <ScrollReveal direction="up" distance={15}>
            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#9A7B38] shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0A1128]">SEBI Regulation 46 Compliance Repository</div>
                  <div className="text-xs text-slate-500">Mandatory disclosures under SEBI (LODR) Regulations 2015</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('investor-relations/regulation-46')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0D9488] hover:text-[#0A1128] bg-teal-50 hover:bg-teal-100/70 border border-teal-200/60 transition-colors cursor-pointer"
                >
                  Regulation 46 Index
                </button>
                <button
                  onClick={() => onNavigate('investor-relations/financial-results')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0A1128] bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
                >
                  Financial Results
                </button>
                <button
                  onClick={() => onNavigate('investor-relations/annual-reports')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0A1128] bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
                >
                  Annual Reports Archive
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: VERY LIGHT COOL GRAY RHYTHM
          Leadership & Governance Preview
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal direction="up" distance={20}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9A7B38] font-semibold">
                  <span>Governance & Leadership</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0A1128]">
                  Fiduciary Responsibility & Independent Board Oversight
                </h2>
                <p className="text-slate-600 text-sm">
                  Steered by an experienced board comprising chartered accountants, legal luminaries, and capital market professionals safeguarding shareholder interests.
                </p>
              </div>

              <button
                onClick={() => onNavigate('about/leadership')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D9488] hover:text-[#0A1128] transition-colors shrink-0 cursor-pointer"
              >
                <span>View Full Leadership Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_TEAM.map((leader, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.08} direction="up" distance={15}>
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-sm hover:border-[#0D9488]/40 transition-all h-full">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-50 text-[#0D9488] border border-teal-200/60 font-semibold inline-block">
                      {leader.category}
                    </span>
                    <h3 className="font-display font-semibold text-base text-[#0A1128]">
                      {leader.name}
                    </h3>
                    <div className="text-xs text-[#9A7B38] font-semibold">
                      {leader.designation}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-2">
                      {leader.bio}
                    </p>
                  </div>

                  {leader.committees && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-semibold">Committees</div>
                      <div className="flex flex-wrap gap-1">
                        {leader.committees.map((com, cIdx) => (
                          <span key={cIdx} className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                            {com}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: WARM IVORY / SOFT BEIGE RHYTHM
          Market Intelligence & Insights
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-[#FAF7F2] border-b border-[#EDE8DF]">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal direction="up" distance={20}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
                  <span>Market Intelligence</span>
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0A1128]">
                  Perspectives on Indian Capital Markets & Regulation
                </h2>
                <p className="text-slate-600 text-sm">
                  Strategic viewpoints from our research and compliance divisions on macroeconomic trends, corporate finance shifts, and SEBI compliance dynamics.
                </p>
              </div>

              <button
                onClick={() => onNavigate('insights')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D9488] hover:text-[#0A1128] transition-colors shrink-0 cursor-pointer"
              >
                <span>Explore All Insights</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INSIGHTS.map((article, idx) => (
              <ScrollReveal key={article.id} delay={idx * 0.1} direction="up" distance={15}>
                <div
                  onClick={() => onNavigate('insights')}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#9A7B38]/50 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-sm h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="text-[#9A7B38] font-mono text-[11px] font-semibold">{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-display font-semibold text-lg text-[#0A1128] group-hover:text-[#0D9488] transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">{article.date}</span>
                    <span className="text-[#0D9488] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Article <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: WHITE RHYTHM
          Split Business Enquiry & Investor Contact CTAs
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" distance={25}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Corporate Mandates (Deep Contrast Institutional Card) */}
              <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#0A1128] to-[#060B18] text-white flex flex-col justify-between space-y-6 shadow-xl border border-slate-800">
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#14B8A6] font-semibold">
                    Corporate Mandates
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Initiate a Corporate Finance or Advisory Mandate
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Connect with our advisory committee to evaluate balance sheet recapitalization, merchant banking transactions, or structured lending solutions.
                  </p>
                </div>

                <div className="pt-4">
                  <MagneticButton
                    onClick={() => onNavigate('contact')}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-[#0A1128] bg-[#0D9488] hover:bg-[#14B8A6] transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-[0.98]"
                    id="cta-business-enquiry"
                  >
                    <span>Submit Corporate Enquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </div>

              {/* Card 2: Investor Relations Helpdesk (Clean White Card) */}
              <div className="p-8 sm:p-10 rounded-2xl bg-[#FAFBFD] border border-slate-200/90 hover:border-[#9A7B38]/50 transition-all flex flex-col justify-between space-y-6 shadow-2xs">
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#9A7B38] font-semibold">
                    Shareholder Services
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128]">
                    Investor Grievance & Shareholder Assistance
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Need assistance regarding share transfers, dematerialization, dividend queries, or statutory filing clarifications? Reach our dedicated compliance desk.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigate('investor-relations/grievance')}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#0A1128] hover:bg-[#0D9488] transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
                    id="cta-investor-grievance"
                  >
                    <span>Investor Grievance Desk</span>
                    <ChevronRight className="w-4 h-4 text-[#9A7B38]" />
                  </button>

                  <button
                    onClick={() => onNavigate('investor-relations/rta')}
                    className="px-4 py-3 rounded-xl text-xs font-medium text-slate-700 hover:text-[#0A1128] bg-white border border-slate-200 transition-colors cursor-pointer"
                  >
                    RTA Information
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
