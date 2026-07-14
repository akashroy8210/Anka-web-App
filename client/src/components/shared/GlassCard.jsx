import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  glowColor = 'rose', // 'rose' | 'amber' | 'slate' | 'purple' | 'orange' | 'blue' | 'emerald' | 'cyan' | 'pink' | 'violet' | 'none'
  variant = 'default', // 'default' | 'luxury' | 'envelope' | 'bento' | 'popup' | 'proposal'
  hoverEffect = true,
  ...props
}) {
  const glowStyles = {
    rose: "shadow-[0_8px_32px_rgba(244,63,94,0.08)] border-rose-500/15 bg-slate-900/60",
    amber: "shadow-[0_8px_32px_rgba(245,158,11,0.08)] border-amber-300/15 bg-slate-900/60",
    purple: "shadow-[0_8px_32px_rgba(168,85,247,0.08)] border-purple-500/15 bg-slate-900/60",
    orange: "shadow-[0_8px_32px_rgba(249,115,22,0.08)] border-orange-500/15 bg-slate-900/60",
    blue: "shadow-[0_8px_32px_rgba(59,130,246,0.08)] border-blue-500/15 bg-slate-900/60",
    emerald: "shadow-[0_8px_32px_rgba(16,185,129,0.08)] border-emerald-500/15 bg-slate-900/60",
    cyan: "shadow-[0_8px_32px_rgba(6,182,212,0.08)] border-cyan-500/15 bg-slate-900/60",
    pink: "shadow-[0_8px_32px_rgba(236,72,153,0.08)] border-pink-500/15 bg-slate-900/60",
    violet: "shadow-[0_8px_32px_rgba(139,92,246,0.08)] border-violet-500/15 bg-slate-900/60",
    slate: "shadow-[0_8px_32px_rgba(255,255,255,0.03)] border-white/8 bg-slate-900/40",
    none: "border-white/5 bg-slate-900/30"
  };

  const variantClasses = {
    default: "rounded-[32px] p-6 md:p-8",
    luxury: "rounded-[40px] p-8 md:p-12 border-rose-500/20 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]",
    envelope: "rounded-none p-6 bg-[#FCF9F2] text-slate-800 border-none shadow-[0_15px_40px_rgba(0,0,0,0.15)]",
    bento: "rounded-[24px] p-6 md:p-7 bg-slate-900/70 border-white/5 hover:border-white/15",
    popup: "rounded-[36px] p-6 md:p-8 border-white/10 bg-slate-950/90 shadow-[0_30px_70px_rgba(0,0,0,0.85)]",
    proposal: "rounded-[44px] p-8 md:p-10 border-rose-500/25 bg-gradient-to-b from-rose-950/20 via-slate-900/50 to-slate-950/40"
  };

  const selectedGlow = glowStyles[glowColor] || glowStyles.slate;
  const selectedVariant = variantClasses[variant] || variantClasses.default;

  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.015, y: -2 } : undefined}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden backdrop-blur-xl border transition-all ${selectedGlow} ${selectedVariant} ${className}`}
      {...props}
    >
      {/* Subtle light reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 pointer-events-none" />
      
      {/* Dynamic ambient halo ring */}
      {glowColor !== 'none' && (
        <div className={`absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-20 bg-${glowColor}-500`}
             style={{
               backgroundImage: `radial-gradient(circle, var(--tw-gradient-stops))`,
               filter: 'blur(40px)'
             }}
        />
      )}
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
