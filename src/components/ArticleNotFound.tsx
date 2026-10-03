import React from 'react';
import { PageRoute } from '../types';
import { FileQuestion, ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface ArticleNotFoundProps {
  onNavigate: (route: PageRoute) => void;
}

export const ArticleNotFound: React.FC<ArticleNotFoundProps> = ({ onNavigate }) => (
  <div className="w-full bg-white min-h-[60vh] flex items-center px-4 sm:px-8 py-20">
    <div className="max-w-xl mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/70 flex items-center justify-center mx-auto mb-6">
        <FileQuestion className="w-6 h-6 text-[#0D9488]" />
      </div>

      <div className="text-[11px] font-mono uppercase tracking-widest text-[#9A7B38] font-semibold mb-3">
        Research Library
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1128] mb-3">
        This article is not available
      </h1>

      <p className="text-slate-600 text-sm leading-relaxed mb-8">
        The research note you requested could not be located. It may have been reorganised,
        or the link you followed may be incomplete.
      </p>

      <MagneticButton
        onClick={() => onNavigate('insights')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#0A1128] hover:bg-[#0D9488] transition-colors cursor-pointer shadow-md hover:shadow-lg"
      >
        Browse all insights
        <ArrowRight className="w-4 h-4" />
      </MagneticButton>
    </div>
  </div>
);
