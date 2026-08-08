import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useCutenessMeter } from '../hooks/useCutenessMeter';
import ReusableUploader from '../../../components/shared/ReusableUploader';

// Audio asset import
import glassBreakSound from '../Assets/mixkit-glass-break-with-hammer-thud-759.wav';

export default function CutenessMeter({ config, isPremium = false, onNext }) {
  const { percent, isOverload, isBroken, showPopup, isMeasuring, startAutomaticMeter, statusText } = useCutenessMeter();

  const [uploadedImage, setUploadedImage] = useState(() => {
    return sessionStorage.getItem('apology_cuteness_temp_img') || '';
  });

  const activeImage = uploadedImage || config?.cutePhotoUrl || config?.cutenessPhoto || '';
  const audioRef = useRef(null);
  const audioPlayedRef = useRef(false);

  // Initialize Glass Shatter Sound
  useEffect(() => {
    audioRef.current = new Audio(glassBreakSound);
    audioRef.current.volume = 0.85;
  }, []);

  // Trigger Glass Break Sound when shattered state hits (>100% / isBroken)
  useEffect(() => {
    if ((isBroken || percent > 100) && !audioPlayedRef.current) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => console.warn('Audio playback prevented:', err));
      }
      audioPlayedRef.current = true;
    } else if (percent <= 100) {
      audioPlayedRef.current = false;
    }
  }, [isBroken, percent]);

  // Purge temporary cuteness image on page reload / refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('apology_cuteness_temp_img');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      sessionStorage.removeItem('apology_cuteness_temp_img');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleUploadDone = (url) => {
    setUploadedImage(url);
    try {
      sessionStorage.setItem('apology_cuteness_temp_img', url);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    setTimeout(() => {
      startAutomaticMeter();
    }, 400);
  };

  // Framer Motion Animated Counter Physics
  const springPercent = useSpring(0, { stiffness: 45, damping: 15 });
  const displayPercent = useTransform(springPercent, (latest) => Math.round(latest));

  useEffect(() => {
    springPercent.set(percent);
  }, [percent, springPercent]);

  // Dynamic Bar Gradient (Adapts to Active Theme)
  const getMeterColor = (val) => {
    if (val <= 100) return 'var(--ap-btn-gradient, linear-gradient(90deg, #ec4899 0%, #d946ef 50%, #e11d48 100%))';
    if (val < 200) return 'linear-gradient(90deg, var(--ap-primary-accent, #e11d48) 0%, #f59e0b 50%, #f43f5e 100%)';
    return 'linear-gradient(90deg, #ef4444 0%, #b91c1c 50%, #7f1d1d 100%)';
  };

  // Glass Shatter Particles & Sparkles
  const particles = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => {
      const angle = (i / 36) * 360 + (Math.random() * 30 - 15);
      const distance = 250 + Math.random() * 400;
      return {
        id: i,
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance,
        rotation: (Math.random() - 0.5) * 1080,
        scale: 0.4 + Math.random() * 0.9,
        size: 20 + Math.random() * 40,
        isSparkle: i % 3 === 0,
      };
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-6 sm:px-12 md:px-20 select-none text-center">
      
      {/* 1. DYNAMIC AMBIENT BACKDROP LIGHT */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none blur-3xl opacity-30"
        animate={{
          scale: percent > 100 ? [1, 1.25, 1.1] : [1, 1.08, 1],
          opacity: percent > 100 ? 0.7 : 0.35,
        }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          width: '700px',
          height: '700px',
          background: percent > 100
            ? 'radial-gradient(circle, var(--ap-primary-accent, rgba(244,63,94,0.8)) 0%, rgba(239,68,68,0.5) 50%, rgba(0,0,0,0) 80%)'
            : 'radial-gradient(circle, var(--ap-primary-accent, rgba(236,72,153,0.6)) 0%, var(--ap-soft-rose, rgba(219,39,119,0.3)) 60%, rgba(0,0,0,0) 80%)',
        }}
      />

      {/* 2. OVERLOAD SHOCKWAVE & PARTICLE EXPLOSION (PERCENT > 100 OR ISBROKEN) */}
      <AnimatePresence>
        {(percent > 100 || isBroken) && (
          <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Shockwave Radial Wave */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute w-96 h-96 rounded-full border-4 border-rose-400 bg-rose-500/20 shadow-[0_0_80px_rgba(244,63,94,0.8)]"
            />

            {/* Exploding Glass Shards & Neon Sparkles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: p.scale,
                  opacity: 0,
                  rotate: p.rotation,
                }}
                transition={{ duration: 1.1, ease: [0.1, 0.8, 0.3, 1] }}
                className="absolute flex items-center justify-center pointer-events-none"
              >
                {p.isSparkle ? (
                  <span className="text-pink-300 drop-shadow-[0_0_12px_rgba(244,63,94,1)]" style={{ fontSize: `${p.size}px` }}>
                    ✨
                  </span>
                ) : (
                  <div
                    className="bg-gradient-to-br from-white/90 via-pink-200/50 to-rose-500/30 backdrop-blur-md border border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size * 1.4}px`,
                      clipPath: 'polygon(50% 0%, 100% 100%, 0% 70%)',
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTAINER */}
      <div className="max-w-3xl w-full z-10 space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-wide" style={{ color: 'var(--ap-text-primary)' }}>
            How Cute Are You? 💖
          </h2>
          <p className="text-sm sm:text-base font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
            Upload your picture to measure your exact cuteness level:
          </p>
        </div>

        {/* 4. METER CARD FRAME (WITH SHAKE, ROTATION & GLASSMORPHISM) */}
        <motion.div
          animate={
            percent > 100 || isBroken
              ? {
                  rotate: [0, -3, 4, -2, 5],
                  y: [0, 6, 12],
                  x: [-3, 3, -4, 4, 0],
                }
              : percent >= 90
              ? { x: [-2, 2, -2, 2, 0] }
              : {}
          }
          transition={
            percent > 100 || isBroken
              ? { duration: 0.4, ease: 'bounce' }
              : { duration: 0.15, repeat: Infinity }
          }
          className="relative max-w-xl mx-auto p-6 sm:p-10 rounded-3xl backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-8 overflow-hidden transition-all duration-300"
          style={{
            background: 'var(--ap-card-bg, rgba(255,255,255,0.1))',
            border: '1.5px solid var(--ap-card-border, rgba(255,255,255,0.2))'
          }}
        >
          {/* INNER SHADOW & GLOW */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_30px_rgba(255,255,255,0.2)]" />

          {/* SVG GLASS CRACK OVERLAY (>100% OR ISBROKEN) */}
          {(percent > 100 || isBroken) && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" viewBox="0 0 500 400">
              <motion.path
                d="M 250 200 L 180 120 L 120 140 L 40 80 M 180 120 L 210 40 M 250 200 L 320 280 L 410 260 L 480 340 M 320 280 L 300 370 M 250 200 L 340 130 L 440 100 M 340 130 L 320 30 M 250 200 L 150 260 L 60 330"
                fill="none"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
              <motion.path
                d="M 180 120 L 240 110 M 320 280 L 260 300 M 340 130 L 380 180"
                fill="none"
                stroke="var(--ap-soft-rose, rgba(255, 192, 203, 0.8))"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              />
            </svg>
          )}

          <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
            
            {/* HERO PHOTO FRAME */}
            <motion.div
              animate={percent === 100 ? { scale: [1, 1.06, 1] } : {}}
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 shadow-2xl relative flex flex-col items-center justify-center transition-all duration-500 group"
              style={{
                background: 'var(--ap-card-bg, linear-gradient(135deg, rgba(255, 235, 243, 0.9) 0%, rgba(248, 195, 211, 0.7) 100%))',
                borderColor: percent >= 200 ? '#ef4444' : percent >= 100 ? '#f59e0b' : 'var(--ap-primary-accent, #ec4899)',
                boxShadow: percent > 100
                  ? `0 0 ${Math.min((percent - 100) / 2, 60)}px ${percent >= 200 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)'}`
                  : 'var(--ap-glow, 0 20px 40px -10px rgba(236, 72, 153, 0.35))',
              }}
            >
              {activeImage ? (
                <div className="relative w-full h-full">
                  <img src={activeImage} alt="Cutest Picture" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage('');
                      sessionStorage.removeItem('apology_cuteness_temp_img');
                    }}
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold transition-colors shadow-lg cursor-pointer z-20"
                    style={{ background: 'var(--ap-btn-gradient, rgba(0,0,0,0.7))' }}
                  >
                    Change 🗑️
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center space-y-4 w-full flex flex-col items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner animate-pulse"
                    style={{
                      background: 'var(--ap-card-bg, rgba(244,63,94,0.15))',
                      border: '1px solid var(--ap-card-border, rgba(244,63,94,0.3))'
                    }}
                  >
                    📸
                  </div>
                  <p className="text-xs sm:text-sm font-bold opacity-90" style={{ color: 'var(--ap-text-primary)' }}>
                    Upload your cutest picture here:
                  </p>
                  <div className="flex justify-center">
                    <ReusableUploader
                      accept="image/*"
                      multiple={false}
                      useAdminApi={true}
                      label="Upload Cute Photo 💖"
                      onUploadSuccess={handleUploadDone}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* METER PROGRESS TRACK & NUMERICAL DISPLAY */}
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-sm sm:text-base font-mono font-bold">
                <span className="transition-colors duration-300 font-serif" style={{ color: 'var(--ap-text-primary)' }}>
                  {statusText}
                </span>

                {/* ANIMATED COUNTER TEXT */}
                <motion.div
                  animate={
                    percent === 100
                      ? { scale: [1, 1.4, 1] }
                      : percent > 100
                      ? { scale: [1, 1.1, 1], textShadow: '0 0 12px rgba(239,68,68,0.9)' }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                  className={`text-xl sm:text-3xl font-extrabold font-mono transition-colors duration-300 ${
                    percent >= 200 ? 'text-red-500' : percent >= 100 ? 'text-amber-400' : ''
                  }`}
                  style={{ color: percent < 100 ? 'var(--ap-primary-accent, #ec4899)' : undefined }}
                >
                  <motion.span>{displayPercent}</motion.span>%
                </motion.div>
              </div>

              {/* PROGRESS BAR TRACK */}
              <div
                className={`w-full h-8 sm:h-9 rounded-full relative overflow-hidden p-1 border transition-all duration-300 bg-black/20 backdrop-blur-md ${
                  isBroken || percent > 100
                    ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)]'
                    : 'border-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]'
                }`}
              >
                {/* DYNAMIC LIQUID WAVE FILL BAR */}
                <motion.div
                  className="h-full rounded-full relative overflow-hidden transition-all duration-150"
                  style={{
                    width: `${Math.min(percent, 100)}%`,
                    background: getMeterColor(percent),
                  }}
                >
                  {/* LIQUID WAVE ANIMATION OVERLAY */}
                  <motion.div
                    className="absolute inset-0 opacity-40 mix-blend-overlay"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 20%, transparent 60%)',
                      backgroundSize: '30px 30px',
                    }}
                  />

                  {/* SHIMMER HIGHLIGHT */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                </motion.div>

                {/* OVERLOAD BANNER OVERLAY */}
                {percent > 100 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-xs sm:text-sm font-black font-mono tracking-widest text-white bg-red-600/90 px-3 py-0.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] animate-bounce">
                      ⚡ CUTENESS OVERLOAD! ⚡
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ANALYZE BUTTON */}
            {activeImage && !isMeasuring && !isBroken && (
              <button
                type="button"
                onClick={startAutomaticMeter}
                className="px-10 py-4 rounded-full text-white text-base font-bold shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-10"
                style={{ background: 'var(--ap-btn-gradient)' }}
              >
                Analyze Cuteness Level ❤️
              </button>
            )}
          </div>
        </motion.div>

        {/* 5. OVERLOAD POPUP DIALOG */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl p-6 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.7, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.7, y: 30 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="max-w-lg w-full p-8 sm:p-10 rounded-3xl text-center space-y-5 relative overflow-hidden shadow-2xl backdrop-blur-2xl"
                style={{
                  background: 'var(--ap-card-bg, rgba(28, 16, 38, 0.95))',
                  border: '1.5px solid var(--ap-card-border, rgba(244, 63, 94, 0.4))'
                }}
              >
                <div className="text-5xl animate-bounce">💖</div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold" style={{ color: 'var(--ap-text-primary)' }}>
                  Your cuteness officially broke my system!
                </h3>
                <p className="text-base font-medium opacity-90" style={{ color: 'var(--ap-text-secondary)' }}>
                  Even my scientific cuteness meter gave up and shattered. ❤️
                </p>
                <div className="pt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={onNext}
                    className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white text-base font-bold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ background: 'var(--ap-btn-gradient)' }}
                  >
                    <span>Okay, I Get It 😂</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}