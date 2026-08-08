import React, { useState, useEffect } from 'react';

export default function NoExcuses({ config, onNext }) {
  const [activeCards, setActiveCards] = useState([0, 1, 2]);
  const [exitingCard, setExitingCard] = useState(null);
  const [entranceStep, setEntranceStep] = useState(0);
  const [showRealization, setShowRealization] = useState(false);
  const [revealLineCount, setRevealLineCount] = useState(0);

  const notesData = [
    {
      id: 0,
      label: "AN EXCUSE",
      text: config.excuse1 || "I had my reasons...",
      rotation: "rotate-[-4deg]",
      desktopPos: "md:col-span-2 md:translate-x-4 md:-translate-y-2"
    },
    {
      id: 1,
      label: "AN EXCUSE",
      text: config.excuse2 || "I wasn't in the right state of mind...",
      rotation: "rotate-[5deg]",
      desktopPos: "md:col-span-2 md:col-start-2 md:translate-x-8 md:translate-y-4"
    },
    {
      id: 2,
      label: "AN EXCUSE",
      text: config.excuse3 || "I thought things would be different...",
      rotation: "rotate-[-3deg]",
      desktopPos: "md:col-span-2 md:col-start-1 md:-translate-x-4 md:translate-y-2"
    }
  ];

  // 1. Cinematic Entrance Sequence: Note 1 -> Note 2 -> Note 3
  useEffect(() => {
    const t1 = setTimeout(() => setEntranceStep(1), 400);
    const t2 = setTimeout(() => setEntranceStep(2), 900);
    const t3 = setTimeout(() => setEntranceStep(3), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleDiscard = (id) => {
    if (exitingCard !== null || showRealization) return;
    setExitingCard(id);

    setTimeout(() => {
      setActiveCards(prev => {
        const next = prev.filter(cardId => cardId !== id);
        // Once final note disappears, trigger 0.8s silence pause before emotional text reveal
        if (next.length === 0) {
          setTimeout(() => {
            setShowRealization(true);
          }, 800);
        }
        return next;
      });
      setExitingCard(null);
    }, 700);
  };

  // 2. Sequential timed text reveal for emotional apology statement
  useEffect(() => {
    if (!showRealization) return;

    const r1 = setTimeout(() => setRevealLineCount(1), 500);
    const r2 = setTimeout(() => setRevealLineCount(2), 1600);
    const r3 = setTimeout(() => setRevealLineCount(3), 2800);

    return () => {
      clearTimeout(r1);
      clearTimeout(r2);
      clearTimeout(r3);
    };
  }, [showRealization]);

  const allCleared = activeCards.length === 0;

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Deep Atmospheric Background Spotlight & Soft Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px] transition-all duration-1000 ${
            showRealization ? 'w-[800px] h-[800px] opacity-15' : 'w-[650px] h-[650px] opacity-25'
          }`}
          style={{ background: 'var(--ap-primary)' }}
        />
        <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />
      </div>

      <div className="max-w-4xl w-full z-10 space-y-10">
        {/* Header Scene Text */}
        {!allCleared && (
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-wide" style={{ color: 'var(--ap-text-primary)' }}>
              Touch an excuse and let it disappear.
            </h2>
            <p className="text-sm sm:text-base font-medium opacity-90 italic font-serif" style={{ color: 'var(--ap-text-secondary)' }}>
              No Excuses. Just Sorry.
            </p>
          </div>
        )}

        {/* 3 Physical Paper Apology Notes Floating in Natural Spatial Composition */}
        {!allCleared ? (
          <div className="min-h-[340px] sm:min-h-[380px] flex items-center justify-center relative perspective-1000">
            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-center justify-center max-w-3xl mx-auto">
              {activeCards.map((id) => {
                const note = notesData.find(c => c.id === id);
                const isEntered = entranceStep > id;
                const isExiting = exitingCard === id;

                return (
                  <div
                    key={id}
                    onClick={() => handleDiscard(id)}
                    className={`ap-glass-card p-8 sm:p-10 text-left cursor-pointer transition-all duration-700 ease-out transform preserve-3d ${note.rotation} ${note.desktopPos} ${
                      !isEntered
                        ? 'opacity-0 scale-75 translate-y-12 pointer-events-none'
                        : isExiting
                        ? 'opacity-0 scale-20 -translate-y-36 rotate-45 blur-xl pointer-events-none'
                        : 'hover:scale-105 hover:rotate-0 hover:z-30 hover:border-rose-400/50 active:scale-95 z-10'
                    }`}
                  >
                    <div className="space-y-3">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest block opacity-80" style={{ color: 'var(--ap-text-secondary)' }}>
                        {note.label}
                      </span>
                      <p className="text-lg sm:text-xl font-serif italic leading-relaxed" style={{ color: 'var(--ap-text-primary)' }}>
                        "{note.text}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Emotional Apology Statement directly in the scene (NO CARD, NO POPUP, NO CONTAINER) */
          showRealization && (
            <div className="max-w-3xl mx-auto space-y-12 py-8 select-none">
              <div className="space-y-6 min-h-[220px] flex flex-col justify-center items-center">
                {revealLineCount >= 1 && (
                  <p className="animate-paper-unfold text-2xl sm:text-3xl font-serif italic opacity-85 text-slate-200">
                    And honestly...
                  </p>
                )}

                {revealLineCount >= 2 && (
                  <p className="animate-paper-unfold text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
                    "{config.noExcusesStatement || "none of that changes what I did."}"
                  </p>
                )}

                {revealLineCount >= 3 && (
                  <p className="animate-paper-unfold text-2xl sm:text-4xl font-serif font-bold text-rose-300">
                    I'm sorry.
                  </p>
                )}
              </div>

              {/* Primary Story CTA Button */}
              {revealLineCount >= 3 && (
                <div className="animate-paper-unfold flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={onNext}
                    className="group relative inline-flex items-center justify-center px-12 py-5 rounded-full text-white text-base sm:text-lg font-serif font-bold tracking-wider shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-white/20"
                    style={{ background: 'var(--ap-btn-gradient)' }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span>I Understand ❤️</span>
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
