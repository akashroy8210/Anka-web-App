import React, { useState } from 'react';

export default function ThingsISaid({ config, onNext }) {
  const defaultNotes = [
    { title: "What I Kept Inside", text: "I should have listened when you tried to tell me how you felt." },
    { title: "What You Deserved", text: "I should have understood your perspective instead of defending myself." },
    { title: "My Missing Words", text: "I should have communicated clearly instead of staying silent." },
    { title: "My Core Promise", text: "I should never have allowed you to feel alone for even a second." }
  ];

  const rawNotes = config.handwrittenNotes && config.handwrittenNotes.length > 0
    ? config.handwrittenNotes
    : defaultNotes;

  const notes = rawNotes.slice(0, 4).map((item, idx) => {
    if (typeof item === 'string') {
      return { title: `Thought #${idx + 1}`, text: item };
    }
    return { title: item.title || `Thought #${idx + 1}`, text: item.text || item.content || defaultNotes[idx]?.text };
  });

  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-20"
          style={{ background: 'var(--ap-accent)' }}
        />
      </div>

      <div className="max-w-5xl w-full z-10 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold" style={{ color: 'var(--ap-text-primary)' }}>
            Instead of All those Excuses, I should have said
          </h2>
          <p className="text-sm sm:text-base font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
            Tap each floating romantic keepsake envelope to unfold the letter inside:
          </p>
        </div>

        {/* 4 Floating Romantic Keepsakes in 3D Space */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center">
          {notes.map((note, idx) => {
            const isFlipped = flippedCards[idx];

            return (
              <div
                key={idx}
                onClick={() => toggleFlip(idx)}
                className="w-full h-[240px] sm:h-[270px] perspective-1000 cursor-pointer group"
              >
                <div 
                  className={`w-full h-full relative transition-transform duration-700 preserve-3d rounded-3xl ${
                    isFlipped ? 'rotate-y-180' : 'group-hover:scale-105'
                  }`}
                >
                  {/* FRONT: Keepsake Envelope */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-3xl backdrop-blur-2xl border p-6 flex flex-col justify-between items-center text-center backface-hidden shadow-2xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-2xl animate-pulse-glow">
                      💌
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest block text-rose-300">
                        {note.title}
                      </span>
                      <p className="text-sm font-serif font-semibold text-white">
                        Unfold Letter 💌
                      </p>
                    </div>
                    <span className="text-xs opacity-60 italic text-slate-300">
                      Tap to open
                    </span>
                  </div>

                  {/* BACK: Revealed Handwritten Letter Note */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-3xl backdrop-blur-2xl border p-6 flex flex-col justify-between items-center text-center backface-hidden rotate-y-180 shadow-2xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'var(--ap-accent)'
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-500/30 text-rose-200 flex items-center justify-center text-sm">
                      ✨
                    </div>
                    <p className="text-sm sm:text-base font-serif italic leading-relaxed my-auto text-white">
                      "{note.text}"
                    </p>
                    <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                      ❤️ Revealed
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNext}
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white text-base font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'var(--ap-btn-gradient)' }}
          >
            <span>My Promises →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
