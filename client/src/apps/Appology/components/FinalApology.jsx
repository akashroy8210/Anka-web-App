import React, { useState } from 'react';

export default function FinalApology({ config, onFinalChoice, socket }) {
  const [chosen, setChosen] = useState(null);

  const handleChoice = (choiceText) => {
    setChosen(choiceText);

    if (socket) {
      socket.emit('live-trigger', {
        type: 'FINAL_CHOICE',
        payload: {
          choice: choiceText,
          timestamp: new Date().toISOString()
        }
      });
    }

    if (onFinalChoice) {
      onFinalChoice(choiceText);
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[180px] opacity-20 animate-pulse-glow"
          style={{ background: 'var(--ap-primary)' }}
        />
      </div>

      <div className="max-w-2xl w-full z-10 space-y-8">
        {/* Authentic Physical Parchment Paper Love Letter */}
        <div className="animate-paper-unfold p-8 sm:p-14 md:p-16 rounded-xl bg-[#FAF4E8] text-left space-y-6 relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-[#E6D7C3] transform hover:rotate-0 rotate-[-0.5deg] transition-transform duration-500">
          
          {/* Subtle Paper Crease & Vintage Inner Shadow */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 90px rgba(160, 110, 60, 0.15), inset 0 0 15px rgba(100, 60, 20, 0.1)'
            }}
          />

          {/* Paper Fold Lines (Horizontal & Vertical Creases) */}
          <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-[#D6C4AD]/40 pointer-events-none" />
          <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-[#D6C4AD]/40 pointer-events-none" />

          {/* Authentic Fountain Ink Letter Content */}
          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between border-b border-[#E0D0BB] pb-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight" style={{ color: '#2A1B0E' }}>
                I'm Sorry. Truly.
              </h2>
              <span className="text-xs font-serif italic" style={{ color: '#8B6B4F' }}>
                Handwritten with Love
              </span>
            </div>

            <div className="space-y-4 text-base sm:text-xl font-serif italic leading-relaxed pt-2" style={{ color: '#3B2818' }}>
              <p className="indent-4" style={{ color: '#3B2818' }}>
                "{config.finalApologyLetter || "I'm not asking you to forget what happened. I'm asking for the chance to show you that I can do better."}"
              </p>
            </div>

            <div className="pt-6 flex items-end justify-between">
              {/* Embossed Red Wax Seal */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-700 via-red-800 to-rose-950 border-2 border-rose-400/50 shadow-lg flex items-center justify-center text-white text-2xl transform -rotate-12 hover:scale-110 transition-transform">
                ❤️
              </div>

              <div className="text-right">
                <span className="text-base sm:text-lg font-serif italic block" style={{ color: '#8B6B4F' }}>
                  Forever yours,
                </span>
                <span className="text-lg sm:text-2xl font-serif font-bold mt-1 block" style={{ color: '#2A1B0E' }}>
                  — {config.creatorName || config.senderName || "With Love"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Decision Choices */}
        <div className="space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest block opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
            What Happens Next Is Up To You
          </span>

          {!chosen ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleChoice("Let's Start Again")}
                className="w-full sm:w-auto px-10 py-4 rounded-full text-white text-base font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: 'var(--ap-btn-gradient)' }}
              >
                ❤️ Let's Start Again
              </button>
              <button
                type="button"
                onClick={() => handleChoice("I Want To Talk")}
                className="w-full sm:w-auto px-10 py-4 rounded-full text-base font-bold ap-btn-secondary border shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>💌 I Want To Talk</span>
              </button>
            </div>
          ) : (
            <div className="ap-glass-card animate-paper-unfold p-6 text-center space-y-2">
              <p className="text-xl font-serif font-bold" style={{ color: 'var(--ap-text-primary)' }}>
                Thank you for choosing: "{chosen}"
              </p>
              <p className="text-xs font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
                Your response has been saved and shared with your loved one. ❤️
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
