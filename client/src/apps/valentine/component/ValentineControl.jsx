import React, { useState } from 'react';
import { Heart, Sparkles, Calendar } from 'lucide-react';

export default function ValentineControl({ sendLiveAction }) {
  const [selectedDay, setSelectedDay] = useState("Rose");

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Heart Rain control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
              Floating Heart Rain
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Triggers a shower of sweet pink floating hearts across her screen.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('heart-rain')}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-350 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Heart Rain 💖
          </button>
        </div>

        {/* Rose Shower control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🌹 Rose Shower
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Causes beautiful falling red roses to fill her entire window frame.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('rose-fall')}
            className="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Rose Shower 🌹
          </button>
        </div>

        {/* Force Day Reveal control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4 sm:col-span-2">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Force Reveal Selected Day
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light leading-normal">
              Force the recipient's viewport to instantly open and reveal the selected love card day.
            </p>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white outline-none focus:border-rose-400 font-sans"
            >
              <option value="Rose" className="bg-[#0A0B1E]">🌹 Rose Day</option>
              <option value="Propose" className="bg-[#0A0B1E]">💍 Propose Day</option>
              <option value="Choclate" className="bg-[#0A0B1E]">🍫 Chocolate Day</option>
              <option value="Teddy" className="bg-[#0A0B1E]">🧸 Teddy Day</option>
              <option value="Promise" className="bg-[#0A0B1E]">🤝 Promise Day</option>
              <option value="Hug" className="bg-[#0A0B1E]">🤗 Hug Day</option>
              <option value="Kiss" className="bg-[#0A0B1E]">💋 Kiss Day</option>
              <option value="Valentine" className="bg-[#0A0B1E]">💝 Valentine Day</option>
            </select>
          </div>
          <button
            onClick={() => sendLiveAction('reveal-day', { day: selectedDay })}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            Force Open Day card ✨
          </button>
        </div>

      </div>
    </div>
  );
}
