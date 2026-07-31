import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Crash({ onNext }) {
  const [phase, setPhase] = useState(0); // 0: loading freeze, 1: blackout, 2: message text, 3: glow transition

  useEffect(() => {
    // Fast dramatic timers (3.2s total instead of 10.5s)
    const timer1 = setTimeout(() => {
      setPhase(1);
    }, 700);

    const timer2 = setTimeout(() => {
      setPhase(2);
    }, 1300);

    const timer3 = setTimeout(() => {
      setPhase(3);
      setTimeout(() => {
        onNext();
      }, 600);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onNext]);

  // Tap anywhere to skip loading immediately
  const handleSkip = () => {
    onNext();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleSkip}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6 text-white overflow-hidden select-none cursor-pointer"
    >
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div 
            key="phase-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 text-center"
          >
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="font-mono text-xs tracking-widest text-gray-400">Loading memories...</p>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div 
            key="phase-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-md text-center space-y-4"
          >
            <p className="text-xl md:text-2xl font-light text-rose-200 gf-font-serif italic leading-relaxed">
              "I almost lost every memory we created..."
            </p>
          </motion.div>
        )}

        {phase === 3 && (
          <motion.div 
            key="phase-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-t from-rose-950/40 via-amber-950/20 to-black flex items-center justify-center"
          >
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-xs font-bold tracking-widest uppercase text-amber-200"
            >
              Memories Restored ❤️
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 text-[10px] font-mono text-gray-500 opacity-60">
        Tap anywhere to skip
      </div>
    </motion.div>
  );
}
