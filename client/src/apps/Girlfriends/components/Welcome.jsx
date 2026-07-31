import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeartRain from '../../virtual-date/components/overlays/HeartRain';
import ButterflySystem from './ButterflySystem';

export default function Welcome({ onNext, girlfriendName, photos = [], girlfriendPhoto, boyfriendPhoto }) {
  const [showHeartRain, setShowHeartRain] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);

  const photo1 = girlfriendPhoto || photos[0] || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800";
  const photo2 = boyfriendPhoto || photos[1] || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeartRain(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinueClick = () => {
    setShowPopup(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[var(--gf-bg-main)] text-[var(--gf-text-primary)]"
    >
      {/* Heart Rain Overlay */}
      {showHeartRain && <HeartRain />}

      {/* Butterfly System */}
      <ButterflySystem 
        enabled={true}
        allowLanding={true}
        allowCursorInteraction={true}
        imageTargets={[photo1Ref.current, photo2Ref.current].filter(Boolean)}
      />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full text-center space-y-8 relative z-10 my-auto py-12"
      >
        <div className="space-y-3">
          <motion.p 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs md:text-sm font-bold tracking-widest uppercase text-[var(--gf-accent-gold)]"
          >
            A Special Celebration
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl gf-font-handwriting text-[var(--gf-accent-rose)] font-bold drop-shadow-sm"
          >
            Happy Girlfriend's Day
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl gf-font-serif italic text-[var(--gf-text-secondary)] font-light"
          >
            To My Beautiful Girl {girlfriendName || '❤️'}
          </motion.p>
        </div>

        {/* 2 Animated Photos Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 px-4">
          <motion.div 
            ref={photo1Ref}
            initial={{ opacity: 0, x: -30, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.5 }}
            whileHover={{ scale: 1.04, rotate: 0 }}
            className="relative group rounded-2xl overflow-hidden shadow-2xl border-2 border-[var(--gf-border-color)] cursor-pointer"
          >
            <img 
              src={photo1} 
              alt="Memory 1" 
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </motion.div>

          <motion.div 
            ref={photo2Ref}
            initial={{ opacity: 0, x: 30, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 2 }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.6 }}
            whileHover={{ scale: 1.04, rotate: 0 }}
            className="relative group rounded-2xl overflow-hidden shadow-2xl border-2 border-[var(--gf-border-color)] md:mt-6 cursor-pointer"
          >
            <img 
              src={photo2} 
              alt="Memory 2" 
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="pt-6"
        >
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleContinueClick}
            className="gf-btn-primary text-lg px-8 py-3.5 shadow-xl cursor-pointer"
          >
            ❤️ Continue
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Love Warning Modal Popup (Framer Motion Animated) */}
      <AnimatePresence>
        {showPopup && (
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
              className="bg-slate-900/95 border-2 border-rose-400/40 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative backdrop-blur-2xl text-white"
            >
              <div className="text-4xl animate-bounce">⚠️ ❤️</div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-rose-300 font-serif tracking-wide drop-shadow-md">
                  A Small Warning
                </h3>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-normal opacity-95">
                  This surprise was made with 100% real feelings and endless love. By tapping yes, you agree to accept all my hugs and kisses!
                </p>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowPopup(false);
                    onNext();
                  }}
                  className="gf-btn-primary w-full py-3.5 text-sm font-extrabold shadow-lg cursor-pointer"
                >
                  I Agree, Take Me In! ❤️
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
