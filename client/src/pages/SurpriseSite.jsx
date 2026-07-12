import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.service';
import { Heart, Volume2, VolumeX, Sparkles, Calendar, Music, Clock } from 'lucide-react';
import BirthdaySurprise from '../apps/birthday/BirthdaySurprise';
import { VirtualDateSurprise } from '../apps/virtual-date/App';
import { updateSEO } from '../utils/seo';

export default function SurpriseSite() {
  const { instanceId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instance, setInstance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Custom states
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Quiz state
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState(0);

  // Audio reference
  const audioRef = useRef(null);

  // Fallback data if DB fetch fails
  const mockConfig = {
    recipientName: "Sweetheart",
    senderName: "With Love",
    specialDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    message: "You are the best thing that ever happened to me. Every moment with you is a gift, and I wanted to make this page just to show you how much I care. Happy Valentine's Day!",
    themeColor: "#E11D48",
    songChoice: "romantic",
    photos: [
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1474552226712-ac0f0962a95d?auto=format&fit=crop&q=80&w=400"
    ]
  };

  useEffect(() => {
    const fetchInstance = async (isSilent = false) => {
      if (!navigator.onLine) {
        if (!isSilent) {
          setErrorMessage("No Internet Connection 🌐 Please check your connection and try again.");
          setLoading(false);
          updateSEO({
            title: `Surprise Vibe Check ❤️`,
            noindex: true
          });
        }
        return;
      }

      try {
        if (!isSilent) setErrorMessage('');
        const data = await api.getLiveInstance(instanceId);
        if (data.success && data.instance) {
          setInstance(data.instance);
          
          // Professional SEO and Privacy update
          const recipientName = data.instance?.config?.recipientName || "Sweetheart";
          const categoryName = data.instance?.category?.name || "Virtual Surprise";
          updateSEO({
            title: `A Special ${categoryName} Surprise for ${recipientName} ❤️`,
            description: `You have received a beautiful interactive virtual surprise page. Open it to unlock photos, songs, and memory timelines.`,
            noindex: true // DO NOT let search engines index private client surprise pages!
          });
        } else if (!isSilent) {
          setErrorMessage("This surprise link is not active yet. Please ask your partner for the correct link.");
          updateSEO({
            title: `Surprise Link Inactive ❤️`,
            noindex: true
          });
        }
      } catch (err) {
        if (!isSilent) {
          console.warn('API error fetching live instance:', err);
          if (!navigator.onLine) {
            setErrorMessage("No Internet Connection 🌐 Please check your connection and try again.");
          } else {
            setErrorMessage("This surprise link is not active yet. Please ask your partner for the correct link.");
          }
          updateSEO({
            title: `Surprise Vibe Check ❤️`,
            noindex: true
          });
        }
      } finally {
        if (!isSilent) {
          setLoading(false);
        }
      }
    };
    
    fetchInstance();

    // Poll every 6 seconds in background to receive real-time admin replies
    const pollInterval = setInterval(() => {
      fetchInstance(true);
    }, 6000);

    return () => clearInterval(pollInterval);
  }, [instanceId]);

  // Content Protection Event Listeners
  useEffect(() => {
    /* 
      NOTE FOR DEVELOPER:
      This is a client-side deterrent only, not absolute security.
      A technical user can still open devtools via the browser menu, 
      or fetch the raw assets directly over the network.
      For true protection, server-side rendering with media isolation should be used.
    */
    const preventContextMenu = (e) => {
      e.preventDefault();
    };

    const preventDevTools = (e) => {
      // F12 (123)
      // Ctrl+Shift+I (I is 73)
      // Ctrl+U (U is 85)
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || 
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('contextmenu', preventContextMenu);
    window.addEventListener('keydown', preventDevTools);

    return () => {
      window.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('keydown', preventDevTools);
    };
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!instance || !instance.config || !instance.config.specialDate) return;

    const interval = setInterval(() => {
      const difference = +new Date(instance.config.specialDate) - +new Date();
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [instance]);

  // Floating hearts generator
  const [floatingHearts, setFloatingHearts] = useState([]);
  const launchHearts = () => {
    const newHearts = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      left: Math.random() * 90 + 5,
      size: Math.random() * 20 + 15,
      delay: Math.random() * 3
    }));
    setFloatingHearts(prev => [...prev, ...newHearts]);
  };

  useEffect(() => {
    if (isOpened) {
      launchHearts();
      const interval = setInterval(launchHearts, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpened]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Audio player toggle
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
    }
    setIsPlaying(!isPlaying);
  };

  // Open envelope
  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true);
    // Play sound from a royalty-free romantic piano loop
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio block', e));
    }
  };

  // Teleport "No" button when hovered
  const handleNoHover = () => {
    // Generate random coordinates inside a small grid
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 150;
    setNoBtnPos({ x: randomX, y: randomY });
    setNoHoverCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-creamBase/20 space-y-4">
        <div className="w-10 h-10 border-4 border-rosePrimary/20 border-t-rosePrimary rounded-full animate-spin"></div>
        <p className="text-slate-500 font-light text-xs">Opening envelope...</p>
      </div>
    );
  }

  if (errorMessage || !instance) {
    const errorText = errorMessage || "This surprise link is not active yet. Please ask your partner for the correct link.";
    return (
      <div className="min-h-screen bg-[#FFFDFD] flex items-center justify-center text-center p-6">
        <div className="max-w-md w-full p-8 rounded-[36px] bg-white border border-rosePrimary/15 shadow-glass-rose space-y-6 flex flex-col items-center animate-fade-in-up">
          <div className="w-16 h-16 bg-rosePrimary/10 text-rosePrimary rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 fill-rosePrimary/20 text-rosePrimary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-black text-2xl text-wineDeep">Surprise Vibe Check</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              {errorText}
            </p>
          </div>
          {errorText.includes("Connection") && (
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 bg-gradient-to-r from-rosePrimary to-wineDeep hover:from-wineDeep hover:to-rosePrimary text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer text-center"
            >
              Retry Connection 🔄
            </button>
          )}
        </div>
      </div>
    );
  }

  const config = instance.config;

  const isBirthday = instance.category && instance.category.slug === 'birthday';
  if (isBirthday) {
    return <BirthdaySurprise instance={instance} instanceId={instanceId} />;
  }

  const isVirtualDate = instance.category && instance.category.slug === 'virtual-date';
  if (isVirtualDate) {
    return <VirtualDateSurprise instance={instance} instanceId={instanceId} />;
  }

  // Render Music Choice URL
  // We can default to a standard background loop
  const backgroundAudioUrl = config.musicUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  return (
    <div className="min-h-screen bg-[#FFF7F5] relative overflow-hidden select-none">
      
      {/* Audio Element */}
      <audio ref={audioRef} src={backgroundAudioUrl} loop />

      {/* Floating Hearts Particle Layer */}
      {isOpened && floatingHearts.map(heart => (
        <div
          key={heart.id}
          className="absolute text-rosePrimary/25 pointer-events-none z-0"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            bottom: '-50px',
            animation: `float-petal 7s linear infinite`,
            animationDelay: `${heart.delay}s`
          }}
        >
          ❤️
        </div>
      ))}

      {/* Music Toggle Floating Button */}
      {isOpened && (
        <button
          onClick={toggleAudio}
          className="fixed top-6 right-6 z-50 p-3 bg-white/70 backdrop-blur-md rounded-full shadow-md text-rosePrimary border hover:bg-white hover:scale-105 transition-all"
        >
          {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
        </button>
      )}

      {/* ENVELOPE ENTRANCE SCREEN */}
      {!isOpened ? (
        <div className="fixed inset-0 z-50 bg-[#FFF7F5] flex flex-col items-center justify-center p-4">
          <div className="absolute top-10 w-48 h-48 rounded-full bg-blushAccent/25 filter blur-3xl animate-float-slow -z-10"></div>
          
          <div className="text-center space-y-6 max-w-sm w-full animate-fade-in-up">
            <div className="relative">
              <div className="w-24 h-24 bg-white border border-rosePrimary/20 rounded-3xl shadow-lg flex items-center justify-center mx-auto animate-heartbeat cursor-pointer hover:scale-105 transition-transform" onClick={handleOpen}>
                <Heart className="w-12 h-12 text-rosePrimary fill-rosePrimary" />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rosePrimary uppercase tracking-widest bg-[#FFF7F5] px-2 py-0.5 rounded-full border border-rosePrimary/25">
                Open Me
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl text-wineDeep">
                A Surprise Awaits You!
              </h2>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Someone created a special interactive landing page just for you. Turn up your volume, tap the heart, and open your surprise!
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* IMMERSIVE LIVE SURPRISE PAGE */
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 space-y-20 relative z-10 animate-fade-in-up">
          
          {/* Main Title Section */}
          <div className="text-center space-y-4">
            <span className="font-accent text-3xl md:text-5xl text-rosePrimary inline-block animate-pulse-glow">
              Dear {config.recipientName},
            </span>
            
            <div className="relative inline-block max-w-xl">
              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-wineDeep leading-tight">
                Every Moment With You Is A Gift
              </h1>
            </div>
            
            <p className="font-accent text-lg text-slate-500">
              {config.senderName}
            </p>
          </div>

          {/* Countdown Timer */}
          {config.specialDate && (
            <div className="glass-card-rose rounded-3xl p-6 text-center border shadow-glass-rose max-w-xl mx-auto">
              <h3 className="font-heading font-bold text-sm text-wineDeep uppercase tracking-wider mb-4 flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-rosePrimary" />
                <span>Countdown to our Special Moment</span>
              </h3>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Mins' },
                  { value: timeLeft.seconds, label: 'Secs' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/80 p-3 rounded-2xl border border-rosePrimary/10 shadow-sm">
                    <span className="block font-heading font-extrabold text-xl sm:text-3xl text-wineDeep">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Letter / Paragraph */}
          <div className="glass-card-rose rounded-3xl p-8 shadow-glass-rose border max-w-2xl mx-auto text-center space-y-6">
            <Heart className="w-8 h-8 text-rosePrimary fill-rosePrimary mx-auto animate-heartbeat" />
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-light italic">
              "{config.message}"
            </p>
          </div>

          {/* Polaroid Memory Photo Gallery */}
          {config.photos && config.photos.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-heading font-bold text-xl text-center text-wineDeep uppercase tracking-wider">
                Captured Memories
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {config.photos.map((url, index) => (
                  <div 
                    key={index}
                    className="bg-white p-4 pb-8 rounded-xl border shadow-md transform rotate-[-2deg] hover:rotate-[2deg] hover:scale-105 transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border mb-4">
                      <img src={url} alt={`Memory ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-accent text-center text-slate-600 text-lg">
                      Memory #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Quiz / Proposal Section */}
          <div className="glass-card-rose rounded-3xl p-8 shadow-glass-rose border max-w-xl mx-auto text-center space-y-6 relative overflow-hidden">
            
            {quizAnswered ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-4 bg-rosePrimary/10 text-rosePrimary rounded-full inline-block">
                  <Sparkles className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-wineDeep">
                  Yay! I Knew You'd Say Yes! ❤️
                </h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Thank you for being my valentine/bestie and completing my world. Sending you a million virtual hugs right now!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-heading font-bold text-xl text-wineDeep">
                  Will You Be My Valentine?
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Pick your answer below (choose wisely!)
                </p>
                
                <div className="flex items-center justify-center space-x-4 min-h-[60px] relative">
                  
                  {/* YES button */}
                  <button
                    onClick={() => { setQuizAnswered(true); launchHearts(); }}
                    className="px-6 py-2.5 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-colors"
                  >
                    Yes!
                  </button>

                  {/* NO button (teleports on hover) */}
                  <button
                    onMouseEnter={handleNoHover}
                    onClick={handleNoHover} // Mobile compatibility
                    style={{
                      transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)`,
                      transition: 'transform 0.15s ease-out'
                    }}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-350 absolute"
                  >
                    No
                  </button>

                </div>

                {noHoverCount > 4 && (
                  <p className="text-[10px] text-rose-500 font-light animate-pulse-glow">
                    Nice try! But "No" is not an option! 😉
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Footer Info */}
          <div className="text-center text-slate-400 text-xs font-light pt-10 border-t border-rosePrimary/10">
            <p>Designed with Love. Powered by AnKa.</p>
          </div>

        </div>
      )}

    </div>
  );
}
