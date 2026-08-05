import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sparkles, Clock, Lock, Heart } from 'lucide-react';

// Helper to format current time in IST (India Standard Time UTC+5:30)
function getISTFormattedTime() {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utcMs + (330 * 60000));

  return istDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Synthesizer for 3-second alarm tick using Web Audio API
function playAlarmBeep(pitch = 880) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn('Audio tick play safely handled', e);
  }
}

/* ── Floating Sparkles & Rose Petals ── */
function FloatingLuxuryParticles({ activeTheme }) {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${Math.random() * 6 + 6}s`,
      delay: `${Math.random() * 4}s`,
      opacity: Math.random() * 0.6 + 0.2,
      isPetal: i % 3 === 0,
    }));
  }, []);

  const isDark = activeTheme === 'dark';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.isPetal
              ? 'rounded-tl-full rounded-br-full bg-gradient-to-br from-pink-400 to-rose-300'
              : (isDark ? 'rounded-full bg-gradient-to-t from-amber-300 to-yellow-100' : 'rounded-full bg-gradient-to-t from-pink-300 to-rose-200')
            }`}
          style={{
            width: p.isPetal ? `${p.size * 1.5}px` : `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            boxShadow: p.isPetal
              ? '0 0 10px rgba(244, 63, 94, 0.4)'
              : (isDark ? '0 0 15px rgba(255, 215, 0, 0.6)' : '0 0 15px rgba(236, 72, 153, 0.6)'),
            animation: `float-slow ${p.duration} ease-in-out infinite alternate`,
            animationDelay: p.delay,
            transform: p.isPetal ? 'rotate(45deg)' : 'none'
          }}
        />
      ))}
    </div>
  );
}

export default function LockedEntry({
  currentTime,
  timeLeft,
  recipientName = 'My Love',
  activeTheme = 'pink', // Default light pink / soft rose
  onCompleteUnlock
}) {
  const [istTimeString, setIstTimeString] = useState(getISTFormattedTime());
  const [sealCracked, setSealCracked] = useState(false);
  const [showBirthdayCard, setShowBirthdayCard] = useState(false);
  const [lightFloodActive, setLightFloodActive] = useState(false);
  const lastSecondRef = useRef(null);

  // Calculate total seconds remaining
  const totalSeconds = (timeLeft.days || 0) * 86400 + (timeLeft.hours || 0) * 3600 + (timeLeft.minutes || 0) * 60 + (timeLeft.seconds || 0);

  // Live IST Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setIstTimeString(getISTFormattedTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3-Second Alarm Tick & Midnight Transition Sequence
  useEffect(() => {
    if (totalSeconds > 0 && totalSeconds <= 3) {
      if (lastSecondRef.current !== totalSeconds) {
        lastSecondRef.current = totalSeconds;
        const pitch = 880 + (3 - totalSeconds) * 200;
        playAlarmBeep(pitch);
      }
    }

    if (totalSeconds <= 0 && !sealCracked) {
      setSealCracked(true);
      setLightFloodActive(true);
      playAlarmBeep(1400);

      setTimeout(() => {
        setShowBirthdayCard(true);
      }, 1200);
    }
  }, [totalSeconds, sealCracked]);

  // Dynamic Theme Colors
  const isDark = activeTheme === 'dark';
  const isPastel = activeTheme === 'pastel';

  // Theme Background & Accent Tokens
  const radialGlow = isDark
    ? 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.25) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 80%)'
    : (isPastel
      ? 'radial-gradient(circle at 50% 50%, rgba(244, 114, 182, 0.25) 0%, rgba(251, 207, 232, 0.15) 50%, transparent 80%)'
      : 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.3) 0%, rgba(251, 113, 133, 0.15) 50%, transparent 80%)');

  return (
    <div className={`fixed inset-0 z-50 bday-wrapper bday-theme-${activeTheme} flex flex-col justify-between p-4 sm:p-8 select-none overflow-y-auto font-sans relative`}>

      {/* Light Flood Screen Overlay on Unlock */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-1000 bg-gradient-to-t ${isDark ? 'from-amber-400/40 via-yellow-200/20 to-amber-500/50' : 'from-pink-400/40 via-rose-200/30 to-pink-500/50'
          } backdrop-blur-sm ${lightFloodActive && !showBirthdayCard ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {/* Radial Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none z-0 opacity-60 blur-[130px]"
        style={{ background: radialGlow }}
      />

      {/* Floating Particles */}
      <FloatingLuxuryParticles activeTheme={activeTheme} />

      {/* MIDNIGHT BIRTHDAY WISH CARD OVERLAY */}
      {showBirthdayCard ? (
        <div className="relative z-30 max-w-xl mx-auto w-full text-center space-y-6 my-auto py-8 animate-slide-up px-4">
          <div className="p-8 sm:p-12 rounded-[40px] bday-card shadow-2xl space-y-6 relative overflow-hidden border border-rose-300/40">

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <Sparkles className="w-10 h-10 fill-current" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest bday-text-accent block">
                ✨ Midnight Birthday Celebration ✨
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold bday-text-title leading-tight">
                Happy Birthday, {recipientName}! 🎉🎂
              </h2>
              <p className="text-sm sm:text-base bday-text-sub font-light leading-relaxed max-w-md mx-auto pt-2">
                The waiting is finally over. Your special day has begun, and a magical interactive world created just for you is now unlocked...
              </p>
            </div>

            <button
              onClick={() => {
                if (onCompleteUnlock) onCompleteUnlock();
              }}
              className="w-full py-4 rounded-2xl bday-btn font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              ✨ Step Into Your Surprise World ✨
            </button>
          </div>
        </div>
      ) : (

        /* HERO SECTION: CENTERING LUXURY GIFT VAULT */
        <div className="relative z-10 max-w-2xl mx-auto w-full text-center space-y-6 sm:space-y-8 my-auto py-6 flex flex-col items-center">

          {/* 3D LUXURY GIFT VAULT CONTAINER */}
          <div className="relative inline-block group">

            {/* Breathing Ambient Glow Ring */}
            <div
              className={`absolute -inset-4 rounded-[48px] ${isDark ? 'bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-600/30' : 'bg-gradient-to-r from-pink-500/30 via-rose-400/30 to-pink-600/30'
                } blur-2xl animate-pulse`}
              style={{ animationDuration: '4s' }}
            />

            {/* 3D Vault Frame */}
            <div
              className={`w-32 h-32 sm:w-44 sm:h-44 rounded-[40px] bday-card border-2 ${isDark ? 'border-amber-400/40' : 'border-pink-300/50'
                } shadow-2xl flex flex-col items-center justify-center relative transition-all duration-700 ${sealCracked ? 'scale-110 shadow-rose-400/50' : 'hover:scale-105'
                }`}
            >
              {/* Internal Warm Light Glow Effect */}
              <div className="absolute inset-2 rounded-[32px] bg-pink-400/10 blur-md pointer-events-none" />

              {/* Embossed Lock Icon */}
              <div className="relative z-10 flex flex-col items-center space-y-1">
                <div className="p-3 rounded-2xl bday-card border bday-border-accent shadow-inner">
                  <Lock className="w-8 h-8 sm:w-12 sm:h-12 bday-text-accent stroke-[2] filter drop-shadow-md" />
                </div>
              </div>

              {/* WAX SEAL WITH EMBOSSED HEART */}
              <div
                className={`absolute -bottom-3 -right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 border-2 border-white/80 shadow-lg flex items-center justify-center transition-transform duration-500 ${sealCracked ? 'scale-125 rotate-45' : 'hover:scale-110'
                  }`}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white filter drop-shadow-sm" />
              </div>
            </div>
          </div>

          {/* MAIN HEADLINE */}
          <div className="space-y-3 max-w-xl px-4">
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="bday-text-title filter drop-shadow-sm">
                Happy Birthday In Advance, {recipientName || 'My Love'}.
              </span>
            </h1>

            <div className="space-y-1.5 text-xs sm:text-sm md:text-base bday-text-sub font-light leading-relaxed max-w-lg mx-auto pt-1">
              <p>I spent time creating something that exists only for you.</p>
              <p>It will unlock the moment your special day begins.</p>
              <p className="font-serif italic bday-text-accent pt-1">Until then... stay with me.</p>
            </div>
          </div>

          {/* CENTERED COUNTDOWN CLOCK */}
          <div className="w-full max-w-md mx-auto pt-2">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Mins' },
                { value: timeLeft.seconds, label: 'Secs' }
              ].map((item, i) => (
                <div
                  key={i}
                  className={`relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bday-card border border-rose-300/30 shadow-xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${totalSeconds <= 3 ? 'border-rose-400 shadow-rose-400/40 animate-pulse' : ''
                    }`}
                >
                  {/* Subtle Glow Underneath Card */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-12 rounded-full bg-pink-400/20 blur-xl" />

                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-black bday-text-title leading-none mb-1.5 filter drop-shadow-sm transition-all">
                    {String(item.value || 0).padStart(2, '0')}
                  </span>

                  <span className="text-[9px] sm:text-[10px] bday-text-accent font-bold uppercase tracking-widest block">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* COUNTDOWN SUBTITLE & STATUS */}
          <div className="space-y-2.5 pt-2">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bday-card border border-rose-300/40 shadow-md">
              <p className="text-xs bday-text-sub font-light tracking-wide italic">
                "Every passing second brings you closer to your surprise."
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Bottom Footer */}
      <div className="relative z-10 w-full text-center pb-2">
        <p className="text-[10px] bday-text-sub opacity-60 font-light tracking-widest uppercase">
          AnKa Surprises • Exclusively Crafted Luxury Experience
        </p>
      </div>
    </div>
  );
}
