import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import PremiumButton from '../../../components/shared/PremiumButton';

export default function HeroSection() {
  const { config, nextStage, getNextStageId, handlePlayMusic } = useProposal();

  const handleStart = () => {
    handlePlayMusic();
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  return (
    <SectionWrapper maxWidth="max-w-md" className="space-y-6 md:space-y-8 select-none text-center">
      <div className="absolute inset-0 bg-radial-gradient from-rose-950/20 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="space-y-4"
      >
        <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-[inset_0_0_20px_rgba(244,63,94,0.1)]">
          <Heart className="w-12 h-12 animate-pulse fill-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
        </div>
        <h1 className="font-heading font-black text-4xl md:text-5xl text-rose-200 tracking-tight leading-tight filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          AnKa Surprises
        </h1>
        <p className="text-[10px] text-rose-300/40 uppercase tracking-[0.25em]">presents a proposal journey</p>
        <p className="text-slate-400 font-light text-sm leading-relaxed pt-2">
          Please turn on your sound for the most immersive experience.
        </p>
      </motion.div>

      <PremiumButton
        variant="primary"
        onClick={handleStart}
        className="!px-10 !py-4 shadow-[0_0_40px_rgba(244,63,94,0.4)]"
      >
        Begin Our Journey ❤️
      </PremiumButton>
    </SectionWrapper>
  );
}
