import React from 'react';
import { motion } from 'framer-motion';

export default function Rules({ onNext }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen w-full flex items-center justify-center p-6 bg-[var(--gf-bg-main)]"
    >
      {/* Parchment Scroll Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="max-w-xl w-full bg-[var(--gf-paper-bg)] text-[var(--gf-paper-text)] p-8 md:p-12 rounded-3xl shadow-2xl border-4 border-amber-800/30 relative overflow-hidden"
      >
        {/* Scroll Header */}
        <div className="text-center space-y-3 border-b-2 border-amber-800/20 pb-6 mb-8">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Official Protocol</span>
          <h2 className="text-4xl md:text-5xl gf-font-handwriting text-[var(--gf-accent-gold)] font-bold">
            Instructions & Rules
          </h2>
        </div>

        {/* Rules Content */}
        <div className="space-y-6 text-left my-6">
          {/* Rule 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
          >
            <span className="text-3xl">💋</span>
            <div className="space-y-1">
              <h3 className="font-bold text-lg font-serif">Rule 1 — The Kiss Penalty</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Every wrong answer means you owe your boyfriend <span className="font-bold underline text-rose-500">10 kisses</span>.
              </p>
            </div>
          </motion.div>

          {/* Rule 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20"
          >
            <span className="text-3xl">🎁</span>
            <div className="space-y-1">
              <h3 className="font-bold text-lg font-serif">Rule 2 — The Perfect Score Reward</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                If you answer every question correctly, your boyfriend owes you <span className="font-bold underline text-amber-600">one wish</span> of your choice.
              </p>
            </div>
          </motion.div>

          {/* Live Counter Display */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 gap-4 pt-4 text-center"
          >
            <div className="p-4 rounded-2xl bg-black/5 border border-black/10">
              <div className="text-2xl font-bold text-rose-500">0 💋</div>
              <div className="text-xs uppercase tracking-wider opacity-70 font-medium">Kisses Owed</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/5 border border-black/10">
              <div className="text-2xl font-bold text-amber-600">0 🎁</div>
              <div className="text-xs uppercase tracking-wider opacity-70 font-medium">Wishes Earned</div>
            </div>
          </motion.div>
        </div>

        {/* Start Game Button */}
        <div className="pt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="gf-btn-primary w-full py-4 text-xl shadow-lg cursor-pointer"
          >
            Start Game ❤️
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
