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
      purple: { border: 'hover:border-purple-500/40', glow: 'purple' },
      orange: { border: 'hover:border-orange-500/40', glow: 'orange' },
      blue: { border: 'hover:border-blue-500/40', glow: 'blue' },
      emerald: { border: 'hover:border-emerald-500/40', glow: 'emerald' },
      cyan: { border: 'hover:border-cyan-500/40', glow: 'cyan' },
      yellow: { border: 'hover:border-amber-500/40', glow: 'amber' },
      pink: { border: 'hover:border-pink-500/40', glow: 'pink' },
      violet: { border: 'hover:border-violet-500/40', glow: 'violet' }
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
    <SectionWrapper maxWidth="max-w-4xl" className="space-y-16 select-none w-full relative py-20 bg-transparent">
      {/* Background is kept fully transparent so local night sky is clean and visible */}
      
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
                      className={`relative w-full rounded-3xl p-6 md:p-8 bg-slate-950/65 border border-white/5 shadow-2xl transition-all duration-300 flex items-start gap-5 ${
                        isActive ? 'border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.04)]' : ''
                      } ${item.accent.border}`}
                    >
                      {/* Content block displaying Category/Label on top and Song Name/Value in bottom */}
                      <div className={`flex-1 space-y-2 text-center sm:text-left ${!isEven && 'sm:text-right'}`}>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold font-sans block">
                          {item.label}
                        </span>
                        
                        <p className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide leading-tight">
                          {item.value}
                        </p>

                        {item.tagline && (
                          <p className="text-xs text-slate-350 italic font-serif leading-relaxed pt-2 border-t border-white/5 mt-2">
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
