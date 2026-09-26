import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { COMPANY_DETAILS, MARKET_TICKER_DATA } from '../data/mockData';
import { AmarnathLogo } from './AmarnathLogo';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Mail, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Users, 
  Scale, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const navigateTo = (route: PageRoute) => {
    onNavigate(route);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Institutional Ticker & Trust Bar (Light Slate) */}
      <div className="bg-slate-50 border-b border-slate-200/80 text-[11px] sm:text-xs text-slate-600 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: BSE Live Ticker Indicator */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-900 tracking-wider">BSE: 538465</span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="text-[#0D9488] font-mono font-medium hidden sm:inline">
                ₹{MARKET_TICKER_DATA.lastPrice.toFixed(2)}
              </span>
              <span className="text-emerald-700 font-mono text-[10px] hidden md:inline">
                +{MARKET_TICKER_DATA.changePercent}%
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-slate-500 border-l border-slate-200 pl-3">
              <span>ISIN: <span className="text-slate-800 font-mono">{COMPANY_DETAILS.isin}</span></span>
              <span>•</span>
              <span>CIN: <span className="text-slate-700 font-mono">{COMPANY_DETAILS.cin}</span></span>
            </div>
          </div>

          {/* Right: Quick Statutory / Contact Actions */}
          <div className="flex items-center gap-4 shrink-0 text-slate-600">
            <button
              onClick={() => navigateTo('investor-relations/grievance')}
              className="hover:text-[#0D9488] transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Investor Desk</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a 
              href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, '')}`}
              className="hover:text-[#9A7B38] transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              <Phone className="w-3 h-3 text-[#9A7B38]" />
              <span className="hidden sm:inline">{COMPANY_DETAILS.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar (Light Surface with Subtle Backdrop Blur) */}
      <nav 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] py-3' 
            : 'bg-white/85 backdrop-blur-sm border-b border-slate-200/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Brand Logo - Uses Official Logo with Light Typography */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center text-left group focus:outline-none cursor-pointer"
            id="nav-brand-logo"
            aria-label="Amarnath Securities Home"
          >
            <AmarnathLogo 
              size={36} 
              showText={true} 
              variant="light"
              subtext="BSE LISTED • ESTD 1994" 
            />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {/* Home */}
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'home'
                  ? 'text-[#0D9488] font-semibold bg-teal-50/70'
                  : 'text-slate-700 hover:text-[#0D9488] hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* About Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => navigateTo('about')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentRoute.startsWith('about')
                    ? 'text-[#0D9488] font-semibold bg-teal-50/70'
                    : 'text-slate-700 hover:text-[#0D9488] hover:bg-slate-50'
                }`}
                aria-expanded={activeDropdown === 'about'}
              >
                <span>About</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'about' ? 'rotate-180 text-[#0D9488]' : ''
                }`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 w-72"
                  >
                    <div className="bg-white rounded-xl shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12)] p-2 border border-slate-200 space-y-1">
                      <button
                        onClick={() => navigateTo('about')}
                        className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors group flex items-start gap-3 cursor-pointer"
                      >
                        <Building2 className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Company Overview</div>
                          <div className="text-xs text-slate-500">Institutional heritage & core vision</div>
                        </div>
                      </button>

                      <button
                        onClick={() => navigateTo('about/leadership')}
                        className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors group flex items-start gap-3 cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-[#9A7B38] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Leadership</div>
                          <div className="text-xs text-slate-500">Board of Directors & Executives</div>
                        </div>
                      </button>

                      <button
                        onClick={() => navigateTo('about/governance')}
                        className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors group flex items-start gap-3 cursor-pointer"
                      >
                        <Scale className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Governance</div>
                          <div className="text-xs text-slate-500">Committees & statutory oversight</div>
                        </div>
                      </button>

                      <button
                        onClick={() => navigateTo('about/corporate-info')}
                        className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors group flex items-start gap-3 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">Corporate Information</div>
                          <div className="text-xs text-slate-500">CIN, ISIN, Auditors & Registrar</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Capabilities Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('capabilities')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => navigateTo('capabilities')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentRoute.startsWith('capabilities')
                    ? 'text-[#0D9488] font-semibold bg-teal-50/70'
                    : 'text-slate-700 hover:text-[#0D9488] hover:bg-slate-50'
                }`}
                aria-expanded={activeDropdown === 'capabilities'}
              >
                <span>Capabilities</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'capabilities' ? 'rotate-180 text-[#0D9488]' : ''
                }`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'capabilities' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 w-84"
                  >
                    <div className="bg-white rounded-xl shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12)] p-2.5 border border-slate-200 space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#9A7B38] border-b border-slate-100 mb-1 font-semibold">
                        Core Advisory & Solutions
                      </div>

                      <button
                        onClick={() => navigateTo('capabilities/corporate-finance')}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-medium">Corporate Finance & Advisory</div>
                          <div className="text-xs text-slate-500">Structuring & solvency balance sheet solutions</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#0D9488] transition-opacity" />
                      </button>

                      <button
                        onClick={() => navigateTo('capabilities/merchant-banking')}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-medium">Merchant Banking</div>
                          <div className="text-xs text-slate-500">Issue management, rights & valuations</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#0D9488] transition-opacity" />
                      </button>

                      <button
                        onClick={() => navigateTo('capabilities/investment-banking')}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-medium">Investment Banking & Capital Raising</div>
                          <div className="text-xs text-slate-500">Institutional equity & structured debt syndication</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#0D9488] transition-opacity" />
                      </button>

                      <button
                        onClick={() => navigateTo('capabilities/securities-services')}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-medium">Securities & Investment Services</div>
                          <div className="text-xs text-slate-500">Treasury frameworks & institutional execution</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#0D9488] transition-opacity" />
                      </button>

                      <button
                        onClick={() => navigateTo('capabilities/corporate-lending')}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-medium">Corporate Lending & Financial Solutions</div>
                          <div className="text-xs text-slate-500">Bridge financing & tailored liquidity lines</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#0D9488] transition-opacity" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Investor Relations Mega-Menu */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('investors')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => navigateTo('investor-relations')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentRoute.startsWith('investor-relations')
                    ? 'text-[#0D9488] font-semibold bg-teal-50/70'
                    : 'text-slate-700 hover:text-[#0D9488] hover:bg-slate-50'
                }`}
                aria-expanded={activeDropdown === 'investors'}
              >
                <span>Investor Relations</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'investors' ? 'rotate-180 text-[#0D9488]' : ''
                }`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'investors' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -left-12 top-full pt-2 w-[540px]"
                  >
                    <div className="bg-white rounded-xl shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12)] p-4 border border-slate-200 grid grid-cols-2 gap-4">
                      {/* Column 1: Financials & Reports */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7B38] pb-1 border-b border-slate-100 mb-1.5 flex items-center gap-1.5 font-semibold">
                          <TrendingUp className="w-3.5 h-3.5 text-[#0D9488]" />
                          <span>Financial & Filings</span>
                        </div>

                        <button
                          onClick={() => navigateTo('investor-relations')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-800 hover:text-[#0D9488] flex items-center justify-between cursor-pointer"
                        >
                          <span>Investor Centre (Hub)</span>
                          <span className="text-[10px] bg-teal-50 text-[#0D9488] border border-teal-200 px-1.5 py-0.5 rounded font-mono font-bold">ALL</span>
                        </button>

                        <button
                          onClick={() => navigateTo('investor-relations/financial-results')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] cursor-pointer"
                        >
                          Financial Results
                        </button>

                        <button
                          onClick={() => navigateTo('investor-relations/annual-reports')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] cursor-pointer"
                        >
                          Annual Reports
                        </button>

                        <button
                          onClick={() => navigateTo('investor-relations/shareholding-pattern')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] cursor-pointer"
                        >
                          Shareholding Pattern
                        </button>

                        <button
                          onClick={() => navigateTo('investor-relations/bse-disclosures')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] cursor-pointer"
                        >
                          BSE Disclosures
                        </button>
                      </div>

                      {/* Column 2: Governance & Shareholder Services */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7B38] pb-1 border-b border-slate-100 mb-1.5 flex items-center gap-1.5 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
                          <span>LODR & Shareholder</span>
                        </div>

                        <button
                          onClick={() => navigateTo('investor-relations/regulation-46')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] flex items-center justify-between cursor-pointer"
                        >
                          <span>Regulation 46 Index</span>
                          <span className="text-[9px] text-[#9A7B38] font-mono border border-[#9A7B38]/30 px-1 rounded bg-amber-50">SEBI</span>
                        </button>

                        <button
                          onClick={() => navigateTo('investor-relations/agm-notices')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] cursor-pointer"
                        >
                          AGM / EGM / Notices
                        </button>

                        <button
                          onClick={() => navigateTo('investor-relations/policies')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] cursor-pointer"
                        >
                          Company Policies
                        </button>

                        <button
                          onClick={() => navigateTo('investor-relations/grievance')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] cursor-pointer"
                        >
                          Investor Grievance & SCORES
                        </button>

                        <button
                          onClick={() => navigateTo('investor-relations/rta')}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-[#0A1128] cursor-pointer"
                        >
                          Registrar & Transfer Agent (RTA)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Insights */}
            <button
              onClick={() => navigateTo('insights')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'insights'
                  ? 'text-[#0D9488] font-semibold bg-teal-50/70'
                  : 'text-slate-700 hover:text-[#0D9488] hover:bg-slate-50'
              }`}
            >
              Insights
            </button>

            {/* Contact */}
            <button
              onClick={() => navigateTo('contact')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === 'contact'
                  ? 'text-[#0D9488] font-semibold bg-teal-50/70'
                  : 'text-slate-700 hover:text-[#0D9488] hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigateTo('investor-relations')}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#0D9488] rounded-lg transition-all shadow-2xs cursor-pointer"
              id="nav-investor-btn"
            >
              Investor Centre
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0A1128] hover:bg-[#0D9488] rounded-lg transition-all shadow-sm hover:shadow-[#0D9488]/20 cursor-pointer"
              id="nav-enquiry-btn"
            >
              Business Enquiry
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#0A1128] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation (Light Theme) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-slate-200 max-h-[85vh] overflow-y-auto px-6 py-6 text-sm text-slate-800 shadow-xl"
          >
            <div className="space-y-4">
              <button
                onClick={() => navigateTo('home')}
                className="w-full text-left py-2 text-base font-semibold text-[#0A1128] border-b border-slate-100 cursor-pointer"
              >
                Home
              </button>

              {/* About Section */}
              <div className="py-2 border-b border-slate-100">
                <div className="text-xs font-mono uppercase text-[#9A7B38] mb-2 tracking-wider font-semibold">About</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <button onClick={() => navigateTo('about')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Company Overview
                  </button>
                  <button onClick={() => navigateTo('about/leadership')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Leadership
                  </button>
                  <button onClick={() => navigateTo('about/governance')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Governance
                  </button>
                  <button onClick={() => navigateTo('about/corporate-info')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Corporate Info
                  </button>
                </div>
              </div>

              {/* Capabilities Section */}
              <div className="py-2 border-b border-slate-100">
                <div className="text-xs font-mono uppercase text-[#9A7B38] mb-2 tracking-wider font-semibold">Capabilities</div>
                <div className="space-y-2 text-slate-700">
                  <button onClick={() => navigateTo('capabilities/corporate-finance')} className="block text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Corporate Finance & Advisory
                  </button>
                  <button onClick={() => navigateTo('capabilities/merchant-banking')} className="block text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Merchant Banking
                  </button>
                  <button onClick={() => navigateTo('capabilities/investment-banking')} className="block text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Investment Banking & Capital Raising
                  </button>
                  <button onClick={() => navigateTo('capabilities/securities-services')} className="block text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Securities & Investment Services
                  </button>
                  <button onClick={() => navigateTo('capabilities/corporate-lending')} className="block text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Corporate Lending & Solutions
                  </button>
                </div>
              </div>

              {/* Investor Relations Section */}
              <div className="py-2 border-b border-slate-100">
                <div className="text-xs font-mono uppercase text-[#9A7B38] mb-2 tracking-wider font-semibold">Investor Relations</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <button onClick={() => navigateTo('investor-relations')} className="text-left py-1 font-semibold text-[#0D9488] cursor-pointer">
                    Investor Centre Hub
                  </button>
                  <button onClick={() => navigateTo('investor-relations/financial-results')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Financial Results
                  </button>
                  <button onClick={() => navigateTo('investor-relations/annual-reports')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Annual Reports
                  </button>
                  <button onClick={() => navigateTo('investor-relations/shareholding-pattern')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Shareholding
                  </button>
                  <button onClick={() => navigateTo('investor-relations/bse-disclosures')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    BSE Disclosures
                  </button>
                  <button onClick={() => navigateTo('investor-relations/regulation-46')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Regulation 46
                  </button>
                  <button onClick={() => navigateTo('investor-relations/agm-notices')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    AGM / Notices
                  </button>
                  <button onClick={() => navigateTo('investor-relations/policies')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Company Policies
                  </button>
                  <button onClick={() => navigateTo('investor-relations/grievance')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    Investor Grievance
                  </button>
                  <button onClick={() => navigateTo('investor-relations/rta')} className="text-left py-1 hover:text-[#0D9488] cursor-pointer">
                    RTA Details
                  </button>
                </div>
              </div>

              {/* Insights & Contact */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => navigateTo('insights')}
                  className="text-left py-2 font-medium text-slate-800 hover:text-[#0D9488] cursor-pointer"
                >
                  Insights & Research
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-left py-2 font-medium text-slate-800 hover:text-[#0D9488] cursor-pointer"
                >
                  Contact Desk
                </button>
              </div>

              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#0A1128] hover:bg-[#0D9488] rounded-lg transition-colors cursor-pointer"
                >
                  Submit Business Enquiry
                </button>
                <button
                  onClick={() => navigateTo('investor-relations')}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Access Investor Centre
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
