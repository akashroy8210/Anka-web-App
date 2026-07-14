import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/shared/GlassCard';

export default function ProposalQuote({ firstText, secondText }) {
  return (
    <GlassCard glowColor="rose" hoverEffect={false} className="max-w-md w-full mx-auto relative overflow-hidden py-10 px-8 text-center border-rose-500/10">
      <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 via-transparent to-transparent pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 md:space-y-8 select-none"
      >
        {firstText && (
          <p className="text-rose-200 text-lg md:text-xl font-serif italic leading-relaxed">
            "{firstText}"
          </p>
        )}
        {secondText && (
          <p className="text-rose-300 font-serif italic text-lg md:text-xl leading-relaxed pt-2">
            "{secondText}"
          </p>
        )}
      </motion.div>
    </GlassCard>
  );
}
