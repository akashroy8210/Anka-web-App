import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function WaxSeal({ isBroken, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isBroken}
      whileHover={{ scale: isBroken ? 1 : 1.05 }}
      whileTap={{ scale: isBroken ? 1 : 0.95 }}
      className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-950 flex items-center justify-center border-2 border-red-500/20 shadow-[0_4px_12px_rgba(0,0,0,0.4),_inset_0_2px_4px_rgba(255,255,255,0.2)] focus:outline-none cursor-pointer z-20 group overflow-hidden"
    >
      {/* Embossed gold border rim inside */}
      <div className="absolute inset-1 rounded-full border border-yellow-500/30 pointer-events-none" />

      {/* Cracking Left & Right halves on break */}
      <motion.div
        animate={isBroken ? { x: -10, rotate: -12, opacity: 0.6 } : { x: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-gradient-to-br from-red-800 via-rose-900 to-red-950 border-r border-red-950/40 origin-left"
      >
        <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 fill-yellow-500/80 text-yellow-500/80 -translate-x-[14px]" />
        </div>
      </motion.div>

      <motion.div
        animate={isBroken ? { x: 10, rotate: 12, opacity: 0.6 } : { x: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-gradient-to-br from-red-800 via-rose-900 to-red-950 border-l border-red-950/40 origin-right"
      >
        <div className="absolute top-1/2 right-full translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 fill-yellow-500/80 text-yellow-500/80 translate-x-[14px]" />
        </div>
      </motion.div>

      {/* Center Heart overlay for un-broken seal */}
      {!isBroken && (
        <div className="relative z-10 flex items-center justify-center text-yellow-500/85 group-hover:text-yellow-350 transition-colors">
          <Heart className="w-5 h-5 fill-current" />
        </div>
      )}

      {/* Decorative wax seal irregular edges */}
      <div className="absolute -inset-1 rounded-full border border-red-900/30 pointer-events-none opacity-30" />
    </motion.button>
  );
}
