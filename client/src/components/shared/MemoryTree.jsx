import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MemoryTree({ config, setActiveMemoryIndex }) {
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-slate-950/60 border border-rosePrimary/20 backdrop-blur-md rounded-[48px] p-6 sm:p-12 shadow-[0_20px_50px_rgba(244,63,94,0.15)] flex flex-col items-center min-h-[580px] overflow-hidden">
      
      {/* Magical Ambient Aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-rosePrimary/15 via-pink-500/10 to-transparent filter blur-3xl opacity-75 rounded-full w-96 h-96 mx-auto top-10 pointer-events-none animate-pulse-glow" />

      {/* Floating Fireflies (Animated elements) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <div
            key={num}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full blur-[1px] animate-firefly"
            style={{
              top: `${15 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${num * 0.7}s`,
              animationDuration: `${4 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Title / Description */}
      <div className="text-center space-y-2 z-10 max-w-xl mx-auto mb-8">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-rosePrimary/10 border border-rosePrimary/15 text-rose-300 text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-rosePrimary animate-pulse" />
          <span>Interactive Memory Tree 🌳</span>
        </span>
        <h3 className="font-heading font-black text-2xl sm:text-3xl text-white leading-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.2)]">
          Our Magical Branch of Moments
        </h3>
        <p className="text-xs text-rose-200/60 leading-relaxed">
          Every polaroid contains a beautiful story we shared. Click on a photo to reveal the full hidden memory note and zoom into the photo.
        </p>
      </div>

      {/* Tree Branch SVG Outline mapping memories */}
      <div className="w-full max-w-2xl aspect-[4/3] relative flex items-center justify-center animate-fade-in z-10">
        
        {/* Dynamic Memory Nodes */}
        {config.memories && config.memories.length > 0 ? (
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-6 p-4">
            
            {/* Centerpiece SVG Magical Tree */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-[0_0_15px_rgba(244,63,94,0.35)]" viewBox="0 0 600 450">
              <defs>
                <linearGradient id="trunkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#451a03" />
                  <stop offset="40%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="leafGradPink" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="leafGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="leafGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 1. Hanging string lights paths */}
              <path d="M 120,240 Q 200,280 290,230" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="3,3" />
              <path d="M 290,230 Q 380,260 480,210" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="3,3" />
              <path d="M 150,150 Q 220,180 300,140" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="3,3" />
              <path d="M 300,140 Q 370,170 450,130" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="3,3" />

              {/* Hanging string light bulbs */}
              <circle cx="160" cy="254" r="5" fill="url(#lampGlow)" className="animate-pulse" />
              <circle cx="240" cy="256" r="5" fill="url(#lampGlow)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <circle cx="340" cy="248" r="5" fill="url(#lampGlow)" className="animate-pulse" style={{ animationDelay: '1s' }} />
              <circle cx="420" cy="245" r="5" fill="url(#lampGlow)" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
              <circle cx="210" cy="162" r="5" fill="url(#lampGlow)" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
              <circle cx="390" cy="155" r="5" fill="url(#lampGlow)" className="animate-pulse" style={{ animationDelay: '1.2s' }} />

              {/* 2. Realistic Thick Tree Trunk */}
              <path d="M 285,450 
                       C 285,380 265,300 290,220 
                       L 310,220 
                       C 290,300 315,380 315,450 Z" fill="url(#trunkGrad)" />
              
              {/* Primary Left Branch */}
              <path d="M 290,230 Q 180,220 120,240 L 120,248 Q 180,228 290,240 Z" fill="url(#trunkGrad)" />
              
              {/* Primary Right Branch */}
              <path d="M 310,220 Q 420,180 480,210 L 480,218 Q 420,188 310,230 Z" fill="url(#trunkGrad)" />
              
              {/* Upper Branches */}
              <path d="M 300,220 Q 210,130 150,150 L 153,155 Q 210,138 300,228 Z" fill="url(#trunkGrad)" />
              <path d="M 300,220 Q 390,120 450,130 L 453,135 Q 390,128 300,228 Z" fill="url(#trunkGrad)" />
              <path d="M 300,160 Q 280,100 300,30 L 306,30 Q 286,100 306,160 Z" fill="url(#trunkGrad)" />

              {/* 3. Glowing Magical Neon Leaves */}
              {/* Left Foliage */}
              <path d="M 120,240 C 105,225 100,245 110,250 C 95,245 90,265 105,270 C 120,275 125,255 120,240 Z" fill="url(#leafGradGreen)" opacity="0.9" />
              <path d="M 150,150 C 135,135 130,155 140,160 C 125,155 120,175 135,180 C 150,185 155,165 150,150 Z" fill="url(#leafGradPink)" opacity="0.9" />
              
              {/* Right Foliage */}
              <path d="M 480,210 C 495,195 500,215 490,220 C 505,215 510,235 495,240 C 480,245 475,225 480,210 Z" fill="url(#leafGradPink)" opacity="0.9" />
              <path d="M 450,130 C 465,115 470,135 460,140 C 475,135 480,155 465,160 C 450,165 445,145 450,130 Z" fill="url(#leafGradGold)" opacity="0.9" />
              
              {/* Top Center Foliage */}
              <path d="M 300,30 C 285,15 280,35 290,40 C 275,35 270,55 285,60 C 300,65 305,45 300,30 Z" fill="url(#leafGradGold)" opacity="0.9" />
              <path d="M 306,30 C 321,15 326,35 316,40 C 331,35 336,55 321,60 C 306,65 301,45 306,30 Z" fill="url(#leafGradPink)" opacity="0.9" />

              {/* Extra Little Leaves */}
              <circle cx="180" cy="180" r="3" fill="#10b981" />
              <circle cx="260" cy="200" r="3" fill="#ec4899" />
              <circle cx="360" cy="190" r="3.5" fill="#f59e0b" />
              <circle cx="430" cy="180" r="3.5" fill="#10b981" />
            </svg>

            {/* Nodes arranged dynamically around branches (max 10 memories) */}
            {config.memories.slice(0, 10).map((mem, index) => {
              const coords = [
                { top: '42%', left: '16%' },  // Node 1
                { top: '32%', left: '74%' },  // Node 2
                { top: '22%', left: '46%' },  // Node 3
                { top: '56%', left: '22%' },  // Node 4
                { top: '48%', left: '55%' },  // Node 5
                { top: '30%', left: '28%' },  // Node 6
                { top: '62%', left: '78%' },  // Node 7
                { top: '15%', left: '62%' },  // Node 8
                { top: '35%', left: '42%' },  // Node 9
                { top: '72%', left: '38%' }   // Node 10
              ];

              const pos = coords[index] || { top: '50%', left: '50%' };
              const memoryTitle = mem.title || `Memory #${index + 1}`;
              const url = mem.imageUrl || (config.photos && config.photos[index]) || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=200";

              // Unique tilts for Polaroid look
              const tilts = ['-rotate-3', 'rotate-6', '-rotate-6', 'rotate-3', '-rotate-4', 'rotate-5', '-rotate-5', 'rotate-4', '-rotate-2', 'rotate-2'];
              const tiltClass = tilts[index % tilts.length];

              return (
                <div
                  key={index}
                  className="absolute z-20 flex flex-col items-center pointer-events-auto"
                  style={{ top: pos.top, left: pos.left }}
                >
                  {/* Decorative Pin / Rope Line */}
                  <div className="w-0.5 h-6 bg-yellow-600/60 mb-0.5" />
                  <div className="w-1.5 h-1.5 bg-red-650 rounded-full -mt-1 shadow-sm z-30" />

                  {/* Polaroid Frame Button */}
                  <button
                    onClick={() => setActiveMemoryIndex(index)}
                    className={`w-14 h-16 bg-white p-1 rounded-sm border border-slate-200 shadow-lg hover:shadow-2xl hover:scale-135 hover:-translate-y-1 active:scale-95 transition-all duration-300 group cursor-pointer flex flex-col items-center ${tiltClass}`}
                    title={memoryTitle}
                  >
                    <div className="w-full h-10 overflow-hidden rounded-xs bg-slate-900">
                      <img src={url} className="w-full h-full object-cover" alt="Polaroid thumbnail" />
                    </div>
                    <div className="w-full text-[5px] text-slate-800 font-accent text-center leading-none mt-1 truncate max-w-full px-0.5">
                      {memoryTitle}
                    </div>
                    
                    {/* Hover tag helper */}
                    <div className="absolute bottom-18 left-1/2 -translate-x-1/2 bg-slate-950/95 text-rose-250 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl z-25 border border-rosePrimary/20">
                      {memoryTitle}
                    </div>
                  </button>
                </div>
              );
            })}

          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 italic text-sm">No memories configured yet.</div>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-rose-300/80 font-light z-10 flex items-center justify-center space-x-1.5">
        <span className="animate-ping w-1.5 h-1.5 bg-rosePrimary rounded-full inline-block" />
        <span>Tap any polaroid photo on the branches to open a memory node.</span>
      </div>
    </div>
  );
}
