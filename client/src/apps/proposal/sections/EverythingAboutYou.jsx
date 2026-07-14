import React from 'react';
import { motion } from 'framer-motion';
import { useProposal } from '../hooks/useProposal';
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

  const bentoItems = [
    { key: 'proposalHobbies', icon: '🎨', label: 'Hobbies', color: 'rose' },
    { key: 'proposalFavFood', icon: '🍕', label: 'Fav Food', color: 'amber' },
    { key: 'proposalFavSongs', icon: '🎵', label: 'Fav Songs', color: 'rose' },
    { key: 'proposalFavPlace', icon: '📍', label: 'Fav Place', color: 'amber' },
    { key: 'proposalFavCafe', icon: '☕', label: 'Fav Cafe', color: 'rose' },
    { key: 'proposalFavMovie', icon: '🎬', label: 'Fav Movie', color: 'amber' },
    { key: 'proposalFavFlower', icon: '🌸', label: 'Fav Flower', color: 'rose', fullWidth: true }
  ].filter(item => !!config[item.key]);

  return (
    <SectionWrapper maxWidth="max-w-4xl" className="space-y-6 md:space-y-8 select-none">
      <AnimatedTitle
        subtitle="Everything That Makes You... You"
        title="The Little Things I Cherish"
      />

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 w-full">
        {bentoItems.map((item, idx) => {
          const isFull = item.fullWidth && bentoItems.length % 3 !== 0;
          return (
            <GlassCard
              key={idx}
              glowColor={item.color}
              className={`flex flex-col items-center justify-center p-6 text-center space-y-3 transition-transform duration-300 border-white/5 hover:border-rose-500/20 ${
                isFull ? 'sm:col-span-2 md:col-span-1' : ''
              }`}
            >
              <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] animate-pulse">{item.icon}</span>
              <h4 className="text-[10px] font-black text-rose-300 uppercase tracking-widest leading-none">{item.label}</h4>
              <p className="text-xs text-slate-200 leading-relaxed font-light">{config[item.key]}</p>
            </GlassCard>
          );
        })}
      </div>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
