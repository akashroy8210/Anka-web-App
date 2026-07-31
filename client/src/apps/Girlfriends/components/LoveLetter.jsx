import React from 'react';
import { motion } from 'framer-motion';

export default function LoveLetter({ onNext, boyfriendName, girlfriendName, girlfriendPhoto, letterText }) {
  const bgPhoto = girlfriendPhoto || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200";

  const defaultLetterText = `My dearest ${girlfriendName || 'love'},\n\nFrom the moment you came into my life, everything became brighter, happier, and full of purpose. You have this incredible way of making even the simplest days feel extraordinary.\n\nThank you for all your warmth, your laughs, your patience, and your unconditional love. Being your boyfriend is the greatest gift of my life.\n\nOn this Girlfriend's Day and every single day after, I promise to cherish you, protect your smile, and love you more than words could ever capture.`;

  const textToDisplay = letterText || defaultLetterText;
  const paragraphs = textToDisplay.split('\n\n');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-black"
    >
      {/* Blurred Background Photo */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(${bgPhoto})` }}
      />

      {/* Unfolding Paper Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.88, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="max-w-2xl w-full bg-[#FFF8F3] text-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl border-4 border-rose-900/20 relative z-10 my-auto space-y-6"
      >
        {/* Letter Header */}
        <div className="border-b border-rose-900/10 pb-4 text-center">
          <span className="text-xs uppercase tracking-widest text-rose-800 font-bold">A Special Note For You</span>
          <h2 className="text-3xl md:text-4xl gf-font-handwriting text-rose-700 font-bold mt-1">
            My Love Letter
          </h2>
        </div>

        {/* Letter Body Paragraphs */}
        <div className="space-y-4 text-base md:text-xl gf-font-journal leading-relaxed text-slate-700">
          {paragraphs.map((para, idx) => (
            <motion.p 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.15 }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Letter Signature */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pt-6 border-t border-rose-900/10 text-right space-y-1"
        >
          <p className="text-lg gf-font-serif italic text-rose-800">
            ❤️ Forever Yours,
          </p>
          <p className="text-2xl gf-font-handwriting font-bold text-slate-900">
            {boyfriendName || 'Your Boyfriend'}
          </p>
        </motion.div>

        {/* Continue to Ending */}
        <div className="pt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="gf-btn-primary px-8 py-3 text-sm cursor-pointer"
          >
            ❤️ Continue to Special Ending
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
