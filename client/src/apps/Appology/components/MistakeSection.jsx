import React, { useState } from 'react';

export default function MistakeSection({ config, onNext }) {
  const [stage, setStage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextStage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(2);
      setIsTransitioning(false);
    }, 600);
  };

  const handleFinish = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onNext();
    }, 600);
  };

  return (
    <div className="w-full min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden px-6 sm:px-12 md:px-20 select-none text-left">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-20 transition-all duration-1000"
          style={{ background: stage === 1 ? 'var(--ap-primary)' : 'var(--ap-accent)' }}
        />
      </div>

      <div className="max-w-3xl w-full z-10 space-y-10">
        {/* Narrative Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold" style={{ color: 'var(--ap-text-primary)' }}>
            I Know I Hurt You
          </h2>
        </div>

        {stage === 1 ? (
          <div 
            className={`transition-all duration-700 transform space-y-8 ${
              isTransitioning ? 'opacity-0 scale-95 -translate-y-8' : 'opacity-100 scale-100 translate-y-0'
            }`}
          >
            {/* Illuminated Paper Surface for Reflection */}
            <div className="ap-glass-card p-8 sm:p-12 md:p-16 space-y-6 relative overflow-hidden">
              <span className="text-xs font-mono uppercase tracking-widest block opacity-80" style={{ color: 'var(--ap-text-secondary)' }}>
                What I Did:
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-serif italic leading-relaxed" style={{ color: 'var(--ap-text-primary)' }}>
                "{config.whatIDid || "I ignored your messages when you needed me, got defensive, and failed to make you feel heard."}"
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextStage}
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-white text-base sm:text-lg font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: 'var(--ap-btn-gradient)' }}
              >
                <span>I Should've Been Better</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          </div>
        ) : (
          <div 
            className={`transition-all duration-700 transform space-y-8 ${
              isTransitioning ? 'opacity-0 scale-95 translate-y-8' : 'opacity-100 scale-100 translate-y-0'
            }`}
          >
            {/* Illuminated Paper Surface for Realization */}
            <div className="ap-glass-card p-8 sm:p-12 md:p-16 space-y-6 relative overflow-hidden">
              <span className="text-xs font-mono uppercase tracking-widest block opacity-80" style={{ color: 'var(--ap-text-secondary)' }}>
                What You Deserved:
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-serif italic leading-relaxed" style={{ color: 'var(--ap-text-primary)' }}>
                "{config.whatIShouldHaveDone || "I should sit silent and listen to yours, listened to your heart, understood your perspective, and given you all my support."}"
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFinish}
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-white text-base sm:text-lg font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: 'var(--ap-btn-gradient)' }}
              >
                <span>Continue Story →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
