import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Heart, Volume2, VolumeX, Gift, ChevronDown } from 'lucide-react';
import { io } from 'socket.io-client';
import { api } from '../../services/api.service';

import '../../styles/birthday-animations.css';
import './styles/globals.css';

import LivingBackground from '../../components/animations/LivingBackground';
import LoveLetter from '../../components/shared/LoveLetter';
import PhotoCollage from '../../components/shared/PhotoCollage';
import MemoryTimeline from '../../components/shared/MemoryTimeline';
import FireworksCelebration from '../../components/shared/FireworksCelebration';
import BalloonBlasting from '../../components/shared/BalloonBlasting';
import RainOfHearts from '../../components/shared/RainOfHearts';

import LockedEntry from './LockedEntry';
import BirthdayCake from './BirthdayCake';
import CakeCutting from './CakeCutting';
import SurpriseReveal from './SurpriseReveal';
import Feedback from './Feedback';
import SendMessage from './SendMessage';
import SecurityUnlock from './SecurityUnlock';

import flowerAsset from './Assets/noun-flowers-2420525.svg';
import PasswordUnlockGateway from '../../components/shared/PasswordUnlockGateway';

import typingSound from '../../assets/music/mixkit-keyboard-typing-1386.wav';
import fireworkSound from '../../assets/music/mixkit-fireworks-whooshes-and-bangs-524.wav';

// YouTube ID extractor helper
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper to darken colors for 3D balloon shading
function adjustColorBrightness(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);
  R = Math.max(0, Math.min(255, parseInt(R * (1 + percent))));
  G = Math.max(0, Math.min(255, parseInt(G * (1 + percent))));
  B = Math.max(0, Math.min(255, parseInt(B * (1 + percent))));
  return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
}

/* ── Premium SVG 3D Balloon (No built-in rope) ── */
function SVGBalloon({ color, scale = 1 }) {
  const gradId = `balloon-grad-${color.replace('#', '')}`;
  return (
    <svg
      viewBox="0 0 100 120"
      className="w-12 h-14 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] overflow-visible"
      style={{ transform: `scale(${scale}) rotate(180deg)` }}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="35%" stopColor={color} />
          <stop offset="100%" stopColor={adjustColorBrightness(color, -0.4)} />
        </radialGradient>
      </defs>
      {/* Knot at bottom */}
      <path d="M 50,94 L 42,102 L 58,102 Z" fill={color} />
      <path d="M 50,94 Q 50,105 47,112" stroke={color} strokeWidth="1.5" fill="none" opacity="0.8" />
      {/* Balloon body */}
      <ellipse cx="50" cy="50" rx="42" ry="46" fill={`url(#${gradId})`} />
      {/* Glossy highlight */}
      <ellipse cx="32" cy="30" rx="7" ry="11" fill="#ffffff" opacity="0.45" transform="rotate(-15 32 30)" />
    </svg>
  );
}

/* ── Curvy Ribbon Thread (Straight Thread styled to theme) ── */
function CurvyThread({ height }) {
  return (
    <svg
      width="100"
      height={height}
      viewBox={`0 0 100 ${height}`}
      className="absolute top-0 pointer-events-none overflow-visible"
      style={{ left: 0 }}
    >
      <line
        x1="50"
        y1="0"
        x2="50"
        y2={height}
        stroke="rgba(244, 63, 94, 0.45)" // Rose/pink theme accent
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Hanging Balloon Thread Item ── */
function HangingThread({ left, right, height, delay, children, tilt }) {
  const swayClass = delay % 2 === 0 ? 'animate-card-sway-left' : 'animate-card-sway-right';
  const posStyle = left !== undefined ? { left } : { right };
  return (
    <div
      className="absolute top-0 pointer-events-none"
      style={{
        ...posStyle,
        width: '100px',
        height: `${height}px`,
        transform: `rotate(${tilt.x}deg)`,
        transformOrigin: 'top center',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <CurvyThread height={height - 20} />
      {/* Positioned precisely at the end of the curvy thread so they stay connected */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 flex items-center justify-center ${swayClass}`}
        style={{
          top: `${height - 24}px`, // overlays the tie knot right at the thread's end
          width: '120px',
          height: '60px',
          animationDelay: `${delay}s`,
          animationDuration: `${5 + (delay % 3) * 1.5}s`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Hanging Balloons Decoration ─── */
function HangingBalloons() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Mouse Parallax (Laptop cursor move)
    const handleMouseMove = (e) => {
      const xPct = (e.clientX / window.innerWidth) - 0.5;
      const yPct = (e.clientY / window.innerHeight) - 0.5;
      setTilt({ x: xPct * 16, y: yPct * 8 });
    };

    // 2. Physical device orientation (moving/tilting laptop or tablet)
    const handleOrientation = (e) => {
      if (e.gamma !== null) {
        setTilt({
          x: (e.gamma / 90) * 20,
          y: (e.beta / 180) * 10
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="absolute top-0 inset-x-0 h-[280px] pointer-events-none z-20 overflow-hidden">
      {/* Corner 1: Left Cluster of 3 (Organized & Symmetrical) */}
      <HangingThread left="5%" height={100} delay={0.2} tilt={tilt}>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute" style={{ left: '50%', transform: 'translate(-50%, -30px) rotate(0deg)' }}><SVGBalloon color="#E11D48" scale={1.05} /></div>
          <div className="absolute" style={{ left: '50%', transform: 'translate(-95%, -20px) rotate(-15deg)' }}><SVGBalloon color="#EC4899" scale={0.92} /></div>
          <div className="absolute" style={{ left: '50%', transform: 'translate(-5%, -20px) rotate(15deg)' }}><SVGBalloon color="#8B5CF6" scale={0.92} /></div>
        </div>
      </HangingThread>

      {/* Corner 2: Right Cluster of 3 (Organized & Symmetrical) */}
      <HangingThread right="5%" height={110} delay={0.8} tilt={tilt}>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute" style={{ left: '50%', transform: 'translate(-50%, -30px) rotate(0deg)' }}><SVGBalloon color="#E11D48" scale={1.05} /></div>
          <div className="absolute" style={{ left: '50%', transform: 'translate(-95%, -20px) rotate(-15deg)' }}><SVGBalloon color="#F59E0B" scale={0.92} /></div>
          <div className="absolute" style={{ left: '50%', transform: 'translate(-5%, -20px) rotate(15deg)' }}><SVGBalloon color="#EC4899" scale={0.92} /></div>
        </div>
      </HangingThread>

      {/* Thread 3: Single Balloon (Perfect 13% step horizontal distribution) */}
      <HangingThread left="18%" height={140} delay={1.4} tilt={tilt}>
        <div className="rotate-[-6deg]"><SVGBalloon color="#8B5CF6" /></div>
      </HangingThread>

      {/* Thread 4: Single Balloon */}
      <HangingThread left="31%" height={90} delay={0.5} tilt={tilt}>
        <div className="rotate-[6deg]"><SVGBalloon color="#EC4899" /></div>
      </HangingThread>

      {/* Thread 5: Single Balloon */}
      <HangingThread left="44%" height={130} delay={2.1} tilt={tilt}>
        <div className="rotate-[-6deg]"><SVGBalloon color="#F59E0B" /></div>
      </HangingThread>

      {/* Thread 6: Single Balloon */}
      <HangingThread left="57%" height={80} delay={0.9} tilt={tilt}>
        <div className="rotate-[6deg]"><SVGBalloon color="#06B6D4" /></div>
      </HangingThread>

      {/* Thread 7: Single Balloon */}
      <HangingThread left="70%" height={150} delay={1.7} tilt={tilt}>
        <div className="rotate-[-6deg]"><SVGBalloon color="#E11D48" /></div>
      </HangingThread>

      {/* Thread 8: Single Balloon */}
      <HangingThread left="83%" height={100} delay={2.5} tilt={tilt}>
        <div className="rotate-[6deg]"><SVGBalloon color="#10B981" /></div>
      </HangingThread>
    </div>
  );
}

/* ─── Ultra-Deluxe Metallic & Glassmorphism Vector Elements ─── */
function FloatingDeluxeHeartSVG({ size = 24, id = 'heart' }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="drop-shadow-[0_6px_16px_rgba(225,29,72,0.4)]">
      <defs>
        <linearGradient id={`dhGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id={`dhGold-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d="M 50,88 L 42,80 C 18,58 2,42 2,27 C 2,13 13,2 27,2 C 35,2 43,6 50,13 C 57,6 65,2 73,2 C 87,2 98,13 98,27 C 98,42 82,58 58,80 L 50,88 Z" fill={`url(#dhGrad-${id})`} stroke={`url(#dhGold-${id})`} strokeWidth="2" opacity="0.9" />
      <path d="M 27,10 C 17,10 10,17 10,27 C 10,38 23,51 45,71 C 48,74 50,75 50,75 C 50,75 42,65 30,52 C 18,39 16,28 20,20 C 24,12 35,10 45,18 Z" fill="#FFE4E6" opacity="0.45" />
    </svg>
  );
}

function FloatingPetalSVG({ size = 22, rotation = 45 }) {
  return (
    <div
      style={{
        width: size * 0.9,
        height: size * 1.3,
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
        background: 'linear-gradient(135deg, rgba(254,205,211,0.95) 0%, rgba(244,63,94,0.85) 60%, rgba(136,19,55,0.9) 100%)',
        transform: `rotate(${rotation}deg) rotateY(15deg)`,
        boxShadow: '0 4px 14px rgba(225,29,72,0.35)',
        border: '1px solid rgba(255,255,255,0.4)',
      }}
    />
  );
}

function FloatingLuxuryBlossomSVG({ size = 24, id = 'blossom' }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="drop-shadow-[0_4px_14px_rgba(244,114,182,0.35)]">
      <defs>
        <linearGradient id={`luxBlo-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF1F2" />
          <stop offset="50%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
      </defs>
      {/* 5 Layered Petals */}
      <g fill={`url(#luxBlo-${id})`} stroke="#FFE4E6" strokeWidth="1" opacity="0.9">
        <path d="M 50,50 C 32,15 32,0 50,0 C 68,0 68,15 50,50 Z" />
        <path d="M 50,50 C 85,32 100,32 100,50 C 100,68 85,68 50,50 Z" />
        <path d="M 50,50 C 68,85 68,100 50,100 C 32,100 32,85 50,50 Z" />
        <path d="M 50,50 C 15,68 0,68 0,50 C 0,32 15,32 50,50 Z" />
      </g>
      <circle cx="50" cy="50" r="10" fill="#FDE68A" />
      <circle cx="50" cy="50" r="5" fill="#D97706" />
    </svg>
  );
}

/* ─── Noun Project Asset Flower Component (Pink Flower + Green Stem) ─── */
function AssetCornerFlowerSVG({ size = 120 }) {
  return (
    <div className="relative w-full h-full drop-shadow-[0_8px_20px_rgba(236,72,153,0.4)]">
      {/* Pink Flower Bloom Top Layer */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-pink-300 via-rose-400 to-pink-600"
        style={{
          WebkitMaskImage: `url(${flowerAsset})`,
          maskImage: `url(${flowerAsset})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 55%, 0% 55%)',
        }}
      />

      {/* Green Stem & Leaves Bottom Layer */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-600 to-green-800"
        style={{
          WebkitMaskImage: `url(${flowerAsset})`,
          maskImage: `url(${flowerAsset})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
        }}
      />
    </div>
  );
}

/* ─── Birthday Asset Flower Corner Ornament ─── */
function CornerFlowerOrnament({ position = 'top-left' }) {
  const isTop = position.includes('top');
  const isLeft = position.includes('left');

  return (
    <div
      className={`fixed ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-32 h-32 sm:w-48 sm:h-48 pointer-events-none z-10 select-none transition-opacity duration-700 opacity-95`}
      style={{
        transform: `${!isLeft ? 'scaleX(-1)' : ''} ${!isTop ? 'scaleY(-1)' : ''}`,
      }}
    >
      <AssetCornerFlowerSVG size="100%" />
    </div>
  );
}

/* ─── Floating Background Elements (Asset Flowers & Glass Hearts) ─── */
function HeartsBackground({ activeTheme }) {
  const items = useMemo(() => {
    const lanes = [4, 12, 22, 78, 88, 96];
    const types = ['single-flower', 'heart-deluxe', 'petal', 'single-flower', 'heart-deluxe', 'petal'];

    return Array.from({ length: 22 }).map((_, i) => {
      const lane = lanes[i % lanes.length];
      const type = types[i % types.length];
      return {
        id: i,
        type,
        left: `${lane + (Math.random() * 4 - 2)}%`,
        size: Math.floor(Math.random() * 16 + 24),
        duration: Math.floor(Math.random() * 8 + 14),
        delay: (Math.random() * 12).toFixed(1),
        opacity: Math.random() * 0.5 + 0.4,
        rotation: Math.floor(Math.random() * 360),
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 4 Corner Birthday Asset Flowers */}
      <CornerFlowerOrnament position="top-left" />
      <CornerFlowerOrnament position="top-right" />
      <CornerFlowerOrnament position="bottom-left" />
      <CornerFlowerOrnament position="bottom-right" />

      {/* Ambient Corner Glow Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-rose-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[140px] pointer-events-none" />

      {/* Floating Asset Flowers & Glass Hearts in Side Lanes */}
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute transform-gpu"
          style={{
            left: item.left,
            bottom: '-40px',
            opacity: item.opacity,
            animation: `float-up-sway ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            willChange: 'transform, opacity',
          }}
        >
          {item.type === 'single-flower' && (
            <div style={{ width: item.size, height: item.size }} className="relative transform-gpu">
              <AssetCornerFlowerSVG size={item.size} />
            </div>
          )}
          {item.type === 'petal' && <FloatingPetalSVG size={item.size} rotation={item.rotation} />}
          {item.type === 'heart-deluxe' && <FloatingDeluxeHeartSVG size={item.size} id={item.id} />}
        </div>
      ))}
    </div>
  );
}

/* ─── Section wrapper — fades in when mounted ─── */
function Section({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    // Allow one frame to paint, then fade in
    const id = requestAnimationFrame(() => {
      if (ref.current) ref.current.classList.add('section-visible');
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div ref={ref} className={`section-enter ${className}`}>
      {children}
    </div>
  );
}

/* ─── Glowing scroll arrow (replaces Open Surprise button) ─── */
function GlowArrow({ onClick, label }) {
  return (
    <div className="flex flex-col items-center gap-3 pt-6 pb-12 animate-slide-up">
      <p className="font-romantic text-2xl text-rose-300/80">{label}</p>
      <button
        onClick={onClick}
        className="relative w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center cursor-pointer group"
        style={{ boxShadow: '0 0 20px rgba(225,29,72,0.4), 0 0 40px rgba(225,29,72,0.2)' }}
      >
        <ChevronDown
          className="w-7 h-7 text-rose-400 group-hover:text-rose-300 transition-colors"
          style={{ animation: 'arrow-bounce 1.4s ease-in-out infinite' }}
        />
        {/* Ripple rings */}
        <span className="absolute inset-0 rounded-full border border-rose-500/30" style={{ animation: 'ripple 2s linear infinite' }} />
        <span className="absolute inset-0 rounded-full border border-rose-500/20" style={{ animation: 'ripple 2s linear infinite 0.7s' }} />
      </button>
    </div>
  );
}

const defaultAudioUrl = 'https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Happy_Birthday_Song_Instrumental_Loop_opw49s.mp3';

export default function BirthdaySurprise({ instance, instanceId }) {
  const config = instance.config || {};

  const bgAudioRef = useRef(null);
  const celebrationAudioRef = useRef(null);
  const canvasRef = useRef(null);

  // ── Gateway ──
  const [gatewayUnlocked, setGatewayUnlocked] = useState(false);

  // ── Countdown ──
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLocked, setIsLocked] = useState(true);
  const [unlockSequenceTriggered, setUnlockSequenceTriggered] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0);
  const [isPreviewUnlocked, setIsPreviewUnlocked] = useState(false);

  // ── Progressive reveal flags ──
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [slicingActive, setSlicingActive] = useState(false);
  const [surpriseOpened, setSurpriseOpened] = useState(false);
  const [letterStarted, setLetterStarted] = useState(false);
  const [memoriesUnlocked, setMemoriesUnlocked] = useState(false);
  const [showSecurityGate, setShowSecurityGate] = useState(false);

  // ── Effects ──
  const [cameraShakeActive, setCameraShakeActive] = useState(false);
  const [showCutButton, setShowCutButton] = useState(false);   // shows after cheers
  const [showArrow, setShowArrow] = useState(false);           // shows after cut
  const [cakeCutEffectsActive, setCakeCutEffectsActive] = useState(false);
  const [heartRainActive, setHeartRainActive] = useState(false);
  const [celebrationCountdown, setCelebrationCountdown] = useState(null);
  const [guestCheers, setGuestCheers] = useState([]);
  const cheerIdRef = useRef(0);

  // ── Music ──
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeMusicSource, setActiveMusicSource] = useState('none');
  const [ytReady, setYtReady] = useState(false);
  const ytPlayerRef = useRef(null);

  // ── Socket ──
  const [socketPopup, setSocketPopup] = useState(null);

  // ── Letter ──
  const [letterTypedText, setLetterTypedText] = useState('');
  const [letterTypingComplete, setLetterTypingComplete] = useState(false);
  const letterIntervalRef = useRef(null);

  // ── Feedback ──
  const [feedbackAnswer, setFeedbackAnswer] = useState(null);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [finalPromiseMessage, setFinalPromiseMessage] = useState(false);

  // ── Reply ──
  const [responseText, setResponseText] = useState('');
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const [submittingResponse, setSubmittingResponse] = useState(false);

  // ── Canvas ──
  const particlesArrayRef = useRef([]);
  const canvasAnimIdRef = useRef(null);

  // ── Scroll refs ──
  const cakeSectionRef = useRef(null);
  const cakeCuttingRef = useRef(null);
  const surpriseRevealRef = useRef(null);
  const loveLetterRef = useRef(null);
  const memoriesRef = useRef(null);

  const scrollTo = useCallback((ref) => {
    if (!ref?.current) return;
    setTimeout(() => {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }, []);

  // ── Scroll lock ──
  // Lock scrolling until the experience is complete
  useEffect(() => {
    if (!gatewayUnlocked || isLocked) {
      document.body.style.overflow = 'hidden';
    } else if (memoriesUnlocked) {
      document.body.style.overflow = '';
    } else if (cakeCut || slicingActive) {
      // Allow scrolling during/after cake cutting so scroll works
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [gatewayUnlocked, isLocked, cakeCut, slicingActive, memoriesUnlocked]);

  // Pause audio on tab change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        bgAudioRef.current?.pause();
        celebrationAudioRef.current?.pause();
        setIsPlayingMusic(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);


  useEffect(() => {
    if (slicingActive || cakeCut) {
      scrollTo(cakeCuttingRef);
    }
    if (cakeCut) {
      // show the glowing arrow after a short delay
      setTimeout(() => setShowArrow(true), 800);
    }
  }, [slicingActive, cakeCut]);

  useEffect(() => {
    if (surpriseOpened) scrollTo(surpriseRevealRef);
  }, [surpriseOpened]);

  useEffect(() => {
    if (letterStarted) scrollTo(loveLetterRef);
  }, [letterStarted]);

  useEffect(() => {
    if (memoriesUnlocked) scrollTo(memoriesRef);
  }, [memoriesUnlocked]);

  // ── Typewriter — starts ONLY after letterStarted or surpriseOpened ──
  useEffect(() => {
    if (!letterStarted && !surpriseOpened) return;

    // Clean up any previous interval
    if (letterIntervalRef.current) clearInterval(letterIntervalRef.current);

    const fullText = config.letterText || config.message || config.finalMessage ||
      'You are the heart of all my happy moments. I created this journey to remind you of how deeply you are loved, and how special you make every single day. No matter where life takes us, know that you are always cherished. Happy Birthday! 🎂';

    let index = 0;
    setLetterTypedText('');
    setLetterTypingComplete(false);

    const typingAudio = new Audio(typingSound);
    typingAudio.loop = true;
    typingAudio.volume = 0.45;

    // Small delay so the section animates in first
    const startDelay = setTimeout(() => {
      typingAudio.play().catch(err => console.log('Autoplay blocked:', err));
      letterIntervalRef.current = setInterval(() => {
        if (index < fullText.length) {
          const char = fullText.charAt(index);
          setLetterTypedText(prev => prev + char);
          index++;
        } else {
          clearInterval(letterIntervalRef.current);
          setLetterTypingComplete(true);
          typingAudio.pause();
        }
      }, 30);
    }, 200);

    return () => {
      clearTimeout(startDelay);
      if (letterIntervalRef.current) clearInterval(letterIntervalRef.current);
      typingAudio.pause();
    };
  }, [letterStarted, surpriseOpened, config.letterText, config.message, config.finalMessage]);

  // Parse YouTube IDs
  const bgMusicYtId = getYouTubeId(config.backgroundMusic || config.musicUrl || defaultAudioUrl);
  const bdaySongYtId = getYouTubeId(config.birthdaySong || 'https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Happy_Birthday_Song_Instrumental_Loop_opw49s.mp3');
  const activeYtId = activeMusicSource === 'birthday' ? bdaySongYtId : bgMusicYtId;

  // Load YouTube API
  useEffect(() => {
    if (bgMusicYtId || bdaySongYtId) {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          setYtReady(true);
        };
      } else {
        setYtReady(true);
      }
    }
  }, [bgMusicYtId, bdaySongYtId]);

  // Synchronize Player Instance with Active YouTube Video ID
  useEffect(() => {
    if (!ytReady) return;

    if (activeYtId) {
      // Destroy old player to avoid duplicate frames
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }

      // Initialize YT player
      ytPlayerRef.current = new window.YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: activeYtId,
        playerVars: {
          autoplay: isPlayingMusic ? 1 : 0,
          loop: 1,
          playlist: activeYtId, // required for loop
          controls: 0,
        },
        events: {
          onReady: (event) => {
            if (isPlayingMusic) {
              try {
                event.target.playVideo();
              } catch (e) {}
            }
          }
        }
      });
    } else {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }
    }

    return () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }
    };
  }, [activeYtId, ytReady]);

  // Synchronize dynamic play/pause state
  useEffect(() => {
    const playAudio = async (ref) => {
      try {
        await ref.current?.play();
      } catch (e) {}
    };

    if (isPlayingMusic) {
      if (activeYtId) {
        bgAudioRef.current?.pause();
        celebrationAudioRef.current?.pause();
        if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
          try {
            ytPlayerRef.current.playVideo();
          } catch (e) {}
        }
      } else {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
          try {
            ytPlayerRef.current.pauseVideo();
          } catch (e) {}
        }
        if (activeMusicSource === 'birthday') {
          bgAudioRef.current?.pause();
          playAudio(celebrationAudioRef);
        } else {
          celebrationAudioRef.current?.pause();
          playAudio(bgAudioRef);
        }
      }
    } else {
      bgAudioRef.current?.pause();
      celebrationAudioRef.current?.pause();
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch (e) {}
      }
    }
  }, [isPlayingMusic, activeMusicSource, activeYtId, gatewayUnlocked]);

  // Auto-play ambient music on first user click/tap anywhere on page if blocked by browser policy
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isLocked) {
        setIsPlayingMusic(true);
        if (activeMusicSource === 'none') setActiveMusicSource('ambient');
      }
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isLocked, activeMusicSource]);

  // ══════════════════════════════════════════════
  // Socket.IO
  // ══════════════════════════════════════════════
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://127.0.0.1:5000'
        : window.location.origin);
    const socket = io(socketUrl);
    socket.on('connect', () => socket.emit('join-room', instanceId));
    socket.on('live-trigger', ({ action, data }) => {
      if (action === 'confetti') triggerCanvasConfetti();
      if (action === 'fireworks') triggerCanvasFireworks();
      if (action === 'popup') {
        setSocketPopup(data.message || 'Thinking of you! ❤️');
        setTimeout(() => setSocketPopup(null), 6000);
      }
      if (action === 'music' && data.musicUrl && bgAudioRef.current) {
        bgAudioRef.current.src = data.musicUrl;
        bgAudioRef.current.play().catch(() => { });
        setIsPlayingMusic(true); setActiveMusicSource('ambient');
      }
      if (action === 'reveal') { setIsLocked(false); setJourneyStep(1); triggerCanvasConfetti(); }
      if (action === 'start-celebration') { handleBlowCandles(); }
      if (action === 'cake-reveal') { handleCutCake(); }
    });
    return () => socket.disconnect();
  }, [instanceId]);

  // ── Indian Standard Time (IST UTC+5:30) Helpers ──
  const getISTTimeMs = () => {
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    return utcMs + (330 * 60000); // IST UTC+5:30
  };

  const getISTUnlockTimeMs = (dateInput) => {
    if (!dateInput) return null;
    let dateStr = '';
    if (typeof dateInput === 'string') {
      dateStr = dateInput.trim();
    } else if (dateInput instanceof Date) {
      dateStr = dateInput.toISOString();
    } else if (typeof dateInput === 'object' && dateInput) {
      dateStr = String(dateInput);
    }
    
    // Extract YYYY-MM-DD
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = match[1];
      const month = match[2];
      const day = match[3];
      // Target is 00:00:00 AM IST of that birthday date
      const targetDate = new Date(`${year}-${month}-${day}T00:00:00+05:30`);
      return isNaN(targetDate.getTime()) ? null : targetDate.getTime();
    }
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? null : d.getTime();
  };

  // ══════════════════════════════════════════════
  // Clock + Countdown
  // ══════════════════════════════════════════════
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!config.specialDate) {
      setIsLocked(false);
      setJourneyStep(1);
      return;
    }
    const unlockTimeMs = getISTUnlockTimeMs(config.specialDate);
    if (!unlockTimeMs) {
      setIsLocked(false);
      setJourneyStep(1);
      return;
    }
    const checkLockStatus = () => {
      const currentISTMs = getISTTimeMs();
      const diff = unlockTimeMs - currentISTMs;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsLocked(false);
        if (!unlockSequenceTriggered) triggerUnlockSequence();
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
        if (!isPreviewUnlocked) {
          setIsLocked(true);
          setJourneyStep(0);
        }
      }
    };
    checkLockStatus();
    const t = setInterval(checkLockStatus, 1000);
    return () => clearInterval(t);
  }, [config.specialDate, unlockSequenceTriggered, isPreviewUnlocked]);

  const triggerUnlockSequence = () => {
    setUnlockSequenceTriggered(true);
    setTimeout(() => {
      setJourneyStep(1);
      triggerCanvasFireworks();
      triggerCanvasConfetti();
      startAmbientMusic();
    }, 1500);
  };

  // ══════════════════════════════════════════════
  // Music
  // ══════════════════════════════════════════════
  const startAmbientMusic = () => {
    setIsPlayingMusic(true);
    setActiveMusicSource('ambient');
    if (bgAudioRef.current) {
      try {
        bgAudioRef.current.play().catch(err => console.log('Direct gesture play retry:', err));
      } catch (e) {}
    }
  };

  const toggleMusicMute = () => {
    if (activeMusicSource === 'none' || !isPlayingMusic) {
      startAmbientMusic();
      return;
    }
    setIsPlayingMusic(false);
    try {
      bgAudioRef.current?.pause();
      celebrationAudioRef.current?.pause();
    } catch (e) {}
  };

  // ══════════════════════════════════════════════
  // Canvas particles
  // ══════════════════════════════════════════════
  useEffect(() => {
    if (gatewayUnlocked) {
      const timer = setTimeout(() => {
        initCanvas();
      }, 100);
      window.addEventListener('resize', initCanvas);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', initCanvas);
        if (canvasAnimIdRef.current) cancelAnimationFrame(canvasAnimIdRef.current);
      };
    }
  }, [gatewayUnlocked]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particlesArrayRef.current.length - 1; i >= 0; i--) {
        const p = particlesArrayRef.current[i];
        p.x += p.vx; p.y += p.vy;
        if (p.type === 'confetti') {
          p.vy += 0.045; p.angle += p.rotationSpeed;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        } else {
          p.vy += 0.08; p.alpha -= 0.011;
          ctx.fillStyle = `rgba(${p.colorRgb},${p.alpha})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        }
        if (p.y > canvas.height + 20 || (p.type === 'firework' && p.alpha <= 0)) {
          particlesArrayRef.current.splice(i, 1);
        }
      }
      canvasAnimIdRef.current = requestAnimationFrame(render);
    };
    if (canvasAnimIdRef.current) cancelAnimationFrame(canvasAnimIdRef.current);
    canvasAnimIdRef.current = requestAnimationFrame(render);
  };

  const triggerCanvasConfetti = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const colors = ['#E11D48', '#FDA4AF', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#F472B6', '#FBBF24'];
    for (let i = 0; i < 100; i++) {
      particlesArrayRef.current.push({
        type: 'confetti',
        x: Math.random() * canvas.width, y: -10,
        vx: (Math.random() - 0.5) * 5, vy: Math.random() * 3 + 2,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360, rotationSpeed: (Math.random() - 0.5) * 0.06,
      });
    }
  }, []);

  const triggerCanvasFireworks = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const audio = new Audio(fireworkSound);
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Autoplay blocked:', err));

    const fColors = ['225,29,72', '251,191,36', '59,130,246', '16,185,129', '139,92,246', '244,114,182'];
    for (let e = 0; e < 5; e++) {
      const cx = canvas.width * (0.15 + Math.random() * 0.7);
      const cy = canvas.height * (0.1 + Math.random() * 0.4);
      const color = fColors[Math.floor(Math.random() * fColors.length)];
      for (let i = 0; i < 50; i++) {
        const speed = Math.random() * 8 + 2;
        const angle = Math.random() * Math.PI * 2;
        particlesArrayRef.current.push({
          type: 'firework', x: cx, y: cy,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2,
          size: Math.random() * 2.5 + 1.5, colorRgb: color, alpha: 1,
        });
      }
    }
  }, []);

  // ══════════════════════════════════════════════
  // Action handlers — no scrollTo calls here
  // (scrolling is handled by useEffects above)
  // ══════════════════════════════════════════════

  const handleBlowCandles = () => {
    setCandlesBlown(true);  // triggers step transition
    setIsPlayingMusic(true);
    setActiveMusicSource('birthday');

    // Instantly play celebration audio on candle blow gesture
    if (celebrationAudioRef.current) {
      celebrationAudioRef.current.currentTime = 0;
      celebrationAudioRef.current.play().catch(err => console.log('Birthday song playback:', err));
    }
    try {
      bgAudioRef.current?.pause();
    } catch (e) {}

    // Start a 3-second celebration countdown before showing the Cut the Cake button
    setCelebrationCountdown(3);
    
    const interval = setInterval(() => {
      setCelebrationCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          triggerCelebrationEffects();
          return null; // hide countdown
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerCelebrationEffects = () => {
    setCameraShakeActive(true);
    setTimeout(() => setCameraShakeActive(false), 1200);
    triggerCanvasFireworks();
    triggerCanvasConfetti();
    setShowCutButton(true);  // show cut cake button immediately when countdown ends
  };

  const handleCutCake = () => {
    if (slicingActive || cakeCut) return;
    setSlicingActive(true);
    // Wait 1.3s for the knife cut animation to complete before splitting cake halves
    setTimeout(() => {
      setCakeCut(true);
      setSlicingActive(false);
      
      // Trigger the premium fireworks celebration & balloon blasting effects for cake cutting
      setCakeCutEffectsActive(true);
      setTimeout(() => {
        setCakeCutEffectsActive(false);
      }, 5000); // active for 5 seconds
    }, 1300);
  };

  // Triggered by clicking the glowing arrow after cake cut -> Scrolls to Cake Feeding (SurpriseReveal)
  const handleArrowClick = () => {
    setShowArrow(false);
    setSurpriseOpened(true);   // triggers useEffect scroll to SurpriseReveal (Cake Feeding)
    triggerCanvasConfetti();
  };

  // Triggered by "Read My Letter" in SurpriseReveal
  const handleOpenLoveLetter = () => {
    setLetterStarted(true);   // triggers useEffect scroll + typewriter
    scrollTo(loveLetterRef);
    // Switch to ambient music
    if (activeMusicSource !== 'ambient' && bgAudioRef.current) {
      celebrationAudioRef.current?.pause();
      
      try {
        const playPromise = bgAudioRef.current?.play();
        if (playPromise !== undefined && typeof playPromise.then === 'function') {
          playPromise.catch(() => { });
        }
      } catch (e) {}

      setIsPlayingMusic(true);
      setActiveMusicSource('ambient');
    }
  };

  const handleUnlockMemories = () => {
    triggerRevealMemories();
  };

  const triggerRevealMemories = () => {
    setMemoriesUnlocked(true); // triggers useEffect scroll
    setTimeout(() => {
      setHeartRainActive(true);
      setTimeout(() => {
        setHeartRainActive(false);
      }, 2000); // active for 2 seconds
    }, 1500);  // trigger rain of hearts when user moves to memory section
  };

  const handleMemoryUnlockNotification = (title) => {
    setTimeout(() => {
        setHeartRainActive(false);
      }, 2000);
    try {
      const socketUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
          ? 'http://127.0.0.1:5000'
          : window.location.origin);
      const socket = io(socketUrl);
      socket.emit('live-action', {
        room: instanceId,
        action: 'memory-unlocked',
        data: { title }
      });
    } catch (e) {}
  };

  const handleFeedbackYes = () => {
    setFeedbackAnswer('yes');
    triggerCanvasConfetti();
    triggerCanvasFireworks();
  };
  const handleFeedbackNo = () => setShowWarningPopup(true);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    setSubmittingResponse(true);
    try {
      const data = await api.submitRecipientResponse(instanceId, {
        recipientResponse: responseText,
        feedbackLiked: feedbackAnswer === 'yes'
      });
      if (data.success) {
        setResponseSubmitted(true);
        setResponseText('');
      } else {
        alert(data.message || 'Failed to submit.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending message.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // ── Audio URLs ──
  const finalBgMusicUrl = config.backgroundMusic || config.musicUrl || defaultAudioUrl;
  const birthdaySongUrl = config.birthdaySongUrl || config.birthdaySong ||
    'https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Happy_Birthday_Song_Instrumental_Loop_opw49s.mp3';

  // ── Theme Resolution ──
  const rawTheme = String(
    config.theme || 
    instance.themeSlug || 
    instance.demo?.themeSlug || 
    instance.categorySlug || 
    'birthday-dark'
  ).toLowerCase();

  let activeTheme = 'pink';
  if (rawTheme.includes('pastel')) {
    activeTheme = 'pastel';
  } else if (rawTheme.includes('dark')) {
    activeTheme = 'dark';
  } else {
    activeTheme = 'pink';
  }

  const passwordEnabled = Boolean(config.passwordEnabled || config.securityAnswer || config.password);
  const correctPassword = config.password || config.securityAnswer || '';

  // ══════════════════════════════════════════════
  // GATEWAY SCREEN
  // ══════════════════════════════════════════════
  if (!gatewayUnlocked) {
    if (passwordEnabled) {
      return (
        <PasswordUnlockGateway
          onSuccess={() => setGatewayUnlocked(true)}
          correctPassword={correctPassword}
          passwordHint={config.passwordHint || config.securityHint || ''}
          unlockHeading={config.unlockHeading || 'Unlock Your Birthday Surprise'}
          unlockSubtitle={config.unlockSubtitle || 'This experience was created only for you.'}
          wrongPasswordMessage={config.wrongPasswordMessage || 'That doesn\'t seem right ❤️'}
          successMessage={config.successMessage || 'Access Granted! Unlocking your magical birthday...'}
          backgroundImage={config.backgroundImage || (config.photos && config.photos[0]) || ''}
          senderName={config.senderName || 'With Love'}
          recipientName={config.recipientName || 'Birthday Star'}
          activeTheme={activeTheme}
          enableNumericKeypad={config.enableNumericKeypad !== false}
          musicUrl={config.birthdaySong || config.musicUrl || ''}
        />
      );
    }

    return (
      <div className={`fixed inset-0 z-50 bday-wrapper bday-theme-${activeTheme} flex flex-col items-center justify-center p-6 text-center select-none`}>
        <LivingBackground />
        <HeartsBackground activeTheme={activeTheme} />
        <div className="relative z-10 space-y-6 max-w-xs w-full p-8 rounded-[32px] bday-card animate-slide-up">
          <div className="w-16 h-16 bday-card rounded-2xl flex items-center justify-center mx-auto animate-heartbeat">
            <Gift className="w-8 h-8 bday-text-accent" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-romantic text-4xl bday-text-title">A Surprise Awaits</h2>
            <p className="text-xs bday-text-sub leading-relaxed">
              Turn up your volume and step into this beautiful journey.
            </p>
          </div>
          <button
            onClick={() => { setGatewayUnlocked(true); startAmbientMusic(); }}
            className="w-full py-4 bday-btn text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            ✨ Enter Journey
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // MAIN SINGLE PAGE
  // ══════════════════════════════════════════════
  return (
    <div
      className={`bday-wrapper bday-theme-${activeTheme} relative select-none ${cameraShakeActive ? 'animate-shake' : ''}`}
      style={{ minHeight: '100vh' }}
    >
      {!isLocked && <HangingBalloons />}
      <HeartsBackground activeTheme={activeTheme} />
      <LivingBackground />

      <audio ref={bgAudioRef} src={finalBgMusicUrl} loop preload="auto" crossOrigin="anonymous" />
      <audio ref={celebrationAudioRef} src={birthdaySongUrl} preload="auto" crossOrigin="anonymous" />
      
      {/* Hidden YouTube Iframe mount container */}
      <div id="yt-player" className="hidden pointer-events-none" />

      {/* Particle canvas — fixed so it sits above everything */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40 w-full h-full" />



      {/* Socket popup */}
      {socketPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl border border-white/15 px-7 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-slide-up max-w-sm w-full">
          <Heart className="w-5 h-5 text-rose-400 fill-rose-400 shrink-0" />
          <p className="text-sm font-black text-white leading-tight">{socketPopup}</p>
        </div>
      )}

      {/* Music toggle */}
      <button
        onClick={toggleMusicMute}
        className="fixed top-5 right-5 z-50 p-3 bg-white/8 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/15 hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        {isPlayingMusic
          ? <Volume2 className="w-4 h-4 text-rose-300" />
          : <VolumeX className="w-4 h-4 text-slate-400" />}
      </button>

      {/* ════════════════════════════════
          SECTION 0 — Locked countdown
      ════════════════════════════════ */}
      {isLocked && (
        <LockedEntry
          currentTime={currentTime}
          timeLeft={timeLeft}
          recipientName={config.recipientName || 'My Love'}
          activeTheme={activeTheme}
          onCompleteUnlock={() => {
            setIsLocked(false);
            setJourneyStep(1);
            triggerCanvasFireworks();
            triggerCanvasConfetti();
            startAmbientMusic();
          }}
        />
      )}

      {/* ════════════════════════════════
          SECTION 1+2 — Cake (lit / blown)
      ════════════════════════════════ */}
      {!isLocked && (
        <div ref={cakeSectionRef} className="relative z-10">
          <BirthdayCake
            config={config}
            candlesBlown={candlesBlown}
            handleBlowCandles={handleBlowCandles}
            guestCheers={guestCheers}
            showOpenSurpriseButton={showCutButton}
            handleCutCake={handleCutCake}
            journeyStep={candlesBlown ? 2 : 1}
            celebrationCountdown={celebrationCountdown}
          />
        </div>
      )}

      {/* ════════════════════════════════
          SECTION 3 — Cake cutting + arrow
      ════════════════════════════════ */}
      {(cakeCut || slicingActive) && (
        <Section>
          <div ref={cakeCuttingRef} className="relative z-10">
            <CakeCutting
              slicingActive={slicingActive}
              cakeCut={cakeCut}
              onCutComplete={handleCutCake}
            />

            {/* Glowing arrow — replaces "Open Your Surprise" button */}
            {cakeCut && showArrow && (
              <GlowArrow
                onClick={handleArrowClick}
                label="I have a beautiful surprise planned for you…"
              />
            )}
          </div>
        </Section>
      )}

      {/* ════════════════════════════════
          SECTION 4 — Surprise reveal
      ════════════════════════════════ */}
      {surpriseOpened && (
        <Section>
          <div ref={surpriseRevealRef} className="relative z-10">
            <SurpriseReveal
              config={config}
              handleOpenLoveLetter={handleOpenLoveLetter}
            />
          </div>
        </Section>
      )}

      {/* ════════════════════════════════
          SECTION 5 — Love letter
      ════════════════════════════════ */}
      {letterStarted && (
        <Section>
          <div ref={loveLetterRef} className="relative z-10">
            <LoveLetter
              recipientName={config.recipientName}
              letterTypedText={letterTypedText || (config.letterText || config.message || config.finalMessage || '')}
              letterTypingComplete={letterTypingComplete || Boolean(letterTypedText || config.letterText || config.message || config.finalMessage)}
              onNext={handleUnlockMemories}
            />
          </div>
        </Section>
      )}

      {/* ════════════════════════════════
          SECTION 5.5 — Security Lock Gate
      ════════════════════════════════ */}
      {showSecurityGate && (
        <Section>
          <div id="security-gate-section" className="relative z-10 py-12">
            <SecurityUnlock
              question={config.securityQuestion}
              answer={config.securityAnswer}
              hint={config.securityHint}
              onSuccess={() => {
                setShowSecurityGate(false);
                triggerRevealMemories();
              }}
            />
          </div>
        </Section>
      )}

      {/* ════════════════════════════════
          SECTION 6 — Memories + rest
      ════════════════════════════════ */}
      {memoriesUnlocked && (
        <Section>
          <div ref={memoriesRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

            {/* 6.1 Memory timeline */}
            {(config.photos?.length > 0 || config.memories?.length > 0) && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-305 text-[10px] font-black uppercase tracking-widest inline-block">
                    💖 Our Journey
                  </span>
                  <h2 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight"
                    style={{ textShadow: '0 0 30px rgba(225,29,72,0.3)' }}>
                    Our Story Timeline
                  </h2>
                  <p className="text-sm text-rose-200/50 max-w-md mx-auto leading-relaxed">
                    A slow walk down memory lane, remembering the beautiful steps that brought us here.
                  </p>
                </div>
                <MemoryTimeline config={config} onMemoryUnlock={handleMemoryUnlockNotification} />
              </div>
            )}

            {/* 6.2 Feedback — above polaroids */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[10px] font-black uppercase tracking-widest inline-block">
                  💭 Quick Question
                </span>
              </div>
              <Feedback
                feedbackAnswer={feedbackAnswer}
                finalPromiseMessage={finalPromiseMessage}
                handleFeedbackYes={handleFeedbackYes}
                handleFeedbackNo={handleFeedbackNo}
                showWarningPopup={showWarningPopup}
                setShowWarningPopup={setShowWarningPopup}
                setFinalPromiseMessage={setFinalPromiseMessage}
              />
            </div>

            {/* 6.3 Polaroid snapshots — with increased gap */}
            <div className="pt-16 sm:pt-24">
              <PhotoCollage config={config} />
            </div>

            {/* 6.4 Final wish */}
            <div className="max-w-2xl mx-auto text-center space-y-5">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-heartbeat mx-auto" />
              <h3 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-rose-950">
                My Final Wish
              </h3>
              <p className="font-serif text-2xl sm:text-3xl text-rose-900 font-bold leading-relaxed italic">
                "{config.finalMessage || config.message || 'No matter where life takes us, I promise to always cheer for your happiness, hold your hand in silent support, and treasure every laugh we share. Happy Birthday!'}"
              </p>
              <p className="text-sm text-rose-800 font-semibold">
                With all my love,<br />
                <span className="font-serif text-3xl text-rose-600 font-extrabold inline-block mt-1">
                  {config.senderName || 'Your Planner'}
                </span>
              </p>
            </div>


            {/* 6.6 Send message (Premium Only) */}
            {instance.tier?.toLowerCase() === 'premium' && (
              <SendMessage
                instance={instance}
                responseSubmitted={responseSubmitted}
                responseText={responseText}
                setResponseText={setResponseText}
                handleSendMessage={handleSendMessage}
                submittingResponse={submittingResponse}
              />
            )}

            {/* Footer */}
            <div className="text-center pt-4 border-t border-white/5">
              <p className="font-romantic text-lg text-rose-300/25">
                Designed with Love · AnKa
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* Reusable Celebration Animations Overlay */}
      <FireworksCelebration active={cakeCutEffectsActive} duration={5} />
      <BalloonBlasting active={cakeCutEffectsActive} duration={5} />
      <RainOfHearts active={heartRainActive} duration={5} />
    </div>
  );
}
