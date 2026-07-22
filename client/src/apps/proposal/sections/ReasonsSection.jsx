import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function ReasonsSection() {
  const { config, nextStage, getNextStageId, activeReason, setActiveReason, instance } = useProposal();
  const isBasic = (instance?.tier || '').toLowerCase() === 'basic';

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  return (
    <SectionWrapper maxWidth="max-w-xl" className="space-y-6 select-none w-full">
      <AnimatedTitle
        subtitle="Reasons Why I Love You"
        title="My Unspoken Thoughts"
      />

      <div className="grid grid-cols-2 gap-4 w-full">
        {config.proposalReasons.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={isBasic ? {} : { scale: 1.03 }}
            whileTap={isBasic ? {} : { scale: 0.97 }}
            onClick={isBasic ? undefined : () => setActiveReason(item)}
            className={`bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-5 rounded-3xl text-center space-y-2.5 shadow-md flex flex-col justify-center items-center h-32 group transition-all duration-300 ${
              isBasic ? 'cursor-default' : 'cursor-pointer hover:border-rose-500/30'
            }`}
          >
            <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 group-hover:bg-rose-500/20 transition-all">
              <Heart className={`w-5 h-5 text-rose-450 fill-rose-500/20 transition-transform ${isBasic ? '' : 'group-hover:scale-110'}`} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">{item.tagline}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveReason(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="bg-amber-50 border border-amber-100 rounded-[32px] p-6 md:p-8 max-w-sm w-full space-y-4 shadow-2xl relative text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveReason(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center pb-2 border-b border-slate-200/80">
                <Heart className="w-7 h-7 text-rose-500 fill-rose-500/10 mx-auto animate-pulse" />
                <h4 className="font-heading font-black text-lg text-wineDeep mt-2 uppercase tracking-wide">
                  {activeReason.tagline}
                </h4>
              </div>

              {activeReason.photo && (
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-black/5">
                  <img
                    src={activeReason.photo}
                    alt={activeReason.tagline}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {activeReason.description && (
                <p className="text-xs font-serif font-light leading-relaxed text-slate-700 text-center italic">
                  "{activeReason.description}"
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
