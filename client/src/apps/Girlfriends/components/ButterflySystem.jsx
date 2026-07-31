import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Real Butterfly Species Color Palettes
const BUTTERFLY_SPECIES = [
  {
    name: 'Monarch',
    primary: '#F95738',
    secondary: '#EE964B',
    accent: '#FFFFFF',
    veins: '#101010',
    body: '#1A1A1A',
    glow: 'rgba(249, 87, 56, 0.4)'
  },
  {
    name: 'Blue Morpho',
    primary: '#0077B6',
    secondary: '#00B4D8',
    accent: '#90E0EF',
    veins: '#03045E',
    body: '#0F172A',
    glow: 'rgba(0, 180, 216, 0.45)'
  },
  {
    name: 'Emerald Swallowtail',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#A7F3D0',
    veins: '#064E3B',
    body: '#022C22',
    glow: 'rgba(16, 185, 129, 0.4)'
  },
  {
    name: 'Sunset Moth',
    primary: '#F43F5E',
    secondary: '#FB923C',
    accent: '#FACC15',
    veins: '#4C0519',
    body: '#1C1917',
    glow: 'rgba(244, 63, 94, 0.4)'
  }
];

// Vector SVG Butterfly with Hardware-Accelerated 3D Wing Flapping
function SvgButterfly({ id, species, scale = 1 }) {
  const flapDuration = 0.2 + (id % 3) * 0.03; // Slight natural variance per butterfly

  return (
    <div 
      className="relative pointer-events-none select-none"
      style={{
        width: `${56 * scale}px`,
        height: `${56 * scale}px`,
        filter: `drop-shadow(0 8px 16px ${species.glow})`
      }}
    >
      <svg 
        viewBox="0 0 120 120" 
        className="w-full h-full overflow-visible"
        style={{ perspective: '600px' }}
      >
        <defs>
          <linearGradient id={`bf-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={species.primary} />
            <stop offset="60%" stopColor={species.secondary} />
            <stop offset="100%" stopColor={species.accent} />
          </linearGradient>
        </defs>

        {/* LEFT WING GROUP — Hinge anchored at body center X=60 */}
        <g 
          id={`bf-wing-left-${id}`} 
          style={{ 
            transformOrigin: '60px 60px',
            animation: `bfFlapLeft ${flapDuration}s ease-in-out infinite alternate`
          }}
        >
          <path
            d="M 60 55 C 45 20, 10 12, 5 35 C 2 52, 28 65, 58 60 Z"
            fill={`url(#bf-grad-${id})`}
            stroke={species.veins}
            strokeWidth="0.9"
          />
          <path
            d="M 58 58 C 32 62, 15 78, 28 100 C 42 108, 56 82, 59 64 Z"
            fill={`url(#bf-grad-${id})`}
            stroke={species.veins}
            strokeWidth="0.9"
          />
          <path
            d="M 60 55 Q 35 32 12 30 M 60 55 Q 28 48 15 54 M 58 58 Q 36 76 30 92"
            fill="none"
            stroke={species.veins}
            strokeWidth="0.6"
            opacity="0.75"
          />
          <circle cx="10" cy="26" r="1.3" fill={species.accent} />
          <circle cx="26" cy="96" r="1.3" fill={species.accent} />
        </g>

        {/* RIGHT WING GROUP — Hinge anchored at body center X=60 */}
        <g 
          id={`bf-wing-right-${id}`} 
          style={{ 
            transformOrigin: '60px 60px',
            animation: `bfFlapRight ${flapDuration}s ease-in-out infinite alternate`
          }}
        >
          <path
            d="M 60 55 C 75 20, 110 12, 115 35 C 118 52, 92 65, 62 60 Z"
            fill={`url(#bf-grad-${id})`}
            stroke={species.veins}
            strokeWidth="0.9"
          />
          <path
            d="M 62 58 C 88 62, 105 78, 92 100 C 78 108, 64 82, 61 64 Z"
            fill={`url(#bf-grad-${id})`}
            stroke={species.veins}
            strokeWidth="0.9"
          />
          <path
            d="M 60 55 Q 85 32 108 30 M 60 55 Q 92 48 105 54 M 62 58 Q 84 76 90 92"
            fill="none"
            stroke={species.veins}
            strokeWidth="0.6"
            opacity="0.75"
          />
          <circle cx="110" cy="26" r="1.3" fill={species.accent} />
          <circle cx="94" cy="96" r="1.3" fill={species.accent} />
        </g>

        {/* BODY & ANTENNAE */}
        <g>
          <path
            d="M 59 46 Q 52 28, 44 20"
            fill="none"
            stroke={species.body}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="43.5" cy="19.5" r="1.5" fill={species.body} />

          <path
            d="M 61 46 Q 68 28, 76 20"
            fill="none"
            stroke={species.body}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="76.5" cy="19.5" r="1.5" fill={species.body} />

          <ellipse cx="60" cy="46" rx="3" ry="4" fill={species.body} />
          <path
            d="M 60 50 C 57 56, 57 72, 60 78 C 63 72, 63 56, 60 50 Z"
            fill={species.body}
          />
          <ellipse cx="60" cy="45" rx="1.5" ry="2" fill={species.accent} opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}

export default function ButterflySystem({
  enabled = true,
  butterflyCount = 6,
  imageTargets = [],
  allowLanding = true,
  allowCursorInteraction = true
}) {
  const containerRef = useRef(null);
  const instancesRef = useRef([]);
  const imageTargetsRef = useRef(imageTargets);

  useEffect(() => {
    imageTargetsRef.current = imageTargets;
  }, [imageTargets]);

  const butterflies = useRef(
    Array.from({ length: butterflyCount }).map((_, i) => ({
      id: i,
      species: BUTTERFLY_SPECIES[i % BUTTERFLY_SPECIES.length],
      scale: 0.75 + Math.random() * 0.3
    }))
  ).current;

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const instances = [];

    butterflies.forEach((bf) => {
      const el = containerRef.current.querySelector(`#bf-wrapper-${bf.id}`);
      if (!el) return;

      const initialX = Math.random() * (window.innerWidth - 120) + 60;
      const initialY = Math.random() * (window.innerHeight - 120) + 60;

      gsap.set(el, { x: initialX, y: initialY, force3D: true });

      const state = {
        id: bf.id,
        el,
        x: initialX,
        y: initialY,
        isResting: false,
        isStartled: false,
        flightTween: null
      };

      instances.push(state);

      // Start continuous flight loop
      scheduleContinuousFlight(state);
    });

    instancesRef.current = instances;

    function scheduleContinuousFlight(state) {
      if (!state.el || !document.body.contains(state.el) || state.isResting) return;

      const targets = (imageTargetsRef.current || []).filter(t => t && t.getBoundingClientRect);
      const shouldLand = allowLanding && targets.length > 0 && Math.random() < 0.25;

      if (shouldLand) {
        landOnPhoto(state, targets);
      } else {
        flyToNextScreenPoint(state);
      }
    }

    function flyToNextScreenPoint(state) {
      const margin = 80;
      const targetX = margin + Math.random() * (window.innerWidth - margin * 2);
      const targetY = margin + Math.random() * (window.innerHeight - margin * 2);

      const dx = targetX - state.x;
      const dy = targetY - state.y;
      const distance = Math.hypot(dx, dy);
      const duration = (distance / 110) + Math.random() * 2.0;

      const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      gsap.to(state.el, {
        rotation: targetAngle,
        duration: 0.6,
        ease: "power2.out"
      });

      state.flightTween = gsap.to(state.el, {
        x: targetX,
        y: targetY,
        duration: duration,
        ease: "sine.inOut",
        onUpdate: () => {
          state.x = gsap.getProperty(state.el, "x");
          state.y = gsap.getProperty(state.el, "y");
        },
        onComplete: () => {
          scheduleContinuousFlight(state);
        }
      });
    }

    function landOnPhoto(state, targets) {
      const targetEl = targets[Math.floor(Math.random() * targets.length)];
      const rect = targetEl.getBoundingClientRect();

      const spots = [
        { x: rect.left + 24, y: rect.top + 24 },
        { x: rect.right - 44, y: rect.top + 24 },
        { x: rect.left + 24, y: rect.bottom - 44 },
        { x: rect.right - 44, y: rect.bottom - 44 }
      ];
      const spot = spots[Math.floor(Math.random() * spots.length)];

      gsap.to(state.el, {
        rotation: Math.random() * 60 - 30,
        duration: 0.8,
        ease: "power2.out"
      });

      state.flightTween = gsap.to(state.el, {
        x: spot.x,
        y: spot.y,
        duration: 2.5 + Math.random() * 1.0,
        ease: "power2.out",
        onComplete: () => {
          state.isResting = true;
          state.x = spot.x;
          state.y = spot.y;

          setTimeout(() => {
            if (!state.el) return;
            state.isResting = false;
            scheduleContinuousFlight(state);
          }, 2500 + Math.random() * 2000);
        }
      });
    }

    const handleMouseMove = (e) => {
      if (!allowCursorInteraction) return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      instancesRef.current.forEach((state) => {
        if (state.isStartled) return;

        const dist = Math.hypot(mouseX - state.x, mouseY - state.y);
        if (dist < 110) {
          state.isStartled = true;
          state.isResting = false;

          if (state.flightTween) state.flightTween.kill();

          const escapeAngle = Math.atan2(state.y - mouseY, state.x - mouseX);
          const escapeX = Math.min(Math.max(60, state.x + Math.cos(escapeAngle) * 240), window.innerWidth - 60);
          const escapeY = Math.min(Math.max(60, state.y + Math.sin(escapeAngle) * 240), window.innerHeight - 60);

          gsap.to(state.el, {
            x: escapeX,
            y: escapeY,
            rotation: escapeAngle * (180 / Math.PI) + 90,
            duration: 0.9,
            ease: "power3.out",
            onComplete: () => {
              state.isStartled = false;
              scheduleContinuousFlight(state);
            }
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      instances.forEach((s) => {
        if (s.flightTween) s.flightTween.kill();
      });
    };
  }, [enabled]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Embedded CSS 3D Wing Flap Animation Keyframes */}
      <style>{`
        @keyframes bfFlapLeft {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-68deg); }
        }
        @keyframes bfFlapRight {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(68deg); }
        }
      `}</style>

      {butterflies.map((bf) => (
        <div
          id={`bf-wrapper-${bf.id}`}
          key={bf.id}
          className="absolute top-0 left-0 pointer-events-none select-none will-change-transform"
        >
          <SvgButterfly id={bf.id} species={bf.species} scale={bf.scale} />
        </div>
      ))}
    </div>
  );
}