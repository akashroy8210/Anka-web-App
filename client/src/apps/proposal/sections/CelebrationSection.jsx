import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import PremiumButton from '../../../components/shared/PremiumButton';

export default function CelebrationSection() {
  const { config, triggerCelebration } = useProposal();

  return (
    <SectionWrapper maxWidth="max-w-xl" className="space-y-6 md:space-y-8 select-none text-center">
      <div className="absolute inset-0 bg-radial-gradient from-rose-500/10 via-transparent to-transparent pointer-events-none animate-pulse" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 w-full flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-inner">
          <Check className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-heading font-black text-rose-100 tracking-tight filter drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            Celebration Time!
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">
            Our hearts are officially locked forever ❤️
          </p>
        </div>

        {config.proposalCelebrateLetter && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FCF9F2] text-slate-800 p-6 md:p-8 rounded-[32px] text-left border shadow-2xl font-serif max-w-md mx-auto leading-relaxed text-xs whitespace-pre-line border-[#EBE3D3] select-text selection:bg-rose-200"
          >
            {config.proposalCelebrateLetter}
          </motion.div>
        )}

        <PremiumButton
          variant="ghost"
          onClick={triggerCelebration}
          className="group !px-7 !py-2.5 hover:!bg-white/10"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
          <span>Celebrate Again</span>
        </PremiumButton>
      </motion.div>
    </SectionWrapper>
  );
}
