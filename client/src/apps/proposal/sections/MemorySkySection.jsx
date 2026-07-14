import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import StarField from '../proposalOnly/StarField';
import ConstellationLines from '../proposalOnly/ConstellationLines';
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

      {/* Dark Luxury Sky Canvas */}
      <GlassCard
        glowColor="amber"
        hoverEffect={false}
        className="relative w-full h-[60vh] md:h-[65vh] border-amber-300/10 rounded-[32px] overflow-hidden shadow-2xl p-0 flex items-center justify-center bg-slate-950/90"
      >
        {/* Soft Nebula/Galaxy glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.12)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(244,63,94,0.1)_0%,transparent_60%)] pointer-events-none" />
        
        {/* Hundreds of Twinkling Stars (Twinkle continuously, different brightness) */}
        <StarField count={120} />

        {/* Constellation Lines */}
        <ConstellationLines stars={starsList} />

        {/* Memory Star Nodes (Artistically placed and pulsing) */}
        {starsList.map((item, idx) => {
          // Disperse positions artistically avoiding overlap
          const top = 20 + (idx * 23) % 65;
          const left = 15 + (idx * 31) % 70;
          const size = 18 + (idx % 3) * 4; // different sizes
          
          return (
            <motion.button
              key={idx}
              onClick={() => setActiveStar(item)}
              animate={{ 
                scale: [1, 1.25, 1], 
                opacity: [0.75, 1, 0.75],
                y: [0, -4, 0]
              }}
              transition={{ 
                duration: 3 + (idx % 2), 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute cursor-pointer p-2.5 z-10 group"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              {/* Star Core Icon */}
              <Star 
                className="text-amber-300 fill-amber-300/50 filter drop-shadow-[0_0_10px_rgba(253,224,71,0.85)] group-hover:scale-125 transition-transform" 
                style={{ width: `${size}px`, height: `${size}px` }}
              />
              {/* Pulse glow halo ring */}
              <div className="absolute inset-0 bg-yellow-300/10 rounded-full blur-sm pointer-events-none animate-ping opacity-60" 
                   style={{ animationDuration: '2s' }} />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
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
