import React, { useState, useEffect, useRef } from 'react';

interface TypewriterLoopProps {
  id?: string;
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
  id,
  phrases = DEFAULT_PHRASES,
  typingSpeed = 65,
  deletingSpeed = 30,
  pauseDuration = 2000,
  className = '',
  cursorClassName = 'text-[#0D9488]'
}) => {
  const activePhrases = phrases && phrases.length > 0 ? phrases : DEFAULT_PHRASES;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const phrasesRef = useRef(activePhrases);
  useEffect(() => {
    phrasesRef.current = activePhrases;
  }, [activePhrases]);

  useEffect(() => {
    const currentTarget = phrasesRef.current[phraseIndex % phrasesRef.current.length] || '';
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < currentTarget.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing full phrase: pause before deleting
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
        // Finished deleting: pause slightly then transition to next phrase
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrasesRef.current.length);
        }, 320);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex, typingSpeed, deletingSpeed, pauseDuration]);

  const currentPhrase = activePhrases[phraseIndex % activePhrases.length];

  return (
    <span 
      id={id}
      className={`inline-flex items-center min-h-[1.3em] align-middle ${className}`}
      aria-label={currentPhrase}
    >
      <span className="inline-block whitespace-pre" aria-hidden="true">
        {displayedText || '\u00A0'}
      </span>
      <span
        className={`inline-block w-[2.5px] h-[1.1em] ml-1.5 align-middle rounded-full bg-current ${cursorClassName}`}
        style={{ animation: 'cursor-blink 0.9s step-start infinite' }}
        aria-hidden="true"
      />
    </span>
  );
};
