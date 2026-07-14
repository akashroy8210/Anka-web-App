import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star as StarIcon, X, Sparkles, MessageCircle, Calendar } from 'lucide-react';
import { useProposal } from '../hooks/useProposal';
import SectionWrapper from '../../../components/shared/SectionWrapper';
import GlassCard from '../../../components/shared/GlassCard';
import MediaViewer from '../../../components/shared/MediaViewer';
import StarField from '../proposalOnly/StarField';
import JourneyNavigation from '../../../components/shared/JourneyNavigation';

export default function MemorySkySection() {
  const { config, nextStage, getNextStageId, activeStar, setActiveStar } = useProposal();
  const [clickedStars, setClickedStars] = useState(new Set());

  const handleNext = () => {
    const nextId = getNextStageId();
    if (nextId) nextStage(nextId);
  };

  // Prioritize timeline memories because they contain uploaded photos and dates, fallback to sky memories
  const starsList = config.proposalTimeline && config.proposalTimeline.length > 0 
    ? config.proposalTimeline 
    : (config.proposalSkyMemories || []);

  const count = starsList.length;
  const cols = Math.ceil(Math.sqrt(count || 1));
  const rows = Math.ceil(count / (cols || 1));

  const starsWithCoords = starsList.map((item, idx) => {
    const colIdx = idx % cols;
    const rowIdx = Math.floor(idx / cols);

    // Grid placement with random offset offsets to avoid overlaps, matching Virtual Date exactly
    const x = 15 + ((colIdx + 0.5) / cols) * 70 + (idx % 2 === 0 ? 4 : -4);
    const y = 15 + ((rowIdx + 0.5) / rows) * 70 + (idx % 2 === 0 ? -4 : 4);

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
    setClickedStars((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });

    // Confetti particles burst on click
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      import('canvas-confetti').then((confettiMod) => {
        const confetti = confettiMod.default || confettiMod;
        confetti({
          particleCount: 20,
          angle: 90,
          spread: 50,
          origin: { x, y },
          colors: ["#FFE7B3", "#F8C8DC", "#FFD89C", "#FFFFFF"],
          ticks: 50,
          gravity: 0.8,
          scalar: 0.9
        });
      });
    } catch (err) {
      console.warn("Confetti blocked.", err);
    }
  };

  return (
    <SectionWrapper maxWidth="max-w-3xl" className="space-y-6 select-none w-full relative py-12">
      
      {/* Title block matching screenshot exactly */}
      <div className="text-center space-y-3 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Sky</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-heading text-rose-500 tracking-wide"
        >
          Message Stars
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-350 max-w-md mx-auto text-xs md:text-sm leading-relaxed font-light"
        >
          Click the glowing stars in our night sky to reveal hidden thoughts written just for you.
        </motion.p>
      </div>

      {/* Sky Canvas Container */}
      <motion.div
        animate={activeStar ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative z-10"
      >
        <GlassCard
          glowColor="amber"
          hoverEffect={false}
          className="relative w-full h-[50vh] md:h-[55vh] border-white/5 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-0 flex items-center justify-center bg-slate-950/80"
        >
          {/* Subtle Nebulas */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(139,92,246,0.1)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(244,63,94,0.08)_0%,transparent_60%)] pointer-events-none" />

          {/* Twinkling star field */}
          <StarField />

          {/* Glowing Constellation Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="constGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(253, 224, 71, 0.15)" />
                <stop offset="50%" stopColor="rgba(244, 63, 94, 0.25)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.15)" />
              </linearGradient>
            </defs>
            {starsWithCoords.map((star, idx) => {
              if (idx === starsWithCoords.length - 1 && starsWithCoords.length > 2) {
                const firstStar = starsWithCoords[0];
                return (
                  <motion.line
                    key={`loop-${idx}`}
                    x1={`${star.x}%`}
                    y1={`${star.y}%`}
                    x2={`${firstStar.x}%`}
                    y2={`${firstStar.y}%`}
                    stroke="url(#constGrad)"
                    strokeWidth="1.2"
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
                  stroke="url(#constGrad)"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeOut", delay: idx * 0.12 }}
                />
              );
            })}
          </svg>

          {/* Twinkling Star Buttons */}
          {starsWithCoords.map((star, idx) => {
            const isClicked = clickedStars.has(star.id);
            const isActive = activeStar?.title === star.title;

            return (
              <motion.button
                key={idx}
                onClick={(e) => handleStarClick(star, idx, e)}
                animate={{
                  scale: isActive ? [1, 1.4, 1.25] : isClicked ? 1.05 : [1, 1.15, 1],
                  opacity: isActive ? 1 : activeStar ? 0.35 : [0.7, 1, 0.7]
                }}
                transition={{
                  scale: isActive ? { duration: 0.3 } : { duration: 3.5 + (idx % 2), repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 3 + (idx % 3), repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute cursor-pointer p-3 z-10 group"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <StarIcon
                  className={`transition-all duration-300 group-hover:scale-125 ${
                    isActive 
                      ? 'fill-yellow-300 text-yellow-300 filter drop-shadow-[0_0_10px_rgba(253,224,71,1)]' 
                      : isClicked
                        ? 'fill-rose-350 text-rose-350 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                        : 'fill-slate-300/40 text-slate-300 group-hover:text-yellow-200 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]'
                  }`}
                  style={{ width: `${star.size}px`, height: `${star.size}px` }}
                />
                {isActive && (
                  <span className="absolute inset-0 border border-yellow-300 rounded-full animate-ping opacity-60" />
                )}
              </motion.button>
            );
          })}

          {/* Stars Found Counter UI inside the box exactly matching screenshot */}
          <div className="absolute bottom-4 left-6 text-xs text-slate-400 font-sans tracking-wide">
            Stars Found: <span className="font-semibold text-rose-400">{clickedStars.size}</span> / {starsWithCoords.length}
          </div>
        </GlassCard>
      </motion.div>

      {/* Memory Popup Modal */}
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
                    <MessageCircle className="w-6 h-6 fill-amber-300" />
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
