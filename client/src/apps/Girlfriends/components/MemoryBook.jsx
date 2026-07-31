import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GirlfriendPlaceholderService from '../services/girlfriendPlaceholderService';

export default function MemoryBook({ onNext, customChapters = [] }) {
  const chapters = customChapters.length > 0 ? customChapters : GirlfriendPlaceholderService.getPlaceholderChapters();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Page Flip Animation State
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [flipProgress, setFlipProgress] = useState(0);

  const totalChapters = chapters.length;
  const currentCh = chapters[currentIndex] || {};

  // Extract photos uploaded by customer for current chapter (with fallbacks)
  const p1 = currentCh.photo1 || currentCh.photoLeft1 || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600";
  const p2 = currentCh.photo2 || currentCh.photoLeft2 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600";
  const p3 = currentCh.photo3 || currentCh.photoRight || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600";

  // Pre-designed romantic chapters with mixed layouts (Shayari ONLY on Chapter 1, others are Human Magazine Love Stories)
  const predefinedContent = [
    // Chapter 1: The Day I Saw You (Special Shayari Opening Spread)
    {
      title: "Who's that girl?",
      subtitle: "ISSUE NO. 01 • THE BEGINNING",
      shayariLeft: "पहली नज़र में ही तुमसे मोहब्बत हो गई,\nतेरे आने से मेरी दुनिया हसीन हो गई।\nतुझे चाहा है और ता-उम्र चाहेंगे,\nतू ही मेरी पहली और आखिरी ख्वाहिश बन गई। ❤️",
      story: "The moment my eyes met yours, my heart whispered: she's the one. Your smile illuminated the room and changed my life forever.",
      descriptionRight: "A chance meeting that turned into the greatest story of my life.",
      quote: "The day my universe found its center 💕",
      stickers: ["🎀", "⭐", "🌸", "💖"]
    },
    // Chapter 2: Who Is She? (Human Magazine Girl Feature — NO SHAYARI)
    {
      title: "SHE IS ART & ELEGANCE",
      subtitle: "HUMAN MAGAZINE • GIRL COVER FEATURE",
      editorialHeading: "WHO IS SHE?",
      story: "She is strong yet gentle, fierce yet caring. Her smile lights up every room she walks into. She is the prettiest song my heart has ever played, and every day with her feels like a dream.",
      descriptionRight: "Definition of Perfection: Her kindness, her laughter, and the effortless way she makes everyone around her feel loved.",
      quote: "Beauty, grace and a soul of pure gold 👑",
      stickers: ["💖", "🍸", "💐", "👑"]
    },
    // Chapter 3: Midnight Stories & Laughter (Scrapbook Memories — NO SHAYARI)
    {
      title: "MIDNIGHT STORIES",
      subtitle: "CHAPTER 03 • ROADS, LAUGHTER & INSIDE JOKES",
      editorialHeading: "THE UNFORGETTABLE MOMENTS",
      story: "From endless 2 AM phone calls to getting lost without GPS on road trips. We built our little universe out of silly jokes, midnight ice cream runs, and quiet cuddles.",
      descriptionRight: "Favorite Memory: Driving under the stars with music playing, knowing I have found my forever person.",
      quote: "My favorite partner in crime for life 🚗🍦",
      stickers: ["🚗", "🍦", "💫", "🥂"]
    },
    // Chapter 4: My Safe Place (Emotional Love Story — NO SHAYARI)
    {
      title: "MY SAFE PLACE",
      subtitle: "CHAPTER 04 • PEACE IN A NOISY WORLD",
      editorialHeading: "WHERE MY HEART RESTS",
      story: "In a world that is fast and loud, you are my quiet comfort. You listen without judgment, hold my hand when I'm tired, and make everything feel like it's going to be okay.",
      descriptionRight: "Home isn't a location or a address. Home is wrapped inside your embrace.",
      quote: "You are my home and my safe place 🏡❤️",
      stickers: ["🌹", "🧸", "💌", "🔑"]
    },
    // Chapter 5: Forever & Always (Lifetime Promises — NO SHAYARI)
    {
      title: "FOREVER & ALWAYS",
      subtitle: "CHAPTER INFINITY • UNTIL THE END OF TIME",
      editorialHeading: "MY LIFETIME PROMISE",
      story: "I promise to choose you, every single day, without pause, without doubt, in a heartbeat. I will love you through all seasons of life and hold your hand through everything.",
      descriptionRight: "To infinity and beyond. Yours today, tomorrow, and for all eternity.",
      quote: "Forever & Always, Yours ❤️",
      stickers: ["💍", "✨", "👑", "❤️"]
    }
  ];

  const content = predefinedContent[currentIndex % predefinedContent.length];

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
      angle += 12;
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
      angle += 12;
      setFlipProgress(angle);
      if (angle >= 180) {
        clearInterval(interval);
        setCurrentIndex((prev) => prev - 1);
        setIsFlipping(false);
        setFlipProgress(0);
      }
    }, 16);
  };

  const shadowOpacity = Math.sin((flipProgress * Math.PI) / 180) * 0.5;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full flex flex-col items-center justify-between p-2 sm:p-6 md:p-8 bg-[#2C1D18] text-amber-50 relative overflow-hidden select-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* 3D BOOK CONTAINER STAGE */}
      <div 
        className="my-auto py-1 sm:py-4 w-full max-w-5xl z-10 flex justify-center items-center"
        style={{ perspective: '2000px' }}
      >
        <div className="w-full min-h-[420px] sm:min-h-[540px] md:min-h-[620px] rounded-2xl sm:rounded-[24px] bg-[#FAF8F5] text-slate-900 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9)] border sm:border-2 border-amber-950/20 overflow-hidden grid grid-cols-2 relative transform-style-3d">
          
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 sm:w-8 md:w-10 bg-gradient-to-r from-black/25 via-black/5 to-black/25 pointer-events-none z-30 shadow-inner" />

          {isFlipping && (
            <div 
              className="absolute top-0 bottom-0 pointer-events-none z-25 bg-black"
              style={{
                left: flipDirection === 'next' ? '50%' : '0',
                width: '50%',
                opacity: shadowOpacity,
                transition: 'opacity 0.1s linear'
              }}
            />
          )}

          {/* LEFT PAGE — VOGUE MAGAZINE & LOVE STORY FEATURE */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between border-r border-amber-900/15 relative bg-[#FAF8F5] text-slate-900 overflow-hidden">
            <div>
              <span className="text-[9px] sm:text-xs font-mono tracking-widest text-rose-700 block uppercase font-bold">
                {content.subtitle}
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 uppercase tracking-tight my-1 leading-none">
                {content.title}
              </h2>
            </div>

            {/* Large Horizontal Landscape Hero Photo (p1) */}
            <div className="w-full aspect-[16/9] min-h-[160px] sm:min-h-[220px] md:min-h-[250px] rounded-xl overflow-hidden border-2 border-white shadow-xl my-2 relative">
              <img src={p1} alt="Landscape Hero Photo 1" className="w-full h-full object-cover" />
            </div>

            {/* Shayari Box OR Editorial Feature Box */}
            {content.shayariLeft ? (
              <div className="p-3 sm:p-4 rounded-xl bg-rose-50/80 border border-rose-200/80 shadow-xs space-y-1 my-1">
                <p className="font-serif italic text-[10px] sm:text-xs md:text-sm text-slate-900 font-bold leading-relaxed whitespace-pre-line text-center">
                  {content.shayariLeft}
                </p>
              </div>
            ) : (
              <div className="p-3 sm:p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 shadow-xs space-y-1 my-1">
                <span className="text-[9px] sm:text-xs font-mono uppercase tracking-wider text-amber-800 font-bold block">
                  {content.editorialHeading || "HUMAN MAGAZINE FEATURE"}
                </span>
                <p className="font-serif italic text-[10px] sm:text-xs text-slate-800 font-medium leading-relaxed">
                  "{content.story}"
                </p>
              </div>
            )}

            {/* Bottom Citation */}
            <div className="border-t border-slate-200 pt-1 text-[8px] sm:text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              HUMAN MAGAZINE • CHAPTER 0{currentIndex + 1}
            </div>
          </div>

          {/* RIGHT PAGE — RICH SCRAPBOOK COLLAGE WITH 2 LARGE PHOTOS & DESCRIPTIONS */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between bg-[#F6F3EF] relative text-slate-900 overflow-hidden">
            
            {/* Aesthetic Overlay Stickers */}
            <div className="absolute top-3 right-4 text-xl sm:text-2xl pointer-events-none z-10">{content.stickers[0]}</div>
            <div className="absolute top-12 right-12 text-sm sm:text-base pointer-events-none z-10">{content.stickers[1]}</div>
            <div className="absolute bottom-16 left-4 text-xl sm:text-2xl pointer-events-none z-10">{content.stickers[2]}</div>
            <div className="absolute bottom-6 right-6 text-xl sm:text-2xl pointer-events-none z-10">{content.stickers[3]}</div>

            {/* Top Horizontal Landscape Photo Frame p2 */}
            <div className="w-full aspect-[16/9] min-h-[130px] sm:min-h-[170px] rounded-xl overflow-hidden border-2 border-white shadow-lg transform -rotate-1 bg-white p-1">
              <img src={p2} alt="Landscape Photo 2" className="w-full h-full object-cover rounded-lg" />
            </div>

            {/* Third Photo Frame p3 — VERTICAL PORTRAIT FRAME */}
            <div className="w-32 sm:w-48 md:w-52 aspect-[3/4] max-h-[150px] sm:max-h-[210px] mx-auto rounded-xl overflow-hidden border-2 border-white shadow-xl transform rotate-2 bg-white p-1 my-1.5">
              <img src={p3} alt="Vertical Portrait Photo 3" className="w-full h-full object-cover rounded-lg" />
            </div>

            {/* Secondary Description & Quote Box */}
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 shadow-xs text-center space-y-1 z-10">
              <p className="font-serif italic text-[10px] sm:text-xs text-amber-900 font-medium leading-relaxed">
                {content.descriptionRight || content.story}
              </p>
              <p className="font-serif italic text-xs font-black text-rose-800 pt-0.5">
                {content.quote}
              </p>
            </div>
          </div>

          {/* Corner Page Turn Arrow */}
          <div 
            onClick={triggerNextPage}
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-slate-900/10 hover:bg-slate-900/20 rounded-tl-lg flex items-center justify-center cursor-pointer transition-all group z-20"
            title="Flip to next page"
          >
            <span className="text-slate-900 font-bold text-[10px] sm:text-xs group-hover:translate-x-0.5 transition-transform">➔</span>
          </div>

          {/* 3D TURNING PAGE ANIMATION */}
          {isFlipping && (
            <div
              className="absolute top-0 bottom-0 w-1/2 bg-[#FAF8F5] z-40 overflow-hidden shadow-2xl border-l border-amber-900/20"
              style={{
                left: flipDirection === 'next' ? '50%' : '0',
                transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                transform: `rotateY(${flipDirection === 'next' ? -flipProgress : flipProgress}deg)`,
                backfaceVisibility: 'visible',
                willChange: 'transform'
              }}
            >
              <div className="p-3 sm:p-8 flex flex-col justify-between h-full bg-[#FAF8F5]">
                {flipProgress < 90 ? (
                  <div className="space-y-1 sm:space-y-3">
                    <span className="text-[7px] sm:text-[9px] font-mono uppercase text-amber-800/60 font-bold block">TURNING...</span>
                    <h3 className="text-xs sm:text-xl font-serif font-bold text-slate-800">
                      Chapter 0{currentIndex + 1}
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-1 sm:space-y-3 transform rotateY-180">
                    <span className="text-[7px] sm:text-[9px] font-mono uppercase text-amber-800/60 font-bold block">
                      NEXT: Chapter 0{Math.min(currentIndex + 2, totalChapters)}
                    </span>
                    <h3 className="text-xs sm:text-xl font-serif font-bold text-slate-800">
                      Chapter 0{Math.min(currentIndex + 2, totalChapters)}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* BOTTOM NAVIGATION BUTTONS */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs sm:max-w-md flex items-center justify-between gap-2 z-10 pb-1"
      >
        <button
          onClick={triggerPrevPage}
          disabled={currentIndex === 0 || isFlipping}
          className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-stone-900/80 border border-stone-700 text-amber-100 text-[10px] sm:text-xs font-semibold disabled:opacity-30 shadow-md hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
        >
          ← Previous
        </button>

        <button
          onClick={triggerNextPage}
          disabled={isFlipping}
          className="px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] sm:text-xs font-bold shadow-lg shadow-rose-600/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          {currentIndex === totalChapters - 1 ? 'Finish Scrapbook ❤️' : 'Next Page →'}
        </button>
      </motion.div>
    </motion.div>
  );
}