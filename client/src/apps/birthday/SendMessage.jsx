import React from 'react';
import { Send, Heart } from 'lucide-react';

export default function SendMessage({
  instance,
  responseSubmitted,
  responseText,
  setResponseText,
  handleSendMessage,
  submittingResponse,
}) {
  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="bday-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden">

        <div className="text-center space-y-1">
          <span className="px-3 py-1 rounded-full bday-card bday-text-accent text-[9px] font-black uppercase tracking-widest inline-block">
            💬 Send a Reply
          </span>
          <h3 className="font-romantic text-3xl bday-text-title">Write a Thank-You</h3>
          <p className="text-xs bday-text-sub leading-relaxed max-w-sm mx-auto">
            Your reply will appear in the sender's dashboard.
          </p>
        </div>

        {responseSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-slide-up">
            <Heart className="w-12 h-12 bday-text-accent fill-current animate-heartbeat mx-auto" />
            <h4 className="font-romantic text-3xl bday-text-title">Sent with Love! ❤️</h4>
            <p className="text-xs bday-text-sub">Your message has been dispatched to the planner.</p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <textarea
              rows={3}
              required
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Oh my god! This is the most beautiful thing… ❤️"
              className="w-full px-4 py-3 text-sm bday-input rounded-2xl leading-relaxed resize-none"
            />
            <button
              type="submit"
              disabled={submittingResponse}
              className="w-full py-3 bday-btn text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {submittingResponse ? 'Sending…' : 'Send Message Back'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
