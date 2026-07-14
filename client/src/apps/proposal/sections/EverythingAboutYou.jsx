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

  // Build active favorites list based on configuration driving (dynamic mapping)
  const items = FAVORITES_CONFIG.map((fav) => {
    const value = config[fav.key];
    if (!value) return null;

    const IconComponent = Icons[fav.iconName] || Icons.Heart;

    const colorClasses = {
      purple: { border: 'hover:border-purple-500/30', glow: 'purple', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      orange: { border: 'hover:border-orange-500/30', glow: 'orange', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
      blue: { border: 'hover:border-blue-500/30', glow: 'blue', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      emerald: { border: 'hover:border-emerald-500/30', glow: 'emerald', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      cyan: { border: 'hover:border-cyan-500/30', glow: 'cyan', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
      yellow: { border: 'hover:border-amber-500/30', glow: 'amber', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      pink: { border: 'hover:border-pink-500/30', glow: 'pink', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
      violet: { border: 'hover:border-violet-500/30', glow: 'violet', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' }
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
    <SectionWrapper maxWidth="max-w-2xl" className="space-y-8 select-none relative py-12">
      {/* Ambient glowing vignette behind list */}
      <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 via-transparent to-transparent pointer-events-none z-0" />
      
      <AnimatedTitle
        subtitle="The Little Things I Cherish"
        title="Discovering You, Page by Page"
      />

      {/* Sequential Alternating Slide-In Favorite Cards List */}
      <div className="flex flex-col space-y-5 w-full z-10 relative">
        {items.map((item, idx) => {
          // Alternating animations: Right for even index, Left for odd index
          const isEven = idx % 2 === 0;
          const slideDirection = isEven ? 120 : -120;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: slideDirection }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ 
                type: "spring", 
                stiffness: 90, 
                damping: 14, 
                mass: 0.8,
                delay: idx * 0.15 
              }}
              className="w-full"
            >
              <GlassCard
                glowColor={item.accent.glow}
                variant="bento"
                className={`w-full flex items-center gap-5 p-5 md:p-6 transition-all duration-300 border-white/5 ${item.accent.border}`}
              >
                {/* Outlined Icon badge on the left */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border shrink-0 ${item.accent.badge} shadow-[0_0_15px_rgba(255,255,255,0.03)]`}>
                  <item.Icon className="w-6 h-6 animate-pulse" style={{ animationDuration: '3s' }} />
                </div>

                {/* Content on the right */}
                <div className="flex-1 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-rose-350 font-serif italic">
                      Chapter {idx + 1}
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-sm md:text-base text-white tracking-wide">
                    {item.label}
                  </h4>
                  <p className="text-sm font-semibold text-rose-100/90 leading-tight">
                    {item.value}
                  </p>
                  {item.tagline && (
                    <p className="text-xs text-slate-350 italic font-serif leading-snug border-t border-white/5 pt-1.5 mt-1.5">
                      "{item.tagline}"
                    </p>
                  )}
                </div>

                {/* Decorative horizontal accent details */}
                <div className="absolute right-4 bottom-4 w-1.5 h-1.5 rounded-full bg-white/10" />
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
