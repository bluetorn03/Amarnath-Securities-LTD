import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PageRoute } from '../types';

export interface StackCardItem {
  id: string;
  stepNumber: string;
  title: string;
  category: string;
  description: string;
  keyPoints: string[];
  statBadge?: { label: string; value: string };
  route?: PageRoute;
  icon?: React.ReactNode;
}

interface StickyCardStackProps {
  items: StackCardItem[];
  onNavigate?: (route: PageRoute) => void;
  className?: string;
}

export const StickyCardStack: React.FC<StickyCardStackProps> = ({
  items,
  onNavigate,
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative space-y-6 sm:space-y-8 ${className}`}>
      {items.map((item, index) => {
        // Sticky offset so cards stack with an elegant revealed header margin
        const topOffset = 100 + index * 24;

        return (
          <div
            key={item.id}
            style={{
              position: 'sticky',
              top: `${topOffset}px`,
              zIndex: 10 + index,
            }}
            className="transition-all duration-300"
          >
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.08)] hover:border-[#0D9488]/40 transition-all p-6 sm:p-8 md:p-10 group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left side: Step info + Title + Description */}
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0D9488] bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60 uppercase">
                      {item.stepNumber}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#9A7B38] font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A1128] group-hover:text-[#0D9488] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bullet points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {item.keyPoints.map((point, ptIdx) => (
                      <div key={ptIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side: Stat Badge & CTA Button */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 shrink-0">
                  {item.statBadge && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-right min-w-[140px]">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                        {item.statBadge.label}
                      </span>
                      <span className="font-mono text-base font-bold text-[#0A1128] block mt-0.5">
                        {item.statBadge.value}
                      </span>
                    </div>
                  )}

                  {item.route && onNavigate && (
                    <button
                      onClick={() => onNavigate(item.route!)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0A1128] text-white hover:bg-[#0D9488] transition-colors shadow-sm group-hover:shadow-md cursor-pointer"
                    >
                      <span>Explore Division</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
