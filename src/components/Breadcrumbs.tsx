import React from 'react';
import { PageRoute } from '../types';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentRoute, onNavigate }) => {
  if (currentRoute === 'home') return null;

  const parts = currentRoute.split('/');
  
  const getLabel = (part: string) => {
    switch (part) {
      case 'about': return 'About Us';
      case 'leadership': return 'Board & Leadership';
      case 'governance': return 'Corporate Governance';
      case 'corporate-info': return 'Corporate Information';
      case 'capabilities': return 'Capabilities';
      case 'corporate-finance': return 'Corporate Finance & Advisory';
      case 'merchant-banking': return 'Merchant Banking';
      case 'investment-banking': return 'Investment Banking';
      case 'securities-services': return 'Securities & Investment';
      case 'corporate-lending': return 'Corporate Lending';
      case 'investor-relations': return 'Investor Relations';
      case 'financial-results': return 'Financial Results';
      case 'annual-reports': return 'Annual Reports';
      case 'shareholding-pattern': return 'Shareholding Pattern';
      case 'bse-disclosures': return 'BSE Disclosures';
      case 'regulation-46': return 'Regulation 46';
      case 'agm-notices': return 'AGM / EGM / Notices';
      case 'policies': return 'Company Policies';
      case 'grievance': return 'Investor Grievance';
      case 'rta': return 'Registrar & Transfer Agent';
      case 'insights': return 'Market Insights';
      case 'contact': return 'Contact & Enquiry';
      default: return part.replace('-', ' ');
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="py-2.5 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-sans">
        <li>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 text-slate-600 hover:text-[#0D9488] transition-colors cursor-pointer"
            id="breadcrumb-home"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>

        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          const route = parts.slice(0, index + 1).join('/') as PageRoute;

          return (
            <React.Fragment key={part}>
              <li className="text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                {isLast ? (
                  <span className="text-[#9A7B38] font-semibold" aria-current="page">
                    {getLabel(part)}
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate(route)}
                    className="text-slate-600 hover:text-[#0D9488] transition-colors cursor-pointer"
                  >
                    {getLabel(part)}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
