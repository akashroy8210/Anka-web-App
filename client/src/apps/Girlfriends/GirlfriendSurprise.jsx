import React, { useEffect } from 'react';
import FlowController from './components/FlowController';
import './styles/globals.css';

export default function GirlfriendSurprise({ config = {}, instance = {}, onSendWish, onSendKiss }) {
  // Combine config or instance data dynamically from backend database
  const activeConfig = { ...config, ...instance?.config };

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

  const handleSendWishToBackend = async (wishText) => {
    if (onSendWish) {
      onSendWish(wishText);
    }
  };

  const handleSendKissToBackend = async (kissCount, totalOwed) => {
    if (onSendKiss) {
      onSendKiss(kissCount, totalOwed);
    }
  };

  return (
    <FlowController
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
