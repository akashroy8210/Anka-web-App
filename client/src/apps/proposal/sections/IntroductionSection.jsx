import React from 'react';
import { motion } from 'framer-motion';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function IntroductionSection() {
  const { config, nextStage, getNextStageId } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  return (
    <SectionWrapper maxWidth="max-w-xl" className="space-y-6 md:space-y-8 select-none text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-5 w-full flex flex-col items-center"
      >
        <AnimatedTitle
          subtitle="The Star of My Story"
          title={config.proposalStarName}
        />
        
        {config.proposalStarPhoto && (
          <div className="w-52 h-52 md:w-60 md:h-60 rounded-full border-4 border-rose-500/20 overflow-hidden shadow-2xl relative">
            <img
              src={config.proposalStarPhoto}
              alt={config.proposalStarName}
              className="w-full h-full object-cover animate-fade-in"
            />
            {/* Subtle glow rim */}
            <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
          </div>
        )}

        {config.proposalStarNickname && (
          <span className="text-lg font-light text-slate-400">
            ({config.proposalStarNickname})
          </span>
        )}

        {config.proposalStarIntro && (
          <p className="text-slate-300 font-serif italic text-sm md:text-base leading-relaxed max-w-md mx-auto pt-2 border-t border-white/5">
            "{config.proposalStarIntro}"
          </p>
        )}
      </motion.div>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
