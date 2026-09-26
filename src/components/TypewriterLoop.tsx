import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface TypewriterLoopProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

const DEFAULT_PHRASES = [
  'Corporate Finance & Advisory',
  'Merchant Banking Services',
  'Capital Raising & Investment Solutions',
  'Strategic Financial Advisory'
];

export const TypewriterLoop: React.FC<TypewriterLoopProps> = ({
  phrases = DEFAULT_PHRASES,
  typingSpeed = 65,
  deletingSpeed = 35,
  pauseDuration = 2200,
  className = '',
  cursorClassName = 'text-[#0D9488]'
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Use ref to keep active list of phrases without resetting the effect on render
  const phrasesRef = useRef(phrases);
  useEffect(() => {
    phrasesRef.current = phrases.length > 0 ? phrases : DEFAULT_PHRASES;
  }, [phrases]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(phrasesRef.current[0] || '');
      return;
    }

    const currentTarget = phrasesRef.current[phraseIndex % phrasesRef.current.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      // Typing phase: add one character
      if (displayedText.length < currentTarget.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Full phrase displayed: pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting phase: remove one character
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting: pause slightly then move to next phrase
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrasesRef.current.length);
        }, 300);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex, typingSpeed, deletingSpeed, pauseDuration, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span className={`inline-block ${className}`}>{phrases[0] || ''}</span>;
  }

  const currentPhrase = phrasesRef.current[phraseIndex % phrasesRef.current.length];

  return (
    <span 
      className={`inline-flex items-center min-h-[1.3em] align-middle ${className}`}
      aria-label={currentPhrase}
    >
      <span className="inline-block" aria-hidden="true">
        {displayedText}
      </span>
      <span
        className={`inline-block w-[2.5px] h-[1.05em] ml-1.5 align-middle rounded-full bg-current ${cursorClassName} animate-[cursor-blink_0.9s_step-start_infinite]`}
        aria-hidden="true"
      />
    </span>
  );
};
