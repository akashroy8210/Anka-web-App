import React, { useState, useEffect } from 'react';

export default function OpeningMessage({ config, onNext }) {
  const lines = [
    config.openingLine1 || "I know you're upset with me.",
    config.openingLine2 || "And honestly...",
    config.openingLine3 || "You have every right to be upset."
  ];

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isAllComplete, setIsAllComplete] = useState(false);

  useEffect(() => {
    if (isAllComplete) return;

    const currentText = lines[lineIndex];

    // 1. Type letter-by-letter
    if (charIndex < currentText.length) {
      const typeTimer = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(typeTimer);
    } 

    // 2. Sentence typing complete: wait 0.5s, fade out line, then start next line
    if (!isFadingOut) {
      const pauseTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 500);
      return () => clearTimeout(pauseTimer);
    }

    // 3. Fade out transition pause (400ms) -> clear previous line and start next line
    const transitionTimer = setTimeout(() => {
      if (lineIndex < lines.length - 1) {
        setLineIndex(prev => prev + 1);
        setCharIndex(0);
        setIsFadingOut(false);
      } else {
        setIsAllComplete(true);
      }
    }, 400);

    return () => clearTimeout(transitionTimer);
  }, [lineIndex, charIndex, isFadingOut, isAllComplete, lines]);

  const displayedText = lines[lineIndex]?.substring(0, charIndex) || '';

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Full-screen cinematic background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-25 animate-pulse-glow"
          style={{ background: 'var(--ap-primary)' }}
        />
      </div>

      {/* Narrative Scene Content */}
      <div className="max-w-3xl w-full z-10 space-y-12">
        <div className="min-h-[220px] flex items-center justify-center">
          {!isAllComplete ? (
            <p 
              className={`font-serif text-3xl sm:text-4xl md:text-6xl font-bold tracking-wide leading-tight transition-all duration-400 transform ${
                isFadingOut ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
              }`}
              style={{ 
                color: 'var(--ap-text-primary)',
                fontFamily: 'Playfair Display, Georgia, serif'
              }}
            >
              {displayedText}
              <span className="inline-block w-1.5 h-8 sm:h-12 ml-2 bg-rose-500 animate-pulse align-middle" />
            </p>
          ) : (
            /* Final Message after all lines finish typing */
            <p 
              className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold tracking-wide leading-tight animate-paper-unfold"
              style={{ 
                color: 'var(--ap-text-primary)',
                fontFamily: 'Playfair Display, Georgia, serif' 
              }}
            >
              {lines[2]}
            </p>
          )}
        </div>

        {/* Natural Embedded Story CTA */}
        <div 
          className={`transition-all duration-1000 transform ${
            isAllComplete
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={onNext}
            className="group relative inline-flex items-center justify-center px-12 py-5 rounded-full text-white text-base sm:text-lg md:text-xl font-serif font-bold tracking-wider shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-white/20"
            style={{ background: 'var(--ap-btn-gradient)' }}
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <span className="relative z-10 flex items-center gap-3">
              {config.openingBtnText || "Just Give Me One Minute ❤️"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
