import React, { useState } from 'react';
import { Heart, Sparkles, Clock, Send, Volume2, Calendar, Gift, Moon, Sun } from 'lucide-react';
import ReusableUploader from '../../../components/shared/ReusableUploader';

export default function VirtualDateControl({ sendLiveAction }) {
  const [shootingStarWish, setShootingStarWish] = useState("Just wanted to remind you that you're loved ❤️");
  const [countdownSecs, setCountdownSecs] = useState(10);
  const [countdownSurprise, setCountdownSurprise] = useState("We are going on a virtual coffee date right now! ☕");
  const [customQuote, setCustomQuote] = useState("Rest is not weakness, bubu.");
  const [selectedMemoryId, setSelectedMemoryId] = useState(2);
  const [customVoiceUrl, setCustomVoiceUrl] = useState("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");

  return (
    <div className="space-y-6 text-left">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Heart Rain control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
              Heart Rain
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Spawns hundreds of soft pink and purple floating hearts falling down.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('heart_rain')}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Heart Rain ❤️
          </button>
        </div>

        {/* Shooting star control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Shooting Star Wish
            </h3>
            <input
              type="text"
              value={shootingStarWish}
              onChange={(e) => setShootingStarWish(e.target.value)}
              placeholder="Enter wish..."
              className="w-full bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400 transition-all font-sans"
            />
          </div>
          <button
            onClick={() => sendLiveAction('shooting_star', { message: shootingStarWish })}
            className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Shoot Star 💫
          </button>
        </div>

        {/* Knock knock control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🚪 Knock Knock
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Triggers a knock sound alert and initiates a loving 3-step conversation gateway.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('knock')}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Knock on Screen 🚪
          </button>
        </div>

        {/* Theme toggle control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🎨 Remote Theme Overrider
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Instantly change her website skin between starlit night and daylight meadow.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => sendLiveAction('change_theme', { theme: 'dark' })}
              className="py-2 rounded-xl bg-[#120E2E] hover:bg-[#1B143F] text-pink-300 border border-pink-500/20 text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer font-sans"
            >
              <Moon className="w-3 h-3" />
              Starlit
            </button>
            <button
              onClick={() => sendLiveAction('change_theme', { theme: 'light' })}
              className="py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-350 text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer font-sans"
            >
              <Sun className="w-3 h-3" />
              Meadow
            </button>
          </div>
        </div>

        {/* Countdown control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4 sm:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Live Screen Countdown
              </h3>
              <div className="flex items-center gap-2">
                {[10, 20, 30].map((secs) => (
                  <button
                    key={secs}
                    onClick={() => setCountdownSecs(secs)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold font-sans cursor-pointer ${countdownSecs === secs ? "bg-sky-400/20 border-sky-400 text-sky-300" : "border-white/10 text-rose-200/40"}`}
                  >
                    {secs}s
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-rose-200/40 uppercase tracking-wide">
                Surprise reveal message
              </label>
              <input
                type="text"
                value={countdownSurprise}
                onChange={(e) => setCountdownSurprise(e.target.value)}
                placeholder="Surprise message..."
                className="w-full bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 outline-none focus:border-sky-400 transition-all font-sans"
              />
            </div>
          </div>
          <button
            onClick={() => sendLiveAction('show_countdown', { duration: countdownSecs, message: countdownSurprise })}
            className="w-full py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-350 border border-sky-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Screen Countdown ⌛
          </button>
        </div>

        {/* Cinematic Quote controls */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4 sm:col-span-2">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              📜 Cinematic Comfort Quote
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                placeholder="Enter cinematic quote..."
                className="flex-1 bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 outline-none focus:border-rose-450 transition-all font-sans"
              />
              <div className="flex gap-1">
                {[
                  "You don't have to carry everything alone.",
                  "Rest is not weakness.",
                  "I'm here."
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCustomQuote(preset)}
                    title={preset}
                    className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-rose-200/40 hover:text-white truncate max-w-[80px]"
                  >
                    {preset.split(" ")[0]}...
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => sendLiveAction('display_quote', { text: customQuote })}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Cast Comfort Quote Card 📜
          </button>
        </div>

        {/* Timeline unlock control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Unlock Secret Memory
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-normal">
              Force unlock a locked timeline milestone.
            </p>
            <select
              value={selectedMemoryId}
              onChange={(e) => setSelectedMemoryId(Number(e.target.value))}
              className="w-full bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white outline-none focus:border-rose-400 font-sans"
            >
              <option value={2} className="bg-[#0A0B1E]">Memory #2 (Jackets swapped)</option>
              <option value={3} className="bg-[#0A0B1E]">Memory #3 (Chaos road trip)</option>
              <option value={4} className="bg-[#0A0B1E]">Memory #4 (Asleep on shoulder)</option>
              <option value={5} className="bg-[#0A0B1E]">Memory #5 (Jaw dropped date)</option>
            </select>
          </div>
          <button
            onClick={() => sendLiveAction('unlock_memory', { memoryId: selectedMemoryId })}
            className="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Unlock Selected Memory ✨
          </button>
        </div>

        {/* Voice Note trigger */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              Push Voice Note Note
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-normal">
              Upload an audio file or type a direct audio stream URL.
            </p>
            <div className="space-y-2">
              <ReusableUploader
                accept="audio/*"
                label="Upload MP3 File"
                useAdminApi={true}
                onUploadSuccess={(url) => setVVoiceUrl(url)}
              />
              <input
                type="text"
                value={customVoiceUrl}
                onChange={(e) => setCustomVoiceUrl(e.target.value)}
                placeholder="Recorded URL or MP3 link..."
                className="w-full bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 outline-none focus:border-rose-400 transition-all font-sans"
              />
            </div>
          </div>
          <button
            onClick={() => sendLiveAction('play_voice', { audioUrl: customVoiceUrl })}
            disabled={!customVoiceUrl}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40"
          >
            Push Audio Note 🎙️
          </button>
        </div>

        {/* Special Finale trigger */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4 sm:col-span-2 shadow-[0_0_20px_rgba(244,63,94,0.1)] border-rose-500/25">
          <div>
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wide">
              <Gift className="w-4 h-4 animate-bounce" />
              Special Finale Sequence
            </h3>
            <p className="text-xs text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Trigger the grand romantic ending. Her screen will fade to deep navy darkness, background stars will glow at maximum intensity, hearts will float upward, and the final glass letter card will appear.
            </p>
          </div>
          <button
            onClick={() => {
              const confirmFinale = window.confirm("Are you ready to trigger the Grand Finale ending? ❤️");
              if (confirmFinale) {
                sendLiveAction('special_finale');
              }
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer tracking-widest uppercase"
          >
            🎆 Trigger Grand Finale 🎆
          </button>
        </div>

      </div>
    </div>
  );
}
