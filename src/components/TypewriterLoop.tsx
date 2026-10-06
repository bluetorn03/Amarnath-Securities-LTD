import React, { useState, useEffect, useRef } from 'react';

interface TypewriterLoopProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

const DEFAULT_PHRASES = [
  'Business Development',
  'Mergers & Acquisitions',
  'Strategic Opportunities',
  'Responsible Growth'
];

export const TypewriterLoop: React.FC<TypewriterLoopProps> = ({
  phrases = DEFAULT_PHRASES,
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseDuration = 2200,
  className = '',
  cursorClassName = 'text-[#0D9488]'
}) => {
  const activePhrases = phrases && phrases.length > 0 ? phrases : DEFAULT_PHRASES;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(activePhrases[0].slice(0, 1));
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const phrasesRef = useRef(activePhrases);
  useEffect(() => {
    phrasesRef.current = activePhrases;
  }, [activePhrases]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(phrasesRef.current[0] || '');
      return;
    }

    const currentTarget = phrasesRef.current[phraseIndex % phrasesRef.current.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < currentTarget.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrasesRef.current.length);
        }, 320);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex, typingSpeed, deletingSpeed, pauseDuration, prefersReducedMotion]);

  const currentPhrase = activePhrases[phraseIndex % activePhrases.length];

  if (prefersReducedMotion) {
    return <span className={`inline-block ${className}`}>{activePhrases[0]}</span>;
  }

  return (
    <span 
      className={`inline-flex items-center min-h-[1.3em] align-middle ${className}`}
      aria-label={currentPhrase}
    >
      <span className="inline-block" aria-hidden="true">
        {displayedText}
      </span>
      <span
        className={`inline-block w-[2.5px] h-[1.1em] ml-1.5 align-middle rounded-full bg-current ${cursorClassName} animate-[cursor-blink_0.9s_step-start_infinite]`}
        aria-hidden="true"
      />
    </span>
  );
};
