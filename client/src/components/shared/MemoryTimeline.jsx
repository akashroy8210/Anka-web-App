import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Lock, Calendar, X, ChevronLeft, ChevronRight, HelpCircle, Eye, EyeOff } from 'lucide-react';

export default function MemoryTimeline({ config, onMemoryUnlock }) {
  const memories = config.memories || [];

  const entries = memories.map((item, i) => {
    const memData = item || {};
    const question = memData.question || '';
    const answer = memData.answer || '';
    return {
      url: memData.imageUrl || '',
      title: memData.title || memData.tag || `Memory #${i + 1}`,
      tag: memData.tag || 'Special Moment',
      description: memData.description || 'A beautiful moment we shared together on our journey.',
      date: memData.date || '',
      isLocked: !!(question.trim() && answer.trim()),
      securityQuestion: question,
      securityAnswer: answer,
      securityHint: answer, // As requested: hint will be same as answer
    };
  });

  // Track which index is unlocked in local session state
  const [unlockedIndices, setUnlockedIndices] = useState(new Set());
  const [activeMemoryIndex, setActiveMemoryIndex] = useState(null);

  const handleUnlock = (index, title) => {
    setUnlockedIndices(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    if (onMemoryUnlock) {
      onMemoryUnlock(title);
    }
  };

  const handlePrevMemory = (e) => {
    e.stopPropagation();
    setActiveMemoryIndex((prev) => {
      let idx = prev;
      do {
        idx = idx === 0 ? entries.length - 1 : idx - 1;
      } while ((entries[idx].isLocked && !unlockedIndices.has(idx)) && idx !== prev);
      return idx;
    });
  };

  const handleNextMemory = (e) => {
    e.stopPropagation();
    setActiveMemoryIndex((prev) => {
      let idx = prev;
      do {
        idx = idx === entries.length - 1 ? 0 : idx + 1;
      } while ((entries[idx].isLocked && !unlockedIndices.has(idx)) && idx !== prev);
      return idx;
    });
  };

  if (entries.length === 0) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Centre vertical line (desktop/tablet: middle, mobile: left side) */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(244,63,94,0.6) 8%, rgba(244,63,94,0.4) 92%, transparent)',
        }}
      />

      <div className="space-y-12 sm:space-y-16 pl-8 sm:pl-0">
        {entries.map((entry, i) => {
          const isLeft = i % 2 === 0;
          const isCurrentlyLocked = entry.isLocked && !unlockedIndices.has(i);

          return (
            <div key={i} className="relative flex flex-col sm:flex-row sm:items-center animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
              
              {/* Centre dot node */}
              <div className="absolute left-[-24px] sm:left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#0d0918] border border-rose-500/50 flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                </div>
                {/* Horizontal connecting line stub (desktop/tablet only) */}
                <div
                  className={`hidden sm:block absolute top-1/2 -translate-y-1/2 h-[1px] w-10
                    ${isLeft ? '-left-10' : '-right-10'}`}
                  style={{
                    background: 'linear-gradient(to right, rgba(244,63,94,0.4), rgba(244,63,94,0.05))',
                    transform: isLeft ? 'rotate(180deg)' : 'none',
                  }}
                />
              </div>

              {/* Desktop/Tablet view: Left Alternating Side */}
              <div className="hidden sm:flex w-1/2 justify-end pr-10">
                {isLeft && (
                  <MemoryCard
                    entry={entry}
                    index={i + 1}
                    isLocked={isCurrentlyLocked}
                    swayClass="animate-card-sway-left"
                    onUnlock={() => handleUnlock(i, entry.title)}
                    onCardClick={() => setActiveMemoryIndex(i)}
                    senderName={config.senderName}
                    securityQuestion={entry.securityQuestion}
                    securityAnswer={entry.securityAnswer}
                    securityHint={entry.securityHint}
                  />
                )}
              </div>

              {/* Desktop/Tablet view: Right Alternating Side */}
              <div className="hidden sm:flex w-1/2 justify-start pl-10">
                {!isLeft && (
                  <MemoryCard
                    entry={entry}
                    index={i + 1}
                    isLocked={isCurrentlyLocked}
                    swayClass="animate-card-sway-right"
                    onUnlock={() => handleUnlock(i, entry.title)}
                    onCardClick={() => setActiveMemoryIndex(i)}
                    senderName={config.senderName}
                    securityQuestion={entry.securityQuestion}
                    securityAnswer={entry.securityAnswer}
                    securityHint={entry.securityHint}
                  />
                )}
              </div>

              {/* Mobile view: Single stacked column (full width) */}
              <div className="block sm:hidden w-full max-w-[340px] sm:max-w-md">
                <MemoryCard
                  entry={entry}
                  index={i + 1}
                  isLocked={isCurrentlyLocked}
                  swayClass="animate-card-sway-right"
                  onUnlock={() => handleUnlock(i, entry.title)}
                  onCardClick={() => setActiveMemoryIndex(i)}
                  senderName={config.senderName}
                  securityQuestion={entry.securityQuestion}
                  securityAnswer={entry.securityAnswer}
                  securityHint={entry.securityHint}
                />
              </div>

            </div>
          );
        })}
      </div>

      {/* Fullscreen Memory Zoom Modal */}
      {activeMemoryIndex !== null && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-[#08050f]/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in-up"
          onClick={() => setActiveMemoryIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveMemoryIndex(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all cursor-pointer z-50 animate-pulse"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevMemory}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextMemory}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Card */}
          <div 
            className="max-w-2xl w-full flex flex-col md:flex-row items-center gap-6 bg-[#140e24]/90 border border-white/10 rounded-[32px] p-6 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Image/Video container */}
            <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/5 relative">
              {entries[activeMemoryIndex].url && (entries[activeMemoryIndex].url.match(/\.(mp4|mov|avi|webm|m4v)(\?|$)/i) || entries[activeMemoryIndex].url.includes('/video/upload/')) ? (
                <video
                  src={entries[activeMemoryIndex].url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={entries[activeMemoryIndex].url}
                  alt={entries[activeMemoryIndex].title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 left-4 z-10 bg-rose-600 px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                Memory #{activeMemoryIndex + 1}
              </div>
            </div>
            {/* Right details panel */}
            <div className="w-full md:w-1/2 space-y-4">
              <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest bg-rose-950/60 border border-rose-500/20 px-3 py-1 rounded-full inline-block">
                {entries[activeMemoryIndex].tag}
              </span>
              <h3 className="font-heading font-black text-2xl text-white">
                {entries[activeMemoryIndex].title}
              </h3>
              <p className="text-rose-100/70 text-sm font-light leading-relaxed border-l-2 border-rose-500 pl-4 italic">
                {entries[activeMemoryIndex].description}
              </p>
              {entries[activeMemoryIndex].date && (
                <p className="text-[10px] text-rose-350/40 font-mono tracking-wider pt-1">{entries[activeMemoryIndex].date}</p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function MemoryCard({ 
  entry, 
  index, 
  isLocked, 
  swayClass, 
  onUnlock, 
  onCardClick, 
  senderName, 
  securityQuestion, 
  securityAnswer, 
  securityHint 
}) {
  const [inputAnswer, setInputAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (!inputAnswer.trim()) return;

    if (inputAnswer.trim().toLowerCase() === securityAnswer.trim().toLowerCase()) {
      setErrorMsg('');
      onUnlock();
    } else {
      setErrorMsg('Not quite right. Try again! 🤭');
    }
  };

  if (isLocked) {
    return (
      <form 
        onSubmit={handleVerify}
        className={`w-full max-w-[360px] bg-[#140e24]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[320px] ${swayClass}`}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-lg">
            <Lock className="w-5 h-5 text-rose-400" />
          </div>
          {index && (
            <div className="absolute -top-2 -left-2 bg-rose-600 border border-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
              #{index}
            </div>
          )}
        </div>

        <div className="space-y-1 w-full">
          <h4 className="text-base font-bold text-rose-200 font-heading">Locked Memory</h4>
          <p className="text-[10px] text-rose-300/50 leading-relaxed">
            Unlockable by answering {senderName || 'Rishu'}'s question:
          </p>
        </div>

        {/* Security Question Display */}
        <div className="w-full p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl text-left">
          <p className="text-xs text-rose-100 font-semibold leading-relaxed">
            {securityQuestion || 'A secret question is set.'}
          </p>
        </div>

        {/* Answer Input */}
        <div className="w-full space-y-1.5">
          <input
            type="text"
            value={inputAnswer}
            onChange={(e) => {
              setInputAnswer(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Type your answer here..."
            className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50 text-center"
            autoComplete="off"
          />
          {errorMsg && (
            <p className="text-[10px] text-rose-400 font-bold animate-pulse">{errorMsg}</p>
          )}
        </div>

        {/* Hint Trigger */}
        {securityHint && (
          <div className="w-full text-left">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[9px] font-bold text-rose-350 hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none"
            >
              <span>{showHint ? 'Hide Hint' : 'Need a hint? 💡'}</span>
            </button>
            {showHint && (
              <p className="mt-1 p-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] text-rose-200/50 leading-relaxed italic">
                Hint: {securityHint}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!inputAnswer.trim()}
          className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:scale-100"
        >
          Unlock with love 💖
        </button>
      </form>
    );
  }

  return (
    <div 
      onClick={onCardClick}
      className={`w-full max-w-[360px] bg-[#140e24]/80 backdrop-blur-xl border border-white/10 rounded-[28px] overflow-hidden shadow-2xl ${swayClass} cursor-pointer group`}
    >
      {/* Photo/Video with capsule label badge at bottom-left */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 flex items-center justify-center">
        {entry.url && (entry.url.match(/\.(mp4|mov|avi|webm|m4v)(\?|$)/i) || entry.url.includes('/video/upload/')) ? (
          <video
            src={entry.url}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            muted
            playsInline
            loop
            autoPlay
          />
        ) : (
          <img
            src={entry.url}
            alt={entry.title}
            className="w-full h-full object-cover filter md:grayscale md:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        )}
        {/* Memory # number badge overlay on image (highly visible!) */}
        {index && (
          <div className="absolute top-4 left-4 z-10 bg-rose-600 px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            Memory #{index}
          </div>
        )}
        {/* Capsule tag badge */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-rose-400" />
          <span>{entry.tag}</span>
        </div>
      </div>

      {/* Description below image */}
      <div className="p-6 text-left space-y-2">
        <h4 className="text-lg font-bold text-slate-100 font-heading tracking-tight leading-snug">
          {entry.title}
        </h4>
        <p className="text-xs text-rose-100/70 leading-relaxed font-light">
          {entry.description}
        </p>
        {entry.date && (
          <p className="text-[10px] text-rose-350/40 font-mono tracking-wider pt-1">{entry.date}</p>
        )}
      </div>
    </div>
  );
}
