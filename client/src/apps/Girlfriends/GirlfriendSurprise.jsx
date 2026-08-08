import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import FlowController from './components/FlowController';
import PasswordUnlockGateway from '../../components/shared/PasswordUnlockGateway';
import './styles/globals.css';

export default function GirlfriendSurprise({ config = {}, instance = {}, onSendWish, onSendKiss }) {
  // Combine config or instance data dynamically from backend database
  const activeConfig = { ...config, ...instance?.config };
  const targetInstanceId = instance?.instanceId || activeConfig?.instanceId;

  // Socket state for real-time live control panel connection
  const [socket, setSocket] = useState(null);

  // Password Protection state
  const passwordEnabled = Boolean(activeConfig.passwordEnabled || activeConfig.securityAnswer || activeConfig.password);
  const correctPassword = activeConfig.password || activeConfig.securityAnswer || '';
  const [unlocked, setUnlocked] = useState(!passwordEnabled);

  const rawThemeStr = String(
    activeConfig.theme || 
    activeConfig.selectedTheme ||
    instance?.demo?.themeSlug || 
    instance?.demo?.slug || 
    instance?.themeSlug || 
    ''
  ).toLowerCase();

  let theme = 'dark';
  if (rawThemeStr.includes('pastel')) theme = 'pastel';
  else if (rawThemeStr.includes('pink')) theme = 'pink';
  else if (rawThemeStr.includes('dark')) theme = 'dark';

  const girlfriendName = activeConfig.girlfriendName || activeConfig.partnerName || activeConfig.recipientName || 'Cutie';
  const boyfriendName = activeConfig.boyfriendName || activeConfig.yourName || activeConfig.senderName || 'Your Boyfriend';
  
  const rawPhotos = activeConfig.photos || [];
  const photos = rawPhotos.map(p => typeof p === 'object' ? p.url : p);
  
  const girlfriendPhoto = activeConfig.girlfriendPhoto || (typeof photos[0] === 'string' ? photos[0] : '');
  const boyfriendPhoto = activeConfig.boyfriendPhoto || (typeof photos[1] === 'string' ? photos[1] : '');
  
  const customQuestions = (activeConfig.questions && activeConfig.questions.length > 0)
    ? activeConfig.questions 
    : (activeConfig.customQuestions || []);

  const customChapters = (activeConfig.chapters && activeConfig.chapters.length > 0)
    ? activeConfig.chapters 
    : (activeConfig.customChapters || []);

  const reasons = (activeConfig.reasons && activeConfig.reasons.length > 0)
    ? activeConfig.reasons 
    : (activeConfig.customReasons || []);

  const bgMusicUrl = activeConfig.bgMusicUrl || activeConfig.musicUrl || '';
  const voiceNoteUrl = activeConfig.voiceNoteUrl || activeConfig.audioNoteUrl || '';

  const letterText = activeConfig.letterText || '';

  useEffect(() => {
    document.title = `Happy Girlfriend's Day ${girlfriendName} ❤️`;
  }, [girlfriendName]);

  // Connect to Socket.IO and join the room for live control interaction
  useEffect(() => {
    if (!targetInstanceId) return;

    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://127.0.0.1:5000'
        : window.location.origin);

    const s = io(socketUrl);

    s.on('connect', () => {
      s.emit('join-room', targetInstanceId);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [targetInstanceId]);

  const handleSendWishToBackend = async (wishText) => {
    if (onSendWish) {
      onSendWish(wishText);
    }
    if (socket && targetInstanceId) {
      socket.emit('admin-action', {
        instanceId: targetInstanceId,
        action: 'girlfriend_wish_received',
        data: { recipientResponse: wishText, wishText }
      });
    }
  };

  const handleSendKissToBackend = async (kissCount, totalOwed) => {
    if (onSendKiss) {
      onSendKiss(kissCount, totalOwed);
    }
    if (socket && targetInstanceId) {
      socket.emit('admin-action', {
        instanceId: targetInstanceId,
        action: 'girlfriend_kiss_received',
        data: { kissCount, totalOwed }
      });
    }
  };

  if (passwordEnabled && !unlocked) {
    return (
      <PasswordUnlockGateway
        onSuccess={() => setUnlocked(true)}
        correctPassword={correctPassword}
        passwordHint={activeConfig.passwordHint || activeConfig.securityHint || ''}
        unlockHeading={activeConfig.unlockHeading || 'Unlock Your Private Memory'}
        unlockSubtitle={activeConfig.unlockSubtitle || 'This experience was created only for you.'}
        wrongPasswordMessage={activeConfig.wrongPasswordMessage || 'I think your boyfriend remembers a different secret ❤️'}
        successMessage={activeConfig.successMessage || 'Access Granted! Unlocking your magical experience...'}
        backgroundImage={activeConfig.backgroundImage || girlfriendPhoto || photos[0] || ''}
        senderName={boyfriendName}
        recipientName={girlfriendName}
        activeTheme={theme}
        enableNumericKeypad={activeConfig.enableNumericKeypad !== false}
        musicUrl={bgMusicUrl}
      />
    );
  }

  return (
    <FlowController
      socket={socket}
      theme={theme}
      girlfriendName={girlfriendName}
      boyfriendName={boyfriendName}
      photos={photos}
      girlfriendPhoto={girlfriendPhoto}
      boyfriendPhoto={boyfriendPhoto}
      customQuestions={customQuestions}
      customChapters={customChapters}
      reasons={reasons}
      bgMusicUrl={bgMusicUrl}
      voiceNoteUrl={voiceNoteUrl}
      letterText={letterText}
      onSendWishToBackend={handleSendWishToBackend}
      onSendKissToBackend={handleSendKissToBackend}
    />
  );
}
