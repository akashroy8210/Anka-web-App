import React from 'react';

export default function SurpriseReveal({ config, handleOpenLoveLetter }) {
  const imageUrlRaw =
    config.cakeFeedingImage ||
    (config.photos && config.photos[0]) ||
    null;
  const imageUrl = (imageUrlRaw && typeof imageUrlRaw === 'object') ? imageUrlRaw.url : (imageUrlRaw || '');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-2xl mx-auto animate-slide-up">

      {/* Badge + heading */}
      <div className="space-y-2">
        <span className="px-4 py-1.5 rounded-full bday-card bday-text-accent text-[10px] font-black uppercase tracking-widest inline-block">
          💖 Sweet Surprise
        </span>
        <h2 className="font-romantic text-4xl sm:text-6xl md:text-7xl bday-text-title leading-tight">
          Our Cake Moment
        </h2>
      </div>

      {/* Image — only if we have one */}
      {imageUrl && (
        <div className="w-full max-w-sm bday-card rounded-3xl overflow-hidden shadow-2xl">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={imageUrl}
              alt="Cake Feeding Moment"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="px-5 py-4">
            <p className="font-romantic text-xl bday-text-sub italic leading-relaxed">
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
        className="px-10 py-4 bday-btn text-sm font-black uppercase tracking-widest rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        💌 Read My Letter
      </button>
    </div>
  );
}
