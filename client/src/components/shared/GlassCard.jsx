import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  glowColor = 'rose', // 'rose' | 'amber' | 'slate' | 'none'
  hoverEffect = true,
  ...props
}) {
  const glowStyles = {
    rose: "shadow-[0_8px_32px_rgba(244,63,94,0.08)] border-rose-500/15 bg-slate-900/60",
    amber: "shadow-[0_8px_32px_rgba(245,158,11,0.08)] border-amber-300/15 bg-slate-900/60",
    slate: "shadow-[0_8px_32px_rgba(255,255,255,0.03)] border-white/8 bg-slate-900/40",
    none: "border-white/5 bg-slate-900/30"
  };

  const selectedGlow = glowStyles[glowColor] || glowStyles.slate;

  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.01, borderColor: 'rgba(244, 63, 94, 0.25)' } : undefined}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden backdrop-blur-xl border rounded-[32px] p-6 md:p-8 transition-all ${selectedGlow} ${className}`}
      {...props}
    >
      {/* Subtle light reflections */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 pointer-events-none" />
      
      {/* Decorative back-lighting */}
      {glowColor === 'rose' && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />
      )}
      {glowColor === 'amber' && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      )}
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
