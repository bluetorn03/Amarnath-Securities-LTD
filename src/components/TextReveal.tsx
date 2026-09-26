import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

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
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <Component className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex flex-wrap gap-x-[0.3em] gap-y-[0.1em]"
      >
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            variants={wordVariants}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
};
