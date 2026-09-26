import React from 'react';

interface AmarnathLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'navy';
  subtext?: string;
}

export const AmarnathLogo: React.FC<AmarnathLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  variant = 'light',
  subtext = 'BSE: 538465'
}) => {
  // Height proportional to the natural 1077 x 1460 aspect ratio (~1.35x)
  const logoHeight = Math.round(size * 1.35);

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: logoHeight }}
      >
        <img
          src="/amarnath-logo.png"
          alt="Amarnath Securities Limited Official Emblem"
          width={size}
          height={logoHeight}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(13,148,136,0.18)] transition-transform duration-300 hover:scale-105"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span 
            className={`font-display font-bold tracking-[0.14em] text-base sm:text-lg transition-colors ${
              isDark ? 'text-white' : 'text-[#0A1128]'
            }`}
          >
            AMARNATH
          </span>
          <span 
            className={`text-[10px] sm:text-xs uppercase tracking-[0.24em] font-medium transition-colors ${
              isDark ? 'text-[#C5A880]' : 'text-[#9A7B38]'
            }`}
          >
            SECURITIES LIMITED
          </span>
          {subtext && (
            <span 
              className={`text-[9px] tracking-wider mt-0.5 font-mono ${
                isDark ? 'text-[#14B8A6]' : 'text-[#0D9488]'
              }`}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
