import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Ending({ onRestart, girlfriendPhoto, boyfriendPhoto, girlfriendName }) {
  const [showQuote, setShowQuote] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const displayPhoto = girlfriendPhoto || boyfriendPhoto || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800";

  useEffect(() => {
    const t1 = setTimeout(() => setShowQuote(true), 2500);
    const t2 = setTimeout(() => setShowButton(true), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen w-full flex flex-col items-center justify-between p-6 md:p-12 bg-[#050816] text-white relative overflow-hidden select-none"
    >
      {/* 1. CINEMATIC BACKGROUND: MOON & GLOW RAYS */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 right-12 md:top-12 md:right-24 w-40 h-40 md:w-56 md:h-56 rounded-full bg-[#F8E7B5]/20 blur-3xl pointer-events-none"
      />

      <div className="absolute top-10 right-14 md:top-16 md:right-28 w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#F8E7B5] shadow-[0_0_80px_rgba(248,231,181,0.6)] opacity-90 pointer-events-none"></div>

      {/* Twinkling Stars & Fireflies */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-white"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute top-1/3 left-2/3 w-2 h-2 rounded-full bg-[#E7C36B] blur-2xs"
        />
        <motion.div 
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          className="absolute top-1/6 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-200"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050816] via-[#050816]/70 to-transparent pointer-events-none"></div>

      {/* 2. TOP HEADER TYPOGRAPHY */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-3 relative z-10 text-center pt-6 md:pt-8"
      >
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#E7C36B] font-bold block">
          CINEMATIC FINALE
        </span>
        <h1 className="text-4xl md:text-6xl gf-font-serif tracking-tight font-extrabold text-white drop-shadow-[0_4px_20px_rgba(231,195,107,0.3)]">
          Thank You...
        </h1>
        <p className="text-lg md:text-2xl gf-font-handwriting text-[#F3E5C3] font-light">
          For choosing me every single day.
        </p>
      </motion.div>

      {/* 3. CENTER FLOATING LUXURY FRAMED COUPLE PHOTO */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.4 }}
        className="relative z-10 my-auto py-4 flex flex-col items-center"
      >
        <motion.div 
          whileHover={{ scale: 1.04, rotate: 0 }}
          className="relative group p-3 bg-white/10 backdrop-blur-md rounded-3xl border border-[#E7C36B]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform -rotate-1 cursor-pointer"
        >
          <div className="w-48 h-60 md:w-56 md:h-72 rounded-2xl overflow-hidden relative shadow-inner">
            <img 
              src={displayPhoto} 
              alt="Couple Memory" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="pt-3 pb-1 text-center">
            <p className="text-xs font-serif italic text-[#F8E7B5] font-light tracking-wide">
              {girlfriendName || 'Our Story'} ❤️
            </p>
          </div>
        </motion.div>

        {/* Sequential Quote Reveal */}
        {showQuote && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-6 text-center"
          >
            <p className="text-base md:text-xl gf-font-serif italic text-[#F3E5C3]/90 max-w-md font-light leading-relaxed">
              "Every page may end... but our story never will."
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* 4. FOOTER BUTTON & BRANDING WATERMARK */}
      <div className="space-y-6 relative z-10 pb-6 text-center w-full max-w-xs">
        {showButton && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="w-full py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-[#E7C36B]/50 backdrop-blur-md text-[#F8E7B5] font-serif font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(248,231,181,0.2)] cursor-pointer"
            >
              Relive Our Story ✨
            </motion.button>
          </motion.div>
        )}

        <div className="pt-2">
          <p className="text-[10px] font-mono tracking-widest text-[#E7C36B]/60 uppercase">
            Created with ❤️ by Anka Surprises
          </p>
        </div>
      </div>
    </motion.div>
  );
}
