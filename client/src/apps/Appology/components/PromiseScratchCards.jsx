import React, { useState } from 'react';
import { useScratchReveal } from '../hooks/useScratchReveal';

function StoryPathStage({ promiseText, index, total, onChoice }) {
  const { canvasRef, isRevealed, revealManually } = useScratchReveal(0.25);

  return (
    <div 
      className="ap-glass-card p-6 sm:p-10 text-center space-y-6 relative overflow-hidden max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between pb-3">
        <span className="text-xs font-bold uppercase tracking-widest block opacity-80" style={{ color: 'var(--ap-text-secondary)' }}>
          Chapter {index + 1} of {total}
        </span>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 shadow-sm" style={{ color: 'var(--ap-text-primary)' }}>
          ✨ Anka Scratch Card
        </span>
      </div>

      {/* Main Promise Text & Canvas Scratch Overlay */}
      <div className="min-h-[150px] flex flex-col items-center justify-center relative w-full">
        <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold italic leading-relaxed" style={{ color: 'var(--ap-text-primary)' }}>
          "{promiseText}"
        </p>

        {/* HTML5 Scratch Surface Canvas */}
        {!isRevealed && (
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl z-20">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-pointer touch-none"
            />
            {/* Quick Tap Backup Reveal Button */}
            <button
              type="button"
              onClick={revealManually}
              className="absolute bottom-3 right-3 z-30 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[11px] font-bold text-white transition-colors cursor-pointer"
            >
              Tap to Reveal ✨
            </button>
          </div>
        )}
      </div>

      {/* Response Choices */}
      <div className={`transition-all duration-500 space-y-3 ${!isRevealed ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        <p className="text-xs sm:text-sm opacity-80 italic text-slate-300">
          How does this promise feel to you?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onChoice("Okay ❤️")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white text-sm font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'var(--ap-btn-gradient)' }}
          >
            Okay ❤️
          </button>
          <button
            type="button"
            onClick={() => onChoice("We'll Discuss This")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold ap-btn-secondary border shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>We'll Discuss This 💬</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PromiseScratchCards({ config, onNext, socket }) {
  const defaultPromises = [
    "I promise to listen before reacting.",
    "I promise not to repeat this mistake.",
    "I promise to communicate instead of disappearing.",
    "I promise to think about how my actions affect you."
  ];

  const rawPromises = config.promises && config.promises.length > 0
    ? config.promises
    : defaultPromises;

  const promises = rawPromises.slice(0, 4).map(p => typeof p === 'string' ? p : p.text);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChoice = (response) => {
    const payload = {
      promiseIndex: currentIndex + 1,
      promiseText: promises[currentIndex],
      response,
      timestamp: new Date().toISOString()
    };

    if (socket) {
      socket.emit('live-trigger', {
        type: 'PROMISE_RESPONSE',
        payload
      });
    }

    if (currentIndex < promises.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  return (
    <div className="w-full min-h-full my-auto flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-20"
          style={{ background: 'var(--ap-primary)' }}
        />
      </div>

      <div className="max-w-3xl w-full z-10 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">
            My Sacred Promises
          </h2>
          <p className="text-sm opacity-80 text-slate-200">
            Scratch the surface of each card to unlock my promises:
          </p>
        </div>

        {/* Story Path Stage */}
        <StoryPathStage
          key={currentIndex}
          promiseText={promises[currentIndex]}
          index={currentIndex}
          total={promises.length}
          onChoice={handleChoice}
        />
      </div>
    </div>
  );
}
