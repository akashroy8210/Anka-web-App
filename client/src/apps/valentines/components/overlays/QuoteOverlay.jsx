import React from "react";
import { motion } from "framer-motion";

export default function QuoteOverlay({ text }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl text-center space-y-4 px-4 py-8"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[2px] bg-gradient-to-r from-romantic-pink to-lavender-glow mx-auto"
        />
        <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white italic leading-relaxed drop-shadow-[0_4px_15px_rgba(255,255,255,0.1)]">
          "{text}"
        </h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[2px] bg-gradient-to-r from-romantic-pink to-lavender-glow mx-auto"
        />
      </motion.div>
    </div>
  );
}
