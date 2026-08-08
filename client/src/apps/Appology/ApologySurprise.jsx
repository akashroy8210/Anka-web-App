import React, { useState, useEffect } from 'react';
import { useApologyTheme } from './hooks/useApologyTheme';
import OpeningMessage from './components/OpeningMessage';
import MistakeSection from './components/MistakeSection';
import NoExcuses from './components/NoExcuses';
import ThingsISaid from './components/ThingsISaid';
import PromiseScratchCards from './components/PromiseScratchCards';
import ApologyMemoryBook from './components/ApologyMemoryBook';
import CutenessMeter from './components/CutenessMeter';
import VoiceApology from './components/VoiceApology';
import VideoApology from './components/VideoApology';
import MakeItRight from './components/MakeItRight';
import RecipientResponse from './components/RecipientResponse';
import FutureChanges from './components/FutureChanges';
import FinalApology from './components/FinalApology';
import { getMergedApologyData } from './data';
import './apology.css';

import flowerAsset from '../birthday/Assets/noun-flowers-2420525.svg';

/* ─── Noun Project Asset Flower Component (Pink Flower + Green Stem) ─── */
function AssetCornerFlowerSVG() {
  return (
    <div className="relative w-full h-full drop-shadow-[0_8px_20px_rgba(236,72,153,0.35)]">
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

function CornerFlowers() {
  return (
    <>
      {/* Top-Left */}
      <div className="fixed top-0 left-0 w-24 h-24 sm:w-40 sm:h-40 pointer-events-none z-0 select-none opacity-85">
        <AssetCornerFlowerSVG />
      </div>
      {/* Top-Right */}
      <div className="fixed top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 pointer-events-none z-0 select-none opacity-85 transform scale-x-[-1]">
        <AssetCornerFlowerSVG />
      </div>
      {/* Bottom-Left */}
      <div className="fixed bottom-0 left-0 w-24 h-24 sm:w-40 sm:h-40 pointer-events-none z-0 select-none opacity-85 transform scale-y-[-1]">
        <AssetCornerFlowerSVG />
      </div>
      {/* Bottom-Right */}
      <div className="fixed bottom-0 right-0 w-24 h-24 sm:w-40 sm:h-40 pointer-events-none z-0 select-none opacity-85 transform scale-x-[-1] scale-y-[-1]">
        <AssetCornerFlowerSVG />
      </div>
    </>
  );
}

export default function ApologySurprise({ instanceData, instance, isPreview = false, socket }) {
  const targetData = instanceData || instance || {};
  const rawConfig = targetData?.config || targetData || {};
  // Read canonical themeSlug directly from database Demo model (targetData.demo.themeSlug) or instance config
  const dbThemeSlug = targetData?.demo?.themeSlug || targetData?.category?.themeSlug;
  const config = getMergedApologyData({
    ...rawConfig,
    themeSlug: rawConfig.themeSlug || rawConfig.selectedTheme || rawConfig.theme || dbThemeSlug
  });
  const theme = useApologyTheme(config.themeSlug);
  const isPremium = (instanceData?.tier === 'Premium') || config.isPremium || isPreview;

  const [currentStep, setCurrentStep] = useState(1);
  const isLastPage = currentStep >= 12;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (socket && instanceData?.instanceId) {
      socket.emit('live-trigger', {
        instanceId: instanceData.instanceId,
        type: 'STEP_CHANGE',
        payload: {
          step: currentStep,
          timestamp: new Date().toISOString()
        }
      });
    }
  }, [currentStep, socket]);

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleSendResponse = (response) => {
    if (socket && instanceData?.instanceId) {
      socket.emit('live-trigger', {
        instanceId: instanceData.instanceId,
        type: 'RECIPIENT_RESPONSE',
        payload: response
      });
    }
  };

  const handleFinalChoice = (choice) => {
    if (socket && instanceData?.instanceId) {
      socket.emit('live-trigger', {
        instanceId: instanceData.instanceId,
        type: 'FINAL_CHOICE',
        payload: choice
      });
    }
  };

  const bgMusicUrl = config.musicUrl || config.bgMusicUrl || config.backgroundMusic || '';
  const audioRef = React.useRef(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    if (!bgMusicUrl) return;

    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.5;
          await audioRef.current.play();
          setIsPlayingMusic(true);
        } catch (e) {
          // Autoplay blocked by browser policy, waiting for user click
        }
      }
    };

    playAudio();

    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [bgMusicUrl]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  return (
    <div 
      className={`w-full h-screen overflow-hidden transition-colors duration-700 font-sans selection:bg-rose-500 selection:text-white apology-wrapper ${theme.cssClass}`} 
      style={{ background: 'var(--ap-bg-primary)', color: 'var(--ap-text-primary)' }}
    >
      {/* Background Birthday Flowers in All 4 Corners */}
      <CornerFlowers />

      {/* Floating Background Music Control Button */}
      {bgMusicUrl && (
        <div className="fixed top-4 right-4 z-50">
          <button
            type="button"
            onClick={toggleMusic}
            className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-xs font-bold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            style={{ color: 'var(--ap-text-primary)' }}
          >
            <span className={isPlayingMusic ? 'animate-spin' : ''}>🎵</span>
            <span>{isPlayingMusic ? 'Music On' : 'Music Off'}</span>
          </button>
          <audio ref={audioRef} src={bgMusicUrl} loop preload="auto" />
        </div>
      )}

      {/* Main Dynamic Viewport Step rendering */}
      <main className="relative z-10 w-full h-full flex flex-col justify-center items-center py-4 overflow-y-auto ap-custom-scroll">
        {currentStep === 1 && <OpeningMessage config={config} onNext={handleNext} />}
        {currentStep === 2 && <MistakeSection config={config} onNext={handleNext} />}
        {currentStep === 3 && <NoExcuses config={config} onNext={handleNext} />}
        {currentStep === 4 && <ThingsISaid config={config} onNext={handleNext} />}
        {currentStep === 5 && <PromiseScratchCards config={config} onNext={handleNext} socket={socket} />}
        {currentStep === 6 && <ApologyMemoryBook config={config} onNext={handleNext} />}
        {currentStep === 7 && <CutenessMeter config={config} isPremium={isPremium} onNext={handleNext} />}
        {currentStep === 8 && (
          (config.voiceUrl || config.voiceNoteUrl)
            ? <VoiceApology config={config} onNext={handleNext} />
            : (config.videoUrl || config.videoApologyUrl)
            ? <VideoApology config={config} onNext={handleNext} />
            : <MakeItRight config={config} onNext={handleNext} />
        )}
        {currentStep === 9 && (
          ((config.voiceUrl || config.voiceNoteUrl) && (config.videoUrl || config.videoApologyUrl))
            ? <VideoApology config={config} onNext={handleNext} />
            : <MakeItRight config={config} onNext={handleNext} />
        )}
        {currentStep === 10 && <RecipientResponse config={config} onNext={handleNext} onSendResponse={handleSendResponse} />}
        {currentStep === 11 && <FutureChanges config={config} onNext={handleNext} />}
        {currentStep >= 12 && (
          <div className="w-full flex flex-col items-center py-6 px-4 pb-24">
            <FinalApology config={config} onFinalChoice={handleFinalChoice} socket={socket} />
          </div>
        )}
      </main>

      {/* Fixed Bottom Action Bar when Demo Surprise Complete */}
      {isLastPage && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-auto">
          <div className="animate-paper-unfold flex flex-row items-center justify-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-full bg-black/10 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={() => window.location.href = '/category'}
              className="px-6 sm:px-8 py-3 rounded-full text-white text-xs sm:text-sm font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              style={{ background: 'var(--ap-btn-gradient)' }}
            >
              <span>Create Your Surprise ✨</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/about'}
              className="px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold ap-btn-secondary border shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>About AnkaSurprise 💖</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
