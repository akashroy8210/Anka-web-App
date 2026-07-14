import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/shared/GlassCard';
import MediaViewer from '../../../components/shared/MediaViewer';

export default function ProposalTimelineCard({ item, index }) {
  return (
    <motion.div
      initial={{ x: -15, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="relative space-y-3 pl-6"
    >
      {/* Dynamic timeline node */}
      <div className="absolute -left-[7px] top-2.5 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-950 shadow-[0_0_10px_rgba(244,63,94,0.6)] z-10" />
      
      <GlassCard glowColor="rose" className="border-rose-500/10 hover:border-rose-500/20 shadow-lg !p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/5 pb-2">
          <h4 className="font-heading font-black text-sm text-rose-100">{item.title}</h4>
          <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
            {item.date && <span>📅 {item.date}</span>}
            {item.location && <span>📍 {item.location}</span>}
          </div>
        </div>
        {item.photo && (
          <MediaViewer
            src={item.photo}
            alt={item.title}
            aspectRatio="aspect-video"
          />
        )}
        {item.description && (
          <p className="text-xs text-slate-300 font-light leading-relaxed">{item.description}</p>
        )}
      </GlassCard>
    </motion.div>
  );
}
