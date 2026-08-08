import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';

import IdentityCheck from './IdentityCheck';
import Welcome from './Welcome';
import LoveQuestion from './LoveQuestion';
import MissionIntro from './MissionIntro';
import Rules from './Rules';
import Quiz from './Quiz';
import Crash from './Crash';
import MemoryBook from './MemoryBook';
import Reasons365 from './Reasons365';
import GiftReveal from './GiftReveal';
import LoveLetter from './LoveLetter';
import Ending from './Ending';

export default function FlowController({ 
  theme = 'dark', 
  girlfriendName = 'Cutie', 
  boyfriendName = 'Your Boyfriend',
  photos = [],
  girlfriendPhoto,
  boyfriendPhoto,
  customQuestions = [],
  customChapters = [],
  reasons = [],
  bgMusicUrl,
  voiceNoteUrl,
  socket,
  letterText,
  onSendWishToBackend,
  onSendKissToBackend
}) {
  const [currentAct, setCurrentAct] = useState(1);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const bgAudioRef = useRef(null);

  useEffect(() => {
    if (bgMusicUrl && bgAudioRef.current) {
      bgAudioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(() => {
        // Autoplay policy fallback
        setIsMusicPlaying(false);
      });
    }
  }, [bgMusicUrl]);

  // Handle real-time socket events triggered from Live Control Panel
  useEffect(() => {
    if (!socket) return;

    const handleLiveTrigger = ({ action, data }) => {
      if (action === 'next_step' || action === 'next' || action === 'trigger_next') {
        setCurrentAct((prev) => Math.min(11, prev + 1));
      } else if (action === 'prev_step' || action === 'prev' || action === 'trigger_prev') {
        setCurrentAct((prev) => Math.max(1, prev - 1));
      } else if (action === 'change_act' || action === 'change_step' || action === 'set_act') {
        if (data && data.act) setCurrentAct(Number(data.act));
        else if (data && data.step) setCurrentAct(Number(data.step));
      } else if (action === 'play_music' || action === 'music_play') {
        if (bgAudioRef.current) {
          bgAudioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
        }
      } else if (action === 'pause_music' || action === 'music_pause' || action === 'mute_music') {
        if (bgAudioRef.current) {
          bgAudioRef.current.pause();
          setIsMusicPlaying(false);
        }
      } else if (action === 'toggle_music') {
        toggleBackgroundMusic();
      }
    };

    socket.on('live-trigger', handleLiveTrigger);

    return () => {
      socket.off('live-trigger', handleLiveTrigger);
    };
  }, [socket]);

  const toggleBackgroundMusic = () => {
    if (!bgAudioRef.current) return;
    if (isMusicPlaying) {
      bgAudioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      bgAudioRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  const getThemeClass = (t) => {
    const clean = String(t || '').toLowerCase();
    if (clean.includes('pastel')) return 'gf-theme-pastel';
    if (clean.includes('pink')) return 'gf-theme-pink';
    return 'gf-theme-dark';
  };

  const handleNext = () => {
    setCurrentAct((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentAct(1);
  };

  return (
    <div className={`gf-wrapper ${getThemeClass(theme)} relative`}>
      
      {/* FLOATING BACKGROUND MUSIC TOGGLE BUTTON */}
      {bgMusicUrl && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleBackgroundMusic}
          className="fixed top-5 right-5 z-50 px-3.5 py-2 rounded-full bg-slate-900/80 border border-white/20 text-white text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 cursor-pointer"
        >
          {isMusicPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Music On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>Muted</span>
            </>
          )}
        </motion.button>
      )}

      {bgMusicUrl && (
        <audio 
          ref={bgAudioRef} 
          src={bgMusicUrl} 
          loop 
          className="hidden" 
        />
      )}

      {currentAct === 1 && (
        <IdentityCheck 
          onNext={handleNext} 
          girlfriendName={girlfriendName} 
        />
      )}

      {currentAct === 2 && (
        <Welcome 
          onNext={handleNext} 
          girlfriendName={girlfriendName} 
          photos={photos} 
          girlfriendPhoto={girlfriendPhoto}
          boyfriendPhoto={boyfriendPhoto}
        />
      )}

      {currentAct === 3 && (
        <LoveQuestion 
          onNext={handleNext} 
        />
      )}

      {currentAct === 4 && (
        <MissionIntro 
          onNext={handleNext} 
          girlfriendName={girlfriendName}
        />
      )}

      {currentAct === 5 && (
        <Rules 
          onNext={handleNext} 
          voiceNoteUrl={voiceNoteUrl}
          boyfriendName={boyfriendName}
          boyfriendPhoto={boyfriendPhoto}
        />
      )}

      {currentAct === 6 && (
        <Quiz 
          onNext={handleNext} 
          customQuestions={customQuestions}
          boyfriendPhoto={boyfriendPhoto}
          onSendWish={onSendWishToBackend}
          onSendKiss={onSendKissToBackend}
        />
      )}

      {currentAct === 7 && (
        <Crash 
          onNext={handleNext} 
        />
      )}

      {currentAct === 8 && (
        <MemoryBook 
          onNext={handleNext} 
          customChapters={customChapters}
        />
      )}

      {currentAct === 9 && (
        <Reasons365 
          onNext={handleNext} 
          reasons={reasons}
        />
      )}

      {currentAct === 10 && (
        <GiftReveal 
          onNext={handleNext} 
          girlfriendName={girlfriendName}
        />
      )}

      {currentAct === 11 && (
        <LoveLetter 
          onNext={handleNext} 
          boyfriendName={boyfriendName}
          girlfriendName={girlfriendName}
          girlfriendPhoto={girlfriendPhoto}
          letterText={letterText}
        />
      )}

      {currentAct === 12 && (
        <Ending 
          onRestart={handleRestart}
          girlfriendPhoto={girlfriendPhoto || photos[0]}
          boyfriendPhoto={boyfriendPhoto || photos[1]}
          girlfriendName={girlfriendName}
          boyfriendName={boyfriendName}
        />
      )}
    </div>
  );
}
