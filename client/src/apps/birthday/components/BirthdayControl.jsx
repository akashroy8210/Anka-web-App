import React from 'react';
import { Heart, Sparkles, Gift } from 'lucide-react';

export default function BirthdayControl({ sendLiveAction }) {
  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Confetti control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🎉 Party Confetti
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Launches colorful paper confetti showers from both corners of the screen.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('confetti')}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Confetti 🎉
          </button>
        </div>

        {/* Fireworks control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🎆 Celebration Fireworks
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Triggers localized multi-colored firecracker explosions on their canvas.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('fireworks')}
            className="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Trigger Fireworks 🎆
          </button>
        </div>

        {/* Force Unlock control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🔓 Force Unlock Letter
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Instantly unlocks the handwritten love letter envelope for immediate viewing.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('reveal')}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Force Unlock 🔓
          </button>
        </div>

        {/* Extinguish Candles control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-rose-250 flex items-center gap-1.5 uppercase tracking-wide">
              🎂 Extinguish Candles
            </h3>
            <p className="text-[10px] text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Blow out the candles remotely and play the custom cheers & birthday song.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('start-celebration')}
            className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Blow Candles 🎂
          </button>
        </div>

        {/* Cake Slicing Animation control */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4 sm:col-span-2 shadow-[0_0_20px_rgba(244,63,94,0.1)] border-rose-500/25">
          <div>
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wide">
              🔪 Cake Slicing & Feeding Stage
            </h3>
            <p className="text-xs text-rose-200/40 font-light mt-1.5 leading-relaxed">
              Triggers the birthday cake slicing animation, reveals the feeding overlay scene, and releases looping crowd cheer sound overlays in real-time.
            </p>
          </div>
          <button
            onClick={() => {
              const confirmSlicing = window.confirm("Are you ready to initiate the cake slicing & feeding scene? 🎂");
              if (confirmSlicing) {
                sendLiveAction('cake-reveal');
              }
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer tracking-widest uppercase"
          >
            🎂 Trigger Cake Slicing Stage 🎂
          </button>
        </div>

      </div>
    </div>
  );
}
