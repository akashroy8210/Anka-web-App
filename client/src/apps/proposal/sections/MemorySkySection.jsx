import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function MemorySkySection() {
  const { config, nextStage, getNextStageId, activeStar, setActiveStar } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  const starsList = config.proposalSkyMemories || [];

  return (
    <SectionWrapper maxWidth="max-w-3xl" className="space-y-6 select-none w-full relative">
      <AnimatedTitle
        subtitle="Memory Sky"
        title="Written in the Stars"
      />

      {/* Sky Canvas Frame */}
      <GlassCard
        glowColor="amber"
        hoverEffect={false}
        className="relative w-full h-[60vh] md:h-[65vh] border-amber-300/10 rounded-[32px] overflow-hidden shadow-2xl p-0 flex items-center justify-center bg-slate-950/80"
      >
        {/* Ambient Nebula glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(139,92,246,0.1)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_75%,rgba(244,63,94,0.08)_0%,transparent_50%)] pointer-events-none" />
        
        {/* Constellation SVG lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="constGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(253, 224, 71, 0.15)" />
              <stop offset="100%" stopColor="rgba(244, 63, 94, 0.15)" />
            </linearGradient>
          </defs>
          
          {starsList.map((star, idx) => {
            if (idx === starsList.length - 1) return null;
            const x1 = 15 + (idx * 33) % 70;
            const y1 = 15 + (idx * 27) % 70;
            const nextIdx = idx + 1;
            const x2 = 15 + (nextIdx * 33) % 70;
            const y2 = 15 + (nextIdx * 27) % 70;
            
            return (
              <motion.line
                key={idx}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="url(#constGradient)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: idx * 0.2 }}
              />
            );
          })}
        </svg>

        {/* Twinkling star nodes */}
        {starsList.map((item, idx) => {
          const top = 15 + (idx * 27) % 70;
          const left = 15 + (idx * 33) % 70;
          return (
            <motion.button
              key={idx}
              onClick={() => setActiveStar(item)}
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.6, 1, 0.6],
                y: [0, -3, 0]
              }}
              transition={{ 
                duration: 2.5 + (idx % 3), 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute cursor-pointer p-2 z-10 hover:scale-125 transition-transform"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <Star className="w-5 h-5 text-amber-300 fill-amber-300/40 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.7)]" />
              {/* Star halo */}
              <div className="absolute inset-0 w-9 h-9 bg-yellow-300/5 rounded-full blur-sm pointer-events-none -left-0.5 -top-0.5" />
            </motion.button>
          );
        })}
      </GlassCard>

      <AnimatePresence>
        {activeStar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveStar(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-amber-300/20 rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveStar(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-amber-300/10 text-amber-300 rounded-full flex items-center justify-center mx-auto border border-amber-300/20">
                <Star className="w-6 h-6 fill-amber-300" />
              </div>
              
              <h4 className="font-heading font-black text-lg text-rose-100">{activeStar.title}</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-light">{activeStar.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
