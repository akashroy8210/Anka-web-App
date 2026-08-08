import React, { useState } from 'react';

export default function FutureChanges({ config, onNext }) {
  const defaultChanges = [
    "I'll listen before getting defensive.",
    "I'll communicate clearly instead of disappearing.",
    "I'll give you the love and attention you deserve.",
    "I'll think about how my actions affect your heart."
  ];

  const rawChanges = config.futureChanges && config.futureChanges.length > 0
    ? config.futureChanges
    : defaultChanges;

  const changes = rawChanges.slice(0, 4).map(item => typeof item === 'string' ? item : item.text);

  const [revealedCount, setRevealedCount] = useState(0);

  const handleOpenNext = () => {
    if (revealedCount < changes.length) {
      setRevealedCount(prev => prev + 1);
    }
  };

  const allRevealed = revealedCount >= changes.length;

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-20"
          style={{ background: 'var(--ap-primary)' }}
        />
      </div>

      <div className="max-w-3xl w-full z-10 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold" style={{ color: 'var(--ap-text-primary)' }}>
            Next Time... 🌱
          </h2>
          <p className="text-sm sm:text-base font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
            Touch each milestone along our commitment path to reveal how I'll do better:
          </p>
        </div>

        {/* Handwritten Timeline Path */}
        <div className="space-y-3 max-w-xl mx-auto text-left">
          {changes.map((item, idx) => {
            const isRevealed = revealedCount > idx;

            return (
              <div
                key={idx}
                onClick={handleOpenNext}
                className={`ap-glass-card p-5 sm:p-6 transition-all duration-600 ease-out cursor-pointer transform ${
                  isRevealed
                    ? 'opacity-100 scale-100 translate-y-0 border-rose-500/40'
                    : 'opacity-50 scale-95 translate-y-3 hover:opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest block opacity-80" style={{ color: 'var(--ap-text-secondary)' }}>
                    Step 0{idx + 1}
                  </span>
                  <span className="text-base">{isRevealed ? '🌱' : '✉️'}</span>
                </div>
                <p className="text-base sm:text-lg font-serif font-medium mt-2 leading-relaxed" style={{ color: 'var(--ap-text-primary)' }}>
                  {isRevealed ? `"${item}"` : "Tap to reveal commitment..."}
                </p>
              </div>
            );
          })}
        </div>

        {/* Final Message & CTA */}
        {allRevealed && (
          <div className="animate-paper-unfold space-y-6 pt-2">
            <p className="text-base sm:text-xl font-serif italic text-rose-200">
              "I don't want to promise perfection. I want to promise that I'll try harder."
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onNext}
                className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white text-base font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: 'var(--ap-btn-gradient)' }}
              >
                <span>The Final Letter →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
