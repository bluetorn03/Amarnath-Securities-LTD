import React, { useEffect, useState } from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  as: Component = 'span',
  stagger = 0.04,
  delay = 0.1
}) => {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) {
      setPrefersReducedMotion(true);
      return;
    }
    const timer = setTimeout(() => {
      setMounted(true);
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={className} aria-label={text}>
      <span className="inline-flex flex-wrap gap-x-[0.3em] gap-y-[0.1em]" aria-hidden="true">
        {words.map((word, idx) => (
          <span
            key={idx}
            className="inline-block transition-all"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'none' : 'translate3d(0, 14px, 0)',
              transitionDuration: '0.6s',
              transitionDelay: `${delay + idx * stagger}s`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: mounted ? 'auto' : 'opacity, transform'
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </Component>
  );
};
