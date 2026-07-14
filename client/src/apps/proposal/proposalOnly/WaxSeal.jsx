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
      className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-950 flex items-center justify-center border-2 border-red-500/20 shadow-[0_4px_12px_rgba(0,0,0,0.4),_inset_0_2px_4px_rgba(255,255,255,0.2)] focus:outline-none cursor-pointer z-20 group"
    >
      {/* Embossed gold border rim inside */}
      <div className="absolute inset-1 rounded-full border border-yellow-500/30 pointer-events-none" />

      {/* Wax seal heart imprint */}
      <AnimatePresence>
        {!isBroken ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5, opacity: 0, rotate: [0, -15, 15] }}
            className="flex items-center justify-center text-yellow-500/80 group-hover:text-yellow-400"
          >
            <Heart className="w-5 h-5 fill-current" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            className="text-yellow-500/20"
          >
            <Heart className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative wax seal irregular edges */}
      <div className="absolute -inset-1 rounded-full border border-red-900/40 pointer-events-none opacity-40" />
    </motion.button>
  );
}

import { AnimatePresence } from 'framer-motion';
