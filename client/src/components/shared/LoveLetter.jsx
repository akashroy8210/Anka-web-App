import React from 'react';
import { Heart } from 'lucide-react';

export default function LoveLetter({
  recipientName,
  letterTypedText,
  letterTypingComplete,
  onNext,
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-5xl animate-slide-up">

        {/* Badge */}
        <div className="text-center mb-5">
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[10px] font-black uppercase tracking-widest inline-block">
            💌 A Letter For You
          </span>
        </div>

        {/* Glass card — wide, short */}
        <div className="w-full bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_80px_rgba(225,29,72,0.1)] px-8 py-7 md:px-14 md:py-9 relative overflow-hidden">

          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-600/6 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-pink-600/6 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-2 border border-white/5 rounded-2xl pointer-events-none" />

          {/* Heart watermark */}
          <div className="absolute bottom-3 right-5 opacity-[0.035] pointer-events-none">
            <Heart className="w-20 h-20 fill-rose-400 text-rose-400" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-5">
            <h3 className="font-romantic text-3xl sm:text-4xl text-rose-200 leading-none">
              Dear {recipientName || 'You'},
            </h3>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-heartbeat shrink-0" />
          </div>

          {/* Letter body */}
          <div className="min-h-[80px]">
            <p className="font-handwritten text-xl sm:text-2xl text-rose-100/90  leading-relaxed whitespace-pre-wrap">
              {letterTypedText}
              {!letterTypingComplete && (
                /* Blinking cursor */
                <span
                  className="inline-block w-[2px] h-7 bg-rose-400 ml-0.5 align-middle"
                  style={{ animation: 'cursor-blink 0.9s step-end infinite' }}
                />
              )}
            </p>
          </div>

          {/* Footer — appears when typing is done */}
          {letterTypingComplete && onNext && (
            <div className="mt-6 pt-4 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
              <p className="font-romantic text-xl text-rose-300/60 italic">
                — with all my love ♡
              </p>
              <button
                onClick={onNext}
                className="px-7 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(225,29,72,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-rose-500/30"
              >
                Explore Memories →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
