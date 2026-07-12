import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function Welcome({ onEnter }) {
  const configContext = useCustomConfig();
  const { config, isEditing, updateConfig } = configContext || {};

  const welcome = config?.welcome || {
    title: "Hey My Love ❤️",
    subtitle: "I know today may feel heavy.",
    line1: "You don't have to smile.",
    line2: "You don't have to explain.",
    line3: "You don't even have to talk.",
    prompt: "Just stay here with me for a little while.",
    buttonText: "Enter Our Little World"
  };

  // Stagger configurations for text reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.0, // Delay between each text block
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 40,
        damping: 15,
        duration: 1.2,
      },
    },
  };

  return (
    <section 
      id="welcome" 
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 relative z-10 overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl text-center space-y-6 md:space-y-8 flex flex-col items-center w-full"
      >
        {/* Heart Icon header */}
        <motion.div variants={itemVariants} className="mb-2">
          <div className="relative">
            <Heart className="w-12 h-12 text-romantic-pink fill-current animate-pulse shadow-rose-500/50" />
            <span className="absolute inset-0 w-12 h-12 bg-romantic-pink fill-current animate-ping opacity-25 rounded-full" />
          </div>
        </motion.div>

        {/* Hey My Love */}
        {isEditing ? (
          <input
            type="text"
            value={welcome.title}
            onChange={(e) => updateConfig("welcome", "title", e.target.value)}
            placeholder="Edit Title..."
            className="text-3xl md:text-5xl font-extrabold text-romantic-pink font-display tracking-tight text-center bg-transparent border-b border-dashed border-romantic-pink/40 outline-none focus:border-romantic-pink w-full max-w-lg z-20 pointer-events-auto"
          />
        ) : (
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink font-display tracking-tight"
          >
            {welcome.title}
          </motion.h1>
        )}

        {/* I know today may feel heavy */}
        {isEditing ? (
          <input
            type="text"
            value={welcome.subtitle}
            onChange={(e) => updateConfig("welcome", "subtitle", e.target.value)}
            placeholder="Edit Subtitle..."
            className="text-lg md:text-xl font-semibold text-text-primary tracking-wide font-sans text-center bg-transparent border-b border-dashed border-white/20 outline-none focus:border-romantic-pink w-full max-w-lg z-20 pointer-events-auto"
          />
        ) : (
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl font-semibold text-text-primary tracking-wide font-sans max-w-lg"
          >
            {welcome.subtitle}
          </motion.p>
        )}

        {/* Bullet thoughts */}
        {isEditing ? (
          <div className="space-y-3 text-base md:text-lg text-text-secondary font-sans italic w-full max-w-md flex flex-col items-center z-20 pointer-events-auto">
            <input
              type="text"
              value={welcome.line1}
              onChange={(e) => updateConfig("welcome", "line1", e.target.value)}
              className="text-center bg-transparent border-b border-dashed border-white/10 outline-none focus:border-romantic-pink w-full"
            />
            <input
              type="text"
              value={welcome.line2}
              onChange={(e) => updateConfig("welcome", "line2", e.target.value)}
              className="text-center bg-transparent border-b border-dashed border-white/10 outline-none focus:border-romantic-pink w-full"
            />
            <input
              type="text"
              value={welcome.line3}
              onChange={(e) => updateConfig("welcome", "line3", e.target.value)}
              className="text-center bg-transparent border-b border-dashed border-white/10 outline-none focus:border-romantic-pink w-full"
            />
          </div>
        ) : (
          <motion.div 
            variants={itemVariants} 
            className="space-y-2.5 text-base md:text-lg text-text-secondary font-sans italic"
          >
            <p>{welcome.line1}</p>
            <p>{welcome.line2}</p>
            <p>{welcome.line3}</p>
          </motion.div>
        )}

        {/* Just stay here with me */}
        {isEditing ? (
          <input
            type="text"
            value={welcome.prompt}
            onChange={(e) => updateConfig("welcome", "prompt", e.target.value)}
            placeholder="Edit prompt..."
            className="text-base md:text-lg font-normal text-text-primary tracking-wide text-center bg-transparent border-b border-dashed border-white/20 outline-none focus:border-romantic-pink w-full max-w-lg z-20 pointer-events-auto"
          />
        ) : (
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl font-normal text-text-primary tracking-wide"
          >
            {welcome.prompt}
          </motion.p>
        )}

        {/* Glowing button */}
        <motion.div variants={itemVariants} className="pt-6">
          {isEditing ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-text-muted font-sans font-bold uppercase tracking-wider">Button Text</span>
              <input
                type="text"
                value={welcome.buttonText}
                onChange={(e) => updateConfig("welcome", "buttonText", e.target.value)}
                className="px-6 py-2 rounded-full bg-romantic-pink/20 border border-romantic-pink/40 text-white text-xs font-semibold text-center outline-none z-20 pointer-events-auto"
              />
            </div>
          ) : (
            <button
              onClick={onEnter}
              className="group relative px-8 py-3.5 rounded-full font-semibold tracking-wide text-white overflow-hidden shadow-[0_4px_25px_var(--glow-shadow)] hover:shadow-[0_4px_35px_rgba(212,165,255,0.4)] active:scale-95 transition-all duration-300 border border-white/10 pointer-events-auto cursor-pointer"
            >
              {/* Pulsing button background */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink transition-all duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Button text */}
              <span className="relative z-10 flex items-center gap-2">
                {welcome.buttonText}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  🌸
                </motion.span>
              </span>
            </button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
