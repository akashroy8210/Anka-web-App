import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import { FAVORITES_CONFIG } from '../constants/defaults';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function EverythingAboutYou() {
  const { config, nextStage, getNextStageId } = useProposal();
  const [activeIdx, setActiveIdx] = useState(0);

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
      purple: { border: 'hover:border-purple-500/40', glow: 'purple', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' },
      orange: { border: 'hover:border-orange-500/40', glow: 'orange', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]' },
      blue: { border: 'hover:border-blue-500/40', glow: 'blue', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' },
      emerald: { border: 'hover:border-emerald-500/40', glow: 'emerald', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' },
      cyan: { border: 'hover:border-cyan-500/40', glow: 'cyan', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' },
      yellow: { border: 'hover:border-amber-500/40', glow: 'amber', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
      pink: { border: 'hover:border-pink-500/40', glow: 'pink', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]' },
      violet: { border: 'hover:border-violet-500/40', glow: 'violet', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]' }
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
    <SectionWrapper maxWidth="max-w-4xl" className="space-y-16 select-none relative py-20">
      {/* Ambient background night sky glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/10 via-slate-900/5 to-transparent pointer-events-none z-0" />
      
      <AnimatedTitle
        subtitle="Every Little Thing I Fell In Love With"
        title="The Story Hidden In Your Little Things"
      />

      {/* Main Relationship Timeline Container */}
      <div className="relative w-full z-10 py-8 min-h-[400px]">
        
        {/* Centered vertical glowing timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-rose-500/20 via-amber-500/60 to-purple-500/20 transform -translate-x-1/2 z-0 hidden sm:block" />

        {/* Dynamic scroll-linked glowing line overlay */}
        <motion.div 
          className="absolute left-1/2 top-0 w-[2px] bg-gradient-to-b from-amber-400 via-rose-500 to-purple-500 transform -translate-x-1/2 z-10 shadow-[0_0_8px_rgba(245,158,11,0.5)] origin-top hidden sm:block"
          style={{ 
            height: `${Math.max(10, Math.min(100, ((activeIdx + 1) / items.length) * 100))}%`
          }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        />

        <div className="space-y-16 sm:space-y-24 w-full">
          {items.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const isActive = idx === activeIdx;

            return (
              <motion.div
                key={idx}
                onViewportEnter={() => setActiveIdx(idx)}
                viewport={{ amount: 0.6 }}
                className={`relative w-full flex flex-col sm:flex-row items-center justify-between ${
                  isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'
                }`}
              >
                {/* Visual Connector Line & Center Timeline Node (Desktop/Tablet only) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden sm:block">
                  <motion.div 
                    animate={isActive ? { scale: 1.25, rotate: 18, stroke: '#f59e0b' } : { scale: 1, rotate: 0, stroke: 'rgba(255,255,255,0.2)' }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`w-6 h-6 rounded-full border bg-slate-950 flex items-center justify-center transition-shadow duration-300 ${
                      isActive 
                        ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)] text-amber-400' 
                        : 'border-white/20 text-slate-500'
                    }`}
                  >
                    <Icons.Heart className={`w-3 h-3 ${isActive ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                  </motion.div>
                </div>

                {/* Alternating storytelling layout: Card side vs Empty placeholder side */}
                <div className="w-full sm:w-[45%] z-10 px-2 sm:px-0">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 80 : -80, y: 15, filter: "blur(5px)" }}
                    whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 80, 
                      damping: 14, 
                      mass: 0.85 
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0.55
                    }}
                    className="w-full"
                  >
                    {/* Active spotlight radial gradient behind the card */}
                    {isActive && (
                      <div className="absolute -inset-10 rounded-[48px] bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.06)_0%,transparent_70%)] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />
                    )}

                    <motion.div
                      whileHover={{ y: -4, rotate: isEven ? 1 : -1 }}
                      transition={{ type: "spring", stiffness: 120, damping: 12 }}
                      className={`relative w-full rounded-2xl p-6 md:p-8 bg-slate-950/65 border border-white/5 shadow-2xl transition-all duration-300 flex items-start gap-5 ${
                        isActive ? 'border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.04)]' : ''
                      }`}
                    >
                      {/* Premium category icon badge */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${item.accent.badge}`}>
                        <item.Icon className="w-5 h-5" />
                      </div>

                      {/* Content block */}
                      <div className="flex-1 text-left space-y-1.5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-1">
                          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-sans">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-serif italic text-rose-350">
                            Chapter {idx + 1}
                          </span>
                        </div>
                        
                        <h4 className="font-heading font-black text-sm md:text-base text-white tracking-wide">
                          {item.label}
                        </h4>
                        
                        <p className="text-base font-semibold text-rose-100/90 leading-tight">
                          {item.value}
                        </p>

                        {item.tagline && (
                          <p className="text-xs text-slate-350 italic font-serif leading-relaxed pt-1.5 border-t border-white/5 mt-2">
                            "{item.tagline}"
                          </p>
                        )}
                      </div>

                      {/* Accent light sweep shimmer */}
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 opacity-30 pointer-events-none hover:animate-shine" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Empty side spacer for desktop layout */}
                <div className="hidden sm:block w-[45%]" />
              </motion.div>
            );
          })}
        </div>
      </div>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
