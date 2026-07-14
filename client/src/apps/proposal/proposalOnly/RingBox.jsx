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
      
      {/* Luxury Ambient Base Radial Glow */}
      <div className="absolute w-48 h-20 bg-rose-500/10 rounded-full blur-3xl bottom-14 pointer-events-none z-0" />
      
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          rotate: [0, 0.5, -0.5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <button
          onClick={handleClick}
          className="relative w-40 h-40 flex flex-col items-center justify-center focus:outline-none cursor-pointer group"
        >
          {/* Glowing Engagement Ring rising up */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.7 }}
                animate={{ opacity: 1, y: -30, scale: 1.35 }}
                exit={{ opacity: 0, y: 15, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
                className="absolute z-30 flex flex-col items-center pointer-events-none"
              >
                <div className="relative">
                  <span className="text-6xl filter drop-shadow-[0_0_20px_rgba(253,224,71,0.95)]">💍</span>
                  {/* Outer light rays halo */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-3 bg-yellow-400/20 rounded-full blur-md"
                  />
                </div>
                
                <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-5 -right-5 animate-bounce" />
                <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500 absolute -top-4 -left-5 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Luxury Burgundy Velvet Box Body */}
          <div className="relative w-32 h-32 bg-gradient-to-b from-red-950 via-[#40020A] to-red-950 rounded-3xl border border-rose-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.8),_inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center transition-all group-hover:border-rose-500/35">
            {/* Embossed gold border rim wrapper inside */}
            <div className="absolute inset-1 rounded-[22px] border border-yellow-500/25 pointer-events-none" />

            {/* Velvet joint gap indicator */}
            <div className={`absolute left-0 right-0 h-[3px] bg-yellow-500/35 top-1/2 transition-all duration-700 ${isOpen ? 'translate-y-[-16px] scale-x-50 opacity-40' : ''}`} />
            
            {/* Box Lid (Opens Upward using rotation) */}
            <motion.div
              animate={isOpen ? { rotateX: -110, y: -24, zIndex: 5 } : { rotateX: 0, y: 0, zIndex: 15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-gradient-to-b from-[#5c030f] to-[#40020A] rounded-3xl border border-rose-500/20 origin-top flex items-center justify-center shadow-lg"
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              <div className="absolute inset-1 rounded-[22px] border border-yellow-500/20 pointer-events-none" />
              
              {/* Embossed Gold Lettering Monogram */}
              {!isOpen && (
                <div className="flex flex-col items-center text-center px-4">
                  <span className="text-[#F5D061] font-serif text-[11px] tracking-[0.25em] uppercase font-bold filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    AnKa
                  </span>
                  <div className="w-6 h-[1px] bg-yellow-500/30 my-1" />
                  <Heart className="w-3 h-3 text-yellow-500/50 fill-yellow-500/20" />
                </div>
              )}
            </motion.div>

            {/* Inner cushion (renders under lid when open) */}
            {isOpen && (
              <div className="absolute inset-2 bg-gradient-to-b from-[#200105] to-black rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                {/* Velvet slit for ring stand */}
                <div className="w-14 h-3 bg-black rounded-full border border-[#40020A] shadow-[inset_0_3px_5px_rgba(0,0,0,0.9)]" />
              </div>
            )}
          </div>
        </button>
      </motion.div>

      {/* Under Label */}
      <span className="text-[10px] uppercase font-black text-rose-300 mt-4 tracking-[0.25em]">
        {isOpen ? 'Surprise Unlocked' : 'Tap Box to Open'}
      </span>
    </div>
  );
}
