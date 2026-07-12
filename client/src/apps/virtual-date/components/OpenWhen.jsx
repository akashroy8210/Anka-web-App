import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { openWhenLetters } from "../data/placeholderData";
import { Mail, X, Heart } from "lucide-react";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function OpenWhen() {
  const [activeLetter, setActiveLetter] = useState(null);

  const configContext = useCustomConfig();
  const { config, isEditing, updateOpenWhenLetterItem } = configContext || {};
  const letters = config?.openWhenLetters || openWhenLetters;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <section id="open-when" className="py-24 px-4 max-w-5xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-16 space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-romantic-pink/10 text-romantic-pink border border-romantic-pink/20"
        >
          <Mail className="w-3.5 h-3.5" />
          Love Letters
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-display text-text-primary"
        >
          Open When...
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted max-w-md mx-auto text-sm md:text-base font-sans"
        >
          Letters written for specific moments when you need comfort, a warm hug, or a reminder that I'm here.
        </motion.p>
      </div>

      {/* Envelope Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
      >
        {letters.map((letter) => (
          <motion.div
            key={letter.id}
            variants={itemVariants}
            whileHover={isEditing ? {} : { scale: 1.05, y: -5 }}
            onClick={() => setActiveLetter(letter)}
            className={`glass-panel p-6 rounded-3xl border text-center flex flex-col items-center justify-between cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 relative group pointer-events-auto
              ${letter.bg} hover:border-romantic-pink`}
          >
            {/* Top Envelope Accent Flap design */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-romantic-pink/30 to-lavender-glow/30 rounded-t-3xl" />

            {/* Letter Symbol */}
            <div className="w-14 h-14 rounded-full bg-glass-bg flex items-center justify-center text-3xl shadow-md group-hover:rotate-12 transition-transform duration-300">
              {letter.emoji}
            </div>

            {/* Title / Label */}
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-text-primary font-sans text-sm md:text-base">
                Open When You're
              </h3>
              <p className="text-lg md:text-xl font-bold font-display text-romantic-pink">
                {letter.label}
              </p>
            </div>

            {/* Small Seal symbol */}
            <div className="mt-6 w-8 h-8 rounded-full border border-romantic-pink/30 bg-romantic-pink/10 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-current text-romantic-pink opacity-45 group-hover:scale-110 group-hover:opacity-100 transition-all" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Letter Reading Overlay Modal */}
      <AnimatePresence>
        {activeLetter && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md pointer-events-auto"
            onClick={() => setActiveLetter(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing on click content
              className="relative max-w-xl w-full bg-[#17182b]/95 rounded-3xl border border-lavender-glow/40 shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Envelope flap open transition effect at top of modal */}
              <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-romantic-pink via-lavender-glow to-romantic-pink" />
              
              {/* Close Button */}
              <button
                onClick={() => setActiveLetter(null)}
                className="absolute top-6 right-6 text-text-muted hover:text-romantic-pink transition-colors p-1 z-10 cursor-pointer"
                aria-label="Close letter"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Letter Content */}
              <div className="p-8 md:p-10 flex flex-col gap-6 select-text max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-divider-color pb-4">
                  <span className="text-4xl">{activeLetter.emoji}</span>
                  <div className="flex-1 w-full">
                    {isEditing ? (
                      <input
                        type="text"
                        value={activeLetter.title}
                        onChange={(e) => {
                          updateOpenWhenLetterItem(activeLetter.id, "title", e.target.value);
                          setActiveLetter(prev => ({ ...prev, title: e.target.value }));
                        }}
                        placeholder="Open when..."
                        className="text-lg md:text-xl font-bold font-display text-romantic-pink bg-transparent border-b border-dashed border-romantic-pink/35 outline-none w-full focus:border-romantic-pink"
                      />
                    ) : (
                      <h3 className="text-lg md:text-xl font-bold font-display text-romantic-pink">
                        {activeLetter.title}
                      </h3>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-text-muted font-sans tracking-wide uppercase">
                        Private Letter
                      </p>
                      {isEditing && (
                        <div className="flex items-center gap-1 z-20 pointer-events-auto">
                          <span className="text-[10px] text-romantic-pink font-bold">Envelope Tab:</span>
                          <input
                            type="text"
                            value={activeLetter.label}
                            onChange={(e) => {
                              updateOpenWhenLetterItem(activeLetter.id, "label", e.target.value);
                              setActiveLetter(prev => ({ ...prev, label: e.target.value }));
                            }}
                            className="bg-transparent border-b border-dashed border-white/20 text-white text-[10px] outline-none w-20 focus:border-romantic-pink"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body Text (Handwriting/emotional font style) */}
                {isEditing ? (
                  <textarea
                    value={activeLetter.content}
                    onChange={(e) => {
                      updateOpenWhenLetterItem(activeLetter.id, "content", e.target.value);
                      setActiveLetter(prev => ({ ...prev, content: e.target.value }));
                    }}
                    placeholder="Write envelope letter..."
                    className="text-text-primary text-sm leading-relaxed font-sans font-light bg-transparent border border-dashed border-white/15 rounded-lg p-3 outline-none w-full min-h-[160px] z-20 pointer-events-auto italic focus:border-romantic-pink"
                  />
                ) : (
                  <p className="text-text-primary font-sans text-base md:text-lg leading-relaxed italic font-light first-letter:text-4xl first-letter:font-bold first-letter:text-romantic-pink first-letter:mr-2 first-letter:float-left">
                    {activeLetter.content}
                  </p>
                )}

                {/* Footer Signoff */}
                <div className="border-t border-divider-color pt-4 mt-4 flex justify-between items-center text-xs md:text-sm text-text-muted italic">
                  <span>Written with all my heart</span>
                  <span className="font-display text-romantic-pink font-bold flex items-center gap-1">
                    Yours, Forever <Heart className="w-3 h-3 fill-current animate-pulse text-romantic-pink" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
