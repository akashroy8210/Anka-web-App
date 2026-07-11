import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { moodComforts } from "../data/placeholderData";
import { Sparkles, Smile } from "lucide-react";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function MoodGarden() {
  const [selectedMood, setSelectedMood] = useState(null);

  const configContext = useCustomConfig();
  const { config, isEditing, updateMoodComfortItem } = configContext || {};
  const comforts = config?.moodGarden || moodComforts;

  const moods = Object.keys(comforts).map((key) => ({
    key,
    ...comforts[key],
  }));

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section id="mood-garden" className="py-24 px-4 max-w-4xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-12 space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-romantic-pink/10 text-romantic-pink border border-romantic-pink/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          A Safe Space
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-display text-text-primary"
        >
          How Are You Feeling?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted max-w-md mx-auto text-sm md:text-base font-sans"
        >
          You don't have to put on a brave face. Select how you feel right now, and let me sit with you.
        </motion.p>
      </div>

      {/* Mood Selector Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {moods.map((mood) => {
          const isActive = selectedMood === mood.key;

          return (
            <motion.button
              key={mood.key}
              onClick={() => setSelectedMood(isActive ? null : mood.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`glass-panel p-6 rounded-3xl text-center flex flex-col items-center justify-center gap-3 transition-all duration-300 pointer-events-auto cursor-pointer
                ${
                  isActive
                    ? "bg-romantic-pink/20 border-romantic-pink shadow-[0_0_20px_var(--glow-shadow)] scale-102"
                    : "bg-glass-bg hover:border-romantic-pink/40 hover:bg-glass-hover"
                }`}
            >
              {/* Emoji with pulse when active */}
              <div className="relative">
                <span className="text-4xl block relative z-10 filter drop-shadow-sm">{mood.emoji}</span>
                {isActive && (
                  <span className="absolute inset-0 bg-romantic-pink/25 rounded-full scale-150 animate-ping z-0" />
                )}
              </div>
              <span className="font-semibold text-text-secondary tracking-wide font-sans text-sm md:text-base">
                {mood.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Soothing Letter box */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          {selectedMood ? (
            <motion.div
              key={selectedMood}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="glass-panel p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col gap-4 text-center md:text-left pointer-events-auto w-full"
            >
              {/* Decorative design */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-romantic-pink/10 to-lavender-glow/10 blur-xl rounded-full" />
              
              <div className="flex flex-col md:flex-row items-center gap-4 border-b border-divider-color pb-4">
                <div className="w-12 h-12 rounded-full bg-romantic-pink/20 flex items-center justify-center text-2xl shadow-inner">
                  {comforts[selectedMood].emoji}
                </div>
                <div className="flex-1 w-full">
                  {isEditing ? (
                    <input
                      type="text"
                      value={comforts[selectedMood].title}
                      onChange={(e) => updateMoodComfortItem(selectedMood, "title", e.target.value)}
                      placeholder="Comfort Title"
                      className="text-lg md:text-xl font-bold text-text-primary font-display bg-transparent border-b border-dashed border-white/20 outline-none w-full z-20 pointer-events-auto"
                    />
                  ) : (
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary font-display">
                      {comforts[selectedMood].title}
                    </h3>
                  )}
                  <p className="text-xs text-romantic-pink font-semibold tracking-wide uppercase mt-0.5 font-sans">
                    A letter to your heart
                  </p>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={comforts[selectedMood].message}
                  onChange={(e) => updateMoodComfortItem(selectedMood, "message", e.target.value)}
                  placeholder="Comfort message..."
                  className="text-text-secondary text-sm md:text-base leading-relaxed font-sans font-light bg-transparent border border-dashed border-white/15 rounded-lg p-2 outline-none w-full min-h-[100px] z-20 pointer-events-auto italic"
                />
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-text-secondary text-base md:text-lg leading-relaxed font-sans font-light italic"
                >
                  "{comforts[selectedMood].message}"
                </motion.p>
              )}

              <div className="text-right text-xs md:text-sm font-display text-romantic-pink italic mt-2">
                — Forever yours ❤️
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-8 text-center text-text-muted border border-dashed border-divider-color rounded-3xl flex flex-col items-center justify-center gap-3 py-12 pointer-events-auto"
            >
              <Smile className="w-10 h-10 stroke-1" />
              <p className="font-sans text-sm md:text-base max-w-xs font-light italic">
                Select a mood tab above, my love. Let me offer a quiet shoulder to rest on.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
