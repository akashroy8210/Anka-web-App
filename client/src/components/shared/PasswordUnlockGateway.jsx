import React, { useState } from 'react';
import { Heart, Lock, Unlock, Sparkles, Key, HelpCircle, Delete, ShieldCheck, Flower2 } from 'lucide-react';

/**
 * Luxury Seamless Hero Password Unlock Gateway
 * Designed as ONE connected hero section (Apple / Dior / Chanel campaign standard).
 * Supports Dark Luxury, Baby Pink/Lavender/Brown, and Soft Pink Themes.
 */
export default function PasswordUnlockGateway({
  onSuccess = () => {},
  correctPassword = '',
  passwordHint = '',
  unlockHeading = 'Unlock Your Private Surprise',
  unlockSubtitle = 'This experience was created only for you.',
  wrongPasswordMessage = 'I think your partner remembers a different secret ❤️',
  successMessage = 'Access Granted! Unlocking your magical experience...',
  backgroundImage = '',
  senderName = 'Someone Special',
  recipientName = 'My Love',
  activeTheme = 'dark', // 'dark' | 'pink' | 'pastel'
  enableNumericKeypad = true,
  musicUrl = ''
}) {
  const [inputVal, setInputVal] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlockingAnimation, setIsUnlockingAnimation] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);

  // Clean strings
  const cleanCorrect = String(correctPassword || '').trim().toLowerCase();
  const targetLength = Math.max(cleanCorrect.length || 4, 4);

  // Synthesize Web Audio API sound effects
  const playKeyPressSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  };

  const playUnlockChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
      });
    } catch (e) {}
  };

  const handleKeyPress = (char) => {
    playKeyPressSound();
    setPressedKey(char);
    setTimeout(() => setPressedKey(null), 150);

    setShowError(false);
    if (inputVal.length < 12) {
      const newNext = inputVal + char;
      setInputVal(newNext);

      // Auto submit if numeric PIN matches length
      if (cleanCorrect && newNext.trim().toLowerCase() === cleanCorrect) {
        triggerSuccessUnlock();
      }
    }
  };

  const handleDelete = () => {
    playKeyPressSound();
    setShowError(false);
    setInputVal(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    playKeyPressSound();
    setShowError(false);
    setInputVal('');
  };

  const triggerSuccessUnlock = () => {
    playUnlockChime();
    setIsUnlockingAnimation(true);
    setTimeout(() => {
      setIsUnlocked(true);
      onSuccess();
    }, 1800);
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const entered = inputVal.trim().toLowerCase();

    if (!cleanCorrect || entered === cleanCorrect) {
      triggerSuccessUnlock();
    } else {
      setIsShaking(true);
      setShowError(true);
      setTimeout(() => setIsShaking(false), 650);
    }
  };

  // Theme styling configurations for ONE seamless connected hero
  const getThemeStyles = () => {
    const t = String(activeTheme || 'dark').toLowerCase();
    
    if (t.includes('pastel') || t.includes('baby')) {
      // Baby Pink + Brown + Lavender Theme
      return {
        outerBg: 'bg-gradient-to-br from-[#FFF5F8] via-[#FFEAF3] to-[#EAE0ED]',
        containerBorder: 'border-pink-300/50 shadow-[0_30px_70px_rgba(244,111,165,0.18)]',
        panelBg: 'bg-white/75 backdrop-blur-2xl text-slate-800',
        imageBlendOverlay: 'from-pink-900/60 via-pink-950/20 to-transparent',
        textColor: 'text-slate-800',
        subTextColor: 'text-slate-600',
        accentGlow: 'from-pink-400 to-rose-400',
        buttonBg: 'bg-white/90 border-pink-200 text-slate-800 hover:bg-pink-500 hover:text-white hover:border-pink-500 shadow-sm',
        heartColor: 'text-pink-500 fill-pink-400/20',
        badgeBg: 'bg-pink-100/90 border-pink-300 text-pink-700',
        petalColor: 'text-pink-300/40'
      };
    }
    
    if (t.includes('pink') || t.includes('magenta')) {
      // Soft Pink / Hot Pink Romantic Theme
      return {
        outerBg: 'bg-gradient-to-br from-[#1c0a14] via-[#2d0f22] to-[#12050c]',
        containerBorder: 'border-rose-500/30 shadow-[0_30px_70px_rgba(244,114,182,0.25)]',
        panelBg: 'bg-[#1c0b16]/80 backdrop-blur-2xl text-rose-100',
        imageBlendOverlay: 'from-[#1c0b16] via-[#1c0b16]/40 to-transparent',
        textColor: 'text-rose-100',
        subTextColor: 'text-pink-300/80',
        accentGlow: 'from-rose-500 to-pink-500',
        buttonBg: 'bg-rose-900/30 border-rose-500/30 text-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-sm',
        heartColor: 'text-rose-400 fill-rose-500/30',
        badgeBg: 'bg-rose-500/20 border-rose-400/30 text-rose-300',
        petalColor: 'text-rose-400/30'
      };
    }

    // Default Luxury Dark Theme
    return {
      outerBg: 'bg-gradient-to-br from-[#06080d] via-[#0f1320] to-[#07090f]',
      containerBorder: 'border-amber-500/25 shadow-[0_30px_70px_rgba(0,0,0,0.8)]',
      panelBg: 'bg-[#0d101b]/85 backdrop-blur-2xl text-amber-100',
      imageBlendOverlay: 'from-[#0d101b] via-[#0d101b]/40 to-transparent',
      textColor: 'text-amber-100',
      subTextColor: 'text-amber-200/70',
      accentGlow: 'from-amber-400 to-rose-500',
      buttonBg: 'bg-slate-900/80 border-amber-500/25 text-amber-200 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-sm',
      heartColor: 'text-amber-400 fill-amber-500/30',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      petalColor: 'text-amber-400/20'
    };
  };

  const theme = getThemeStyles();
  const heroImage = backgroundImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800";

  if (isUnlocked) return null;

  return (
    <div className={`fixed inset-0 z-50 w-full h-full min-h-screen ${theme.outerBg} overflow-y-auto transition-all duration-700 select-none flex flex-col justify-center`}>
      
      {/* Decorative Atmospheric Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Glowing Ambient Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Floating Line-Art Flower & Heart Silhouettes */}
        <div className="absolute top-1/6 right-1/12 animate-float" style={{ animationDuration: '8s' }}>
          <Flower2 className={`w-16 h-16 ${theme.petalColor}`} />
        </div>
        <div className="absolute bottom-1/6 left-1/12 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }}>
          <Heart className={`w-12 h-12 ${theme.petalColor}`} />
        </div>
      </div>

      {/* 100% FULL WIDTH CONNECTED HERO SECTION */}
      <div className={`w-full h-full min-h-screen grid grid-cols-1 lg:grid-cols-12 relative z-10 ${isShaking ? 'animate-shake' : ''}`}>

        {/* LEFT SIDE (60% Desktop): 100% Full Height & Width Hero Image */}
        <div className="lg:col-span-7 relative w-full h-full min-h-[380px] lg:min-h-screen overflow-hidden group">
          {/* Hero Image with Slow Zoom */}
          <img
            src={heroImage}
            alt="Surprise Cover"
            className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 filter brightness-95"
          />

          {/* Desktop Right Seamless Gradient Fade Blend */}
          <div className={`absolute inset-y-0 right-0 w-2/3 hidden lg:block bg-gradient-to-l ${theme.imageBlendOverlay}`} />
          {/* Mobile Bottom Seamless Gradient Fade Blend */}
          <div className={`absolute inset-x-0 bottom-0 h-2/3 lg:hidden bg-gradient-to-t ${theme.imageBlendOverlay}`} />

          {/* Top Badge */}
          <div className="absolute top-8 left-8 z-10">
            <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest border backdrop-blur-md shadow-lg ${theme.badgeBg}`}>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Private Surprise</span>
            </span>
          </div>

          {/* Bottom Left Quote Overlay */}
          <div className="absolute bottom-10 left-8 right-8 lg:right-24 z-10 text-left space-y-1.5">
            <p className="text-sm sm:text-base font-serif italic text-white/95 leading-relaxed drop-shadow-lg">
              "Every beautiful story deserves a beautiful beginning."
            </p>
            <span className="text-xs font-bold text-pink-300 uppercase tracking-widest block drop-shadow-md">
              Created for {recipientName}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE (40% Desktop): 100% Full Height Seamless Password Panel */}
        <div className={`lg:col-span-5 w-full h-full min-h-screen p-6 sm:p-12 lg:p-16 ${theme.panelBg} flex flex-col justify-center text-center space-y-6 relative`}>
          
          {/* Success Golden Light Overlay */}
          {isUnlockingAnimation && (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300/40 via-pink-400/40 to-amber-300/40 backdrop-blur-md flex flex-col items-center justify-center space-y-3 z-30 animate-fade-in">
              <Unlock className="w-16 h-16 text-amber-300 animate-bounce" />
              <h3 className="font-heading font-extrabold text-2xl text-white drop-shadow-md px-4">
                {successMessage}
              </h3>
              <div className="w-12 h-1 bg-amber-300 rounded-full animate-pulse" />
            </div>
          )}

          {/* Animated Top Icon: 3D Golden Heart Lock */}
          <div className="relative inline-flex items-center justify-center mx-auto">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500/20 to-rose-500/20 flex items-center justify-center border border-white/20 shadow-inner">
              <Lock className={`w-7 h-7 ${theme.heartColor} animate-pulse`} />
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-2">
            <h2 className={`font-serif font-extrabold text-2xl sm:text-3xl tracking-wide ${theme.textColor}`}>
              {unlockHeading}
            </h2>
            <p className={`text-xs sm:text-sm font-light leading-relaxed max-w-xs mx-auto ${theme.subTextColor}`}>
              {unlockSubtitle}
            </p>
          </div>

          {/* PIN Indicator Display */}
          <div className="flex justify-center items-center space-x-3 py-1">
            {Array.from({ length: targetLength }).map((_, idx) => {
              const filled = idx < inputVal.length;
              return (
                <div
                  key={idx}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                    filled
                      ? 'bg-rose-500/20 border-rose-400/80 shadow-[0_0_15px_rgba(244,114,182,0.4)] scale-105'
                      : 'bg-white/5 border-white/15'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                      filled
                        ? 'text-rose-400 fill-rose-500 scale-110 animate-pulse'
                        : 'text-white/20'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Error & Hint Alerts */}
          {showError && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-shake flex items-center justify-center space-x-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
              <span>{wrongPasswordMessage}</span>
            </div>
          )}

          {/* Romantic Glass Hint Badge */}
          {passwordHint && (
            <div className="flex justify-center py-1">
              {showHint ? (
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md text-amber-200 text-xs font-serif shadow-lg animate-fade-in max-w-xs">
                  <span className="shrink-0">💡</span>
                  <span className="truncate"><strong>Hint:</strong> {passwordHint}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md text-rose-200/80 hover:text-rose-200 text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Need a hint?</span>
                </button>
              )}
            </div>
          )}

          {/* SIGNATURE 3D HEART NUMERIC KEYPAD */}
          {enableNumericKeypad ? (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-3 gap-y-3 gap-x-2 max-w-xs mx-auto justify-items-center">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(num)}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-85 group focus:outline-none"
                  >
                    <svg
                      viewBox="0 0 100 90"
                      className={`absolute inset-0 w-full h-full filter transition-all duration-200 ${
                        pressedKey === num
                          ? 'fill-rose-500 stroke-rose-300 scale-105 drop-shadow-[0_0_15px_rgba(244,114,182,0.9)]'
                          : 'fill-white/10 stroke-white/30 group-hover:fill-rose-500/30 group-hover:stroke-rose-400 group-hover:drop-shadow-[0_0_10px_rgba(244,114,182,0.4)]'
                      }`}
                      style={{ strokeWidth: 2.5 }}
                    >
                      <path d="M 50 85 C 50 85 10 55 10 30 C 10 15 22 5 35 5 C 43 5 48 10 50 15 C 52 10 57 5 65 5 C 78 5 90 15 90 30 C 90 55 50 85 50 85 Z" />
                    </svg>
                    <span className="relative z-10 font-serif font-extrabold text-base sm:text-lg text-white drop-shadow-md">
                      {num}
                    </span>
                  </button>
                ))}
                
                {/* Bottom Controls Row in Heart Shapes */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-85 group focus:outline-none"
                  title="Clear all"
                >
                  <svg
                    viewBox="0 0 100 90"
                    className="absolute inset-0 w-full h-full fill-white/5 stroke-white/20 group-hover:fill-white/15 transition-all"
                    style={{ strokeWidth: 2 }}
                  >
                    <path d="M 50 85 C 50 85 10 55 10 30 C 10 15 22 5 35 5 C 43 5 48 10 50 15 C 52 10 57 5 65 5 C 78 5 90 15 90 30 C 90 55 50 85 50 85 Z" />
                  </svg>
                  <span className="relative z-10 font-sans text-[10px] font-extrabold uppercase tracking-wider text-white/70">
                    Clear
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-85 group focus:outline-none"
                >
                  <svg
                    viewBox="0 0 100 90"
                    className={`absolute inset-0 w-full h-full filter transition-all duration-200 ${
                      pressedKey === '0'
                        ? 'fill-rose-500 stroke-rose-300 scale-105 drop-shadow-[0_0_15px_rgba(244,114,182,0.9)]'
                        : 'fill-white/10 stroke-white/30 group-hover:fill-rose-500/30 group-hover:stroke-rose-400 group-hover:drop-shadow-[0_0_10px_rgba(244,114,182,0.4)]'
                    }`}
                    style={{ strokeWidth: 2.5 }}
                  >
                    <path d="M 50 85 C 50 85 10 55 10 30 C 10 15 22 5 35 5 C 43 5 48 10 50 15 C 52 10 57 5 65 5 C 78 5 90 15 90 30 C 90 55 50 85 50 85 Z" />
                  </svg>
                  <span className="relative z-10 font-serif font-extrabold text-base sm:text-lg text-white drop-shadow-md">
                    0
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-85 group focus:outline-none"
                  title="Delete digit"
                >
                  <svg
                    viewBox="0 0 100 90"
                    className="absolute inset-0 w-full h-full fill-white/5 stroke-white/20 group-hover:fill-rose-500/20 group-hover:stroke-rose-400 transition-all"
                    style={{ strokeWidth: 2 }}
                  >
                    <path d="M 50 85 C 50 85 10 55 10 30 C 10 15 22 5 35 5 C 43 5 48 10 50 15 C 52 10 57 5 65 5 C 78 5 90 15 90 30 C 90 55 50 85 50 85 Z" />
                  </svg>
                  <Delete className="relative z-10 w-4 h-4 text-rose-300" />
                </button>
              </div>

              {/* Primary Unlock Action Button */}
              <button
                type="button"
                onClick={handleVerify}
                className="w-full max-w-xs py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/30 transition-all transform active:scale-98 flex items-center justify-center space-x-2 cursor-pointer mx-auto"
              >
                <Key className="w-4 h-4" />
                <span>Unlock Surprise</span>
              </button>
            </div>
          ) : (
            /* Text Input Mode for Text Passwords */
            <form onSubmit={handleVerify} className="space-y-4 pt-1 max-w-xs mx-auto w-full">
              <input
                type="password"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter secret passcode..."
                className="w-full px-4 py-3.5 text-center text-sm border border-white/20 bg-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Unlock Surprise</span>
              </button>
            </form>
          )}

          <div className="text-[10px] text-white/30 tracking-widest uppercase font-mono pt-1">
            ✨ Protected with AnKa Private Security
          </div>
        </div>
      </div>
    </div>
  );
}
