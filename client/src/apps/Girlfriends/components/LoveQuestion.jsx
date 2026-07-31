import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FUNNY_MESSAGES = [
  "I know your real answer 😂",
  "Nice try! No escaping allowed 😉",
  "No lies allowed today ❤️",
  "Love detected 100% 💖",
  "That button is disabled today 😂",
  "You belong with me forever ❤️"
];

export default function LoveQuestion({ onNext }) {
  const [attempts, setAttempts] = useState(0);
  const [maybePos, setMaybePos] = useState({ top: 'auto', left: 'auto' });
  const [isRelocated, setIsRelocated] = useState(false);
  const [currentMsg, setCurrentMsg] = useState("");

  const handleMaybeHover = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const msg = FUNNY_MESSAGES[(nextAttempts - 1) % FUNNY_MESSAGES.length];
    setCurrentMsg(msg);

    const randomTop = Math.floor(Math.random() * 60 + 20) + '%';
    const randomLeft = Math.floor(Math.random() * 60 + 20) + '%';
    setMaybePos({ top: randomTop, left: randomLeft });
    setIsRelocated(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen w-full flex items-center justify-center p-6 relative bg-[var(--gf-bg-main)]"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <motion.div 
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="gf-glass-card max-w-md w-full p-8 md:p-10 rounded-[36px] text-center space-y-7 relative z-10 shadow-2xl border border-white/40 overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl"
      >
        <div className="space-y-3 relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.2 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-rose-500/30"
          >
            💖
          </motion.div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-bold text-[10px] uppercase tracking-widest border border-rose-500/20">
            Confidential Question
          </span>
        </div>

        <div className="space-y-2 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold gf-font-serif text-slate-900 dark:text-white tracking-tight">
            Do you love me?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-4">
            Be 100% honest... your heart already knows the answer!
          </p>
        </div>

        <AnimatePresence>
          {currentMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-500/10 py-2 px-4 rounded-xl border border-rose-500/20 shadow-2xs"
            >
              {currentMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[64px] z-10">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onNext}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/30 cursor-pointer"
          >
            Yes! Absolutely ❤️
          </motion.button>

          <motion.button
            onMouseEnter={handleMaybeHover}
            onTouchStart={handleMaybeHover}
            onClick={handleMaybeHover}
            animate={isRelocated ? { top: maybePos.top, left: maybePos.left } : {}}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            style={isRelocated ? { position: 'fixed', zIndex: 60 } : {}}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Maybe / Um... 🤔
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
