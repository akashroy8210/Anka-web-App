import React, { useState, useEffect } from 'react';

/* ── Balloon component with burst on click ── */
function Balloon({ emoji, style, onBurst }) {
  const [burst, setBurst] = useState(false);
  const handle = () => {
    if (burst) return;
    setBurst(true);
    onBurst?.();
    setTimeout(() => setBurst(false), 600);
  };
  return (
    <div
      onClick={handle}
      className={`absolute cursor-pointer text-4xl select-none transition-all duration-300
        ${burst ? 'animate-balloon-burst pointer-events-none' : 'animate-rise-balloon'}
      `}
      style={style}
    >
      {emoji}
    </div>
  );
}

/* ── Same cake SVG (lit or blown) ── */
export function CakeSVG({ isBlown, size = 'w-56 h-56' }) {
  return (
    <svg viewBox="0 0 300 300" className={`${size} drop-shadow-[0_15px_35px_rgba(225,29,72,0.25)] select-none`}>
      <defs>
        <linearGradient id="cs-stand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" /><stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="cs-bot" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e11d48" /><stop offset="60%" stopColor="#be123c" /><stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
        <linearGradient id="cs-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe4e6" /><stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>
        <linearGradient id="cs-drip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#881337" /><stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
        <radialGradient id="cs-flame" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" /><stop offset="40%" stopColor="#facc15" />
          <stop offset="85%" stopColor="#ea580c" /><stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Stand */}
      <ellipse cx="150" cy="245" rx="125" ry="18" fill="url(#cs-stand)" stroke="#94a3b8" strokeWidth="2" />
      <path d="M 85,245 L 95,270 L 205,270 L 215,245 Z" fill="#94a3b8" />
      <ellipse cx="150" cy="270" rx="60" ry="8" fill="#64748b" />

      {/* Bottom tier */}
      <path d="M 60,165 A 90,16 0 0 0 240,165 L 240,230 A 90,16 0 0 1 60,230 Z" fill="url(#cs-bot)" />
      <ellipse cx="150" cy="165" rx="90" ry="16" fill="#be123c" />
      {/* cream base blobs */}
      {[65,90,120,150,180,210,235].map((cx, i) => (
        <ellipse key={i} cx={cx} cy={i % 2 === 0 ? 228 : 235} rx={i % 2 === 0 ? 8 : 9} ry={i % 2 === 0 ? 5 : 6} fill="#fff" opacity="0.9" />
      ))}
      <path d="M 60,165 Q 70,185 80,165 Q 90,175 100,165 Q 115,190 130,165 Q 145,178 160,165 Q 175,192 190,165 Q 205,175 220,165 Q 230,185 240,165 A 90,16 0 0 1 60,165 Z" fill="url(#cs-drip)" />

      {/* Top tier */}
      <path d="M 85,115 A 65,12 0 0 0 215,115 L 215,165 A 65,12 0 0 1 85,165 Z" fill="url(#cs-top)" />
      <ellipse cx="150" cy="115" rx="65" ry="12" fill="#ffe4e6" />
      <path d="M 85,115 Q 95,130 105,115 Q 120,140 135,115 Q 150,128 165,115 Q 180,138 195,115 Q 205,128 215,115 A 65,12 0 0 1 85,115 Z" fill="#db2777" opacity="0.85" />
      {/* toppings */}
      <circle cx="115" cy="113" r="7" fill="#e11d48" />
      <circle cx="150" cy="118" r="8" fill="#e11d48" />
      <circle cx="185" cy="113" r="7" fill="#e11d48" />
      {[100,132,168,200].map((cx, i) => <circle key={i} cx={cx} cy="115" r="5" fill="#fff" opacity="0.95" />)}

      {/* Candle 1 */}
      <rect x="117" y="65" width="6" height="35" rx="1" fill="#c084fc" />
      <line x1="120" y1="65" x2="120" y2="58" stroke="#334155" strokeWidth="1.5" />
      {!isBlown ? (
        <g className="animate-candle-flicker">
          <circle cx="120" cy="50" r="9" fill="url(#cs-flame)" />
          <path d="M 120,40 Q 123,49 120,55 Q 117,49 120,40 Z" fill="#fbbf24" />
        </g>
      ) : <path d="M 120,55 Q 118,50 122,46 T 120,42" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.5" />}

      {/* Candle 2 */}
      <rect x="147" y="68" width="6" height="38" rx="1" fill="#f472b6" />
      <line x1="150" y1="68" x2="150" y2="61" stroke="#334155" strokeWidth="1.5" />
      {!isBlown ? (
        <g className="animate-candle-flicker" style={{ animationDelay: '0.15s' }}>
          <circle cx="150" cy="53" r="10" fill="url(#cs-flame)" />
          <path d="M 150,42 Q 153,52 150,58 Q 147,52 150,42 Z" fill="#fbbf24" />
        </g>
      ) : <path d="M 150,58 Q 148,53 152,49 T 150,45" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.5" />}

      {/* Candle 3 */}
      <rect x="177" y="65" width="6" height="35" rx="1" fill="#fb7185" />
      <line x1="180" y1="65" x2="180" y2="58" stroke="#334155" strokeWidth="1.5" />
      {!isBlown ? (
        <g className="animate-candle-flicker" style={{ animationDelay: '0.3s' }}>
          <circle cx="180" cy="50" r="9" fill="url(#cs-flame)" />
          <path d="M 180,40 Q 183,49 180,55 Q 177,49 180,40 Z" fill="#fbbf24" />
        </g>
      ) : <path d="M 180,55 Q 178,50 182,46 T 180,42" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.5" />}
    </svg>
  );
}

/* ── Sliced cake using clipPath ── */
export function SlicedHalf({ side }) {
  return (
    <svg viewBox="0 0 300 300" className="w-32 h-32 drop-shadow-[0_8px_20px_rgba(225,29,72,0.3)] select-none">
      <defs>
        <linearGradient id={`sh-stand-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" /><stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id={`sh-bot-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e11d48" /><stop offset="60%" stopColor="#be123c" /><stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
        <linearGradient id={`sh-top-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe4e6" /><stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>
        <clipPath id={`half-${side}`}>
          {side === 'left'
            ? <rect x="0" y="0" width="152" height="300" />
            : <rect x="148" y="0" width="152" height="300" />}
        </clipPath>
      </defs>
      <g clipPath={`url(#half-${side})`}>
        <ellipse cx="150" cy="245" rx="125" ry="18" fill={`url(#sh-stand-${side})`} stroke="#94a3b8" strokeWidth="2" />
        <path d="M 85,245 L 95,270 L 205,270 L 215,245 Z" fill="#94a3b8" />
        <ellipse cx="150" cy="270" rx="60" ry="8" fill="#64748b" />
        <path d="M 60,165 A 90,16 0 0 0 240,165 L 240,230 A 90,16 0 0 1 60,230 Z" fill={`url(#sh-bot-${side})`} />
        <ellipse cx="150" cy="165" rx="90" ry="16" fill="#be123c" />
        <path d="M 60,165 Q 70,185 80,165 Q 90,175 100,165 Q 115,190 130,165 Q 145,178 160,165 Q 175,192 190,165 Q 205,175 220,165 Q 230,185 240,165 A 90,16 0 0 1 60,165 Z" fill="#881337" />
        <path d="M 85,115 A 65,12 0 0 0 215,115 L 215,165 A 65,12 0 0 1 85,165 Z" fill={`url(#sh-top-${side})`} />
        <ellipse cx="150" cy="115" rx="65" ry="12" fill="#ffe4e6" />
        <path d="M 85,115 Q 95,130 105,115 Q 120,140 135,115 Q 150,128 165,115 Q 180,138 195,115 Q 205,128 215,115 A 65,12 0 0 1 85,115 Z" fill="#db2777" opacity="0.85" />
        <circle cx="115" cy="113" r="6" fill="#e11d48" />
        <circle cx="150" cy="118" r="7" fill="#e11d48" />
        <circle cx="185" cy="113" r="6" fill="#e11d48" />
        {/* blown candles */}
        <rect x="117" y="65" width="6" height="35" rx="1" fill="#c084fc" />
        <rect x="147" y="68" width="6" height="38" rx="1" fill="#f472b6" />
        <rect x="177" y="65" width="6" height="35" rx="1" fill="#fb7185" />
        {/* cut line highlight */}
        <rect x="148" y="60" width="4" height="215" fill="white" opacity="0.25" />
      </g>
    </svg>
  );
}

/* ── Balloons data ── */
const BALLOON_EMOJIS = ['🎈', '🎈', '💗', '🎀', '🎈', '💖', '🎈', '💕', '🎈', '🎀'];

export default function BirthdayCake({
  config,
  candlesBlown,
  handleBlowCandles,
  guestCheers,
  showOpenSurpriseButton,
  handleCutCake,
  journeyStep
}) {
  const [balloonStates, setBalloonStates] = useState(
    BALLOON_EMOJIS.map((e, i) => ({
      id: i, emoji: e,
      left: 5 + i * 10,
      duration: 9 + i * 1.3,
      delay: i * 0.8,
      burst: false,
    }))
  );

  const burstBalloon = (id) => {
    setBalloonStates(prev => prev.map(b => b.id === id ? { ...b, burst: true } : b));
    setTimeout(() => {
      setBalloonStates(prev => prev.map(b => b.id === id ? { ...b, burst: false } : b));
    }, 700);
  };

  /* ──────────────────────────────────────────────────────
     SECTION 1: Candles lit — blow prompt
  ────────────────────────────────────────────────────── */
  if (journeyStep === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Subtle ambient stars */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-white/10 animate-shimmer"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${6 + Math.random() * 8}px`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >★</div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-10 animate-slide-up">
          {/* Badge */}
          <div className="flex flex-col items-center space-y-1">
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[10px] font-black uppercase tracking-widest">
              🎂 Happy Birthday, {config.recipientName}!
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2 max-w-lg">
            <h1 className="font-romantic text-6xl sm:text-7xl text-white leading-tight" style={{ textShadow: '0 0 40px rgba(225,29,72,0.4)' }}>
              Make a Wish
            </h1>
            <p className="text-sm text-rose-200/50 max-w-xs mx-auto leading-relaxed">
              Close your eyes, make a beautiful secret wish, and blow the candles out!
            </p>
          </div>

          {/* Cake */}
          <div className="relative">
            <CakeSVG isBlown={false} size="w-64 h-64" />
          </div>

          {/* Blow button */}
          <button
            onClick={handleBlowCandles}
            className="group relative px-10 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(225,29,72,0.6)] hover:scale-105 active:scale-95 cursor-pointer border border-rose-500/30"
          >
            <span className="relative z-10">💨 Blow the Candles</span>
          </button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────
     SECTION 2: Candles blown — celebration + cut cake
  ────────────────────────────────────────────────────── */
  if (journeyStep === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">

        {/* Balloons removed per request */}

        {/* Guest cheer toasts */}
        {guestCheers.map((cheer) => (
          <div
            key={cheer.id}
            className="fixed bg-white/8 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl animate-slide-up z-30 text-left min-w-[150px] max-w-[200px]"
            style={{ left: `${cheer.left}%`, bottom: `${cheer.bottom}%` }}
          >
            <span className="text-[9px] font-black text-pink-400 uppercase tracking-wider block">{cheer.guestName}</span>
            <p className="text-xs text-rose-100 leading-tight mt-0.5">{cheer.message}</p>
          </div>
        ))}

        <div className="relative z-10 flex flex-col items-center space-y-10 animate-slide-up">
          <div className="space-y-1">
            <span className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-[10px] font-black uppercase tracking-widest">
              🎉 Celebration Time!
            </span>
          </div>

          <div className="space-y-2 max-w-lg">
            <h1 className="font-romantic text-4xl sm:text-5xl text-white leading-tight" style={{ textShadow: '0 0 40px rgba(225,29,72,0.4)' }}>
              Happy Birthday, {config.recipientName}!
            </h1>
            <p className="text-sm text-rose-200/50 max-w-xs mx-auto leading-relaxed">
              Pop the balloons! Now let's cut the cake together 🔪
            </p>
          </div>

          {/* Blown cake */}
          <CakeSVG isBlown={true} size="w-60 h-60" />

          {/* Cut cake — only appears after cheers finish */}
          {showOpenSurpriseButton && (
            <button
              onClick={handleCutCake}
              className="px-10 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_50px_rgba(225,29,72,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-rose-500/30 animate-slide-up"
            >
              🔪 Cut the Cake
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
