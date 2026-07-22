import React from "react";
import { motion } from "framer-motion";
import { futureDreams } from "../data/placeholderData";
import { Sparkles, Heart } from "lucide-react";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function FutureDreams() {
  const configContext = useCustomConfig();
  const { config, isEditing, updateFutureDreamItem } = configContext || {};
  const isBasic = (configContext?.instance?.tier || '').toLowerCase() === 'basic';
  const rawDreams = config?.futureDreams || futureDreams;
  const dreams = isBasic ? rawDreams.slice(0, 3) : rawDreams;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 15 },
    },
  };

  return (
    <section id="future-dreams" className="py-24 px-4 max-w-5xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-16 space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-romantic-pink/10 text-romantic-pink border border-romantic-pink/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          A Clean Canvas
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-display text-text-primary"
        >
          Our Future Dreams
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted max-w-md mx-auto text-sm md:text-base font-sans"
        >
          Beautiful tomorrows waiting to be written. There is so much magic ahead for us.
        </motion.p>
      </div>

      {/* Grid of Polaroid Dream Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {dreams.map((dream, index) => {
          // Generate organic rotations for a cozy scrapbook look
          const rotations = [-2, 1.5, -1, 2, -1.5, 1];
          const rotation = isEditing ? 0 : rotations[index % rotations.length];

          return (
            <motion.div
              key={dream.id}
              variants={cardVariants}
              style={{ rotate: rotation }}
              whileHover={isEditing ? {} : {
                rotate: 0,
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3, type: "spring", stiffness: 150 },
              }}
              className="glass-panel p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:border-lavender-glow transition-all duration-300 pointer-events-auto flex flex-col justify-between"
            >
              {/* Card Body */}
              <div className="space-y-4">
                {/* Emoji / Icon Container */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${dream.color} flex items-center justify-center text-2xl shadow-sm z-20 pointer-events-auto`}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={dream.icon}
                      onChange={(e) => updateFutureDreamItem(dream.id, "icon", e.target.value)}
                      className="bg-transparent text-center text-2xl outline-none w-10"
                    />
                  ) : (
                    dream.icon
                  )}
                </div>

                {/* Text Content */}
                <div className="space-y-1.5 w-full">
                  {isEditing ? (
                    <input
                      type="text"
                      value={dream.title}
                      onChange={(e) => updateFutureDreamItem(dream.id, "title", e.target.value)}
                      placeholder="Title"
                      className="text-base font-bold font-display text-text-primary bg-transparent border-b border-dashed border-white/25 outline-none w-full z-20 pointer-events-auto focus:border-romantic-pink"
                    />
                  ) : (
                    <h3 className="text-lg md:text-xl font-bold font-display text-text-primary">
                      {dream.title}
                    </h3>
                  )}

                  {isEditing ? (
                    <textarea
                      value={dream.desc}
                      onChange={(e) => updateFutureDreamItem(dream.id, "desc", e.target.value)}
                      placeholder="Description"
                      className="text-text-secondary text-xs leading-relaxed font-sans font-light bg-transparent border border-dashed border-white/15 rounded-lg p-2 outline-none w-full min-h-[60px] z-20 pointer-events-auto focus:border-romantic-pink"
                    />
                  ) : (
                    <p className="text-text-secondary text-sm md:text-base leading-relaxed font-sans font-light">
                      {dream.desc}
                    </p>
                  )}
                </div>
              </div>

              {/* Heart Accent Footer */}
              <div className="flex items-center gap-1.5 border-t border-divider-color pt-4 mt-6 text-romantic-pink/40 group-hover:text-romantic-pink transition-colors">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span className="text-[10px] font-semibold tracking-widest uppercase font-sans">
                  Dreaming together
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
