import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Volume2, VolumeX, Gift, ChevronDown } from 'lucide-react';
import { io } from 'socket.io-client';
import { api } from '../../services/api.service';

import '../../styles/birthday-animations.css';

import LivingBackground from '../../components/animations/LivingBackground';
import LoveLetter from '../../components/shared/LoveLetter';
import PhotoCollage from '../../components/shared/PhotoCollage';
import MemoryTimeline from '../../components/shared/MemoryTimeline';

import LockedEntry from './LockedEntry';
import BirthdayCake from './BirthdayCake';
import CakeCutting from './CakeCutting';
import SurpriseReveal from './SurpriseReveal';
import Feedback from './Feedback';
import SendMessage from './SendMessage';

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

/* ─── Floating + broken hearts backdrop (removed completely) ─── */
function HeartsBackground() {
  return null;
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

const defaultAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

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

  // ── Progressive reveal flags ──
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [slicingActive, setSlicingActive] = useState(false);
  const [surpriseOpened, setSurpriseOpened] = useState(false);
  const [letterStarted, setLetterStarted] = useState(false);
  const [memoriesUnlocked, setMemoriesUnlocked] = useState(false);

  // ── Effects ──
  const [cameraShakeActive, setCameraShakeActive] = useState(false);
  const [showCutButton, setShowCutButton] = useState(false);   // shows after cheers
  const [showArrow, setShowArrow] = useState(false);           // shows after cut
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

  // ── Typewriter — starts ONLY after letterStarted + section is mounted ──
  useEffect(() => {
    if (!letterStarted) return;

    // Clean up any previous interval
    if (letterIntervalRef.current) clearInterval(letterIntervalRef.current);

    const fullText = config.message ||
      'You are the heart of all my happy moments. I created this journey to remind you of how deeply you are loved, and how special you make every single day. No matter where life takes us, know that you are always cherished. Happy Birthday! 🎂';

    let index = 0;
    setLetterTypedText('');
    setLetterTypingComplete(false);

    // Small delay so the section animates in first
    const startDelay = setTimeout(() => {
      letterIntervalRef.current = setInterval(() => {
        if (index < fullText.length) {
          const char = fullText.charAt(index);
          setLetterTypedText(prev => prev + char);
          index++;
        } else {
          clearInterval(letterIntervalRef.current);
          setLetterTypingComplete(true);
        }
      }, 38);
    }, 600);

    return () => {
      clearTimeout(startDelay);
      if (letterIntervalRef.current) clearInterval(letterIntervalRef.current);
    };
  }, [letterStarted, config.message]);

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

  // ══════════════════════════════════════════════
  // Socket.IO
  // ══════════════════════════════════════════════
  useEffect(() => {
    const socketUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
      ? 'http://127.0.0.1:5000'
      : window.location.origin;
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
      if (action === 'start-celebration') { setCandlesBlown(true); triggerCelebrationEffects(); }
      if (action === 'cake-reveal') { setCakeCut(true); }
    });
    return () => socket.disconnect();
  }, [instanceId]);

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
    const unlockTime = new Date(config.specialDate);
    const t = setInterval(() => {
      const diff = +unlockTime - +new Date();
      if (diff <= 0) {
        clearInterval(t);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsLocked(false);
        if (!unlockSequenceTriggered && journeyStep === 0) triggerUnlockSequence();
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
        setIsLocked(true); setJourneyStep(0);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [config.specialDate, unlockSequenceTriggered]);

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
  };

  const toggleMusicMute = () => {
    if (activeMusicSource === 'none') { startAmbientMusic(); return; }
    setIsPlayingMusic(prev => !prev);
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
    setCandlesBlown(true);  // triggers useEffect scroll
    bgAudioRef.current?.pause();
    celebrationAudioRef.current?.play()
      .then(() => { setIsPlayingMusic(true); setActiveMusicSource('birthday'); })
      .catch(() => { });
    triggerCelebrationEffects();
    // triggerCanvasConfetti();
    // triggerCanvasFireworks();
  };

  const triggerCelebrationEffects = () => {
    setCameraShakeActive(true);
    setTimeout(() => setCameraShakeActive(false), 1200);
    triggerCanvasFireworks();
    triggerCanvasConfetti();
    setTimeout(() => {
      setShowCutButton(true);  // show cut cake button
    }, 1200);
  };

  const handleCutCake = () => {
    if (slicingActive || cakeCut) return;
    setSlicingActive(true);
    // Wait 1.3s for the knife cut animation to complete before splitting cake halves
    setTimeout(() => {
      setCakeCut(true);
      setSlicingActive(false);
    }, 1300);
  };

  // Triggered by clicking the glowing arrow after cake cut
  const handleArrowClick = () => {
    setShowArrow(false);
    setSurpriseOpened(true);   // triggers useEffect scroll to SurpriseReveal
    triggerCanvasConfetti();
  };

  // Triggered by "Read My Letter" in SurpriseReveal
  const handleOpenLoveLetter = () => {
    setLetterStarted(true);   // triggers useEffect scroll + typewriter
    // Switch to ambient music
    if (activeMusicSource !== 'ambient' && bgAudioRef.current) {
      celebrationAudioRef.current?.pause();
      bgAudioRef.current?.play().catch(() => { });
      setIsPlayingMusic(true);
      setActiveMusicSource('ambient');
    }
  };

  const handleUnlockMemories = () => {
    setMemoriesUnlocked(true); // triggers useEffect scroll
  };

  const handleMemoryUnlockNotification = (title) => {
    triggerCanvasConfetti();
    triggerCanvasFireworks();
    try {
      const socketUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://127.0.0.1:5000'
        : window.location.origin;
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
  const birthdaySongUrl = config.birthdaySong ||
    'https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Happy_Birthday_Song_Instrumental_Loop_opw49s.mp3';

  // ══════════════════════════════════════════════
  // GATEWAY SCREEN
  // ══════════════════════════════════════════════
  if (!gatewayUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#08050f] text-rose-100 flex flex-col items-center justify-center p-6 text-center select-none">
        <LivingBackground />
        <HeartsBackground />
        <div className="relative z-10 space-y-6 max-w-xs w-full p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_30px_80px_rgba(225,29,72,0.15)] animate-slide-up">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto animate-heartbeat">
            <Gift className="w-8 h-8 text-rose-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-romantic text-4xl text-white">A Surprise Awaits</h2>
            <p className="text-xs text-rose-200/50 leading-relaxed">
              Turn up your volume and step into this beautiful journey.
            </p>
          </div>
          <button
            onClick={() => { setGatewayUnlocked(true); startAmbientMusic(); }}
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_50px_rgba(225,29,72,0.6)] transition-all hover:scale-[1.02] cursor-pointer border border-rose-500/30"
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
      className={`bg-[#08050f] text-rose-100 relative select-none ${cameraShakeActive ? 'animate-shake' : ''}`}
      style={{ minHeight: '100vh' }}
    >
      {!isLocked && <HangingBalloons />}
      <HeartsBackground />
      <LivingBackground />

      <audio ref={bgAudioRef} src={finalBgMusicUrl} loop />
      <audio ref={celebrationAudioRef} src={birthdaySongUrl} />
      
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
          setJourneyStep={setJourneyStep}
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
              letterTypedText={letterTypedText}
              letterTypingComplete={letterTypingComplete}
              onNext={handleUnlockMemories}
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
                  <h2 className="font-heading font-black text-5xl sm:text-6xl text-white tracking-tight"
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
              <Heart className="w-8 h-8 text-rose-400 fill-rose-400 animate-heartbeat mx-auto" />
              <h3 className="font-romantic text-5xl text-white"
                style={{ textShadow: '0 0 30px rgba(225,29,72,0.3)' }}>
                My Final Wish
              </h3>
              <p className="font-romantic text-3xl text-rose-100/80 leading-relaxed italic">
                "{config.finalMessage || 'No matter where life takes us, I promise to always cheer for your happiness, hold your hand in silent support, and treasure every laugh we share. Happy Birthday!'}"
              </p>
              <p className="text-sm text-rose-200/50">
                With all my love,<br />
                <span className="font-romantic text-3xl text-rose-300 inline-block mt-1">
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
    </div>
  );
}
