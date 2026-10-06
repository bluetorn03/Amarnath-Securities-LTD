import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  formatNumber?: boolean;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  start = 0,
  prefix = '',
  suffix = '',
  duration = 1800,
  decimals = 0,
  formatNumber = false,
  className = ''
}) => {
  const [value, setValue] = useState(start);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Accessibility: Reduced motion displays final value immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const node = elementRef.current;
    if (!node) {
      setValue(end);
      return;
    }

    let startTime: number | null = null;

    const startAnimation = () => {
      startTime = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth institutional ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        setValue(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setValue(end);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    // Check if element is already in the viewport on mount
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      hasAnimatedRef.current = true;
      startAnimation();
      return;
    }

    if (!('IntersectionObserver' in window)) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimatedRef.current) {
              hasAnimatedRef.current = true;
              startAnimation();
            }
          } else {
            // When completely scrolled away, allow replaying upon return
            // without altering the displayed value
            hasAnimatedRef.current = false;
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, start, duration]);

  const formattedValue = () => {
    if (decimals > 0) return value.toFixed(decimals);
    const rounded = Math.round(value);
    return formatNumber ? rounded.toLocaleString('en-IN') : rounded.toString();
  };

  return (
    <span ref={elementRef} className={`font-mono tabular-nums inline-block ${className}`}>
      {prefix}
      {formattedValue()}
      {suffix}
    </span>
  );
};
