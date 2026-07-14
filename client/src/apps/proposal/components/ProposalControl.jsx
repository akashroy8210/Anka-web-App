import React, { useState } from 'react';
import { Heart, Sparkles, AlertCircle, Volume2, Bell, MessageSquare, Send } from 'lucide-react';

export default function ProposalControl({ sendLiveAction }) {
  const [popupMsg, setPopupMsg] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [liveMsg, setLiveMsg] = useState('');

  const handleSendPopup = (e) => {
    e.preventDefault();
    if (!popupMsg.trim()) return;
    sendLiveAction('popup', { text: popupMsg.trim() });
    setPopupMsg('');
  };

  const handleSendNotif = (e) => {
    e.preventDefault();
    if (!notifMsg.trim()) return;
    sendLiveAction('notification', { text: notifMsg.trim() });
    setNotifMsg('');
  };

  const handleSendLive = (e) => {
    e.preventDefault();
    if (!liveMsg.trim()) return;
    sendLiveAction('live-message', { text: liveMsg.trim() });
    setLiveMsg('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Heart Rain control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              ❤️ Heart Rain
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Triggers a shower of animated floating hearts cascading down the recipient's screen in real-time.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('heart-rain')}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Heart Rain ❤️
          </button>
        </div>

        {/* Confetti control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🎉 Party Confetti
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Launches colorful paper confetti showers from the corners of the screen to celebrate key moments.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('confetti')}
            className="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Confetti 🎉
          </button>
        </div>

        {/* Fireworks control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              ✨ Celebration Fireworks
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Triggers magical multi-colored firecracker explosions on their viewport to elevate the emotions.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('fireworks')}
            className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Fireworks ✨
          </button>
        </div>

        {/* Play Music control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🎵 Play Music
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Plays/Resumes the configured romantic surprise soundtrack on the partner's device remotely.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('play-music')}
            className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Play Music 🎵
          </button>
        </div>

        {/* Popup Message Form */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              💌 Remote Popup Message
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1 leading-relaxed">
              Instantly open a romantic overlay dialog on their surprise journey.
            </p>
          </div>
          <form onSubmit={handleSendPopup} className="flex gap-2">
            <input
              type="text"
              value={popupMsg}
              onChange={(e) => setPopupMsg(e.target.value)}
              placeholder="Type popup text..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 text-white placeholder-white/20 border border-white/10 text-[10px] focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-rose-550 hover:bg-rose-600 text-white text-[10px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Notification Form */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🔔 Screen Notification
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1 leading-relaxed">
              Pushes a floating toaster notification warning or cute bubble text.
            </p>
          </div>
          <form onSubmit={handleSendNotif} className="flex gap-2">
            <input
              type="text"
              value={notifMsg}
              onChange={(e) => setNotifMsg(e.target.value)}
              placeholder="Type notification..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 text-white placeholder-white/20 border border-white/10 text-[10px] focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-rose-550 hover:bg-rose-600 text-white text-[10px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Live Message Form */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 sm:col-span-2 shadow-[0_0_20px_rgba(244,63,94,0.1)] border-rose-500/25">
          <div>
            <h3 className="text-sm font-bold text-rose-450 flex items-center gap-2 uppercase tracking-wide">
              💬 Live Chat Message
            </h3>
            <p className="text-xs text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Sends an interactive live bubble chat message that floats across their screen immediately.
            </p>
          </div>
          <form onSubmit={handleSendLive} className="flex gap-2">
            <input
              type="text"
              value={liveMsg}
              onChange={(e) => setLiveMsg(e.target.value)}
              placeholder="Type live chat message here..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white placeholder-white/20 border border-white/10 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-550 to-pink-550 text-white font-bold text-[10px] shadow-md uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send Message</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
