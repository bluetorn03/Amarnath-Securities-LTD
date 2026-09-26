import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  scale?: boolean | number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  direction = 'up',
  distance = 24,
  scale = false,
  once = true
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      case 'none': return { x: 0, y: 0 };
    }
  };

  const initialScale = typeof scale === 'number' ? scale : scale ? 0.96 : 1;

  const initial = {
    opacity: 0,
    scale: initialScale,
    ...getInitialPosition()
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // smooth institutional cubic-bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
