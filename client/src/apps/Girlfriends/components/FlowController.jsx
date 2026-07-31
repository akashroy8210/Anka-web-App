import React, { useState } from 'react';

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
  letterText,
  onSendWishToBackend,
  onSendKissToBackend
}) {
  const [currentAct, setCurrentAct] = useState(1);

  // Map theme prop to CSS class
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
    <div className={`gf-wrapper ${getThemeClass(theme)}`}>
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
        />
      )}

      {currentAct === 5 && (
        <Rules 
          onNext={handleNext} 
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
