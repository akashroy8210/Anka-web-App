import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { starMessages } from "../data/placeholderData";
import { Sparkles, MessageCircle, X } from "lucide-react";
import confetti from "canvas-confetti";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function MessageStars() {
  const [activeStar, setActiveStar] = useState(null);
  const [clickedStars, setClickedStars] = useState(new Set());
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);

  const configContext = useCustomConfig();
  const { config, isEditing, updateStarMessageItem } = configContext || {};
  const messages = config?.starMessages || starMessages;

  // Generate responsive random positions on mount or when messages length changes
  useEffect(() => {
    const generatedStars = [];
    const rows = 6;
    const cols = 5;
    
    // Distribute stars on grid to prevent overlaps, but add random offsets
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        if (index >= messages.length) break;

        const gridX = (c + 0.1 + Math.random() * 0.8) / cols * 100;
        const gridY = (r + 0.1 + Math.random() * 0.8) / rows * 100;

        // Size variations
        const size = Math.random() * 6 + 10; // 10px to 16px
        // Twinkle speed
        const twinkleDelay = Math.random() * 4;
        const twinkleDuration = 2 + Math.random() * 3;

        generatedStars.push({
          id: index,
          x: gridX,
          y: gridY,
          size,
          twinkleDelay,
          twinkleDuration
        });
      }
    }
    setStars(generatedStars);
  }, [messages.length]);

  const handleStarClick = (star, e) => {
    setActiveStar(star);
    setClickedStars((prev) => {
      const next = new Set(prev);
      next.add(star.id);
      return next;
    });

    // Particle Burst using canvas-confetti
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 15,
      angle: 90,
      spread: 45,
      origin: { x, y },
      colors: ["#D4A5FF", "#F8C8DC", "#FFD89C", "#FFFFFF"], // lavender, romantic pink, amber, white
      shapes: ["circle"],
      ticks: 60,
      gravity: 0.8,
      scalar: 0.8
    });
  };

  return (
    <section id="message-stars" className="py-24 px-4 max-w-5xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-10 space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-romantic-pink/10 text-romantic-pink border border-romantic-pink/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Sky
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-display text-text-primary"
        >
          Message Stars
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted max-w-md mx-auto text-sm md:text-base font-sans"
        >
          Click the glowing stars in our night sky to reveal hidden thoughts written just for you.
        </motion.p>
      </div>

      {/* Sky Container */}
      <div 
        ref={containerRef}
        className="w-full h-[450px] md:h-[550px] relative bg-black/15 rounded-3xl border border-glass-border shadow-2xl overflow-hidden backdrop-blur-sm pointer-events-auto"
      >
        {/* Soft nebulas in sky */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-romantic-pink/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-lavender-glow/5 blur-3xl" />

        {/* Twinkling star map */}
        {stars.map((star) => {
          const isClicked = clickedStars.has(star.id);
          const isActive = activeStar?.id === star.id;

          return (
            <motion.button
              key={star.id}
              onClick={(e) => handleStarClick(star, e)}
              className="absolute pointer-events-auto group focus:outline-none cursor-pointer"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size * 2.5}px`,
                height: `${star.size * 2.5}px`,
                transform: "translate(-50%, -50%)",
              }}
              aria-label={`Star ${star.id + 1}`}
            >
              {/* Twinkle / glow circle */}
              <motion.div
                animate={{
                  scale: isActive ? [1, 1.4, 1.2] : isClicked ? 1.1 : [1, 1.3, 1],
                  opacity: isActive ? 1 : isClicked ? 0.9 : [0.4, 1, 0.4],
                }}
                transition={{
                  scale: isActive ? { duration: 0.3 } : {
                    duration: star.twinkleDuration,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: star.twinkleDelay,
                  },
                  opacity: isActive ? { duration: 0.3 } : {
                    duration: star.twinkleDuration,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: star.twinkleDelay,
                  },
                }}
                className={`w-full h-full flex items-center justify-center rounded-full transition-all duration-300
                  ${
                    isActive 
                      ? "text-amber-highlight drop-shadow-[0_0_8px_rgba(255,216,156,1)]" 
                      : isClicked 
                        ? "text-romantic-pink drop-shadow-[0_0_5px_rgba(248,200,220,0.6)]" 
                        : "text-text-muted group-hover:text-amber-highlight group-hover:drop-shadow-[0_0_6px_var(--glow-shadow)]"
                  }`}
              >
                {/* Visual SVG star shape */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-1/2 h-1/2"
                >
                  <path d="M12 1.5l2.83 5.73 6.32.92-4.58 4.46 1.08 6.3-5.65-2.97-5.65 2.97 1.08-6.3-4.58-4.46 6.32-.92L12 1.5z" />
                </svg>
              </motion.div>

              {/* Pulsing ring around active star */}
              {isActive && (
                <span className="absolute inset-0 border border-amber-highlight rounded-full animate-ping opacity-60" />
              )}
            </motion.button>
          );
        })}

        {/* Counter UI inside the box */}
        <div className="absolute bottom-4 left-6 text-xs text-text-muted font-sans tracking-wide">
          Stars Found: <span className="font-semibold text-romantic-pink">{clickedStars.size}</span> / {stars.length}
        </div>
      </div>

      {/* Star Message Dialog Modal */}
      <AnimatePresence>
        {activeStar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-panel max-w-md w-full rounded-3xl p-6 md:p-8 flex flex-col items-center text-center relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveStar(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-romantic-pink transition-colors p-1 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 bg-romantic-pink/20 text-romantic-pink rounded-full flex items-center justify-center mb-4 shadow-inner">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold tracking-widest text-romantic-pink uppercase mb-2 font-sans">
                Star #{activeStar.id + 1} Whisper
              </h3>

              {/* Content */}
              {isEditing ? (
                <textarea
                  value={messages[activeStar.id] || ""}
                  onChange={(e) => updateStarMessageItem(activeStar.id, e.target.value)}
                  placeholder="Write your secret star whisper here..."
                  className="text-text-secondary text-sm leading-relaxed font-sans font-light bg-transparent border border-dashed border-white/15 rounded-lg p-3 outline-none w-full min-h-[100px] z-20 pointer-events-auto italic text-center focus:border-romantic-pink"
                />
              ) : (
                <p className="text-xl md:text-2xl font-display text-text-primary font-medium italic leading-relaxed py-3">
                  "{messages[activeStar.id]}"
                </p>
              )}

              {/* Button */}
              <button
                onClick={() => setActiveStar(null)}
                className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-romantic-pink to-lavender-glow text-white font-semibold text-sm hover:opacity-95 active:scale-95 transition-all shadow-md shadow-romantic-pink/20 cursor-pointer"
              >
                Close Whisper
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
