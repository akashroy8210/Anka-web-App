import React, { useState } from 'react';
import { Lock, Unlock, HelpCircle, Eye, EyeOff } from 'lucide-react';

const CUTE_ERRORS = [
  {
    title: "Oops! 😅",
    message: "That's not quite right... Maybe your birthday brain is taking a little nap today. 🤭"
  },
  {
    title: "Almost there! 💖",
    message: "Nice try! Your answer is close... but not the magic word. ✨"
  }
];

export default function SecurityUnlock({ question, answer, hint, onSuccess }) {
  const [inputAnswer, setInputAnswer] = useState('');
  const [errorObj, setErrorObj] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputAnswer.trim()) return;

    const normalizedInput = inputAnswer.trim().toLowerCase();
    const normalizedCorrect = answer.trim().toLowerCase();

    if (normalizedInput === normalizedCorrect) {
      setIsSuccess(true);
      setErrorObj(null);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000); // 1s delay for beautiful unlock transition
    } else {
      // Pick a random cute error message
      const randomErr = CUTE_ERRORS[Math.floor(Math.random() * CUTE_ERRORS.length)];
      setErrorObj(randomErr);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <div className="glass-card bg-slate-950/60 border border-rosePrimary/20 rounded-[32px] p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background lights */}
        <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-rosePrimary/10 filter blur-xl"></div>
        <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-rosePrimary/15 filter blur-xl"></div>

        {/* Lock Icon */}
        <div className="relative inline-block">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto border transition-all duration-700 ${
            isSuccess 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
              : 'bg-rose-500/10 border-rosePrimary/20 text-rose-300'
          }`}>
            {isSuccess ? <Unlock className="w-9 h-9" /> : <Lock className="w-9 h-9" />}
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
            {isSuccess ? 'Memories Unlocked! ✨' : 'Unlock Special Memories'}
          </h3>
          <p className="text-xs text-rose-200/60 font-light leading-relaxed max-w-xs mx-auto">
            {isSuccess 
              ? 'Answer is correct. Preparing a walk down memory lane...'
              : 'Answer the question correctly to access our story timeline!'
            }
          </p>
        </div>

        {/* Question Bubble */}
        {!isSuccess && (
          <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl text-left space-y-1.5">
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-rose-300" />
              <span>Question for you:</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed">
              {question}
            </p>
          </div>
        )}

        {/* Answer Form */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rosePrimary/50 focus:border-rosePrimary/50 text-center"
                autoComplete="off"
              />
            </div>

            {/* Error Message Bubble */}
            {errorObj && (
              <div className="p-4 bg-rose-500/5 border border-rosePrimary/10 rounded-2xl text-left space-y-1 animate-shake">
                <span className="text-xs font-black text-rosePrimary uppercase tracking-wider block">
                  {errorObj.title}
                </span>
                <p className="text-[11px] text-slate-350 leading-relaxed font-light">
                  {errorObj.message}
                </p>
              </div>
            )}

            {/* Hint Trigger */}
            {hint && (
              <div className="text-left pt-1">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-[10px] font-bold text-rose-300 hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none"
                >
                  {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showHint ? 'Hide Hint' : 'Need a hint? 💡'}</span>
                </button>
                {showHint && (
                  <p className="mt-1.5 p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] sm:text-xs text-rose-200/50 leading-relaxed italic">
                    Hint: {hint}
                  </p>
                )}
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!inputAnswer.trim()}
              className="w-full py-3 bg-rosePrimary hover:bg-wineDeep text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-rosePrimary/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Unlock Memories 🔑
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
