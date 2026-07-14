import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import RingBox from '../proposalOnly/RingBox';
import PremiumButton from '../../../components/shared/PremiumButton';

export default function ProposalRingSection() {
  const { 
    config, 
    nextStage, 
    ringBoxOpen, 
    setRingBoxOpen, 
    proposalAnswer, 
    handleProposalSubmit 
  } = useProposal();

  const handleAccept = () => {
    handleProposalSubmit('Accepted');
    nextStage('celebration');
  };

  return (
    <SectionWrapper maxWidth="max-w-md" className="space-y-6 md:space-y-8 select-none text-center">
      <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 w-full"
      >
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.25)] animate-pulse">
          <Heart className="w-10 h-10 fill-rose-500 animate-bounce" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-heading font-black text-rose-100 tracking-tight">
            {config.proposalQuestion}
          </h2>
          <p className="text-xs text-slate-400 font-light leading-relaxed max-w-xs mx-auto">
            {!ringBoxOpen ? "Open the ring box below to unlock the final key..." : "Choose your heart's answer..."}
          </p>
        </div>

        {/* Velvet ring box component */}
        <RingBox isOpen={ringBoxOpen} setIsOpen={setRingBoxOpen} />

        {/* Action CTAs */}
        {ringBoxOpen && !proposalAnswer && (
          <div className="flex gap-4 max-w-xs mx-auto pt-4">
            <PremiumButton
              variant="primary"
              onClick={handleAccept}
              className="w-1/2 py-3 shadow-lg"
            >
              {config.proposalYesBtn}
            </PremiumButton>
            <PremiumButton
              variant="secondary"
              onClick={() => handleProposalSubmit('Thinking')}
              className="w-1/2 py-3"
            >
              {config.proposalThinkBtn}
            </PremiumButton>
          </div>
        )}

        {proposalAnswer === 'Thinking' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-slate-900/60 backdrop-blur-md border border-amber-300/10 rounded-2xl max-w-xs mx-auto shadow-md"
          >
            <p className="text-xs text-rose-200 italic leading-relaxed">
              "{config.proposalThinkResponse}"
            </p>
          </motion.div>
        )}
      </motion.div>
    </SectionWrapper>
  );
}
