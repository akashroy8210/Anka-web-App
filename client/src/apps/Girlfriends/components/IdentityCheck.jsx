import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRY_AGAIN_SEQUENCE = [
  "Try Again",
  "Are You Sure?",
  "Really?",
  "Hmm...",
  "Maybe Not...",
  "Last Chance...",
  "Wrong Girl 😂",
  "Identity Verification Failed",
  "Still Trying? ❤️"
];

export default function IdentityCheck({ onNext, girlfriendName }) {
  const [seqIndex, setSeqIndex] = useState(0);
  const [exitPos, setExitPos] = useState({ top: '60%', left: '35%' });
  const [phase, setPhase] = useState('active');

  const containerRef = useRef(null);

  const handleTryAgainClick = () => {
    if (phase !== 'active') return;

    if (seqIndex < TRY_AGAIN_SEQUENCE.length - 1) {
      setSeqIndex((prev) => prev + 1);
    } else {
      setPhase('glitching');
      
      setTimeout(() => {
        setPhase('message');

        setTimeout(() => {
          setPhase('fading');
          setTimeout(() => {
            onNext();
          }, 800);
        }, 3000);
      }, 2200);
    }
  };

  const handleExitHover = () => {
    const randomTop = Math.floor(Math.random() * 70 + 15) + '%';
    const randomLeft = Math.floor(Math.random() * 70 + 15) + '%';
    setExitPos({ top: randomTop, left: randomLeft });
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'fading' ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      className={`fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-6 z-50 overflow-hidden ${
        phase === 'glitching' ? 'gf-glitch-active' : ''
      }`}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md text-center space-y-8 relative z-10"
      >
        <AnimatePresence mode="wait">
          {phase === 'active' || phase === 'glitching' ? (
            <motion.div 
              key="verification-box"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h1 className="text-2xl md:text-3xl font-light tracking-wide text-white drop-shadow-md">
                Hmm... I don't think this surprise is for you.
              </h1>

              <div className="pt-8 flex items-center justify-center gap-6 min-h-[120px] relative w-full">
                {/* Runaway Exit Button */}
                <motion.button
                  onMouseEnter={handleExitHover}
                  onTouchStart={handleExitHover}
                  onClick={handleExitHover}
                  animate={{ top: exitPos.top, left: exitPos.left }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ position: 'fixed', zIndex: 60 }}
                  className="px-6 py-2.5 rounded-full border border-gray-700 bg-gray-900 text-gray-400 text-sm font-medium hover:bg-gray-800"
                >
                  Exit
                </motion.button>

                {/* Click-Progressing Try Again Button */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleTryAgainClick}
                  className="px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm shadow-xl cursor-pointer"
                >
                  {TRY_AGAIN_SEQUENCE[seqIndex]}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="settled-message"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="space-y-4"
            >
              <p className="text-2xl md:text-3xl font-serif text-white font-medium leading-relaxed">
                I was just testing if it's really you {girlfriendName ? girlfriendName : ''} ❤️
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
