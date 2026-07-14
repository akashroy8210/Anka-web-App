import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star as StarIcon, X, Calendar, Sparkles, MessageCircle } from 'lucide-react';
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
  const realStarsList = config.proposalTimeline && config.proposalTimeline.length > 0 
    ? config.proposalTimeline 
    : (config.proposalSkyMemories || []);

  const realCount = realStarsList.length;
  const totalStarsCount = 30; // Fill canopy constellation with 30 stars

  // Generate randomized non-overlapping positions across the entire canvas canopy
  const distributedStars = useMemo(() => {
    const stars = [];
    const minDistance = 9; // Minimum percentage distance between star nodes

    const isOverlapping = (x, y) => {
      return stars.some(star => {
        const dx = star.x - x;
        const dy = star.y - y;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });
    };

    // 1. Generate coordinates for real memories
    realStarsList.forEach((item, idx) => {
      let x, y, attempts = 0;
      do {
        x = 12 + Math.random() * 76;
        y = 12 + Math.random() * 76;
        attempts++;
      } while (isOverlapping(x, y) && attempts < 100);

      stars.push({
        ...item,
        id: idx,
        isReal: true,
        x,
        y,
        size: 16 + (idx % 3) * 4
      });
    });

    // 2. Generate coordinates for fake decorative stars
    const fakeCount = Math.max(0, totalStarsCount - realCount);
    for (let i = 0; i < fakeCount; i++) {
      let x, y, attempts = 0;
      do {
        x = 10 + Math.random() * 80;
        y = 10 + Math.random() * 80;
        attempts++;
      } while (isOverlapping(x, y) && attempts < 100);

      stars.push({
        title: `Decorative Star #${i + 1}`,
        description: '',
        isReal: false,
        id: realCount + i,
        x,
        y,
        size: 7 + (i % 3) * 2 // smaller sizes
      });
    }

    return stars;
  }, [realStarsList, realCount]);

  const handleStarClick = (item, idx, e) => {
    if (!item.isReal) return; // Decorative stars cannot be clicked

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
          spread: 55,
          origin: { x, y },
          colors: ["#FFE7B3", "#F8C8DC", "#FFD89C", "#FFFFFF"],
          ticks: 50,
          gravity: 0.8,
          scalar: 0.95
        });
      });
    } catch (err) {
      console.warn("Confetti blocked.", err);
    }
  };

  const realStarsOnly = distributedStars.filter(s => s.isReal);

  return (
    <SectionWrapper maxWidth="max-w-4xl" className="space-y-6 select-none w-full relative py-12">
      
      {/* Interactive Sky pill and Title Block */}
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

      {/* Fresh Immersive Star Sky Box Canopy */}
      <motion.div
        animate={activeStar ? { scale: 1.025 } : { scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative z-10 px-2 sm:px-4"
      >
        <GlassCard
          glowColor="amber"
          hoverEffect={false}
          className="relative w-full aspect-[4/3] md:aspect-[16/10] min-h-[400px] md:min-h-[520px] border-white/5 rounded-[40px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.7)] p-0 bg-slate-950/80"
        >
          {/* Depth of field background camera blur when active memory details are open */}
          <div 
            className="relative w-full h-full transition-all duration-700 ease-in-out"
            style={{ filter: activeStar ? "blur(5px) brightness(0.55)" : "blur(0px) brightness(1)" }}
          >
            {/* Ambient deep space nebula glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.14)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(244,63,94,0.1)_0%,transparent_60%)] pointer-events-none" />

            {/* Twinkling star field canvas */}
            <StarField />

            {/* Glowing Constellation Connecting Lines (only for real stars) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="constGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(253, 224, 71, 0.15)" />
                  <stop offset="50%" stopColor="rgba(244, 63, 94, 0.25)" />
                  <stop offset="100%" stopColor="rgba(168, 85, 247, 0.15)" />
                </linearGradient>
              </defs>
              {realStarsOnly.map((star, idx) => {
                if (idx === realStarsOnly.length - 1 && realStarsOnly.length > 2) {
                  const firstStar = realStarsOnly[0];
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
                      transition={{ duration: 2.2, ease: "easeOut", delay: idx * 0.1 }}
                    />
                  );
                }
                if (idx === realStarsOnly.length - 1) return null;
                const nextStar = realStarsOnly[idx + 1];
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

            {/* Scattered Star Nodes */}
            {distributedStars.map((star, idx) => {
              const isClicked = clickedStars.has(star.id);
              const isActive = activeStar?.title === star.title;

              return (
                <motion.button
                  key={idx}
                  onClick={(e) => handleStarClick(star, star.id, e)}
                  disabled={!star.isReal}
                  animate={{
                    scale: isActive ? [1, 1.45, 1.3] : isClicked ? 1.05 : [1, 1.15, 1],
                    opacity: isActive ? 1 : activeStar ? 0.25 : star.isReal ? [0.85, 1, 0.85] : [0.3, 0.65, 0.3]
                  }}
                  transition={{
                    scale: isActive ? { duration: 0.3 } : { duration: 3.5 + (idx % 2), repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 2.5 + (idx % 3), repeat: Infinity, ease: "easeInOut" }
                  }}
                  className={`absolute p-3 z-10 ${star.isReal ? 'cursor-pointer group' : 'cursor-default pointer-events-none'}`}
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  <StarIcon
                    className={`transition-all duration-300 ${
                      isActive 
                        ? 'fill-yellow-350 text-yellow-350 filter drop-shadow-[0_0_12px_rgba(253,224,71,1)] scale-110' 
                        : isClicked
                          ? 'fill-rose-350 text-rose-350 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                          : star.isReal
                            ? 'fill-yellow-100/60 text-yellow-250 filter drop-shadow-[0_0_6px_rgba(253,224,71,0.65)] group-hover:scale-125'
                            : 'fill-slate-500/15 text-slate-500/20' // Decorative stars are dim, slate and small
                    }`}
                    style={{ width: `${star.size}px`, height: `${star.size}px` }}
                  />
                  {isActive && star.isReal && (
                    <span className="absolute inset-0 border border-yellow-300 rounded-full animate-ping opacity-60" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Stars Found Counter UI inside the box - Excluded from the blur wrapper */}
          <div className="absolute bottom-6 left-8 text-xs text-slate-400 font-sans tracking-wide z-20">
            Stars Found: <span className="font-semibold text-rose-455">{clickedStars.size}</span> / {realCount}
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
