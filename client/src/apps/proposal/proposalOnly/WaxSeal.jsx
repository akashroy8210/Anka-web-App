import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function WaxSeal({ isBroken, onClick }) {
  // Broken halves animate outwards, fall downwards, and dissolve away (detach physics)
  const leftHalfVariants = {
    closed: { x: 0, y: 0, rotate: 0, opacity: 1 },
    broken: { x: -24, y: 55, rotate: -22, opacity: 0 }
  };

  const rightHalfVariants = {
    closed: { x: 0, y: 0, rotate: 0, opacity: 1 },
    broken: { x: 24, y: 55, rotate: 22, opacity: 0 }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isBroken}
      whileHover={{ scale: isBroken ? 1 : 1.05 }}
      whileTap={{ scale: isBroken ? 1 : 0.95 }}
      className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 border-red-500/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)] focus:outline-none cursor-pointer z-20 group ${
        isBroken ? 'pointer-events-none border-none shadow-none bg-transparent' : 'bg-gradient-to-br from-red-700 via-rose-800 to-red-950'
      }`}
    >
      {/* Embossed inner gold border */}
      {!isBroken && (
        <div className="absolute inset-1 rounded-full border border-yellow-500/30 pointer-events-none z-10" />
      )}

      {/* Cracking Left Half */}
      <motion.div
        variants={leftHalfVariants}
        initial="closed"
        animate={isBroken ? "broken" : "closed"}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-gradient-to-br from-red-700 via-rose-800 to-red-950 border-r border-red-955/40 origin-left rounded-l-full shadow-inner flex items-center"
      >
        <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 fill-yellow-500/80 text-yellow-500/80 -translate-x-[14px]" />
        </div>
      </motion.div>

      {/* Cracking Right Half */}
      <motion.div
        variants={rightHalfVariants}
        initial="closed"
        animate={isBroken ? "broken" : "closed"}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-gradient-to-br from-red-700 via-rose-800 to-red-950 border-l border-red-955/40 origin-right rounded-r-full shadow-inner flex items-center"
      >
        <div className="absolute top-1/2 right-full translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 fill-yellow-500/80 text-yellow-500/80 translate-x-[14px]" />
        </div>
      </motion.div>

      {/* Center Heart icon overlay */}
      {!isBroken && (
        <div className="relative z-10 flex items-center justify-center text-yellow-500/85 group-hover:text-yellow-350 transition-colors">
          <Heart className="w-5 h-5 fill-current" />
        </div>
      )}

      {/* Decorative wax seal irregular edges */}
      {!isBroken && (
        <div className="absolute -inset-1 rounded-full border border-red-900/30 pointer-events-none opacity-30" />
      )}
    </motion.button>
  );
}
