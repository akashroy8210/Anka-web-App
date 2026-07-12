import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { starMessages, timelineMemories, thingsILove, futureDreams } from "./data/placeholderData";
import "./index.css";

// Components
import BackgroundParticles from "./components/BackgroundParticles";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Timeline from "./components/Timeline";
import ThingsILove from "./components/ThingsILove";
import MoodGarden from "./components/MoodGarden";
import MessageStars from "./components/MessageStars";
import MemoryGallery from "./components/MemoryGallery";
import FutureDreams from "./components/FutureDreams";
import VoiceNote from "./components/VoiceNote";
import OpenWhen from "./components/OpenWhen";
import FinalScreen from "./components/FinalScreen";

// Admin & Real-time Sockets integration
import { SocketProvider, useSocket } from "./contexts/SocketContext";
import { useCustomConfig } from "./contexts/CustomConfigContext";

// Overlays
import HeartRain from "./components/overlays/HeartRain";
import ShootingStarAlert from "./components/overlays/ShootingStarAlert";
import KnockKnockAlert from "./components/overlays/KnockKnockAlert";
import CountdownOverlay from "./components/overlays/CountdownOverlay";
import QuoteOverlay from "./components/overlays/QuoteOverlay";
import VoiceNoteAlert from "./components/overlays/VoiceNoteAlert";

export function GirlfriendApp() {
  const configContext = useCustomConfig();
  const { config, isEditing } = configContext || {};

  const [theme, setTheme] = useState("dark"); // Default theme: Midnight Sky (dark)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [welcomeEntered, setWelcomeEntered] = useState(isEditing || false);
  const [loading, setLoading] = useState(!isEditing); // Skip loading screen in edit mode
  const [loadingText, setLoadingText] = useState("Creating our little world...");
  const [notifications, setNotifications] = useState([]);

  // Socket state hook
  const socketContext = useSocket();
  const {
    heartRainActive,
    shootingStarActive,
    setShootingStarActive,
    shootingStarMessage,
    knockKnockActive,
    setKnockKnockActive,
    activeVoiceNote,
    setActiveVoiceNote,
    countdownActive,
    setCountdownActive,
    countdownDuration,
    countdownMessage,
    activeQuote,
    finaleTriggered,
    setFinaleTriggered,
    themeOverride,
    liveMessages
  } = socketContext || {};

  const finalScreenData = config?.finalScreen || {
    title: "Biwipie,",
    letter: [
      "I know today wasn't the best day.",
      "Honestly, I didn't make this because I wanted to fix anything.",
      "I just wanted to spend some time with you. That's all.",
      "And if you smiled even once while looking through this, then I'm happy."
    ],
    signoff: "— Your idiot ❤️"
  };

  // Force socket theme override
  useEffect(() => {
    if (themeOverride) {
      setTheme(themeOverride);
    }
  }, [themeOverride]);

  // Loading text cycling effect
  useEffect(() => {
    if (!loading) return;

    const texts = [
      "Gathering stars...",
      "Unfolding old letters...",
      "Brewing coffee...",
      "Lighting the candles...",
      "Just for you..."
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < texts.length) {
        setLoadingText(texts[index]);
        index++;
      } else {
        setLoading(false);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [loading]);

  // Simulated Live Socket.io message feed
  useEffect(() => {
    if (!welcomeEntered) return;

    const showNotification = () => {
      // Pick a random comforting message
      const messageIndex = Math.floor(Math.random() * starMessages.length);
      const message = starMessages[messageIndex];
      const id = Date.now() + Math.random();

      const newNotification = {
        id,
        message
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Remove after 6 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 6000);
    };

    // First live whisper after 6 seconds of entering
    const initialTimeout = setTimeout(showNotification, 6000);

    // Repeat every 32 seconds
    const interval = setInterval(showNotification, 32000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [welcomeEntered]);

  const handleEnter = () => {
    setWelcomeEntered(true);
    setIsMusicPlaying(true); // Autostart music on click interaction
    
    // Smooth scroll down slightly after fade-in
    setTimeout(() => {
      const el = document.getElementById("timeline");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 800);
  };

  const handleReplay = () => {
    setWelcomeEntered(false);
    setIsMusicPlaying(false);
    setTheme("dark"); // Reset to starlit sky on replay
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 bg-gradient-to-tr from-bg-from via-bg-via to-bg-to text-text-primary ${theme === "light" ? "theme-light" : "theme-dark"}`}>
      {/* Loading Screen Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-gradient-to-tr from-bg-from via-bg-via to-bg-to text-text-primary"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="mb-6"
            >
              <Heart className="w-16 h-16 text-romantic-pink fill-current" />
            </motion.div>
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-light tracking-widest text-lavender-glow italic font-sans"
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Ambient Canvas Elements */}
      <BackgroundParticles theme={theme} />

      {/* Custom Trailing Sparkles Cursor */}
      <CustomCursor theme={theme} />

      {/* Header Navigation controls */}
      <Navbar
        isMusicPlaying={isMusicPlaying}
        setIsMusicPlaying={setIsMusicPlaying}
        welcomeEntered={welcomeEntered}
        theme={theme}
        setTheme={setTheme}
        isFinale={finaleTriggered}
      />

      {/* Main App Layout Grid */}
      <main className="relative w-full flex flex-col items-center">
        {/* SECTION 1: Welcome Hero */}
        <Welcome onEnter={handleEnter} theme={theme} />

        {/* Dynamic content reveals after clicking Enter */}
        <AnimatePresence>
          {welcomeEntered && (
            <motion.div
              key="content-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1.5 } }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center relative z-10"
            >
              {/* Divider lines between pages */}
              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 2: Timeline */}
              <Timeline theme={theme} />

              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 3: Things I Love */}
              <ThingsILove theme={theme} />

              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 4: Mood Garden */}
              <MoodGarden theme={theme} />

              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 5: Message Stars */}
              <MessageStars theme={theme} />

              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 6: Memory Gallery */}
              <MemoryGallery theme={theme} />

              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 7: Future Dreams */}
              <FutureDreams theme={theme} />

              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 8: Voice Note */}
              <VoiceNote theme={theme} />

              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 9: Open When */}
              <OpenWhen theme={theme} />

              <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-divider-color to-transparent my-10" />

              {/* SECTION 10: Final Screen */}
              <FinalScreen onReplay={handleReplay} theme={theme} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Real-time overlays controlled by Bubu */}
      {heartRainActive && <HeartRain />}
      
      <AnimatePresence>
        {shootingStarActive && (
          <ShootingStarAlert 
            message={shootingStarMessage} 
            onClose={() => setShootingStarActive && setShootingStarActive(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {knockKnockActive && (
          <KnockKnockAlert 
            onClose={() => setKnockKnockActive && setKnockKnockActive(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {countdownActive && (
          <CountdownOverlay 
            duration={countdownDuration} 
            message={countdownMessage} 
            onClose={() => setCountdownActive && setCountdownActive(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeQuote && (
          <QuoteOverlay 
            text={activeQuote} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeVoiceNote && (
          <VoiceNoteAlert 
            audioUrl={activeVoiceNote} 
            onClose={() => setActiveVoiceNote && setActiveVoiceNote(null)} 
          />
        )}
      </AnimatePresence>

      {/* Climax Letter Reveal Curtain Overlay */}
      <AnimatePresence>
        {finaleTriggered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl text-white overflow-hidden pointer-events-auto"
          >
            {/* Climax Elements */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center max-w-lg w-full text-center space-y-8 relative z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                className="relative text-romantic-pink drop-shadow-[0_0_20px_rgba(248,200,220,0.6)]"
              >
                <Heart className="w-16 h-16 fill-current text-romantic-pink" />
                <span className="absolute inset-0 w-16 h-16 bg-romantic-pink fill-current animate-ping opacity-25 rounded-full" />
              </motion.div>

              <h2 className="text-2xl md:text-4xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-romantic-pink via-lavender-glow to-amber-highlight drop-shadow-lg">
                A Message From Bubu ✨
              </h2>

              <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-lg w-full text-left space-y-6 font-sans text-text-primary border border-glass-border shadow-2xl relative bg-white/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-romantic-pink/5 to-lavender-glow/5 blur-xl rounded-full" />
                
                <h3 className="text-xl font-bold font-display text-romantic-pink">
                  {finalScreenData.title}
                </h3>
                
                <div className="space-y-4 text-base md:text-lg text-text-secondary leading-relaxed font-light italic">
                  {finalScreenData.letter.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <div className="text-right text-xl font-accent text-romantic-pink pt-4 border-t border-divider-color">
                  {finalScreenData.signoff}
                </div>
              </div>

              <button
                onClick={() => setFinaleTriggered && setFinaleTriggered(false)}
                className="px-6 py-2.5 rounded-full border border-glass-border hover:border-romantic-pink text-text-secondary hover:text-romantic-pink text-xs font-semibold transition-all cursor-pointer font-sans pointer-events-auto"
              >
                Close Letter
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Message Notifications (Socket.io UI spec) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {/* Real-time messages sent by Bubu */}
          {liveMessages && liveMessages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 35, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.35 } }}
              className="pointer-events-auto p-4 rounded-2xl bg-white/12 border border-romantic-pink shadow-[0_0_20px_rgba(248,200,220,0.3)] backdrop-blur-md flex items-start gap-3 w-full"
            >
              <div className="w-8 h-8 rounded-full bg-romantic-pink/20 flex items-center justify-center text-romantic-pink text-lg flex-shrink-0">
                💝
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-romantic-pink font-sans tracking-widest uppercase">
                    Bubu Whispered
                  </span>
                  <span className="text-[10px] text-white/50 font-sans">
                    now
                  </span>
                </div>
                <p className="text-sm font-display text-white leading-relaxed italic">
                  "{m.text}"
                </p>
              </div>
            </motion.div>
          ))}

          {/* Simulated whispers */}
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 35, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.35 } }}
              className="pointer-events-auto p-4 rounded-2xl bg-white/12 border border-amber-highlight shadow-[0_0_20px_var(--glow-shadow)] backdrop-blur-md flex items-start gap-3 w-full"
            >
              <div className="w-8 h-8 rounded-full bg-amber-highlight/20 flex items-center justify-center text-amber-highlight text-lg flex-shrink-0">
                ✨
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-highlight font-sans tracking-widest uppercase">
                    Live Whisper
                  </span>
                  <span className="text-[10px] text-white/50 font-sans">
                    now
                  </span>
                </div>
                <p className="text-sm font-display text-white leading-relaxed italic">
                  "{n.message}"
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

import Landing from "./pages/Landing";
import { CustomConfigProvider } from "./contexts/CustomConfigContext";

function GirlfriendAppWrapper({ instanceId }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const serverUrl = window.location.hostname === "localhost" ? "http://localhost:8080" : "https://surprisebabebackend.onrender.com";
    fetch(`${serverUrl}/api/instances/${instanceId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Instance not found");
        return res.json();
      })
      .then((data) => {
        setConfig(data.config);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [instanceId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0B1E] text-white font-sans">
        <Heart className="w-12 h-12 text-romantic-pink animate-pulse mb-4" />
        <p className="text-sm font-semibold tracking-wider animate-bounce text-text-secondary">Retrieving Sona's world...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0B1E] text-white p-6 text-center font-sans">
        <div className="glass-panel p-8 rounded-3xl max-w-sm space-y-4">
          <span className="text-4xl">🌌</span>
          <h2 className="text-xl font-bold text-romantic-pink font-display">Starlit Pocket Missing</h2>
          <p className="text-sm text-text-secondary leading-relaxed font-light">
            This little pocket of stardust hasn't been created yet, or it floated away 😔
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 rounded-full bg-romantic-pink text-white font-semibold text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Create Your World
          </a>
        </div>
      </div>
    );
  }

  return (
    <CustomConfigProvider initialConfig={config} isEditingMode={false}>
      <SocketProvider isAdmin={false}>
        <GirlfriendApp />
      </SocketProvider>
    </CustomConfigProvider>
  );
}

export function VirtualDateSurprise({ instance, instanceId }) {
  const config = instance.config || {};

  // Build dynamic timeline memories list
  let timeline = [...timelineMemories];
  if (config.vTimeline && config.vTimeline.length > 0) {
    timeline = config.vTimeline.map((item, idx) => ({
      id: idx + 1,
      date: item.date,
      title: item.title,
      description: item.description,
      image: item.imageUrl || item.image
    }));
  } else {
    if (config.vMemory1Title || config.vMemory1Desc || config.vMemory1Date) {
      timeline[0] = {
        id: 1,
        date: config.vMemory1Date || "Our First Meet",
        title: config.vMemory1Title || "The First Meeting",
        description: config.vMemory1Desc || "The start of us...",
        image: timeline[0].image
      };
    }
    if (config.vMemory2Title || config.vMemory2Desc || config.vMemory2Date) {
      timeline[1] = {
        id: 2,
        date: config.vMemory2Date || "Cozy Date",
        title: config.vMemory2Title || "A Beautiful Day Together",
        description: config.vMemory2Desc || "Spending precious time...",
        image: timeline[1].image
      };
    }
    if (config.vMemory3Title || config.vMemory3Desc || config.vMemory3Date) {
      timeline[2] = {
        id: 3,
        date: config.vMemory3Date || "Special Moment",
        title: config.vMemory3Title || "Realizing Forever",
        description: config.vMemory3Desc || "I fell for you...",
        image: timeline[2].image
      };
    }
  }

  // Build dynamic whispers/star messages
  const messages = [...starMessages];
  if (config.vWhisper1) messages[0] = config.vWhisper1;
  if (config.vWhisper2) messages[1] = config.vWhisper2;
  if (config.vWhisper3) messages[2] = config.vWhisper3;

  // Build dynamic things I love list
  const loveReasons = config.thingsILove && config.thingsILove.length > 0
    ? config.thingsILove
    : thingsILove;

  // Build dynamic future dreams list
  const dreamsList = config.futureDreams && config.futureDreams.length > 0
    ? config.futureDreams
    : futureDreams;
  
  // CustomConfig defaults merged with database config:
  const customConfig = {
    welcome: {
      title: `Hey My Love ${config.recipientName || 'Sweetheart'} ❤️`,
      subtitle: config.message ? "A starlit pocket surprise has been crafted for you." : "I know today may feel heavy.",
      line1: "You don't have to smile.",
      line2: "You don't have to explain.",
      line3: "You don't even have to talk.",
      prompt: "Just stay here with me for a little while.",
      buttonText: "Enter Our Little World"
    },
    voiceNote: {
      intro: config.vVoiceIntro || "Bubu, I know today wasn't the easiest day, so I thought I'd stay here with you for a bit. Put on your headphones, close your eyes, and play this.",
      audioUrl: config.vVoiceUrl || ""
    },
    finalScreen: {
      title: `${config.recipientName || 'Biwipie'},`,
      letter: [
        config.message || "I know today wasn't the best day. Honestly, I didn't make this because I wanted to fix anything. I just wanted to spend some time with you. That's all. And if you smiled even once while looking through this, then I'm happy."
      ],
      signoff: `— ${config.senderName || 'Your idiot'} ❤️`
    },
    timeline,
    starMessages: messages,
    thingsILove: loveReasons,
    futureDreams: dreamsList
  };

  // Map database photos list:
  if (config.photos && config.photos.length > 0) {
    customConfig.galleryPhotos = config.photos.map((url, idx) => ({
      id: idx + 1,
      url,
      caption: `Captured Memory #${idx + 1}`
    }));
  }

  return (
    <CustomConfigProvider initialConfig={customConfig} isEditingMode={false}>
      <SocketProvider isAdmin={false} customInstanceId={instanceId}>
        <GirlfriendApp />
      </SocketProvider>
    </CustomConfigProvider>
  );
}

export default function App() {
  const path = window.location.pathname;
  const pathParts = path.split("/").filter(Boolean);

  // Route: Landing/Customizer Page
  if (path === "/" || path === "") {
    return <Landing />;
  }



  // Route: Sona's dynamic date experience website /v/:id
  if (pathParts[0] === "v" && pathParts[1]) {
    const instanceId = pathParts[1];
    return <GirlfriendAppWrapper instanceId={instanceId} />;
  }

  // Fallback
  return <Landing />;
}
