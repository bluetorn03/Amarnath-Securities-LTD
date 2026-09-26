import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

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
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(start);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Restart animation from start value to final value
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          startTime = null;
          setValue(start);
          rafRef.current = requestAnimationFrame(animate);
        } else {
          // Reset when scrolled out of view, so it replays upon return!
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          startTime = null;
          setValue(start);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, start, duration, prefersReducedMotion]);

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
