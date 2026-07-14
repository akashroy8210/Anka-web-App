import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MapPin, Calendar, BookOpen, Star, Volume2, VolumeX, AlertCircle, X, ChevronRight, Gift } from 'lucide-react';
import { api } from '../../services/api.service';

export default function ProposalSurprise({ config = {}, instanceId, isAdminPreview = false }) {
  const [searchParams] = useSearchParams();
  const previewStage = searchParams.get('previewStage');

  // Journey stages: 'entry', 'profile', 'favorites', 'transition', 'firstmeet', 'timeline', 'moments', 'reasons', 'letters', 'sky', 'proposal', 'celebration'
  const [stage, setStage] = useState('entry');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Real-time triggers
  const [socketPopup, setSocketPopup] = useState(null);
  const [socketNotification, setSocketNotification] = useState(null);
  const [socketLiveMsg, setSocketLiveMsg] = useState(null);
  const [showHeartRain, setShowHeartRain] = useState(false);

  // Proposal states
  const [proposalAnswer, setProposalAnswer] = useState(null); // 'Accepted' | 'Thinking'
  const [activeReason, setActiveReason] = useState(null);
  const [activeLetter, setActiveLetter] = useState(null);
  const [activeStar, setActiveStar] = useState(null);
  const [ringBoxOpen, setRingBoxOpen] = useState(false);

  const bgAudioRef = useRef(null);

  // Initialize stage based on preview query parameter
  useEffect(() => {
    if (previewStage) {
      if (previewStage === 'timeline') setStage('timeline');
      else if (previewStage === 'proposal') setStage('proposal');
      else if (previewStage === 'celebration') {
        setStage('celebration');
        setProposalAnswer('Accepted');
        setRingBoxOpen(true);
        triggerCelebration();
      }
    }
  }, [previewStage]);

  // Handle Socket.IO live triggers
  useEffect(() => {
    if (isAdminPreview) return;
    const socketUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
      ? 'http://127.0.0.1:5000'
      : window.location.origin;
    const socket = io(socketUrl);
    socket.on('connect', () => socket.emit('join-room', instanceId));
    socket.on('live-trigger', ({ action, data }) => {
      if (action === 'confetti') triggerConfetti();
      if (action === 'fireworks') triggerFireworks();
      if (action === 'heart-rain') {
        setShowHeartRain(true);
        setTimeout(() => setShowHeartRain(false), 8000);
      }
      if (action === 'popup') {
        setSocketPopup(data.text || 'Thinking of you! ❤️');
      }
      if (action === 'notification') {
        setSocketNotification(data.text);
        setTimeout(() => setSocketNotification(null), 5000);
      }
      if (action === 'live-message') {
        setSocketLiveMsg(data.text);
        setTimeout(() => setSocketLiveMsg(null), 6000);
      }
      if (action === 'play-music') {
        handlePlayMusic();
      }
    });
    return () => socket.disconnect();
  }, [instanceId, isAdminPreview]);

  const handlePlayMusic = () => {
    if (bgAudioRef.current) {
      bgAudioRef.current.play().catch(() => {});
      setIsPlayingMusic(true);
    }
  };

  const handleToggleMute = () => {
    if (bgAudioRef.current) {
      bgAudioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const triggerCelebration = () => {
    triggerConfetti();
    triggerFireworks();
    setShowHeartRain(true);
    setTimeout(() => setShowHeartRain(false), 15000);
  };

  const handleProposalSubmit = async (status) => {
    setProposalAnswer(status);
    if (status === 'Accepted') {
      triggerCelebration();
    }
    if (!isAdminPreview) {
      try {
        await api.submitRecipientResponse(instanceId, {
          proposalStatus: status,
          proposalAcceptanceTime: new Date(),
          recipientResponse: status === 'Accepted' ? 'Yes! I will marry you!' : 'Let me think...'
        });
      } catch (err) {
        console.error('Error submitting proposal response:', err);
      }
    }
  };

  const nextStage = (next) => {
    setStage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if favorites exist
  const hasFavorites = config.proposalHobbies || config.proposalFavFood || 
                       config.proposalFavSongs || config.proposalFavPlace || 
                       config.proposalFavCafe || config.proposalFavMovie || 
                       config.proposalFavFlower;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      
      {/* Background ambient music */}
      <audio
        ref={bgAudioRef}
        src={config.musicUrl || config.backgroundMusic || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
        loop
      />

      {/* Floating audio control bar */}
      {isPlayingMusic && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg">
          <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider animate-pulse">Playing</span>
          <button onClick={handleToggleMute} className="text-white hover:text-rose-400 transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Real-time heart rain overlay */}
      {showHeartRain && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-500 text-2xl"
              initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 0.8, scale: 0.5 + Math.random() }}
              animate={{ y: window.innerHeight + 50, opacity: 0 }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            >
              ❤️
            </motion.div>
          ))}
        </div>
      )}

      {/* Real-time components overlays */}
      <AnimatePresence>
        {/* Socket popup */}
        {socketPopup && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          >
            <div className="bg-slate-900 border border-rose-500/20 rounded-[32px] p-6 max-w-sm text-center space-y-4 shadow-2xl relative">
              <button onClick={() => setSocketPopup(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto"><Heart className="w-6 h-6 animate-pulse" /></div>
              <p className="text-sm font-semibold text-rose-200">{socketPopup}</p>
            </div>
          </motion.div>
        )}

        {/* Socket toaster notification */}
        {socketNotification && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-600/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full shadow-lg border border-white/20 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 animate-bounce" />
            <span>{socketNotification}</span>
          </motion.div>
        )}

        {/* Socket live floating chat message */}
        {socketLiveMsg && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-3xl max-w-xs shadow-2xl border border-white/10"
          >
            <p className="text-xs font-semibold leading-relaxed">"{socketLiveMsg}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE: Entry Screen */}
      {stage === 'entry' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 relative">
          <div className="absolute inset-0 bg-radial-gradient from-rose-950/20 via-transparent to-transparent pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 max-w-md"
          >
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
              <Heart className="w-10 h-10 animate-pulse fill-rose-500" />
            </div>
            <h1 className="font-heading font-black text-4xl text-rose-200 tracking-tight leading-tight">
              AnKa Surprises
            </h1>
            <p className="text-xs text-rose-300/40 uppercase tracking-widest">presents a proposal journey</p>
            <p className="text-slate-400 font-light text-sm leading-relaxed pt-2">
              Please turn on your sound for the most immersive experience.
            </p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              handlePlayMusic();
              nextStage('profile');
            }}
            className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm tracking-widest uppercase rounded-full shadow-[0_0_40px_rgba(244,63,94,0.4)] cursor-pointer"
          >
            Begin Our Journey ❤️
          </motion.button>
        </div>
      )}

      {/* STAGE: Profile Section */}
      {stage === 'profile' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 w-full"
          >
            <h2 className="text-xs font-black uppercase text-rose-400 tracking-widest">The Star of My Story</h2>
            {config.proposalStarPhoto && (
              <div className="w-48 h-48 rounded-full border-4 border-rose-500/20 overflow-hidden mx-auto shadow-2xl">
                <img src={config.proposalStarPhoto} className="w-full h-full object-cover animate-fade-in" />
              </div>
            )}
            <h3 className="text-3xl font-heading font-black text-rose-100">
              {config.proposalStarName || recipientName}
              {config.proposalStarNickname && <span className="text-lg font-light text-slate-400 block mt-1">({config.proposalStarNickname})</span>}
            </h3>
            {config.proposalStarIntro && (
              <p className="text-slate-400 font-serif italic text-sm leading-relaxed max-w-md mx-auto">
                "{config.proposalStarIntro}"
              </p>
            )}
          </motion.div>
          <button
            onClick={() => nextStage(hasFavorites ? 'favorites' : 'transition')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: Favorites Section */}
      {stage === 'favorites' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-4xl mx-auto w-full">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase text-rose-400 tracking-widest">Everything That Makes You... You</h2>
            <p className="text-[10px] text-slate-500 font-light">The little details that make you unique in my eyes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {config.proposalHobbies && (
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center space-y-2">
                <span className="text-xl">🎨</span>
                <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Hobbies</h4>
                <p className="text-xs text-slate-300">{config.proposalHobbies}</p>
              </div>
            )}
            {config.proposalFavFood && (
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center space-y-2">
                <span className="text-xl">🍕</span>
                <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Fav Food</h4>
                <p className="text-xs text-slate-300">{config.proposalFavFood}</p>
              </div>
            )}
            {config.proposalFavSongs && (
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center space-y-2">
                <span className="text-xl">🎵</span>
                <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Fav Songs</h4>
                <p className="text-xs text-slate-300">{config.proposalFavSongs}</p>
              </div>
            )}
            {config.proposalFavPlace && (
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center space-y-2">
                <span className="text-xl">📍</span>
                <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Fav Place</h4>
                <p className="text-xs text-slate-300">{config.proposalFavPlace}</p>
              </div>
            )}
            {config.proposalFavCafe && (
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center space-y-2">
                <span className="text-xl">☕</span>
                <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Fav Cafe</h4>
                <p className="text-xs text-slate-300">{config.proposalFavCafe}</p>
              </div>
            )}
            {config.proposalFavMovie && (
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center space-y-2">
                <span className="text-xl">🎬</span>
                <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Fav Movie</h4>
                <p className="text-xs text-slate-300">{config.proposalFavMovie}</p>
              </div>
            )}
            {config.proposalFavFlower && (
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center space-y-2 sm:col-span-2 md:col-span-1">
                <span className="text-xl">🌸</span>
                <h4 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Fav Flower</h4>
                <p className="text-xs text-slate-300">{config.proposalFavFlower}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => nextStage('transition')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: Transition Page */}
      {stage === 'transition' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <p className="text-rose-300 text-lg font-serif italic leading-relaxed">
              "Abhi tak jo kuch tumne dekha...<br />woh sirf tum thi."
            </p>
            <p className="text-rose-400 font-serif italic text-lg leading-relaxed pt-2">
              "Ab main tumhe woh dikhana chahta hoon...<br />jo maine tum mein dekha."
            </p>
          </motion.div>
          <button
            onClick={() => nextStage(config.proposalFirstPhoto ? 'firstmeet' : (config.proposalTimeline?.length > 0 ? 'timeline' : 'moments'))}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Show Me ❤️</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: First Time I Saw You */}
      {stage === 'firstmeet' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase text-rose-400 tracking-widest">The First Time I Saw You</h2>
            <p className="text-[10px] text-slate-500 font-light">Where our universe collided.</p>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/5 border border-white/10 p-5 rounded-[32px] space-y-4 w-full shadow-2xl text-left"
          >
            {config.proposalFirstPhoto && (
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/10">
                <img src={config.proposalFirstPhoto} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-2">
              <h3 className="font-heading font-black text-xl text-rose-100">{config.proposalFirstTitle || 'A Memory Frozen in Time'}</h3>
              <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                {config.proposalFirstDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-rose-450" /> {config.proposalFirstDate}</span>}
                {config.proposalFirstLocation && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-450" /> {config.proposalFirstLocation}</span>}
              </div>
              {config.proposalFirstDesc && (
                <p className="text-xs text-slate-300 leading-relaxed font-light font-serif pt-1">
                  "{config.proposalFirstDesc}"
                </p>
              )}
            </div>
          </motion.div>

          <button
            onClick={() => nextStage(config.proposalTimeline?.length > 0 ? 'timeline' : 'moments')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: Our Journey Together Timeline */}
      {stage === 'timeline' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-2xl mx-auto w-full">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase text-rose-400 tracking-widest">Our Journey Together</h2>
            <p className="text-[10px] text-slate-500 font-light">Tracing the footpaths of our hearts.</p>
          </div>

          <div className="relative border-l border-rose-500/20 ml-2 pl-6 space-y-8 w-full py-4">
            {config.proposalTimeline && config.proposalTimeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="relative space-y-3"
              >
                {/* Node icon */}
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-slate-950 shadow-md"></div>
                
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl shadow-sm space-y-2">
                  <h4 className="font-bold text-xs text-rose-200">{item.title}</h4>
                  <div className="flex gap-3 text-[9px] text-slate-400 font-mono">
                    {item.date && <span>📅 {item.date}</span>}
                    {item.location && <span>📍 {item.location}</span>}
                  </div>
                  {item.photo && (
                    <div className="w-full h-40 rounded-xl overflow-hidden border border-white/5">
                      <img src={item.photo} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {item.description && (
                    <p className="text-[11px] text-slate-300 font-light leading-relaxed">{item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => nextStage(config.proposalMoments?.length > 0 ? 'moments' : 'reasons')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: Our Little Moments */}
      {stage === 'moments' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-4xl mx-auto w-full">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase text-rose-400 tracking-widest">Our Little Moments</h2>
            <p className="text-[10px] text-slate-500 font-light">Cozy memories and quiet frames.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {config.proposalMoments && config.proposalMoments.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-[32px] p-5 space-y-3 shadow-md">
                {item.image && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/5">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-rose-200">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => nextStage(config.proposalReasons?.length > 0 ? 'reasons' : 'letters')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: Reasons Why I Love You */}
      {stage === 'reasons' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-xl mx-auto w-full">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase text-rose-400 tracking-widest">Reasons Why I Love You</h2>
            <p className="text-[10px] text-slate-500 font-light">Click each card to open it beautifully.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {config.proposalReasons && config.proposalReasons.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveReason(item)}
                className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-4 rounded-3xl text-center space-y-2 cursor-pointer shadow-md flex flex-col justify-center items-center h-28"
              >
                <Heart className="w-5 h-5 text-rose-450 fill-rose-500/20" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-rose-200">{item.tagline}</span>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {activeReason && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-slate-900 border border-rose-500/10 rounded-[32px] p-6 max-w-sm w-full space-y-4 shadow-2xl relative"
                >
                  <button onClick={() => setActiveReason(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
                  <h4 className="font-heading font-black text-lg text-rose-200 text-center">{activeReason.tagline}</h4>
                  {activeReason.photo && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/5">
                      <img src={activeReason.photo} className="w-full h-full object-cover" />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => nextStage(config.proposalLetters?.length > 0 ? 'letters' : 'sky')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: Letters Never Sent */}
      {stage === 'letters' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-xl mx-auto w-full">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black uppercase text-rose-400 tracking-widest">Letters Never Sent</h2>
            <p className="text-[10px] text-slate-500 font-light">My unspoken thoughts, drafted on virtual paper.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            {config.proposalLetters && config.proposalLetters.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLetter(item)}
                className="bg-white/5 border border-white/5 p-5 rounded-[32px] hover:bg-white/10 cursor-pointer transition-all flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-rose-400" />
                  <span className="text-xs font-bold text-rose-100">{item.title}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300">Open Envelope</span>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {activeLetter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
              >
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="bg-amber-50 rounded-[32px] p-6 max-w-md w-full shadow-2xl relative text-left border border-amber-100/20 text-slate-800"
                >
                  <button onClick={() => setActiveLetter(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
                  <h4 className="font-heading font-black text-lg text-wineDeep border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider">{activeLetter.title}</h4>
                  <p className="text-xs leading-relaxed font-serif font-light text-slate-700 whitespace-pre-line min-h-48 max-h-[60vh] overflow-y-auto pr-2">
                    {activeLetter.content}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => nextStage(config.proposalSkyMemories?.length > 0 ? 'sky' : 'proposal')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: Memory Sky */}
      {stage === 'sky' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-xl mx-auto w-full relative">
          <div className="text-center space-y-2 z-10">
            <h2 className="text-xs font-black uppercase text-rose-400 tracking-widest">Memory Sky</h2>
            <p className="text-[10px] text-slate-500 font-light">Look at the night sky. Each star glows with a specific memory.</p>
          </div>

          <div className="relative w-full h-[60vh] bg-slate-950/80 rounded-[32px] border border-white/5 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Glowing stars */}
            {config.proposalSkyMemories && config.proposalSkyMemories.map((item, idx) => {
              // Deterministic seed mapping for layout spacing
              const top = 15 + (idx * 27) % 70;
              const left = 15 + (idx * 33) % 70;
              return (
                <motion.button
                  key={idx}
                  onClick={() => setActiveStar(item)}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2 + (idx % 3), repeat: Infinity, ease: "easeInOut" }}
                  className="absolute cursor-pointer"
                  style={{ top: `${top}%`, left: `${left}%` }}
                >
                  <Star className="w-5 h-5 text-amber-300 fill-amber-300/30 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" />
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {activeStar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-slate-900 border border-amber-300/20 rounded-[32px] p-6 max-w-sm w-full text-center space-y-3 shadow-2xl relative"
                >
                  <button onClick={() => setActiveStar(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
                  <div className="w-10 h-10 bg-amber-300/10 text-amber-300 rounded-full flex items-center justify-center mx-auto"><Star className="w-5 h-5 fill-amber-300" /></div>
                  <h4 className="font-heading font-black text-base text-rose-100">{activeStar.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{activeStar.description}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => nextStage('proposal')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1 cursor-pointer z-10"
          >
            <span>Continue Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE: Final Proposal */}
      {stage === 'proposal' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 relative max-w-md mx-auto">
          <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 via-transparent to-transparent pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse">
              <Heart className="w-10 h-10 fill-rose-500 animate-bounce" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-black text-rose-100 tracking-tight">
                {config.proposalQuestion || 'Will You Be Mine Forever?'}
              </h2>
              <p className="text-xs text-slate-500 font-light leading-relaxed max-w-xs mx-auto">
                Open the ring box below to unlock the final key...
              </p>
            </div>

            {/* Ring box animation container */}
            <div className="py-6 flex justify-center">
              <motion.button
                onClick={() => setRingBoxOpen(!ringBoxOpen)}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 relative bg-rose-950/20 hover:bg-rose-950/40 rounded-3xl border border-rose-500/20 flex flex-col items-center justify-center cursor-pointer shadow-lg"
              >
                {ringBoxOpen ? (
                  <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1.2 }} className="text-4xl">💍</motion.span>
                ) : (
                  <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-4xl">🎁</motion.span>
                )}
                <span className="text-[9px] uppercase font-bold text-rose-300 mt-2 block tracking-wider">
                  {ringBoxOpen ? 'Opened' : 'Click Box'}
                </span>
              </motion.button>
            </div>

            {/* Actions */}
            {ringBoxOpen && !proposalAnswer && (
              <div className="flex gap-4 max-w-xs mx-auto pt-4">
                <button
                  onClick={() => {
                    handleProposalSubmit('Accepted');
                    nextStage('celebration');
                  }}
                  className="w-1/2 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  {config.proposalYesBtn || '💍 YES'}
                </button>
                <button
                  onClick={() => handleProposalSubmit('Thinking')}
                  className="w-1/2 py-3 bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/20 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                >
                  {config.proposalThinkBtn || '🤍 Let Me Think'}
                </button>
              </div>
            )}

            {proposalAnswer === 'Thinking' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-slate-900 border border-amber-300/10 rounded-2xl max-w-xs mx-auto"
              >
                <p className="text-xs text-rose-200 italic">
                  "{config.proposalThinkResponse || 'Take all the time you need, my heart is always yours... 🤍'}"
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* STAGE: Celebration */}
      {stage === 'celebration' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 relative max-w-xl mx-auto">
          <div className="absolute inset-0 bg-radial-gradient from-rose-500/10 via-transparent to-transparent pointer-events-none animate-pulse" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <Check className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-black text-rose-100 tracking-tight">Celebration Time!</h2>
              <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">
                Our hearts are officially locked forever ❤️
              </p>
            </div>

            {config.proposalCelebrateLetter && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 text-slate-800 p-6 rounded-[32px] text-left border shadow-2xl font-serif max-w-md mx-auto leading-relaxed text-xs leading-relaxed whitespace-pre-line"
              >
                {config.proposalCelebrateLetter}
              </motion.div>
            )}

            <button
              onClick={triggerCelebration}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rosePrimary" />
              <span>Celebrate Again</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="py-6 text-center text-[9px] uppercase tracking-widest text-slate-600 border-t border-white/5">
        &copy; {new Date().getFullYear()} AnKa Surprises. All rights reserved.
      </footer>

    </div>
  );
}
