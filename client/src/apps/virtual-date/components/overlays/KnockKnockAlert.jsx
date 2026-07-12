import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function KnockKnockAlert({ onClose }) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel max-w-sm w-full p-8 rounded-3xl text-center border border-glass-border shadow-2xl flex flex-col items-center gap-6"
          >
            {/* Soft Knock Ring visuals */}
            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
              <span className="absolute inset-0 bg-lavender-glow/20 rounded-full animate-ping" />
              <span className="absolute inset-2 bg-lavender-glow/30 rounded-full animate-pulse" />
              <div className="relative text-3xl">🚪</div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display text-text-primary">
                Knock knock...
              </h3>
              <p className="text-sm text-text-muted font-sans font-light">
                Someone is knocking on our door.
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-romantic-pink to-lavender-glow text-white font-semibold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer font-sans"
            >
              Who's there? 🤔
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel max-w-sm w-full p-8 rounded-3xl text-center border border-glass-border shadow-2xl flex flex-col items-center gap-6"
          >
            <div className="relative w-16 h-16 bg-romantic-pink/20 text-romantic-pink rounded-full flex items-center justify-center mb-2">
              <Heart className="w-8 h-8 fill-current animate-pulse" />
              <span className="absolute inset-0 bg-romantic-pink/10 rounded-full scale-125 animate-ping" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold font-display text-text-primary">
                It's me ❤️
              </h3>
              <p className="text-sm text-text-muted font-sans font-light">
                Your favorite idiot.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-romantic-pink to-lavender-glow text-white font-semibold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer font-sans"
            >
              Come in 🌸
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel max-w-sm w-full p-8 rounded-3xl text-center border border-glass-border shadow-2xl flex flex-col items-center gap-6"
          >
            <div className="text-4xl animate-bounce">🧸</div>

            <div className="space-y-2">
              <h3 className="text-3xl font-accent text-romantic-pink leading-none">
                I missed you.
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs font-sans font-light italic">
                Just wanted to drop by and say hello. I'm right here with you, baby.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full border border-glass-border hover:border-romantic-pink text-text-secondary hover:text-romantic-pink font-semibold text-sm transition-all cursor-pointer font-sans"
            >
              Close Door ❤️
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
