import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

export default function ShootingStarAlert({ message, onClose }) {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Show card after the shooting star completes its path (approx 1.2s)
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 1200);

    // Auto close after 7 seconds of showing the card
    const closeTimer = setTimeout(() => {
      onClose();
    }, 8200);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* Shooting Star Vector Graphic */}
      <motion.div
        initial={{ x: "-20vw", y: "15vh", opacity: 1 }}
        animate={{
          x: "120vw",
          y: "75vh",
          opacity: [1, 1, 0]
        }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="absolute w-2 h-2 rounded-full bg-[#FFF3D4] z-50"
        style={{
          boxShadow: "0 0 25px 3px #FFF3D4, -30px -15px 50px 3px rgba(255,243,212,0.4)"
        }}
      />

      {/* Surprise Message Card Popup */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -25 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="glass-panel max-w-md w-full p-6 md:p-8 rounded-3xl flex flex-col items-center text-center relative pointer-events-auto shadow-[0_0_35px_rgba(255,216,156,0.25)]"
          >
            {/* Top right sparkles decor */}
            <div className="absolute top-4 right-4 text-amber-highlight">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            {/* Beating Heart Seal */}
            <div className="w-14 h-14 bg-romantic-pink/20 text-romantic-pink rounded-full flex items-center justify-center mb-4 relative">
              <Heart className="w-7 h-7 fill-current animate-pulse" />
              <span className="absolute inset-0 bg-romantic-pink/15 rounded-full scale-125 animate-ping" />
            </div>

            <h3 className="text-[10px] font-bold tracking-widest text-amber-highlight uppercase mb-2 font-sans">
              A shooting star dropped a wish
            </h3>

            <p className="text-xl md:text-2xl font-display text-text-primary italic leading-relaxed py-2">
              "{message}"
            </p>

            <button
              onClick={onClose}
              className="mt-6 px-5 py-2 rounded-full border border-glass-border hover:border-romantic-pink text-text-secondary hover:text-romantic-pink text-xs font-semibold transition-all cursor-pointer"
            >
              Catch the wish 💫
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
