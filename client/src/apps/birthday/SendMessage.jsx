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
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_16px_48px_rgba(0,0,0,0.4)] space-y-5 relative overflow-hidden">
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-1">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[9px] font-black uppercase tracking-widest inline-block">
            💬 Send a Reply
          </span>
          <h3 className="font-romantic text-3xl text-white">Write a Thank-You</h3>
          <p className="text-xs text-rose-200/40 leading-relaxed max-w-sm mx-auto">
            Your reply will appear in the sender's dashboard.
          </p>
        </div>

        {responseSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-slide-up">
            <Heart className="w-12 h-12 text-rose-400 fill-rose-400 animate-heartbeat mx-auto" />
            <h4 className="font-romantic text-3xl text-white">Sent with Love! ❤️</h4>
            <p className="text-xs text-rose-200/50">Your message has been dispatched to the planner.</p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <textarea
              rows={3}
              required
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Oh my god! This is the most beautiful thing… ❤️"
              className="w-full px-4 py-3 text-sm border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white/5 text-slate-100 placeholder-rose-200/20 leading-relaxed resize-none focus:border-rose-500/50 backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={submittingResponse}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border border-rose-500/30"
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
