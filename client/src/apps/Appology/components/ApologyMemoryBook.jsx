import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ApologyMemoryBook({ config, onNext }) {
  const customChapters = config?.chapters || config?.memoryBook || config?.memories || [];
  
  const defaultChapters = [
    {
      title: "WHERE IT ALL BEGAN",
      subtitle: "ISSUE NO. 01 • OUR FIRST MOMENTS",
      shayariLeft: "पहली नज़र की वो मीठी सी बातें,\nयाद आती हैं मुझे वो हसीन मुलाकातें।\nमेरी हर खता को माफ़ कर दो तुम,\nतेरे बिना अधूरी लगती हैं रातें। ❤️",
      story: "The day we first met, I knew you were someone extraordinarily special. Every single moment since has filled my heart with warmth.",
      descriptionRight: "A beautiful beginning that changed my life forever.",
      quote: "The day my universe found its home 💕",
      stickers: ["🎀", "⭐", "🌸", "💖"],
      photo1: config?.memoryPhoto1 || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
      photo2: config?.memoryPhoto2 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600",
      photo3: config?.memoryPhoto3 || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "THE SMILE I MISS MOST",
      subtitle: "CHAPTER 02 • YOUR RADIANT SMILE",
      shayariLeft: "तुम हंसती हो तो बहारें भी झूम उठती हैं,\nआपकी मुस्कान से ही तो जिंदगी मुस्कुराती है।\nलौट आओ मेरे पास अब और तड़पाओ मत,\nयह धड़कन सिर्फ तुम्हें ही पुकारती है। 🌹",
      editorialHeading: "YOUR RADIANT SMILE",
      story: "Your laughter is my absolute favorite sound in the world. Seeing your face light up is all I ever want, and losing that joy even for a moment breaks my heart.",
      descriptionRight: "Your kindness, grace, and bright laughter make everything better.",
      quote: "Your happiness means the whole world to me 👑",
      stickers: ["💖", "🍸", "💐", "👑"],
      photo1: config?.memoryPhoto2 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600",
      photo2: config?.memoryPhoto3 || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
      photo3: config?.memoryPhoto1 || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "OUR UNFORGETTABLE MOMENTS",
      subtitle: "CHAPTER 03 • ROADS, LAUGHTER & INSIDE JOKES",
      shayariLeft: "माना कि हुई गलती मुझसे बड़ी भाड़ी,\nपर दिल में सिर्फ तुम ही हो मेरी दुलारी।\nभूल जाओ वो बातें जो दिल दुखा गईं,\nआ जाओ वापस, खत्म करो यह दुरी सारी। ✨",
      editorialHeading: "OUR CHERISHED MEMORIES",
      story: "From late-night conversations to silly inside jokes, we built our little world out of genuine love, quiet cuddles, and endless smiles.",
      descriptionRight: "Favorite Memory: Standing by your side, knowing I found my forever person.",
      quote: "My favorite person in the whole universe 🍦✨",
      stickers: ["🚗", "🍦", "💫", "🥂"],
      photo1: config?.memoryPhoto3 || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
      photo2: config?.memoryPhoto1 || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
      photo3: config?.memoryPhoto2 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "MY PROMISE TO YOU",
      subtitle: "CHAPTER 04 • FROM THE BOTTOM OF MY HEART",
      shayariLeft: "वही वफ़ा, वही प्यार, वही वादा निभाएंगे,\nहर मोड़ पर तेरा साथ हम निभाएंगे।\nएक मौका दो हमें फिर से संभालने का,\nहर खुशी तेरी राहों में बिछाएंगे। ❤️",
      editorialHeading: "MY LIFETIME COMMITMENT",
      story: "I promise to choose you, listen better, hold your hand through everything, and cherish every single moment with you.",
      descriptionRight: "I'm truly sorry for my mistake, and I want to make things right forever.",
      quote: "Forever & Always, Yours ❤️",
      stickers: ["💍", "✨", "👑", "❤️"],
      photo1: config?.memoryPhoto1 || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
      photo2: config?.memoryPhoto2 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600",
      photo3: config?.memoryPhoto3 || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const userUploadedChapters = config?.chapters || config?.scrapbook || config?.memories || config?.photos || [];

  // Merge user uploaded photos per chapter requirement so Shayari, stories, and titles are ALWAYS preserved!
  const chapters = defaultChapters.map((defCh, idx) => {
    const uploaded = userUploadedChapters[idx] || {};
    const photo1Url = typeof uploaded === 'string' 
      ? uploaded 
      : (uploaded?.photo1 || uploaded?.image || uploaded?.url || uploaded?.imageUrl || '');
    const photo2Url = uploaded?.photo2 || '';
    const photo3Url = uploaded?.photo3 || '';

    return {
      ...defCh,
      photo1: photo1Url || defCh.photo1,
      photo2: photo2Url || defCh.photo2,
      photo3: photo3Url || defCh.photo3
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // REAL 3D PAGE FLIP ANIMATION STATE
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [flipProgress, setFlipProgress] = useState(0);

  const totalChapters = chapters.length;
  const currentCh = chapters[currentIndex] || {};

  const p1 = currentCh.photo1 || currentCh.photoLeft1 || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600";
  const p2 = currentCh.photo2 || currentCh.photoLeft2 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600";
  const p3 = currentCh.photo3 || currentCh.photoRight || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600";

  // Target chapter during flip turn
  const targetIndex = flipDirection === 'next' ? currentIndex + 1 : currentIndex - 1;
  const targetCh = chapters[targetIndex] || {};

  // PAGE TURN NEXT
  const triggerNextPage = () => {
    if (isFlipping) return;
    if (currentIndex >= totalChapters - 1) {
      if (onNext) onNext();
      return;
    }

    setFlipDirection('next');
    setIsFlipping(true);

    let angle = 0;
    const interval = setInterval(() => {
      angle += 10;
      setFlipProgress(angle);
      if (angle >= 180) {
        clearInterval(interval);
        setCurrentIndex((prev) => prev + 1);
        setIsFlipping(false);
        setFlipProgress(0);
      }
    }, 16);
  };

  // PAGE TURN PREVIOUS
  const triggerPrevPage = () => {
    if (isFlipping || currentIndex <= 0) return;

    setFlipDirection('prev');
    setIsFlipping(true);

    let angle = 0;
    const interval = setInterval(() => {
      angle += 10;
      setFlipProgress(angle);
      if (angle >= 180) {
        clearInterval(interval);
        setCurrentIndex((prev) => prev - 1);
        setIsFlipping(false);
        setFlipProgress(0);
      }
    }, 16);
  };

  const shadowOpacity = Math.sin((flipProgress * Math.PI) / 180) * 0.45;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-slate-900 relative overflow-hidden select-none max-w-5xl mx-auto"
    >
      {/* Header Title */}
      <div className="space-y-1 text-center mb-3">
        <span className="text-xs font-bold uppercase tracking-widest block text-rose-500 font-mono">
          UNSPOKEN MEMORIES & SHAYARI
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-wide" style={{ color: 'var(--ap-text-primary)' }}>
          Our Memory Scrapbook 📖
        </h2>
        <p className="text-xs sm:text-sm font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
          Turn the real 3D parchment pages of our journey:
        </p>
      </div>

      {/* REAL 3D BOOK STAGE WITH LEATHER SPINE & DECKLED PAPER TEXTURE */}
      <div 
        className="w-full max-w-5xl z-10 flex justify-center items-center my-2"
        style={{ perspective: '2200px' }}
      >
        <div 
          className="w-full max-w-[920px] h-[480px] sm:h-[530px] md:h-[570px] flex-shrink-0 rounded-2xl sm:rounded-[28px] bg-[#FAF6EE] text-slate-900 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.7)] border-2 border-[#EADFC9] overflow-hidden grid grid-cols-2 relative"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.015) 1.2px, transparent 0), radial-gradient(rgba(0,0,0,0.015) 1.2px, transparent 0)',
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 6px 6px',
            transformStyle: 'preserve-3d'
          }}
        >
          
          {/* REAL LEATHER BOOK SPINE IN CENTER WITH RIVETS */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 sm:w-10 bg-gradient-to-r from-[#2A180E] via-[#5C3B26] to-[#2A180E] pointer-events-none z-50 shadow-[inset_0_0_12px_rgba(0,0,0,0.8)] border-x border-amber-900/60 flex flex-col justify-between items-center py-4">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-xs" />
            <div className="w-1 h-32 bg-amber-400/40 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-xs" />
          </div>

          {/* FLIP PAGE BACKDROP SHADOW */}
          {isFlipping && (
            <div 
              className="absolute top-0 bottom-0 pointer-events-none z-30 bg-black/40"
              style={{
                left: flipDirection === 'next' ? '50%' : '0',
                width: '50%',
                opacity: shadowOpacity,
                transition: 'opacity 0.05s linear'
              }}
            />
          )}

          {/* REAL 3D FLIPPING PAGE LEAF WITH DUAL-SIDED ROTATION */}
          {isFlipping && (
            <div
              className="absolute top-0 bottom-0 z-40 overflow-hidden shadow-2xl bg-[#FAF6EE]"
              style={{
                left: flipDirection === 'next' ? '50%' : '0%',
                width: '50%',
                transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${flipDirection === 'next' ? -flipProgress : flipProgress}deg)`,
                backfaceVisibility: 'visible'
              }}
            >
              {/* FRONT OF THE LEAF (Current Page Face) */}
              <div 
                className="absolute inset-0 bg-[#FAF6EE] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden border-l border-amber-900/20"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute inset-3 rounded-[18px] border border-amber-700/15 pointer-events-none" />
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-amber-900 block font-bold uppercase">{currentCh.subtitle}</span>
                  <h3 className="text-lg sm:text-2xl font-serif font-black uppercase text-slate-900 mt-1">{currentCh.title}</h3>
                </div>
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-white p-2 shadow-lg border border-slate-200">
                  <img src={p1} alt="Flipping Leaf Photo" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center font-serif italic text-xs font-bold text-slate-900">
                  {currentCh.shayariLeft || currentCh.story}
                </div>
              </div>

              {/* BACK OF THE LEAF (Next Page Face) */}
              <div 
                className="absolute inset-0 bg-[#F6F2E8] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden border-r border-amber-900/20"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="absolute inset-3 rounded-[18px] border border-amber-700/15 pointer-events-none" />
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-rose-700 block font-bold uppercase">{targetCh.subtitle || "NEXT CHAPTER"}</span>
                  <h3 className="text-lg sm:text-2xl font-serif font-black uppercase text-slate-900 mt-1">{targetCh.title || "TURNING PAGE"}</h3>
                </div>
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-white p-2 shadow-lg border border-slate-200">
                  <img src={targetCh.photo1 || p2} alt="Next Leaf Photo" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center font-serif italic text-xs font-bold text-slate-900">
                  {targetCh.story || targetCh.shayariLeft}
                </div>
              </div>
            </div>
          )}

          {/* LEFT PAGE — SHAYARI & REAL POLAROID HERO */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between border-r border-amber-900/20 relative bg-[#FAF6EE] text-slate-900 overflow-hidden">
            {/* Gold Deckled Border Line */}
            <div className="absolute inset-3 rounded-[18px] border border-amber-700/15 pointer-events-none z-10" />

            <div className="relative z-10">
              <span className="text-[9px] sm:text-xs font-mono tracking-widest text-amber-900 block uppercase font-bold">
                {currentCh.subtitle || "OUR MEMORIES"}
              </span>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-serif font-black text-slate-900 uppercase tracking-tight my-1 leading-none">
                {currentCh.title || "CHAPTER MEMORY"}
              </h2>
            </div>

            {/* Real Polaroid Photo Frame (p1) with Tape effect */}
            <div className="w-full aspect-[16/10] min-h-[140px] sm:min-h-[200px] md:min-h-[220px] rounded-xl overflow-hidden bg-white p-2.5 shadow-2xl border border-slate-200 my-2 relative z-10 transform -rotate-1 hover:rotate-0 transition-transform">
              {/* Top Scotch Tape Sticker */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/70 border border-amber-300/50 backdrop-blur-xs rotate-[-3deg] shadow-xs z-20" />
              <div className="w-full h-[78%] rounded-lg overflow-hidden relative">
                <img src={p1} alt="Hero Memory Polaroid" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] sm:text-xs font-serif italic text-slate-700 text-center pt-1 truncate">
                "{currentCh.quote || "A memory written in my heart 💕"}"
              </p>
            </div>

            {/* Romantic Shayari Box */}
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-300/60 shadow-md space-y-1.5 my-1 relative z-10">
              <div className="flex items-center justify-center gap-1.5 text-rose-600 font-bold text-xs">
                <span>🌹</span>
                <span className="font-serif tracking-wider uppercase text-[10px]">Romantic Shayari</span>
                <span>🌹</span>
              </div>
              <p className="font-serif italic text-[11px] sm:text-xs md:text-sm text-slate-900 font-bold leading-relaxed whitespace-pre-line text-center">
                {currentCh.shayariLeft || currentCh.story}
              </p>
            </div>

            {/* Bottom Citation */}
            <div className="border-t border-amber-900/15 pt-1 text-[8px] sm:text-[10px] text-amber-900/60 font-mono tracking-widest uppercase relative z-10">
              ANKA SCRAPBOOK • CHAPTER 0{currentIndex + 1}
            </div>
          </div>

          {/* RIGHT PAGE — SCRAPBOOK COLLAGE WITH POLAROIDS & MEMORY NOTES */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between bg-[#F6F2E8] relative text-slate-900 overflow-hidden">
            {/* Gold Deckled Border Line */}
            <div className="absolute inset-3 rounded-[18px] border border-amber-700/15 pointer-events-none z-10" />

            {/* Aesthetic Stickers */}
            <div className="absolute top-4 right-5 text-xl sm:text-2xl pointer-events-none z-20">{currentCh.stickers?.[0] || "🌸"}</div>
            <div className="absolute top-14 right-14 text-sm sm:text-base pointer-events-none z-20">{currentCh.stickers?.[1] || "💖"}</div>
            <div className="absolute bottom-16 left-5 text-xl sm:text-2xl pointer-events-none z-20">{currentCh.stickers?.[2] || "✨"}</div>

            {/* 2 Polaroid Photos Layout (p2 & p3) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 my-2 relative z-10">
              <div className="w-full aspect-square rounded-xl bg-white p-2 shadow-xl border border-slate-200 relative transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="absolute -top-2 left-3 w-12 h-4 bg-rose-100/70 border border-rose-300/50 backdrop-blur-xs rotate-[5deg] shadow-xs z-20" />
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img src={p2} alt="Memory Polaroid 2" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="w-full aspect-square rounded-xl bg-white p-2 shadow-xl border border-slate-200 relative transform rotate-3 hover:rotate-0 transition-transform">
                <div className="absolute -top-2 right-3 w-12 h-4 bg-amber-100/70 border border-amber-300/50 backdrop-blur-xs rotate-[-4deg] shadow-xs z-20" />
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img src={p3} alt="Memory Polaroid 3" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Story & Promise Letter Card */}
            <div className="space-y-2 my-2 bg-white/80 p-3 sm:p-4 rounded-2xl border border-amber-300/60 shadow-md relative z-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block border-b border-amber-200 pb-1">
                📖 Memory Story & Reflections
              </span>
              <p className="text-[10px] sm:text-xs text-slate-800 font-serif italic leading-relaxed">
                "{currentCh.story}"
              </p>
              <span className="text-[10px] sm:text-xs font-serif font-bold text-rose-700 block text-right pt-1">
                — {currentCh.descriptionRight || "Forever Yours ❤️"}
              </span>
            </div>

            {/* Bottom Page Indicator */}
            <div className="border-t border-amber-900/15 pt-1 text-[8px] sm:text-[10px] text-amber-900/60 font-mono tracking-widest uppercase text-right relative z-10">
              PAGE 0{currentIndex * 2 + 2} OF {totalChapters * 2}
            </div>
          </div>

        </div>
      </div>

      {/* FLIP NAVIGATION CONTROLS */}
      <div className="w-full max-w-5xl flex items-center justify-between mt-4 px-2 z-20">
        <button
          type="button"
          onClick={triggerPrevPage}
          disabled={currentIndex <= 0 || isFlipping}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            currentIndex <= 0 ? 'opacity-30 cursor-not-allowed bg-slate-300 text-slate-500' : 'ap-btn-secondary shadow-md hover:scale-105'
          }`}
        >
          <span>👈 Previous Chapter</span>
        </button>

        <span className="text-xs sm:text-sm font-mono font-bold" style={{ color: 'var(--ap-text-primary)' }}>
          Chapter {currentIndex + 1} of {totalChapters}
        </span>

        <button
          type="button"
          onClick={triggerNextPage}
          disabled={isFlipping}
          className="px-6 py-2.5 rounded-full text-white text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          style={{ background: 'var(--ap-btn-gradient)' }}
        >
          <span>{currentIndex >= totalChapters - 1 ? 'Continue Journey ❤️' : 'Next Chapter 👉'}</span>
        </button>
      </div>
    </motion.div>
  );
}
