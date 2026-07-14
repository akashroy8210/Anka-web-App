import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageCircle } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import { getHeartCoordinates } from '../services/proposalHelpers';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import StarField from '../proposalOnly/StarField';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function MemorySkySection() {
  const { config, nextStage, getNextStageId, activeStar, setActiveStar } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  const starsList = config.proposalSkyMemories || [];

  const handleStarClick = (item, idx, e) => {
    setActiveStar(item);

    // Sparkle particles burst using lazy-loaded canvas-confetti
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      import('canvas-confetti').then((confettiMod) => {
        const confetti = confettiMod.default || confettiMod;
        confetti({
          particleCount: 25,
          angle: 90,
          spread: 55,
          origin: { x, y },
          colors: ["#FFE7B3", "#F8C8DC", "#FFD89C", "#FFFFFF"],
          ticks: 50,
          gravity: 0.8,
          scalar: 0.95
        });
      });
    } catch (err) {
      console.warn("Confetti trigger blocked.", err);
    }
  };

  // Map star nodes trace outline of heart shape constellation dynamically
  const starsWithCoords = starsList.map((item, idx) => {
    const coords = getHeartCoordinates(idx, starsList.length);
    return {
      ...item,
      id: idx,
      x: coords.x,
      y: coords.y,
      size: 14 + (idx % 3) * 4
    };
  });

  return (
    <SectionWrapper maxWidth="max-w-3xl" className="space-y-6 select-none w-full relative">
      <AnimatedTitle
        subtitle="Memory Sky"
        title="Written in the Stars"
      />

      {/* Dark Luxury Sky Canvas - Zooming camera scale on active memory */}
      <motion.div
        animate={activeStar ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative"
      >
        <GlassCard
          glowColor="amber"
          hoverEffect={false}
          className="relative w-full h-[60vh] md:h-[65vh] border-amber-300/10 rounded-[32px] overflow-hidden shadow-2xl p-0 flex items-center justify-center bg-slate-950/90"
        >
          {/* Nebula dust overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(244,63,94,0.1)_0%,transparent_60%)] pointer-events-none" />

          {/* Twinkling backgrounds */}
          <StarField />

          {/* Glowing Constellation Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="constLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(253, 224, 71, 0.25)" />
                <stop offset="50%" stopColor="rgba(244, 63, 94, 0.35)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.25)" />
              </linearGradient>
            </defs>
            {starsWithCoords.map((star, idx) => {
              if (idx === starsWithCoords.length - 1 && starsWithCoords.length > 2) {
                // Connect back to the first star to complete the heart loop!
                const firstStar = starsWithCoords[0];
                return (
                  <motion.line
                    key={`loop-${idx}`}
                    x1={`${star.x}%`}
                    y1={`${star.y}%`}
                    x2={`${firstStar.x}%`}
                    y2={`${firstStar.y}%`}
                    stroke="url(#constLine)"
                    strokeWidth="1.6"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.2, ease: "easeOut", delay: idx * 0.1 }}
                  />
                );
              }
              if (idx === starsWithCoords.length - 1) return null;
              const nextStar = starsWithCoords[idx + 1];
              return (
                <motion.line
                  key={idx}
                  x1={`${star.x}%`}
                  y1={`${star.y}%`}
                  x2={`${nextStar.x}%`}
                  y2={`${nextStar.y}%`}
                  stroke="url(#constLine)"
                  strokeWidth="1.6"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeOut", delay: idx * 0.15 }}
                />
              );
            })}
          </svg>

          {/* Interactive Memory Star Nodes */}
          {starsWithCoords.map((star, idx) => {
            const isActive = activeStar?.title === star.title;

            return (
              <motion.button
                key={idx}
                onClick={(e) => handleStarClick(star, idx, e)}
                animate={{
                  scale: isActive ? [1, 1.4, 1.25] : [1, 1.15, 1],
                  opacity: isActive ? 1 : [0.7, 1, 0.7],
                  y: [0, -3, 0]
                }}
                transition={{
                  scale: isActive ? { duration: 0.3 } : { duration: 3 + (idx % 2), repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 3 + (idx % 3), repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 4 + (idx % 2), repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute cursor-pointer p-3 z-10 group"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <Star
                  className={`fill-amber-300/40 text-amber-300 transition-all duration-300 group-hover:scale-125 ${
                    isActive ? 'fill-yellow-300 text-yellow-300 filter drop-shadow-[0_0_12px_rgba(253,224,71,1)]' : 'filter drop-shadow-[0_0_6px_rgba(253,224,71,0.65)]'
                  }`}
                  style={{ width: `${star.size}px`, height: `${star.size}px` }}
                />
                
                {/* Active halo ping ring */}
                {isActive && (
                  <span className="absolute inset-0 border border-yellow-300 rounded-full animate-ping opacity-60" />
                )}
              </motion.button>
            );
          })}
        </GlassCard>
      </motion.div>

      <AnimatePresence>
        {activeStar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveStar(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-amber-300/20 rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveStar(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 bg-amber-300/15 text-amber-300 rounded-full flex items-center justify-center mx-auto border border-amber-300/20">
                <MessageCircle className="w-6 h-6 fill-amber-300" />
              </div>
              
              <h4 className="font-heading font-black text-lg text-rose-100">{activeStar.title}</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-light">{activeStar.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
