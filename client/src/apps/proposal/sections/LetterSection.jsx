import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import Envelope from '../proposalOnly/Envelope';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function LetterSection() {
  const { config, nextStage, getNextStageId, activeLetter, setActiveLetter } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  return (
    <SectionWrapper maxWidth="max-w-xl" className="space-y-6 select-none w-full relative">
      <AnimatedTitle
        subtitle="Letters Never Sent"
        title="Unspoken Words of My Soul"
      />

      {/* Grid of Envelopes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full py-4 justify-center">
        {config.proposalLetters.map((item, idx) => (
          <Envelope
            key={idx}
            recipientName={config.recipientName}
            title={item.title}
            onOpen={() => setActiveLetter(item)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLetter(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
          >
            {/* Realistic Aged Paper Letter Layout */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 14 }}
              className="bg-[#FCF9F2] rounded-[36px] p-8 md:p-10 max-w-md w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] relative text-left border border-[#EDE5D6] text-slate-800 overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.015) 1px, transparent 0), radial-gradient(rgba(0,0,0,0.015) 1px, transparent 0)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 4px 4px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Soft physical letter fold crease lines */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49.5%,rgba(0,0,0,0.02)_50%,transparent_50.5%)] pointer-events-none z-10" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49.5%,rgba(0,0,0,0.02)_50%,transparent_50.5%)] pointer-events-none z-10" />

              {/* Close Button */}
              <button
                onClick={() => setActiveLetter(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Romantic Header */}
              <div className="flex items-center gap-2 border-b border-slate-250/70 pb-3 mb-5 select-none relative z-10">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h4 className="font-heading font-black text-sm md:text-base text-wineDeep uppercase tracking-wider">
                  {activeLetter.title}
                </h4>
              </div>

              {/* Letter content (scrollable paper body) */}
              <p className="font-handwritten text-xl sm:text-2xl leading-relaxed text-slate-700/90 whitespace-pre-line min-h-48 max-h-[48vh] overflow-y-auto pr-2 select-text selection:bg-rose-250 relative z-10">
                {activeLetter.content}
              </p>

              {/* Hand-written closing signature */}
              <div className="mt-6 pt-4 border-t border-slate-250/60 flex justify-between items-center select-none relative z-10">
                <span className="font-romantic text-2xl text-rose-600/95 italic">
                  — with all my love
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  Anka Surprises
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
