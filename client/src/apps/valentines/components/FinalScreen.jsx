import React from "react";
import { motion } from "framer-motion";
import { Heart, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function FinalScreen({ onReplay }) {
  const configContext = useCustomConfig();
  const { config, isEditing, updateConfig } = configContext || {};
  
  const finalScreen = config?.finalScreen || {
    title: "Biwipie,",
    letter: [
      "I know today wasn't the best day.",
      "Honestly, I didn't make this because I wanted to fix anything.",
      "I just wanted to spend some time with you. That's all.",
      "And if you smiled even once while looking through this, then I'm happy."
    ],
    signoff: "— Your idiot ❤️"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const handleReplayClick = () => {
    // Blast a huge heart shower using starlit palette colors
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#D4A5FF", "#F8C8DC", "#FFD89C"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#D4A5FF", "#F8C8DC", "#FFD89C"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Call scroll replay
    onReplay();
  };

  const handleLetterChange = (value) => {
    const paragraphs = value.split("\n\n").filter(Boolean);
    updateConfig("finalScreen", "letter", paragraphs);
  };

  const letterText = finalScreen.letter.join("\n\n");

  return (
    <section 
      id="final-screen" 
      className="min-h-[90vh] w-full flex flex-col justify-center items-center px-4 relative z-10 py-24 text-center overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-2xl mx-auto space-y-8 flex flex-col items-center w-full"
      >
        {/* Pulsing Glowing Heart */}
        <motion.div
          variants={itemVariants}
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative drop-shadow-[0_0_15px_rgba(248,200,220,0.5)]"
        >
          <Heart className="w-16 h-16 text-romantic-pink fill-current" />
          <span className="absolute inset-0 w-16 h-16 bg-romantic-pink fill-current animate-ping opacity-15 rounded-full" />
        </motion.div>

        {/* Handwritten Final Letter */}
        <motion.div
          variants={itemVariants}
          className="glass-panel p-8 md:p-10 rounded-3xl max-w-lg w-full text-left space-y-6 font-sans text-text-primary border border-glass-border shadow-2xl relative pointer-events-auto"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-romantic-pink/5 to-lavender-glow/5 blur-xl rounded-full" />
          
          {isEditing ? (
            <input
              type="text"
              value={finalScreen.title}
              onChange={(e) => updateConfig("finalScreen", "title", e.target.value)}
              placeholder="Letter Salutation (e.g., Biwipie,)"
              className="text-lg font-bold font-display text-romantic-pink bg-transparent border-b border-dashed border-romantic-pink/35 outline-none w-full z-20 pointer-events-auto"
            />
          ) : (
            <h3 className="text-xl font-bold font-display text-romantic-pink">
              {finalScreen.title}
            </h3>
          )}
          
          {isEditing ? (
            <textarea
              value={letterText}
              onChange={(e) => handleLetterChange(e.target.value)}
              placeholder="Write your custom letter here... Double press Enter for paragraph breaks!"
              className="text-text-secondary text-sm leading-relaxed font-sans font-light bg-transparent border border-dashed border-white/15 rounded-lg p-3 outline-none w-full min-h-[160px] z-20 pointer-events-auto italic"
            />
          ) : (
            <div className="space-y-4 text-base md:text-lg text-text-secondary leading-relaxed font-light italic">
              {finalScreen.letter.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {isEditing ? (
            <div className="flex justify-end pt-4 border-t border-divider-color z-20 pointer-events-auto">
              <span className="text-[10px] uppercase font-bold text-romantic-pink mr-2 mt-2">Sign:</span>
              <input
                type="text"
                value={finalScreen.signoff}
                onChange={(e) => updateConfig("finalScreen", "signoff", e.target.value)}
                placeholder="Signoff (e.g. — Your idiot ❤️)"
                className="text-right text-sm font-accent text-romantic-pink bg-transparent border-b border-dashed border-romantic-pink/35 outline-none w-full max-w-[200px]"
              />
            </div>
          ) : (
            <div className="text-right text-xl font-accent text-romantic-pink pt-4 border-t border-divider-color">
              {finalScreen.signoff}
            </div>
          )}
        </motion.div>

        {/* Replay action */}
        <motion.div variants={itemVariants} className="pt-8">
          <button
            onClick={handleReplayClick}
            className="group px-6 py-3 rounded-full flex items-center gap-2 border border-glass-border bg-glass-bg hover:bg-glass-hover hover:border-romantic-pink text-text-secondary hover:text-romantic-pink transition-all duration-300 font-semibold tracking-wide text-sm active:scale-95 pointer-events-auto cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            Replay Our Little World
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
