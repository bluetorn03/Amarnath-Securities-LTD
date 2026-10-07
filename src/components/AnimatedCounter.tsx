import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  formatNumber?: boolean;
  decimalClassName?: string;
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
  decimalClassName = '',
  className = ''
}) => {
  const [value, setValue] = useState(start);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
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

    // Immediate viewport check on mount so content already in view starts animating
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
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10px 0px'
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, start, duration]);

  const renderContent = () => {
    let numStr: string;
    if (decimals > 0) {
      numStr = value.toFixed(decimals);
    } else {
      const rounded = Math.round(value);
      numStr = formatNumber ? rounded.toLocaleString('en-IN') : rounded.toString();
    }

    if (decimalClassName && decimals > 0 && numStr.includes('.')) {
      const [whole, dec] = numStr.split('.');
      return (
        <>
          <span>{whole}</span>
          <span className={decimalClassName}>.{dec}</span>
        </>
      );
    }

    return numStr;
  };

  return (
    <span ref={elementRef} className={`font-mono tabular-nums inline-block ${className}`}>
      {prefix}
      {renderContent()}
      {suffix}
    </span>
  );
};
