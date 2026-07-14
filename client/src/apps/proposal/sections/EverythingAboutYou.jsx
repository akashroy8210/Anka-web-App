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

  // Build active bento list based on configuration driving (dynamic mapping)
  const items = FAVORITES_CONFIG.map((fav) => {
    const value = config[fav.key];
    if (!value) return null;

    // Resolve Lucide Outlined Icon dynamically
    const IconComponent = Icons[fav.iconName] || Icons.Heart;

    // Set custom accents styling
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
      accent,
      fullWidth: fav.fullWidth
    };
  }).filter(Boolean);

  return (
    <SectionWrapper maxWidth="max-w-4xl" className="space-y-6 md:space-y-8 select-none relative">
      {/* Decorative ambient lighting behind Bento */}
      <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 via-transparent to-transparent pointer-events-none z-0" />
      
      <AnimatedTitle
        subtitle="Everything That Makes You... You"
        title="The Little Things I Cherish"
      />

      {/* Responsive Bento Grid - 2 columns on mobile where possible */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 w-full z-10 relative">
        {items.map((item, idx) => {
          const isFullWidth = item.fullWidth && items.length % 3 !== 0;
          return (
            <GlassCard
              key={idx}
              glowColor={item.accent.glow}
              variant="bento"
              className={`flex flex-col items-center justify-between text-center min-h-[160px] md:min-h-[180px] transition-all duration-300 ${
                item.accent.border
              } ${isFullWidth ? 'col-span-2 md:col-span-1' : ''}`}
            >
              {/* Glowing circular icon container */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${item.accent.badge} shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                <item.Icon className="w-5 h-5" />
              </div>

              {/* Title & Category Details */}
              <div className="space-y-1 my-2">
                <span className="text-[8px] uppercase tracking-widest text-slate-450 font-bold block">
                  {item.category}
                </span>
                <h4 className="font-heading font-black text-xs md:text-sm text-white">
                  {item.label}
                </h4>
                <p className="text-xs font-light text-rose-200">
                  {item.value}
                </p>
              </div>

              {/* Emotional tagline */}
              {item.tagline && (
                <p className="text-[9px] text-slate-450 italic font-serif leading-snug border-t border-white/5 pt-1.5 w-full">
                  "{item.tagline}"
                </p>
              )}
            </GlassCard>
          );
        })}
      </div>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
