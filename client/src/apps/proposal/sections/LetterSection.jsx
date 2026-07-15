import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';
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
    <SectionWrapper maxWidth="max-w-4xl" className="space-y-8 select-none w-full relative py-12">
      {/* Soft atmospheric background lights */}
      <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 via-transparent to-transparent pointer-events-none z-0" />

      <AnimatedTitle
        subtitle="Letters Never Sent"
        title="Unspoken Words of My Soul"
      />

      {/* Responsive Envelopes List - Centers beautifully on desktop */}
      <div className="flex flex-wrap gap-8 w-full py-8 justify-center items-center z-10 relative">
        {config.proposalLetters.map((item, idx) => (
          <Envelope
            key={idx}
            recipientName={config.recipientName}
            title={item.title}
            onOpen={() => setActiveLetter(item)}
          />
        ))}
      </div>

      {/* Romantic Deckle-Edged Letter Popup Modal */}
      <AnimatePresence>
        {activeLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLetter(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, rotate: -2, opacity: 0, y: 35 }}
              animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, rotate: 2, opacity: 0, y: 35 }}
              transition={{ type: 'spring', damping: 16, stiffness: 90 }}
              className="bg-[#FAF6EE] rounded-[40px] p-8 md:p-12 max-w-lg w-full shadow-[0_35px_80px_-15px_rgba(0,0,0,0.85)] border-2 border-[#EADFC9] text-slate-800 overflow-hidden relative text-left"
              style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.01) 1.2px, transparent 0), radial-gradient(rgba(0,0,0,0.01) 1.2px, transparent 0)',
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 5px 5px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold deckled borders */}
              <div className="absolute inset-4 rounded-[28px] border border-amber-600/15 pointer-events-none z-10" />

              {/* Physical paper texture fold crease lines */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49.7%,rgba(0,0,0,0.02)_50%,transparent_50.3%)] pointer-events-none z-10" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49.7%,rgba(0,0,0,0.02)_50%,transparent_50.3%)] pointer-events-none z-10" />

              {/* Elegant Gold close badge */}
              <button
                onClick={() => setActiveLetter(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-20 shadow-sm border border-black/5"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Romantic script header */}
              <div className="flex items-center gap-2.5 border-b border-[#EADFC9] pb-4 mb-6 select-none relative z-10">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                <h4 className="font-heading font-black text-xs md:text-sm text-amber-900 uppercase tracking-widest">
                  {activeLetter.title}
                </h4>
              </div>

              {/* Handwritten Letter body */}
              <p className="font-handwritten text-xl sm:text-2xl leading-relaxed text-slate-700 whitespace-pre-line min-h-60 max-h-[50vh] overflow-y-auto pr-3 select-text selection:bg-rose-250/30 relative z-10">
                {activeLetter.content}
              </p>

              {/* Handwritten Close Signature */}
              <div className="mt-8 pt-4 border-t border-[#EADFC9] flex justify-between items-center select-none relative z-10">
                <span className="font-romantic text-2xl text-rose-600/90 italic">
                  — with all my love
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-slate-400 tracking-widest">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Anka Stationery</span>
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
