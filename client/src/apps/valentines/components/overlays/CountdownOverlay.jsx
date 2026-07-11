import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gift } from "lucide-react";

export default function CountdownOverlay({ duration, message, onClose }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-auto">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4, filter: "blur(10px)", transition: { duration: 0.4 } }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <h2 className="text-sm font-bold tracking-widest text-lavender-glow uppercase font-sans">
              Surprise Incoming in...
            </h2>
            <motion.div
              key={timeLeft}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-8xl md:text-9xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink drop-shadow-[0_0_30px_rgba(212,165,255,0.45)]"
            >
              {timeLeft}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="glass-panel max-w-md w-full p-8 rounded-3xl text-center relative border border-glass-border shadow-2xl flex flex-col items-center gap-6 shadow-[0_0_45px_rgba(212,165,255,0.3)]"
          >
            <div className="absolute top-4 right-4 text-romantic-pink">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            {/* Gift Icon Seal */}
            <div className="w-16 h-16 bg-lavender-glow/20 text-lavender-glow rounded-full flex items-center justify-center mb-2 relative">
              <Gift className="w-8 h-8 animate-bounce" />
              <span className="absolute inset-0 bg-lavender-glow/10 rounded-full scale-125 animate-ping" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold tracking-widest text-romantic-pink uppercase mb-2 font-sans">
                A Surprise For You
              </h3>
              <p className="text-xl md:text-2xl font-display text-text-primary italic leading-relaxed py-2">
                "{message}"
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-gradient-to-r from-romantic-pink to-lavender-glow text-white font-semibold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer font-sans"
            >
              Open Surprise 🎁
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
