import React from 'react';

export default function SurpriseReveal({ config, handleOpenLoveLetter }) {
  const imageUrl =
    config.cakeFeedingImage ||
    (config.photos && config.photos[0]) ||
    null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-2xl mx-auto animate-slide-up">

      {/* Badge + heading */}
      <div className="space-y-2">
        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[10px] font-black uppercase tracking-widest inline-block">
          💖 Sweet Surprise
        </span>
        <h2
          className="font-romantic text-6xl sm:text-7xl text-white leading-tight"
          style={{ textShadow: '0 0 40px rgba(225,29,72,0.35)' }}
        >
          Our Cake Moment
        </h2>
      </div>

      {/* Image — only if we have one */}
      {imageUrl && (
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={imageUrl}
              alt="Cake Feeding Moment"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="px-5 py-4">
            <p className="font-romantic text-xl text-rose-200/70 italic leading-relaxed">
              "Sharing sweet bites, celebrating another beautiful year…"
            </p>
          </div>
        </div>
      )}

      {/* No image fallback */}
      {!imageUrl && (
        <div className="text-6xl">🎂</div>
      )}

      {/* Read Letter button — the ONLY button here */}
      <button
        onClick={handleOpenLoveLetter}
        className="px-10 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_50px_rgba(225,29,72,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-rose-500/30"
      >
        💌 Read My Letter
      </button>
    </div>
  );
}
