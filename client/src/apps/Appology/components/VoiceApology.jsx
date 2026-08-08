import React, { useState, useRef } from 'react';

export default function VoiceApology({ config, onNext }) {
  const audioUrl = config.voiceUrl || config.voiceNoteUrl || '';
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-6 px-4 sm:px-12 md:px-20 select-none text-center">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-25 animate-pulse-glow"
          style={{ background: 'var(--ap-primary)' }}
        />
      </div>

      <div className="max-w-2xl w-full z-10 space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest block text-rose-300">
            Voice Note
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight" style={{ color: 'var(--ap-text-primary)' }}>
            {config.voiceTitle || "I wanted to say this properly 🎙️"}
          </h2>
          <p className="text-sm sm:text-base font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
            {config.voiceDescription || "Press play to listen to my voice note:"}
          </p>
        </div>

        <div className="ap-glass-card p-6 sm:p-8 flex items-center space-x-6 max-w-xl mx-auto">
          <button
            type="button"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 shrink-0"
            style={{ background: 'var(--ap-btn-gradient)' }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className="flex-1 text-left space-y-2">
            <span className="text-sm font-bold block" style={{ color: 'var(--ap-text-primary)' }}>
              {config.creatorName || "Personal Voice Note"}
            </span>
            {/* Animated Waveform */}
            <div className="flex items-center space-x-1.5 h-8">
              {[40, 70, 30, 90, 50, 80, 40, 60, 100, 50, 70, 30, 85, 45, 95].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
                  style={{
                    height: isPlaying ? `${Math.max(25, (h * Math.random()))}%` : `${h * 0.4}%`,
                    background: 'var(--ap-primary-accent)'
                  }}
                />
              ))}
            </div>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onNext}
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white text-base font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'var(--ap-btn-gradient)' }}
          >
            <span>Continue ❤️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
