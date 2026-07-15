import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function WaxSeal({ isBroken, onClick }) {
  // Molten wax detaching physics: split halves rotate slightly and fall down while fading out
  const leftHalfVariants = {
    closed: { x: 0, y: 0, rotate: 0, opacity: 1 },
    broken: { x: -30, y: 60, rotate: -25, opacity: 0 }
  };

  const rightHalfVariants = {
    closed: { x: 0, y: 0, rotate: 0, opacity: 1 },
    broken: { x: 30, y: 60, rotate: 25, opacity: 0 }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isBroken}
      whileHover={isBroken ? {} : { scale: 1.08, rotate: 1 }}
      whileTap={isBroken ? {} : { scale: 0.95 }}
      className={`relative w-16 h-16 flex items-center justify-center focus:outline-none cursor-pointer z-20 group transition-all duration-300 ${
        isBroken 
          ? 'pointer-events-none' 
          : 'rounded-[52%_48%_54%_46%_/_48%_52%_48%_52%] bg-gradient-to-br from-[#BD1E3C] via-[#8C0E26] to-[#4A000E] shadow-[0_8px_24px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-4px_8px_rgba(0,0,0,0.6)] border border-[#7A061B]'
      }`}
    >
      {/* Inner wax circular seal depression stamp ring */}
      {!isBroken && (
        <div className="absolute w-[80%] h-[80%] rounded-[50%_48%_51%_49%] border border-[#7A0012]/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),_0_1px_2px_rgba(255,255,255,0.15)] pointer-events-none z-10" />
      )}

      {/* Shimmering reflection light sweep overlay */}
      {!isBroken && (
        <div className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none z-15">
          <div className="w-4 h-[150%] bg-white/25 blur-sm rotate-30 absolute top-[-25%] left-[-50%] group-hover:left-[150%] transition-[left] duration-1000 ease-out" />
        </div>
      )}

      {/* Left Halved Wax Plate */}
      <motion.div
        variants={leftHalfVariants}
        initial="closed"
        animate={isBroken ? "broken" : "closed"}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-gradient-to-br from-[#BD1E3C] via-[#8C0E26] to-[#4A000E] border-r border-[#690011] origin-left rounded-l-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.35),_inset_0_-4px_6px_rgba(0,0,0,0.5)] flex items-center"
      >
        <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center">
          {/* Gold Metallic Embossed split heart */}
          <Heart className="w-5.5 h-5.5 fill-[#F2C249] text-[#B8860B] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.7)] -translate-x-[15.5px]" />
        </div>
      </motion.div>

      {/* Right Halved Wax Plate */}
      <motion.div
        variants={rightHalfVariants}
        initial="closed"
        animate={isBroken ? "broken" : "closed"}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-gradient-to-br from-[#BD1E3C] via-[#8C0E26] to-[#4A000E] border-l border-[#690011] origin-right rounded-r-full shadow-[inset_-2px_2px_4px_rgba(255,255,255,0.35),_inset_0_-4px_6px_rgba(0,0,0,0.5)] flex items-center"
      >
        <div className="absolute top-1/2 right-full translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center">
          {/* Gold Metallic Embossed split heart */}
          <Heart className="w-5.5 h-5.5 fill-[#F2C249] text-[#B8860B] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.7)] translate-x-[15.5px]" />
        </div>
      </motion.div>

      {/* Center Heart Emblem overlay (visible when closed, disappears immediately on click) */}
      {!isBroken && (
        <div className="relative z-10 flex items-center justify-center text-[#FCD264] group-hover:text-[#FFE79E] transition-colors filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]">
          <Heart className="w-6 h-6 fill-current stroke-[#946A00] stroke-[1.5]" />
        </div>
      )}
    </motion.button>
  );
}
