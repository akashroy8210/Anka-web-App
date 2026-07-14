import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Calendar, Image as ImageIcon } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import AnimatedTitle from '../../../components/shared/AnimatedTitle';
import GlassCard from '../../../components/shared/GlassCard';
import MediaViewer from '../../../components/shared/MediaViewer';
import StarField from '../proposalOnly/StarField';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function MemorySkySection() {
  const { config, nextStage, getNextStageId, activeStar, setActiveStar } = useProposal();

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  // Combine both arrays or prioritize timeline memories because they contain uploaded photos and dates
  const starsList = config.proposalTimeline && config.proposalTimeline.length > 0 
    ? config.proposalTimeline 
    : (config.proposalSkyMemories || []);

  // Responsive dynamic grid star placement helper to avoid overlapping
  const count = starsList.length;
  const cols = Math.ceil(Math.sqrt(count || 1));
  const rows = Math.ceil(count / (cols || 1));

  const starsWithCoords = starsList.map((item, idx) => {
    const colIdx = idx % cols;
    const rowIdx = Math.floor(idx / cols);

    // Dynamic centered coordinates between 15% and 85% to avoid borders
    const x = 15 + ((colIdx + 0.5) / cols) * 70 + (idx % 2 === 0 ? 3 : -3);
    const y = 15 + ((rowIdx + 0.5) / rows) * 70 + (idx % 2 === 0 ? -3 : 3);

    return {
      ...item,
      id: idx,
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
      size: 14 + (idx % 3) * 4
    };
  });

  const handleStarClick = (item, idx, e) => {
    setActiveStar(item);

    // Sparkle particles burst using canvas-confetti
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      import('canvas-confetti').then((confettiMod) => {
        const confetti = confettiMod.default || confettiMod;
        confetti({
          particleCount: 25,
          angle: 90,
          spread: 60,
          origin: { x, y },
          colors: ["#FFE7B3", "#F8C8DC", "#FFD89C", "#FFFFFF"],
          ticks: 55,
          gravity: 0.85,
          scalar: 0.9
        });
      });
    } catch (err) {
      console.warn("Confetti block bypass.", err);
    }
  };

  return (
    <SectionWrapper maxWidth="max-w-3xl" className="space-y-6 select-none w-full relative">
      <AnimatedTitle
        subtitle="Memory Sky"
        title="Written in the Stars"
      />

      {/* Dark Luxury Sky Canvas - Zooming camera scale on active memory */}
      <motion.div
        animate={activeStar ? { scale: 1.015, filter: "brightness(0.9)" } : { scale: 1, filter: "brightness(1)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative"
      >
        <GlassCard
          glowColor="amber"
          hoverEffect={false}
          className="relative w-full h-[55vh] md:h-[60vh] border-amber-300/10 rounded-[32px] overflow-hidden shadow-2xl p-0 flex items-center justify-center bg-slate-950/90"
        >
          {/* Nebula gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(244,63,94,0.1)_0%,transparent_60%)] pointer-events-none" />

          {/* Twinkling star specs */}
          <StarField />

          {/* Glowing Constellation Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="constLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(253, 224, 71, 0.2)" />
                <stop offset="50%" stopColor="rgba(244, 63, 94, 0.3)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.2)" />
              </linearGradient>
            </defs>
            {starsWithCoords.map((star, idx) => {
              if (idx === starsWithCoords.length - 1 && starsWithCoords.length > 2) {
                // Loop back to the first star to form a complete constellation shape
                const firstStar = starsWithCoords[0];
                return (
                  <motion.line
                    key={`loop-${idx}`}
                    x1={`${star.x}%`}
                    y1={`${star.y}%`}
                    x2={`${firstStar.x}%`}
                    y2={`${firstStar.y}%`}
                    stroke="url(#constLine)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut", delay: idx * 0.1 }}
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
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeOut", delay: idx * 0.12 }}
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
                  scale: isActive ? [1, 1.45, 1.3] : [1, 1.12, 1],
                  opacity: isActive ? 1 : activeStar ? 0.35 : [0.75, 1, 0.75],
                  y: [0, -3, 0]
                }}
                transition={{
                  scale: isActive ? { duration: 0.3 } : { duration: 3.5 + (idx % 2), repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 3 + (idx % 3), repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 4 + (idx % 2), repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute cursor-pointer p-3.5 z-10 group"
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

      {/* High-fidelity responsive GlassCard popup modal for memory details */}
      <AnimatePresence>
        {activeStar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveStar(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              className="w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard
                glowColor="amber"
                variant="popup"
                className="relative overflow-hidden text-center space-y-4 shadow-2xl p-6 md:p-8"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveStar(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer z-20 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                {/* Uploaded Memory Photo */}
                {activeStar.image || activeStar.photo ? (
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-slate-950/50">
                    <MediaViewer 
                      src={activeStar.image || activeStar.photo} 
                      alt={activeStar.title} 
                      aspectRatio="aspect-[4/3]"
                      allowLightbox={true}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-amber-300/10 text-amber-300 rounded-full flex items-center justify-center mx-auto border border-amber-300/20">
                    <Star className="w-6 h-6 fill-amber-300" />
                  </div>
                )}

                {/* Date & Details */}
                <div className="space-y-2">
                  {activeStar.date && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-300/10 text-amber-300 border border-amber-300/20 uppercase tracking-widest mx-auto">
                      <Calendar className="w-3 h-3" />
                      <span>{activeStar.date}</span>
                    </div>
                  )}
                  <h4 className="font-heading font-black text-xl text-rose-100">{activeStar.title}</h4>
                </div>

                <p className="text-xs text-slate-350 leading-relaxed font-light font-sans max-h-32 overflow-y-auto pr-1">
                  {activeStar.description}
                </p>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <JourneyNavigation onNext={handleNext} />
    </SectionWrapper>
  );
}
