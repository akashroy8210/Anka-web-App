import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Heart } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function LetterSection() {
  const { config, nextStage, getNextStageId, activeLetter, setActiveLetter } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  return (
    <SectionWrapper maxWidth="max-w-xl" className="space-y-6 select-none w-full">
      <AnimatedTitle
        subtitle="Letters Never Sent"
        title="Unspoken Words of My Soul"
      />

      <div className="grid grid-cols-1 gap-4 w-full">
        {config.proposalLetters.map((item, idx) => (
          <GlassCard
            key={idx}
            glowColor="rose"
            onClick={() => setActiveLetter(item)}
            className="!p-5 hover:bg-white/10 cursor-pointer flex items-center justify-between shadow-sm border-rose-500/10 hover:border-rose-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                <BookOpen className="w-4.5 h-4.5 text-rose-450" />
              </div>
              <span className="text-xs font-bold text-rose-100">{item.title}</span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-rose-300">Open Envelope</span>
          </GlassCard>
        ))}
      </div>

      <AnimatePresence>
        {activeLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLetter(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            {/* Paper letter styled card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-[#FCF9F2] rounded-[32px] p-8 max-w-md w-full shadow-2xl relative text-left border border-[#EBE3D3] text-slate-800"
              style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 1px, transparent 0), radial-gradient(rgba(0,0,0,0.02) 1px, transparent 0)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 4px 4px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveLetter(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h4 className="font-heading font-black text-base text-wineDeep uppercase tracking-wider">
                  {activeLetter.title}
                </h4>
              </div>

              <p className="font-handwritten text-xl leading-relaxed text-slate-700 whitespace-pre-line min-h-48 max-h-[50vh] overflow-y-auto pr-2 select-text selection:bg-rose-200">
                {activeLetter.content}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex justify-between items-center">
                <span className="font-romantic text-2xl text-rose-600/80 italic">— with all my love</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Anka Surprises</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
