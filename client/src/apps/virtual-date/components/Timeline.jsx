import React, { useState } from "react";
import { motion } from "framer-motion";
import { timelineMemories } from "../data/placeholderData";
import { Calendar, Heart } from "lucide-react";
import { useSocket } from "../contexts/SocketContext";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function Timeline() {
  const socketContext = useSocket();
  const unlockedMemories = socketContext ? socketContext.unlockedMemories : new Set();
  const [localUnlocked, setLocalUnlocked] = useState(new Set([1])); // Memory 1 always unlocked

  const configContext = useCustomConfig();
  const { config, isEditing, updateTimelineItem } = configContext || {};
  const memories = config?.timeline || timelineMemories;

  const handleLocalUnlock = (id) => {
    setLocalUnlocked((prev) => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });
  };

  return (
    <section id="timeline" className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-16 space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-romantic-pink/10 text-romantic-pink border border-romantic-pink/20"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          Our Journey
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-display text-text-primary"
        >
          Our Story Timeline
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted max-w-md mx-auto text-sm md:text-base font-sans"
        >
          A slow walk down memory lane, remembering the beautiful steps that brought us here.
        </motion.p>
      </div>

      {/* Timeline Tree */}
      <div className="relative">
        {/* Central Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-romantic-pink via-lavender-glow to-divider-color -translate-x-[1px]" />

        {/* Memory Items */}
        <div className="space-y-16">
          {memories.map((memory, index) => {
            const isEven = index % 2 === 0;
            const isUnlocked = 
              isEditing ||
              memory.id === 1 || 
              (unlockedMemories && unlockedMemories.has(memory.id)) || 
              localUnlocked.has(memory.id);

            return (
              <div
                key={memory.id}
                className={`flex flex-col md:flex-row items-stretch ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Spacing filler for desktop */}
                <div className="hidden md:block w-1/2" />

                {/* Central Dot */}
                <div className="relative z-10 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-8 h-8 rounded-full border-4 border-bg-from bg-gradient-to-br from-romantic-pink to-lavender-glow flex items-center justify-center text-white text-xs shadow-md shadow-romantic-pink/30 translate-x-0 md:-translate-x-4"
                  >
                    ❤️
                  </motion.div>
                </div>

                {/* Card Container */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                  className="w-full md:w-1/2 pl-12 md:pl-0 pr-0 md:px-8"
                >
                  {isUnlocked ? (
                    <div className="glass-panel group relative overflow-hidden shadow-xl hover:shadow-2xl hover:border-lavender-glow transition-all duration-500 flex flex-col pointer-events-auto rounded-3xl">
                      {/* Card Image / Looping Video */}
                      <div className="h-48 md:h-56 overflow-hidden relative">
                        {memory.image.includes("video") || memory.image.includes(".mp4") || memory.image.startsWith("data:video") ? (
                          <video
                            src={memory.image}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <img
                            src={memory.image}
                            alt={memory.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                        
                        {/* Custom visualizer overlay editor */}
                        {isEditing && (
                          <label className="absolute inset-0 bg-black/60 hover:bg-black/80 flex flex-col items-center justify-center gap-1.5 text-white text-xs font-semibold cursor-pointer transition-all z-20 pointer-events-auto">
                            <span>📷 Upload Photo/Video</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.readAsDataURL(file);
                                  reader.onloadend = () => {
                                    updateTimelineItem(memory.id, "image", reader.result);
                                  };
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}

                        {/* Floating Date Badge */}
                        {isEditing ? (
                          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/15 z-30 pointer-events-auto">
                            <span className="text-[9px] uppercase font-bold text-romantic-pink font-sans">Date:</span>
                            <input
                              type="text"
                              value={memory.date}
                              onChange={(e) => updateTimelineItem(memory.id, "date", e.target.value)}
                              className="bg-transparent text-white text-xs font-semibold outline-none w-20"
                            />
                          </div>
                        ) : (
                          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md text-white border border-white/10 shadow-sm">
                            <Calendar className="w-3.5 h-3.5" />
                            {memory.date}
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={memory.title}
                            onChange={(e) => updateTimelineItem(memory.id, "title", e.target.value)}
                            placeholder="Memory Title"
                            className="text-base font-bold text-text-primary font-display bg-transparent border-b border-dashed border-white/20 outline-none w-full z-20 pointer-events-auto"
                          />
                        ) : (
                          <h3 className="text-xl md:text-2xl font-bold text-text-primary font-display">
                            {memory.title}
                          </h3>
                        )}

                        {isEditing ? (
                          <textarea
                            value={memory.description}
                            onChange={(e) => updateTimelineItem(memory.id, "description", e.target.value)}
                            placeholder="Describe this memory..."
                            className="text-text-secondary text-xs leading-relaxed font-sans font-light bg-transparent border border-dashed border-white/15 rounded-lg p-2 outline-none w-full min-h-[70px] z-20 pointer-events-auto"
                          />
                        ) : (
                          <p className="text-text-secondary text-sm md:text-base leading-relaxed font-sans font-light">
                            {memory.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel group relative overflow-hidden shadow-xl hover:shadow-2xl hover:border-romantic-pink/40 transition-all duration-500 flex flex-col pointer-events-auto rounded-3xl min-h-[320px] items-center justify-center p-8 text-center bg-white/5 border border-glass-border shadow-inner">
                      <div className="w-14 h-14 bg-romantic-pink/15 text-romantic-pink rounded-full flex items-center justify-center mb-4 relative">
                        <span className="text-xl">🔒</span>
                        <span className="absolute inset-0 bg-romantic-pink/10 rounded-full scale-125 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-bold font-display text-text-primary mb-1">
                        Locked Memory
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-[220px] mb-6 italic">
                        Unlockable by Sona or remotely by Bubu ✨
                      </p>
                      <button
                        onClick={() => handleLocalUnlock(memory.id)}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-romantic-pink to-lavender-glow text-white font-semibold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer font-sans"
                      >
                        Unlock with love ❤️
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
