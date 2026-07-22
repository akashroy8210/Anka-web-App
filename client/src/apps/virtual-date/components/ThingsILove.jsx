import React from "react";
import { motion } from "framer-motion";
import { thingsILove } from "../data/placeholderData";
import { Heart } from "lucide-react";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function ThingsILove() {
  const configContext = useCustomConfig();
  const { config, isEditing, updateThingsILoveItem } = configContext || {};
  const isBasic = (configContext?.instance?.tier || '').toLowerCase() === 'basic';
  const rawItems = config?.thingsILove || thingsILove;
  const items = isBasic ? rawItems.slice(0, 6) : rawItems;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section id="things-i-love" className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-16 space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-romantic-pink/10 text-romantic-pink border border-romantic-pink/20"
        >
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
          A Little Reminder
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-display text-text-primary"
        >
          Things I Love About You
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted max-w-md mx-auto text-sm md:text-base font-sans"
        >
          Just a few of the infinite reasons why you are so incredibly special to me.
        </motion.p>
      </div>

      {/* Floating Card Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {items.map((item, index) => {
          // Generate a custom float speed/delay for natural asynchronous movement
          const floatDuration = 4 + (index % 3) * 1.5;
          const floatDelay = index * 0.2;

          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              animate={isEditing ? {} : {
                y: [0, -10, 0],
              }}
              transition={isEditing ? {} : {
                y: {
                  duration: floatDuration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: floatDelay,
                },
              }}
              whileHover={isEditing ? {} : { 
                scale: 1.05, 
                rotate: (index % 2 === 0 ? 1 : -1) * 1,
                transition: { duration: 0.3 }
              }}
              className="glass-panel group relative p-6 md:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between pointer-events-auto"
            >
              {/* Soft decorative background glow */}
              <div className={`absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-30 blur-2xl transition-opacity duration-500`} />

              {/* Heart Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr ${item.color} text-white font-bold text-xs shadow-sm`}>
                  {item.id}
                </div>
                <Heart className="w-4 h-4 text-romantic-pink fill-current opacity-40 group-hover:opacity-100 group-hover:text-romantic-pink transition-all duration-300" />
              </div>

              {/* Card Text */}
              <div className="space-y-2 relative z-10 flex-1 w-full">
                {isEditing ? (
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateThingsILoveItem(item.id, "title", e.target.value)}
                    placeholder="Title"
                    className="text-base font-bold text-text-primary font-display bg-transparent border-b border-dashed border-white/25 outline-none w-full z-20 pointer-events-auto"
                  />
                ) : (
                  <h3 className="text-lg md:text-xl font-bold text-text-primary font-display">
                    {item.title}
                  </h3>
                )}

                {isEditing ? (
                  <textarea
                    value={item.desc}
                    onChange={(e) => updateThingsILoveItem(item.id, "desc", e.target.value)}
                    placeholder="Description"
                    className="text-text-secondary text-xs leading-relaxed font-sans font-light bg-transparent border border-dashed border-white/15 rounded-lg p-2 outline-none w-full min-h-[60px] z-20 pointer-events-auto"
                  />
                ) : (
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed font-sans font-light">
                    {item.desc}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
