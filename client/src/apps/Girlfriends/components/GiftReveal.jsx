import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function GiftReveal({ onNext, girlfriendName }) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleRevealClick = () => {
    setIsRevealed(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFB703', '#FF4D8D', '#F8C8DC', '#E11D48', '#FFD700']
      });

      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[var(--gf-bg-main)] text-[var(--gf-text-primary)] relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div 
            key="pre-reveal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="text-center space-y-8 my-auto max-w-md w-full relative z-10"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-5xl shadow-2xl shadow-rose-500/30 border-2 border-white/40 cursor-pointer"
              onClick={handleRevealClick}
            >
              🎁
            </motion.div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-[var(--gf-accent-gold)] font-bold">
                Final Surprise Unlocked
              </span>
              <h2 className="text-3xl md:text-5xl font-bold gf-font-serif text-[var(--gf-text-primary)]">
                A Special Gift Awaits
              </h2>
              <p className="text-xs text-[var(--gf-text-secondary)] max-w-xs mx-auto leading-relaxed">
                You've completed all chapters... Click below to open your Girlfriend's Day gift.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleRevealClick}
              className="gf-btn-primary px-10 py-4 text-lg shadow-2xl cursor-pointer"
            >
              Open Your Gift 🎁
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="post-reveal"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="max-w-md w-full bg-slate-900/95 border-2 border-rose-400/40 p-8 md:p-10 rounded-[36px] text-center space-y-6 shadow-2xl relative my-auto backdrop-blur-2xl text-white"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-rose-500/20 text-white">
              💖
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                UNLIMITED LOVE COUPON
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold gf-font-serif text-white tracking-wide">
                My Forever Partner
              </h2>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed pt-2 opacity-95">
                This coupon entitles you to infinite hugs, late-night food runs, endless patience, and my entire heart for the rest of our lives.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--gf-border-color)]">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="gf-btn-primary w-full py-3.5 text-base shadow-lg cursor-pointer"
              >
                Read Love Letter 📜
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
