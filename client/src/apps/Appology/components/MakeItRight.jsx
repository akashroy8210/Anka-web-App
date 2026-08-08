import React, { useState } from 'react';

export default function MakeItRight({ config, onNext }) {
  const [needTimeText, setNeedTimeText] = useState(null);

  const handleNeedTime = () => {
    setNeedTimeText("I understand completely. Take all the time you need. I will be right here whenever you're ready to talk. ❤️");
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-25 animate-pulse-glow"
          style={{ background: 'var(--ap-primary)' }}
        />
      </div>

      <div className="max-w-3xl w-full z-10 space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest block text-rose-300">
            One Core Question
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight" style={{ color: 'var(--ap-text-primary)' }}>
            Can I try to make this right? ❤️
          </h2>
        </div>

        {needTimeText && (
          <div className="ap-glass-card animate-paper-unfold p-8 text-lg sm:text-xl font-serif italic leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--ap-text-primary)' }}>
            {needTimeText}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-xl mx-auto pt-4">
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-12 py-5 rounded-full text-white text-lg font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'var(--ap-btn-gradient)' }}
          >
            {config.yesBtnLabel || "❤️ Yes, Let's Try Again"}
          </button>

          {!needTimeText && (
            <button
              type="button"
              onClick={handleNeedTime}
              className="w-full sm:w-auto px-10 py-5 rounded-full text-base sm:text-lg font-bold ap-btn-secondary border shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>I Need Some Time ⏳</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
