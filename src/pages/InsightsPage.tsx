import React from 'react';
import { PageRoute } from '../types';
import { INSIGHTS } from '../data/mockData';
import { InsightCard } from '../components/InsightCard';
import { TextReveal } from '../components/TextReveal';
import { ScrollReveal } from '../components/ScrollReveal';
import { MagneticButton } from '../components/MagneticButton';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface InsightsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white text-[#0A1128] min-h-screen font-sans">
      {/* Page Header — clean light institutional */}
      <div className="bg-[#F8FAFC] border-b border-slate-200/80 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D9488] font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Market Intelligence & Research</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A1128] tracking-tight leading-tight">
              <TextReveal text="Capital Markets & Regulatory Perspectives" delay={0.1} />
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Analytical viewpoints from Amarnath Securities research desk on Indian structured finance,
              SEBI listing norms, corporate transactions and macroeconomic shifts.
            </p>
          </div>
        </div>
      </div>

      {/* Article library */}
      <div className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between gap-4 mb-7">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[#0A1128]">
              Research Notes
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              {INSIGHTS.length} Notes Published
            </span>
          </div>

          <ScrollReveal direction="up" distance={20}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INSIGHTS.map((article, index) => (
                <InsightCard
                  key={article.id}
                  article={article}
                  onNavigate={onNavigate}
                  index={index}
                />
              ))}
            </div>
          </ScrollReveal>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 mb-4 font-mono">
              For research enquiries or customised market analysis
            </p>
            <MagneticButton
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white bg-[#0A1128] hover:bg-[#0D9488] transition-colors cursor-pointer shadow-md hover:shadow-lg"
            >
              Contact Research & Advisory Desk
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};
