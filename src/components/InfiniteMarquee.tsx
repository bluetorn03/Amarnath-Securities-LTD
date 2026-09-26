import React from 'react';
import { useReducedMotion } from 'motion/react';

interface InfiniteMarqueeProps {
  items?: string[];
  className?: string;
  itemClassName?: string;
  separator?: string;
}

const DEFAULT_MARQUEE_ITEMS = [
  'CAPITAL. STRATEGY. OPPORTUNITY.',
  'BSE LISTED: 538465',
  'CORPORATE ADVISORY & RESTRUCTURING',
  'INSTITUTIONAL MERCHANT BANKING',
  'THREE DECADES OF STEWARDSHIP',
  'SEBI LODR REGULATION 46',
  'ISIN: INE745P01010',
  'ROC AHMEDABAD, GUJARAT',
  'ESTD 1994'
];

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  items = DEFAULT_MARQUEE_ITEMS,
  className = '',
  itemClassName = '',
  separator = '•'
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div 
        className={`w-full py-3.5 px-4 bg-[#FAF7F2] border-y border-[#EFEAE1] overflow-hidden ${className}`}
        aria-label="Institutional Disclosures Summary"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-700">
          {items.map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span>{item}</span>
              {idx < items.length - 1 && <span className="text-[#0D9488] font-bold">{separator}</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full overflow-hidden select-none pointer-events-auto bg-[#FAF7F2] border-y border-[#EFEAE1] py-3 sm:py-3.5 group ${className}`}
      aria-hidden="true"
    >
      {/* Side Edge Fade Gradients for Seamless Editorial Polish */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10" />

      {/* Two Identical Running Tracks for Mathematical Zero-Jump Loop */}
      <div className="flex w-max group-hover:[&_*]:[animation-play-state:paused]">
        {/* Track 1 */}
        <div className="flex shrink-0 items-center gap-8 sm:gap-10 pr-8 sm:pr-10 animate-marquee will-change-transform">
          {items.map((item, idx) => (
            <div key={`track1-${idx}`} className="flex items-center gap-8 sm:gap-10 whitespace-nowrap">
              <span className={`text-[11px] sm:text-xs font-mono tracking-widest uppercase font-semibold text-slate-700 transition-colors hover:text-[#0A1128] ${itemClassName}`}>
                {item}
              </span>
              <span className="text-[#0D9488] text-sm font-bold opacity-80 select-none">
                {separator}
              </span>
            </div>
          ))}
        </div>

        {/* Track 2 (Cloned for seamless infinite loop) */}
        <div className="flex shrink-0 items-center gap-8 sm:gap-10 pr-8 sm:pr-10 animate-marquee will-change-transform" aria-hidden="true">
          {items.map((item, idx) => (
            <div key={`track2-${idx}`} className="flex items-center gap-8 sm:gap-10 whitespace-nowrap">
              <span className={`text-[11px] sm:text-xs font-mono tracking-widest uppercase font-semibold text-slate-700 transition-colors hover:text-[#0A1128] ${itemClassName}`}>
                {item}
              </span>
              <span className="text-[#0D9488] text-sm font-bold opacity-80 select-none">
                {separator}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
