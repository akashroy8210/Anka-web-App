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
      <div className="bday-card rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">

        {feedbackAnswer === 'yes' ? (
          <div className="space-y-4 animate-slide-up">
            <Heart className="w-10 h-10 bday-text-accent fill-current animate-heartbeat mx-auto" />
            <h3 className="font-romantic text-4xl bday-text-title">I knew you'd love it! ❤️</h3>
            <p className="text-sm bday-text-sub leading-relaxed max-w-sm mx-auto">
              Your smile is the best gift I could hope for. Thank you for walking this journey with me!
            </p>
          </div>
        ) : finalPromiseMessage ? (
          <div className="space-y-4 animate-slide-up">
            <Smile className="w-10 h-10 bday-text-accent mx-auto" />
            <h3 className="font-romantic text-4xl bday-text-title">Promise me one more smile 😊</h3>
            <p className="text-sm bday-text-sub leading-relaxed max-w-sm mx-auto">
              Kyunki aapki pyaari hasi hi is surprise ki asli kamyabi hai.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-romantic text-4xl bday-text-title">Did you enjoy this? 🎉</h3>
              <p className="text-xs bday-text-sub leading-relaxed">
                Let the sender know this journey brought joy!
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={handleFeedbackYes}
                className="px-8 py-3 bday-btn text-xs font-black uppercase tracking-widest rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                ❤️ Loved it!
              </button>
              <button
                onClick={handleFeedbackNo}
                className="px-8 py-3 bday-btn-secondary text-xs font-black uppercase tracking-widest rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all"
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
          <div className="bday-card rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center space-y-5 animate-slide-up">
            <Heart className="w-10 h-10 bday-text-accent fill-current mx-auto animate-heartbeat" />
            <h4 className="font-romantic text-3xl bday-text-title">Are you sure?</h4>
            <p className="text-xs bday-text-sub leading-relaxed">
              Your planner spent a lot of love crafting this just for you!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowWarningPopup(false); setFinalPromiseMessage(true); }}
                className="w-1/2 py-2.5 bday-btn-secondary text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                End
              </button>
              <button
                onClick={() => setShowWarningPopup(false)}
                className="w-1/2 py-2.5 bday-btn text-xs font-bold uppercase rounded-xl cursor-pointer"
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
