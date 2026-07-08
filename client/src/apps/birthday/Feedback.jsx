import React from 'react';
import { Heart, Smile } from 'lucide-react';

export default function Feedback({
  feedbackAnswer,
  finalPromiseMessage,
  handleFeedbackYes,
  handleFeedbackNo,
  showWarningPopup,
  setShowWarningPopup,
  setFinalPromiseMessage,
}) {
  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_16px_48px_rgba(0,0,0,0.4)] text-center space-y-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-600/8 rounded-full blur-3xl pointer-events-none" />

        {feedbackAnswer === 'yes' ? (
          <div className="space-y-4 animate-slide-up">
            <Heart className="w-10 h-10 text-rose-400 fill-rose-400 animate-heartbeat mx-auto" />
            <h3 className="font-romantic text-4xl text-white">I knew you'd love it! ❤️</h3>
            <p className="text-sm text-rose-200/60 leading-relaxed max-w-sm mx-auto">
              Your smile is the best gift I could hope for. Thank you for walking this journey with me!
            </p>
          </div>
        ) : finalPromiseMessage ? (
          <div className="space-y-4 animate-slide-up">
            <Smile className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="font-romantic text-4xl text-white">Promise me one more smile 😊</h3>
            <p className="text-sm text-rose-200/60 leading-relaxed max-w-sm mx-auto">
              Kyunki aapki pyaari hasi hi is surprise ki asli kamyabi hai.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-romantic text-4xl text-white">Did you enjoy this? 🎉</h3>
              <p className="text-xs text-rose-200/50 leading-relaxed">
                Let the sender know this journey brought joy!
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={handleFeedbackYes}
                className="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-rose-500/30"
              >
                ❤️ Loved it!
              </button>
              <button
                onClick={handleFeedbackNo}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-rose-300 text-xs font-black uppercase tracking-widest rounded-full border border-white/10 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                😅 Not Yet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Warning modal */}
      {showWarningPopup && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0a18] border border-white/10 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center space-y-5 animate-slide-up">
            <Heart className="w-10 h-10 text-rose-400 fill-rose-400 mx-auto animate-heartbeat" />
            <h4 className="font-romantic text-3xl text-white">Are you sure?</h4>
            <p className="text-xs text-rose-200/50 leading-relaxed">
              Your planner spent a lot of love crafting this just for you!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowWarningPopup(false); setFinalPromiseMessage(true); }}
                className="w-1/2 py-2.5 bg-white/5 hover:bg-white/10 text-rose-300 text-xs font-bold uppercase rounded-xl border border-white/10 cursor-pointer"
              >
                End
              </button>
              <button
                onClick={() => setShowWarningPopup(false)}
                className="w-1/2 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold uppercase rounded-xl cursor-pointer border border-rose-500/30"
              >
                Continue ❤️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
