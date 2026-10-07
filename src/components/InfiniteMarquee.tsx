import React from 'react';

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
  const renderTrack = (trackKey: string, isAriaHidden = false) => (
    <div
      key={trackKey}
      className="flex shrink-0 flex-nowrap items-center gap-8 sm:gap-10 pr-8 sm:pr-10 animate-marquee will-change-transform"
      aria-hidden={isAriaHidden ? 'true' : undefined}
    >
      {items.map((item, idx) => (
        <div key={`${trackKey}-${idx}`} className="flex items-center gap-8 sm:gap-10 whitespace-nowrap shrink-0">
          <span className={`text-[11px] sm:text-xs font-mono tracking-widest uppercase font-semibold text-slate-700 transition-colors hover:text-[#0A1128] ${itemClassName}`}>
            {item}
          </span>
          <span className="text-[#0D9488] text-sm font-bold opacity-80 select-none">
            {separator}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div 
      className={`relative w-full overflow-hidden select-none pointer-events-auto bg-[#FAF7F2] border-y border-[#EFEAE1] py-3 sm:py-3.5 group ${className}`}
      aria-label="Institutional Disclosures Summary"
    >
      {/* Side Edge Fade Gradients for Seamless Editorial Polish */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10" />

      {/* Identical Running Tracks for Mathematical Zero-Jump Loop (Always single horizontal row) */}
      <div className="flex w-max flex-nowrap">
        {renderTrack('track-1', false)}
        {renderTrack('track-2', true)}
        {renderTrack('track-3', true)}
        {renderTrack('track-4', true)}
      </div>
    </div>
  );
};
