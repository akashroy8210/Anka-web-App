import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import { FAVORITES_CONFIG } from '../constants/defaults';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function EverythingAboutYou() {
  const { config, nextStage, getNextStageId } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  // Build active favorites list based on configuration driving
  const items = FAVORITES_CONFIG.map((fav) => {
    const value = config[fav.key];
    if (!value) return null;

    const IconComponent = Icons[fav.iconName] || Icons.Heart;

    const colorClasses = {
      purple: { border: 'hover:border-purple-500/40', glow: 'purple', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]' },
      orange: { border: 'hover:border-orange-500/40', glow: 'orange', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]' },
      blue: { border: 'hover:border-blue-500/40', glow: 'blue', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
      emerald: { border: 'hover:border-emerald-500/40', glow: 'emerald', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
      cyan: { border: 'hover:border-cyan-500/40', glow: 'cyan', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
      yellow: { border: 'hover:border-amber-500/40', glow: 'amber', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
      pink: { border: 'hover:border-pink-500/40', glow: 'pink', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]' },
      violet: { border: 'hover:border-violet-500/40', glow: 'violet', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]' }
    };

    const accent = colorClasses[fav.accentColor] || colorClasses.purple;

    return {
      key: fav.key,
      value: value,
      label: fav.defaultLabel,
      tagline: fav.defaultTagline,
      category: fav.defaultCategory || 'About You',
      Icon: IconComponent,
      accent
    };
  }).filter(Boolean);

  return (
    <SectionWrapper maxWidth="max-w-3xl" className="space-y-12 select-none relative py-16">
      {/* Ambient background glows for storytelling atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 via-violet-500/5 to-transparent pointer-events-none z-0" />
      
      <AnimatedTitle
        subtitle="Every Little Thing I Fell in Love With"
        title="Pieces of You That I Treasure"
      />

      {/* Alternating storytelling cards layout */}
      <div className="flex flex-col space-y-8 w-full z-10 relative">
        {items.map((item, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: isEven ? 80 : -80, y: 15 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                type: "spring", 
                stiffness: 70, 
                damping: 15, 
                mass: 0.9,
                delay: idx * 0.1 
              }}
              className="w-full flex"
            >
              <GlassCard
                glowColor={item.accent.glow}
                variant="bento"
                className={`w-full relative overflow-hidden transition-all duration-500 border-white/5 hover:bg-slate-900/50 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 ${
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                } ${item.accent.border}`}
              >
                {/* Outlined badge with glowing halo */}
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center border shrink-0 relative ${item.accent.badge}`}
                >
                  <div className="absolute -inset-2 rounded-full border border-white/5 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
                  <item.Icon className="w-9 h-9" />
                </motion.div>

                {/* Content block */}
                <div className={`flex-1 space-y-2 text-center sm:text-left ${!isEven && 'sm:text-right'}`}>
                  <div className={`flex items-center justify-between gap-2 border-b border-white/5 pb-2 ${!isEven && 'sm:flex-row-reverse'}`}>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-sans">
                      {item.category}
                    </span>
                    <span className="text-xs font-serif italic text-rose-350">
                      Chapter {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h4 className="font-heading font-black text-lg md:text-xl text-white tracking-wide leading-tight">
                    {item.label}
                  </h4>
                  
                  <p className="text-base md:text-lg font-semibold text-rose-100 leading-snug">
                    {item.value}
                  </p>

                  {item.tagline && (
                    <p className="text-xs md:text-sm text-slate-350 italic font-serif leading-relaxed pt-2">
                      "{item.tagline}"
                    </p>
                  )}
                </div>

                {/* Shimmer light sweep bar */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine pointer-events-none" />
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
