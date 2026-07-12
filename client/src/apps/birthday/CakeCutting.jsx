import React from 'react';

/* ── Small triangular slice SVG ── */
function CakeSlice() {
  return (
    <svg viewBox="0 0 200 200" className="w-24 h-24 drop-shadow-[0_8px_20px_rgba(225,29,72,0.4)]">
      <defs>
        <linearGradient id="sl-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
        <linearGradient id="sl-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe4e6" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>
      </defs>
      {/* Side face */}
      <path d="M 100,18 L 18,170 L 182,170 Z" fill="url(#sl-side)" />
      {/* Top frosting */}
      <path d="M 100,18 L 18,170 L 38,156 L 100,30 L 162,156 L 182,170 Z" fill="url(#sl-top)" opacity="0.9" />
      {/* Pink drip on top */}
      <path d="M 78,30 Q 89,48 100,30 Q 111,48 122,30" stroke="#db2777" strokeWidth="3" fill="none" />
      {/* Strawberry */}
      <circle cx="100" cy="22" r="9" fill="#e11d48" />
      <circle cx="100" cy="22" r="4" fill="#fecdd3" opacity="0.5" />
      {/* Candle stub */}
      <rect x="96" y="8" width="8" height="16" rx="2" fill="#c084fc" />
      {/* Cream layers */}
      <line x1="56" y1="97" x2="144" y2="97" stroke="#fff" strokeWidth="3" opacity="0.45" />
      <line x1="40" y1="133" x2="160" y2="133" stroke="#ffe4e6" strokeWidth="2.5" opacity="0.35" />
      {/* Bottom plate */}
      <ellipse cx="100" cy="170" rx="82" ry="9" fill="#e2e8f0" opacity="0.7" />
    </svg>
  );
}

/* ── Half of the red-velvet cake using clipPath ── */
function CakeHalf({ side, shifted }) {
  const gradId = `cc-bot-${side}`;
  const topId = `cc-top-${side}`;
  const clipId = `cc-clip-${side}`;

  // Centered by default at left-1/2 and translateX(-50%). Shifts slightly on cut.
  const transformStyle = shifted
    ? `translateX(calc(-50% + ${side === 'left' ? '-10px' : '10px'})) rotate(${side === 'left' ? '-1.5' : '1.5'}deg)`
    : 'translateX(-50%) rotate(0deg)';

  return (
    <div
      className="absolute left-1/2 transition-all duration-1000 ease-out"
      style={{
        transform: transformStyle,
      }}
    >
      <svg viewBox="0 0 300 300" className="w-40 h-40 drop-shadow-[0_10px_25px_rgba(225,29,72,0.3)]">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="60%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>
          <linearGradient id={topId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="100%" stopColor="#fecdd3" />
          </linearGradient>
          <clipPath id={clipId}>
            {side === 'left'
              ? <rect x="0" y="0" width="151" height="300" />
              : <rect x="149" y="0" width="151" height="300" />
            }
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          {/* Stand */}
          <ellipse cx="150" cy="245" rx="125" ry="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 85,245 L 95,270 L 205,270 L 215,245 Z" fill="#94a3b8" />
          <ellipse cx="150" cy="270" rx="60" ry="8" fill="#64748b" />
          {/* Bottom tier */}
          <path d="M 60,165 A 90,16 0 0 0 240,165 L 240,230 A 90,16 0 0 1 60,230 Z" fill={`url(#${gradId})`} />
          <ellipse cx="150" cy="165" rx="90" ry="16" fill="#be123c" />
          {/* Drip */}
          <path d="M 60,165 Q 80,185 100,165 Q 120,190 140,165 Q 160,180 180,165 Q 200,185 220,165 Q 230,185 240,165 A 90,16 0 0 1 60,165 Z" fill="#881337" />
          {/* Top tier */}
          <path d="M 85,115 A 65,12 0 0 0 215,115 L 215,165 A 65,12 0 0 1 85,165 Z" fill={`url(#${topId})`} />
          <ellipse cx="150" cy="115" rx="65" ry="12" fill="#ffe4e6" />
          <path d="M 85,115 Q 100,135 115,115 Q 135,142 150,115 Q 165,130 180,115 Q 200,138 215,115 A 65,12 0 0 1 85,115 Z" fill="#db2777" opacity="0.85" />
          {/* Toppings */}
          <circle cx="115" cy="112" r="6" fill="#e11d48" />
          <circle cx="150" cy="117" r="7" fill="#e11d48" />
          <circle cx="185" cy="112" r="6" fill="#e11d48" />
          {/* Blown candles */}
          <rect x="117" y="65" width="6" height="35" rx="1" fill="#c084fc" />
          <rect x="147" y="68" width="6" height="38" rx="1" fill="#f472b6" />
          <rect x="177" y="65" width="6" height="35" rx="1" fill="#fb7185" />
          {/* Cream filling visible on cut face */}
          <rect x="148" y="62" width="4" height="212" fill="white" opacity="0.22" />
        </g>
      </svg>
    </div>
  );
}

export default function CakeCutting({ slicingActive, cakeCut }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-10 animate-slide-up">

      <div className="space-y-2">
        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[10px] font-black uppercase tracking-widest inline-block">
          🔪 Slicing Sweetness
        </span>
        <h2
          className="font-romantic text-4xl sm:text-6xl md:text-7xl text-white leading-tight"
          style={{ textShadow: '0 0 40px rgba(225,29,72,0.35)' }}
        >
          Here's your slice!
        </h2>
        <p className="text-sm text-rose-200/40 max-w-xs mx-auto">
          The cake is cut — something beautiful awaits below ↓
        </p>
      </div>

      {/* Knife + cake halves */}
      <div className="relative w-40 h-40 mx-auto">
        {/* Knife drops during slicingActive */}
        {slicingActive && (
          <div className="absolute top-[-70px] left-1/2 -translate-x-1/2 z-20 animate-slice-cut animate-duration-1000">
            <svg className="w-8 h-28 fill-slate-300 drop-shadow-md" viewBox="0 0 100 250">
              <path d="M50,0 C60,20 60,185 50,205 L40,205 L40,0 Z" />
              <rect x="42" y="205" width="16" height="45" rx="4" fill="#5c3f30" />
            </svg>
          </div>
        )}

        <CakeHalf side="left" shifted={cakeCut} />

        {/* Small slice slides out from center */}
        <div
          className="absolute z-10 transition-all duration-1000 ease-out"
          style={{
            opacity: cakeCut ? 1 : 0,
            transform: cakeCut ? 'translateY(55px) scale(1.05)' : 'translateY(-15px) scale(0.2)',
            left: 'calc(50% - 48px)', // centers the 96px (w-24) slice
            bottom: '0px',
            pointerEvents: 'none'
          }}
        >
          <CakeSlice />
        </div>

        <CakeHalf side="right" shifted={cakeCut} />
      </div>
    </div>
  );
}
