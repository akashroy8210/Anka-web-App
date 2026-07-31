import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Crash({ onNext }) {
  const [phase, setPhase] = useState(0); // 0: blackout, 1: text reveal, 2: glow transition

  useEffect(() => {
    // Phase 0: Silent blackout (500ms)
    // Phase 1: Romantic quote reveal (1.2s)
    // Phase 2: Restored transition (600ms -> onNext)
    const timer1 = setTimeout(() => {
      setPhase(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setPhase(2);
      setTimeout(() => {
        onNext();
      }, 700);
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onNext]);

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
        {phase === 1 && (
          <motion.div 
            key="phase-quote"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="max-w-md text-center space-y-4"
          >
            <p className="text-xl md:text-2xl font-light text-rose-200 gf-font-serif italic leading-relaxed">
              "I almost lost every memory we created..."
            </p>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div 
            key="phase-restored"
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
    </motion.div>
  );
}
