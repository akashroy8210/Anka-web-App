import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { playChime } from '../services/proposalHelpers';

export default function RingBox({ isOpen, setIsOpen }) {
  const handleClick = () => {
    if (!isOpen) {
      playChime();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 select-none relative">
      
      {/* Ambient shadow glow behind box */}
      <div className="absolute w-44 h-16 bg-rose-500/10 rounded-full blur-2xl bottom-12 pointer-events-none z-0" />
      
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        {/* The Box Body */}
        <button
          onClick={handleClick}
          className="relative w-36 h-36 flex flex-col items-center justify-center focus:outline-none cursor-pointer group"
        >
          {/* Inner ring rise layout */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: -25, scale: 1.25 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                className="absolute z-30 flex flex-col items-center"
              >
                {/* Shining Ring */}
                <div className="relative">
                  <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(253,224,71,0.8)] animate-pulse">💍</span>
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-md pointer-events-none"
                  />
                </div>
                
                {/* Sparkle details */}
                <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-4 -right-4 animate-bounce" />
                <Heart className="w-4 h-4 text-rose-450 fill-rose-500 absolute -top-3 -left-4 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Velvet Box Lid / Body structure */}
          <div className="relative w-28 h-28 bg-gradient-to-b from-red-900 to-rose-950 rounded-3xl border border-rose-500/20 shadow-inner flex flex-col items-center justify-center transition-all group-hover:border-rose-500/30">
            {/* Box Lid Joint indicator */}
            <div className={`absolute left-0 right-0 h-[2px] bg-yellow-500/30 top-1/2 transition-all duration-500 ${isOpen ? 'translate-y-[-14px] scale-x-75' : ''}`} />
            
            {/* Box Lid (Opens Upward) */}
            <motion.div
              animate={isOpen ? { rotateX: -105, y: -20 } : { rotateX: 0, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-b from-red-800 to-red-900 rounded-3xl border border-rose-500/20 origin-top flex items-center justify-center shadow-lg"
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              {/* Box Top Monogram */}
              {!isOpen && (
                <div className="flex flex-col items-center">
                  <span className="text-white/20 font-serif text-[10px] tracking-widest uppercase mb-1">AnKa</span>
                  <Heart className="w-4 h-4 text-white/10 fill-white/5 animate-pulse" />
                </div>
              )}
            </motion.div>

            {/* Box Cushion Base (shows inside when open) */}
            {isOpen && (
              <div className="absolute inset-2 bg-gradient-to-b from-rose-950 to-black rounded-2xl flex items-center justify-center border border-white/5">
                {/* Velvet slit for ring */}
                <div className="w-12 h-2.5 bg-black/80 rounded-full border border-white/10 shadow-inner" />
              </div>
            )}
          </div>
        </button>
      </motion.div>

      {/* Box Labels */}
      <span className="text-[10px] uppercase font-bold text-rose-300 mt-4 tracking-[0.2em]">
        {isOpen ? 'Surprise Unlocked' : 'Tap to Open Box'}
      </span>
    </div>
  );
}
