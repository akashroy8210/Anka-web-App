import React from 'react';
import { Heart, Sparkles, Gift } from 'lucide-react';

export default function BirthdayControl({ sendLiveAction }) {
  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Confetti control */}
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xs">
          <div>
            <h3 className="text-xs font-black text-[#6B1D2F] flex items-center gap-1.5 uppercase tracking-wide">
              🎉 Party Confetti
            </h3>
            <p className="text-[11px] text-slate-600 font-light mt-1.5 leading-relaxed">
              Launches colorful paper confetti showers from both corners of the screen.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('confetti')}
            className="w-full py-2.5 rounded-xl bg-[#6B1D2F] hover:bg-[#521523] text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Trigger Confetti 🎉
          </button>
        </div>

        {/* Fireworks control */}
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xs">
          <div>
            <h3 className="text-xs font-black text-[#6B1D2F] flex items-center gap-1.5 uppercase tracking-wide">
              🎆 Celebration Fireworks
            </h3>
            <p className="text-[11px] text-slate-600 font-light mt-1.5 leading-relaxed">
              Triggers localized multi-colored firecracker explosions on their canvas.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('fireworks')}
            className="w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Trigger Fireworks 🎆
          </button>
        </div>

        {/* Force Unlock control */}
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xs">
          <div>
            <h3 className="text-xs font-black text-[#6B1D2F] flex items-center gap-1.5 uppercase tracking-wide">
              🔓 Force Unlock Letter
            </h3>
            <p className="text-[11px] text-slate-600 font-light mt-1.5 leading-relaxed">
              Instantly unlocks the handwritten love letter envelope for immediate viewing.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('reveal')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Force Unlock 🔓
          </button>
        </div>

        {/* Extinguish Candles control */}
        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xs">
          <div>
            <h3 className="text-xs font-black text-[#6B1D2F] flex items-center gap-1.5 uppercase tracking-wide">
              🎂 Extinguish Candles
            </h3>
            <p className="text-[11px] text-slate-600 font-light mt-1.5 leading-relaxed">
              Blow out the candles remotely and play the custom cheers & birthday song.
            </p>
          </div>
          <button
            onClick={() => sendLiveAction('start-celebration')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Blow Candles 🎂
          </button>
        </div>

        {/* Cake Slicing Animation control */}
        <div className="bg-rose-50/80 border border-rose-300/80 rounded-2xl p-5 flex flex-col justify-between gap-4 sm:col-span-2 shadow-sm">
          <div>
            <h3 className="text-sm font-black text-[#6B1D2F] flex items-center gap-2 uppercase tracking-wide">
              🔪 Cake Slicing & Feeding Stage
            </h3>
            <p className="text-xs text-slate-600 font-light mt-1.5 leading-relaxed">
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6B1D2F] via-rose-700 to-[#6B1D2F] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer tracking-widest uppercase"
          >
            🎂 Trigger Cake Slicing Stage 🎂
          </button>
        </div>

      </div>
    </div>
  );
}
