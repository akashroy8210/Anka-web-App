import React from 'react';

export default function VideoApology({ config, onNext }) {
  const videoUrl = config.videoUrl || config.videoApologyUrl || '';

  if (!videoUrl) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-6 sm:px-12 md:px-20 select-none text-center">
      {/* Environmental Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-25 animate-pulse-glow"
          style={{ background: 'var(--ap-primary)' }}
        />
      </div>

      <div className="max-w-3xl w-full z-10 space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest block text-rose-300">
            Video Message
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight" style={{ color: 'var(--ap-text-primary)' }}>
            {config.videoTitle || "Watch What I Couldn't Say 🎥"}
          </h2>
          {config.videoDescription && (
            <p className="text-sm sm:text-base font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
              {config.videoDescription}
            </p>
          )}
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black aspect-video max-w-2xl mx-auto">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
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
