import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import GirlfriendPlaceholderService from '../services/girlfriendPlaceholderService';

export default function Reasons365({ 
  onNext, 
  reasons = GirlfriendPlaceholderService.getPlaceholderReasons(),
  enableNumbering = true,
  enableIcons = true,
  enableDecorations = true
}) {
  const activeReasons = (reasons && reasons.length > 0)
    ? reasons 
    : GirlfriendPlaceholderService.getPlaceholderReasons();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = Right, -1 = Left
  const [isAnimating, setIsAnimating] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalReasons = activeReasons.length;
  const currentReason = activeReasons[currentIndex] || activeReasons[0];

  // Synthesize soft paper slide audio using Web Audio API
  const playPaperFlipSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (err) {
      // Audio autoplay fallback
    }
  };

  // CARD SLIDE NEXT (Alternates slide direction: Even = Right, Odd = Left)
  const handleNextCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playPaperFlipSound();

    const isRight = currentIndex % 2 === 0;
    setDirection(isRight ? 1 : -1);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalReasons);
      setIsAnimating(false);
    }, 280);
  };

  // CARD SLIDE PREVIOUS (Reverse slide direction)
  const handlePrevCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playPaperFlipSound();

    const isRight = currentIndex % 2 === 1;
    setDirection(isRight ? 1 : -1);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalReasons) % totalReasons);
      setIsAnimating(false);
    }, 280);
  };

  // KEYBOARD NAVIGATION (← and →)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating, totalReasons]);

  // TOUCH SWIPE NAVIGATION
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX.current;

    if (diffX > 40) {
      handleNextCard(); // Swipe Left = Next
    } else if (diffX < -40) {
      handlePrevCard(); // Swipe Right = Previous
    }
  };

  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / totalReasons) * 100));

  // Compute 3 Peek Cards behind top card
  const peekCards = [1, 2, 3].map((offset) => {
    const idx = (currentIndex + offset) % totalReasons;
    return {
      reason: activeReasons[idx],
      offset
    };
  });

  // Framer Motion Top Card Variants
  const cardVariants = {
    initial: { 
      scale: 0.92, 
      opacity: 0, 
      y: 20 
    },
    center: { 
      x: 0, 
      y: 0, 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 24
      }
    },
    exit: (customDir) => ({
      x: customDir * 420,
      y: -25,
      rotate: customDir * 20,
      opacity: 0,
      transition: {
        duration: 0.35,
        ease: [0.32, 0, 0.67, 0]
      }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 bg-[var(--gf-bg-main)] text-[var(--gf-text-primary)] relative overflow-hidden select-none"
    >
      
      {/* Floating Particle Sparkles (Framer Motion Animated) */}
      {enableDecorations && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <motion.div 
            animate={{ y: [-6, 6, -6], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/6 left-1/4 text-sm text-[var(--gf-accent-gold)]"
          >
            ✨
          </motion.div>

          <motion.div 
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/3 right-1/4 text-xs text-[var(--gf-accent-rose)]"
          >
            🌸
          </motion.div>

          <motion.div 
            animate={{ y: [6, -6, 6], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-1/4 left-1/3 text-base text-[var(--gf-accent-rose)]"
          >
            💖
          </motion.div>

          <motion.div 
            animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-1/6 right-1/3 text-xs text-[var(--gf-accent-gold)]"
          >
            ✨
          </motion.div>
        </div>
      )}

      {/* 1. HEADER SECTION (FRAMER MOTION ANIMATED) */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center space-y-2 pt-6 md:pt-10 z-10 max-w-xl"
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[var(--gf-accent-gold)] block"
        >
          DAILY LOVE DECK
        </motion.span>

        <h1 className="text-3xl md:text-5xl gf-font-serif font-extrabold text-[var(--gf-accent-rose)] tracking-tight">
          Reasons Why I Love You
        </h1>

        <p className="text-sm md:text-base gf-font-handwriting text-[var(--gf-text-secondary)] font-light">
          Tap or flip through card after card of love notes ❤️
        </p>
      </motion.div>

      {/* 2. CENTERED STACKED CARD DECK (FRAMER MOTION STACK PHYSICS & PEEK CARDS) */}
      <div 
        className="my-auto py-4 relative w-full max-w-sm md:max-w-md h-[440px] md:h-[480px] flex items-center justify-center z-10 cursor-pointer"
        onClick={handleNextCard}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* PEEK CARDS BEHIND TOP CARD (Rendered with Framer Motion spring layouts) */}
        {peekCards.slice().reverse().map(({ reason, offset }) => {
          const yOffset = offset * 14;
          const scale = 1 - offset * 0.05;
          const rotation = offset % 2 === 1 ? -offset * 2.5 : offset * 2.5;
          const opacity = 1 - offset * 0.18;

          return (
            <motion.div
              key={`peek-${reason?.id || offset}`}
              animate={{
                y: yOffset,
                scale: scale,
                rotate: rotation,
                opacity: opacity
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 26
              }}
              className="absolute inset-0 rounded-3xl p-6 md:p-8 bg-[var(--gf-card-bg)] border border-[var(--gf-border-color)] shadow-[var(--gf-card-shadow)] flex flex-col justify-between pointer-events-none"
              style={{ zIndex: 10 - offset }}
            >
              <div className="flex justify-between items-center opacity-40">
                <span className="text-xs font-mono font-bold text-[var(--gf-accent-gold)]">
                  REASON #{reason?.number || (currentIndex + offset + 1)}
                </span>
                <span className="text-sm">{reason?.icon || '❤️'}</span>
              </div>
              <div className="space-y-2 opacity-30">
                <div className="h-4 bg-slate-400/30 rounded w-3/4"></div>
                <div className="h-3 bg-slate-400/20 rounded w-full"></div>
              </div>
              <div className="text-[10px] text-slate-400/40 font-mono text-center">ANKA LOVE DECK</div>
            </motion.div>
          );
        })}

        {/* ACTIVE TOP CARD (FRAMER MOTION ANIMATE PRESENCE & SPRING PHYSICS) */}
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={`active-${currentIndex}`}
            custom={direction}
            variants={cardVariants}
            initial="initial"
            animate="center"
            exit="exit"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="absolute inset-0 rounded-3xl p-6 md:p-8 bg-[var(--gf-card-bg)] border-2 border-[var(--gf-border-color)] shadow-[var(--gf-card-shadow)] flex flex-col justify-between backdrop-blur-md z-20 cursor-pointer"
          >
            {/* Card Top Ribbon Header */}
            <div className="flex items-center justify-between border-b border-[var(--gf-border-color)] pb-3">
              {enableNumbering && (
                <span className="text-xs md:text-sm font-mono font-extrabold tracking-wider text-[var(--gf-accent-gold)] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gf-accent-gold)]" />
                  <span>Reason #{currentReason.number || (currentIndex + 1)}</span>
                </span>
              )}

              {enableIcons && currentReason.icon && (
                <motion.span 
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  className="text-2xl inline-block"
                >
                  {currentReason.icon}
                </motion.span>
              )}
            </div>

            {/* Card Center Content */}
            <div className="space-y-4 my-auto text-center py-2">
              <h2 className="text-2xl md:text-3xl gf-font-serif font-extrabold text-[var(--gf-text-primary)] leading-tight">
                {currentReason.title}
              </h2>

              {currentReason.description && (
                <p className="text-xs md:text-sm text-[var(--gf-text-secondary)] leading-relaxed font-sans font-normal px-2">
                  {currentReason.description}
                </p>
              )}
            </div>

            {/* Card Footer Hint */}
            <div className="pt-3 border-t border-[var(--gf-border-color)] flex items-center justify-between text-[10px] font-mono text-[var(--gf-text-secondary)] opacity-70">
              <span>TAP TO FLIP</span>
              <span className="flex items-center gap-1 text-[var(--gf-accent-rose)] font-bold">
                <span>Next Note</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM CONTROLS & PROGRESS BAR (FRAMER MOTION ANIMATED) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-sm md:max-w-md space-y-4 z-10 pb-6 text-center"
      >
        {/* Previous & Next Buttons */}
        <div className="flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); handlePrevCard(); }}
            className="flex-1 py-3 px-4 rounded-full bg-[var(--gf-card-bg)] border border-[var(--gf-border-color)] text-[var(--gf-text-primary)] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--gf-accent-rose)]" />
            <span>Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); handleNextCard(); }}
            className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Next Love Note</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.button>
        </div>

        {/* Counter & Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono text-[var(--gf-text-secondary)] px-1">
            <span>Progress</span>
            <span className="font-bold text-[var(--gf-accent-gold)]">
              {currentIndex + 1} / {totalReasons} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200/30 overflow-hidden border border-[var(--gf-border-color)]">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--gf-accent-rose)] to-[var(--gf-accent-gold)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>
        </div>

        {/* Continue to Next Act Button */}
        {onNext && (
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="gf-btn-primary text-sm py-2.5 px-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            >
              Continue Journey ❤️
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
