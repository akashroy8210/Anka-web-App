import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SENTENCES = [
  "We planned something...",
  "Today...",
  "We're going to discover...",
  "How much...",
  "You really love me ❤️"
];

const NOT_YET_MESSAGES = [
  "Go grab a glass! I'll wait 🥤",
  "Hydration is important cutie ❤️",
  "Just one sip! Please? 🥺",
  "Okay last reminder, drink water! 💦"
];

export default function MissionIntro({ onNext, girlfriendName }) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [notYetIndex, setNotYetIndex] = useState(0);

  useEffect(() => {
    if (currentSentenceIndex >= SENTENCES.length) {
      setIsTypingComplete(true);
      return;
    }

    const targetText = SENTENCES[currentSentenceIndex];
    let charIdx = 0;
    setDisplayedText('');

    const typingInterval = setInterval(() => {
      if (charIdx < targetText.length) {
        setDisplayedText(targetText.substring(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentSentenceIndex((prev) => prev + 1);
        }, 1200);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, [currentSentenceIndex]);

  const handleNotYetClick = () => {
    setNotYetIndex((prev) => (prev + 1) % NOT_YET_MESSAGES.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[var(--gf-bg-main)] text-[var(--gf-text-primary)] relative overflow-hidden"
    >
      <div className="max-w-xl w-full text-center space-y-8 relative z-10 my-auto py-12">
        {/* Typewriter Header Display */}
        <div className="min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={currentSentenceIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="text-3xl md:text-5xl gf-font-serif font-extrabold text-[var(--gf-accent-rose)] tracking-tight leading-snug"
            >
              {displayedText}
              {!isTypingComplete && <span className="animate-pulse text-[var(--gf-accent-gold)]">|</span>}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Once typing finishes: Show Mission Action Buttons */}
        {isTypingComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            className="space-y-6 pt-4"
          >
            <p className="text-sm md:text-base text-[var(--gf-text-secondary)] font-medium">
              Before we start the mission... Did you drink water today? 🥤
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWaterModal(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-sm shadow-xl cursor-pointer"
              >
                Yes, Hydrated & Ready! ❤️
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNotYetClick}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--gf-border-color)] text-[var(--gf-text-secondary)] text-xs font-bold hover:bg-white/10 cursor-pointer"
              >
                Not yet 🙈
              </motion.button>
            </div>

            {notYetIndex > 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold text-[var(--gf-accent-gold)] animate-pulse"
              >
                {NOT_YET_MESSAGES[notYetIndex - 1]}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>

      {/* Hydration Modal Popup */}
      <AnimatePresence>
        {showWaterModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="bg-slate-900/95 border-2 border-rose-400/40 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-6 shadow-2xl backdrop-blur-2xl text-white"
            >
              <div className="text-4xl animate-bounce">💧 🥤</div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-rose-300 font-serif tracking-wide drop-shadow-md">
                  Good Girl! ❤️
                </h3>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-normal opacity-95">
                  Hydrated and ready for the surprise of your life! Let me show you the ground rules.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowWaterModal(false);
                  onNext();
                }}
                className="gf-btn-primary w-full py-3 text-sm font-bold shadow-lg cursor-pointer"
              >
                Let's Go! 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
