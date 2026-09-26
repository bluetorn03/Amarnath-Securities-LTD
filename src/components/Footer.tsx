import React from 'react';
import { PageRoute } from '../types';
import { COMPANY_DETAILS, MARKET_TICKER_DATA } from '../data/mockData';
import { AmarnathLogo } from './AmarnathLogo';
import { 
  ShieldCheck, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  FileCheck,
  ChevronRight
} from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#040711] border-t border-white/10 text-slate-400 text-xs font-sans mt-auto">
      {/* Top Banner: Statutory Identity Ribbon */}
      <div className="border-b border-white/5 bg-[#060B18]/70 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AmarnathLogo size={42} showText={true} variant="dark" subtext="BSE LISTED • SCRIP: 538465" />
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880]">BSE Scrip Code</span>
              <span className="font-mono text-white text-sm font-semibold">{COMPANY_DETAILS.bseScripCode}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880]">ISIN Code</span>
              <span className="font-mono text-white text-sm font-semibold">{COMPANY_DETAILS.isin}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880]">Corporate Identity (CIN)</span>
              <span className="font-mono text-white text-xs font-semibold">{COMPANY_DETAILS.cin}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880]">Listing Year</span>
              <span className="font-mono text-white text-sm font-semibold">Since {COMPANY_DETAILS.foundedYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Column 1: Company Profile & Positioning */}
        <div className="lg:col-span-2 space-y-4 pr-4">
          <h4 className="font-display font-semibold text-white text-base tracking-wide">
            Amarnath Securities Limited
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            {COMPANY_DETAILS.corePositioning}. Established in 1994, Amarnath Securities Limited provides institutional-grade corporate finance, merchant banking, capital raising, and statutory investor advisory with three decades of continuous market integrity.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Registered Office:</strong> {COMPANY_DETAILS.regOffice}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#14B8A6] shrink-0" />
              <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-slate-300 hover:text-white transition-colors">
                {COMPANY_DETAILS.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
              <a href={`tel:${COMPANY_DETAILS.phone.replace(/\s+/g, '')}`} className="text-slate-300 hover:text-white transition-colors font-mono">
                {COMPANY_DETAILS.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Capabilities */}
        <div className="space-y-3">
          <h5 className="font-mono text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
            Capabilities
          </h5>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onNavigate('capabilities/corporate-finance')}
                className="hover:text-white transition-colors text-left"
              >
                Corporate Finance & Advisory
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('capabilities/merchant-banking')}
                className="hover:text-white transition-colors text-left"
              >
                Merchant Banking
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('capabilities/investment-banking')}
                className="hover:text-white transition-colors text-left"
              >
                Investment Banking
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('capabilities/securities-services')}
                className="hover:text-white transition-colors text-left"
              >
                Securities & Investment
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('capabilities/corporate-lending')}
                className="hover:text-white transition-colors text-left"
              >
                Corporate Lending
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Investor Relations Hub */}
        <div className="space-y-3">
          <h5 className="font-mono text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
            Investor Relations
          </h5>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/financial-results')}
                className="hover:text-white transition-colors text-left"
              >
                Financial Results
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/annual-reports')}
                className="hover:text-white transition-colors text-left"
              >
                Annual Reports
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/shareholding-pattern')}
                className="hover:text-white transition-colors text-left"
              >
                Shareholding Pattern
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/bse-disclosures')}
                className="hover:text-white transition-colors text-left"
              >
                BSE Disclosures
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/regulation-46')}
                className="hover:text-white transition-colors text-left"
              >
                Regulation 46 Index
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/agm-notices')}
                className="hover:text-white transition-colors text-left"
              >
                AGM / Notices
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Governance & Compliance */}
        <div className="space-y-3">
          <h5 className="font-mono text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
            Governance & RTA
          </h5>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onNavigate('about/leadership')}
                className="hover:text-white transition-colors text-left"
              >
                Board of Directors
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('about/governance')}
                className="hover:text-white transition-colors text-left"
              >
                Board Committees
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/policies')}
                className="hover:text-white transition-colors text-left"
              >
                Corporate Policies
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/grievance')}
                className="hover:text-white transition-colors text-left"
              >
                Investor Grievance Redressal
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('investor-relations/rta')}
                className="hover:text-white transition-colors text-left"
              >
                Registrar & Transfer Agent
              </button>
            </li>
            <li>
              <a 
                href={COMPANY_DETAILS.sebiScoresUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#14B8A6] transition-colors flex items-center gap-1"
              >
                <span>SEBI SCORES Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Registrar & Share Transfer Agent Info Strip */}
      <div className="border-t border-white/5 bg-[#050914] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>
              <strong className="text-slate-300">Registrar & Share Transfer Agent (RTA):</strong> {COMPANY_DETAILS.rtaName} | Phone: {COMPANY_DETAILS.rtaPhone} | Email: {COMPANY_DETAILS.rtaEmail}
            </span>
          </div>

          <a
            href={COMPANY_DETAILS.bsePortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-[#14B8A6] flex items-center gap-1 transition-colors"
          >
            <span>View BSE Scrip: 538465 Live on BSE Listing Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Statutory Disclaimers & Copyright */}
      <div className="border-t border-white/5 py-6 px-4 sm:px-8 bg-[#03060E] text-[10px] text-slate-400">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> Amarnath Securities Limited is a public limited company listed on the BSE Limited (Scrip Code: 538465). The information provided on this portal is published in compliance with the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015 and the Companies Act, 2013. Neither the company nor its directors shall be liable for any investment decisions made on the basis of this website. Investors are advised to consult their independent financial and legal advisors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5 text-slate-400">
            <div>
              © 1994 - 2026 Amarnath Securities Limited. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>CIN: {COMPANY_DETAILS.cin}</span>
              <span>•</span>
              <span>ISIN: {COMPANY_DETAILS.isin}</span>
              <span>•</span>
              <span className="text-[#14B8A6]">Redesigned for 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
