import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import ProposalContext from './ProposalContext';
import { parseProposalConfig } from './services/proposalParser';
import { getVisibleStages } from './services/proposalRegistry';
import { api } from '../../services/api.service';

export default function ProposalProvider({ children, instance, instanceId, isAdminPreview = false }) {
  const config = parseProposalConfig(instance?.config, instance);
  const visibleStages = getVisibleStages(config);

  const [stage, setStage] = useState(visibleStages[0] || 'entry');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Overlays
  const [activeReason, setActiveReason] = useState(null);
  const [activeLetter, setActiveLetter] = useState(null);
  const [activeStar, setActiveStar] = useState(null);
  const [ringBoxOpen, setRingBoxOpen] = useState(false);
  const [proposalAnswer, setProposalAnswer] = useState(null); // 'Accepted' | 'Thinking'

  // Socket states
  const [socketPopup, setSocketPopup] = useState(null);
  const [socketNotification, setSocketNotification] = useState(null);
  const [socketLiveMsg, setSocketLiveMsg] = useState(null);
  const [showHeartRain, setShowHeartRain] = useState(false);

  const bgAudioRef = useRef(null);

  // Sync stage changes to scroll to top
  const nextStage = (nextId) => {
    if (visibleStages.includes(nextId)) {
      setStage(nextId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getNextStageId = () => {
    const currentIndex = visibleStages.indexOf(stage);
    if (currentIndex !== -1 && currentIndex < visibleStages.length - 1) {
      return visibleStages[currentIndex + 1];
    }
    return null;
  };

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

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

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

  // Socket management
  useEffect(() => {
    if (isAdminPreview) return;
    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://127.0.0.1:5000'
        : window.location.origin);
    const socket = io(socketUrl);

    socket.on('connect', () => socket.emit('join-room', instanceId));
    socket.on('live-trigger', ({ action, data }) => {
      if (action === 'confetti') triggerConfetti();
      if (action === 'fireworks') triggerFireworks();
      if (action === 'heart-rain') {
        setShowHeartRain(true);
        setTimeout(() => setShowHeartRain(false), 8000);
      }
      if (action === 'popup') setSocketPopup(data.text || 'Thinking of you! ❤️');
      if (action === 'notification') {
        setSocketNotification(data.text);
        setTimeout(() => setSocketNotification(null), 5000);
      }
      if (action === 'live-message') {
        setSocketLiveMsg(data.text);
        setTimeout(() => setSocketLiveMsg(null), 6000);
      }
      if (action === 'play-music') handlePlayMusic();
    });

    return () => {
      socket.disconnect();
    };
  }, [instanceId, isAdminPreview]);

  const value = {
    config,
    instance,
    instanceId,
    isAdminPreview,
    stage,
    setStage,
    visibleStages,
    nextStage,
    getNextStageId,
    isPlayingMusic,
    isMuted,
    handlePlayMusic,
    handleToggleMute,
    activeReason,
    setActiveReason,
    activeLetter,
    setActiveLetter,
    activeStar,
    setActiveStar,
    ringBoxOpen,
    setRingBoxOpen,
    proposalAnswer,
    setProposalAnswer,
    socketPopup,
    setSocketPopup,
    socketNotification,
    setSocketNotification,
    socketLiveMsg,
    setSocketLiveMsg,
    showHeartRain,
    triggerCelebration,
    handleProposalSubmit,
    bgAudioRef
  };

  return (
    <ProposalContext.Provider value={value}>
      {children}
    </ProposalContext.Provider>
  );
}
