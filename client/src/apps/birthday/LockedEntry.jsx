import React from 'react';
import { Heart } from 'lucide-react';

export default function LockedEntry({ currentTime, timeLeft, setJourneyStep }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0813] flex flex-col items-center justify-between p-6 sm:p-10 select-none">
      {/* Subtle cosmic particle graphics */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-purple-500/5 filter blur-3xl animate-float-slow -z-10"></div>
      <div className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full bg-fuchsia-500/10 filter blur-3xl animate-float-reverse -z-10"></div>

      {/* Top Clock */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Live Clock</span>
        <div className="font-mono text-purple-200 text-xl sm:text-2xl font-bold bg-slate-950/60 px-5 py-2.5 rounded-2xl border border-purple-500/10 shadow-sm inline-block">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Main Locked Message */}
      <div className="text-center space-y-6 max-w-lg mx-auto">
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-slate-950/40 border border-purple-500/25 rounded-[32px] shadow-2xl flex items-center justify-center mx-auto animate-heartbeat">
            <Heart className="w-14 h-14 text-purple-400 fill-purple-400" />
          </div>
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black text-purple-300 uppercase tracking-widest bg-purple-950/80 border border-purple-500/25 px-3 py-1 rounded-full">
            Locked Surprise
          </span>
        </div>

        <div className="space-y-3.5">
          <h2 className="font-heading font-black text-2.5xl sm:text-4xl text-purple-200 leading-tight">
            Pyaar Ka Yaadgar Tohfa 💖
          </h2>
          <p className="text-base text-purple-300 font-light leading-relaxed max-w-sm mx-auto">
            Someone has planned something special for you. The surprise will unlock at the perfect moment...
          </p>
        </div>
      </div>

      {/* Countdown timer */}
      <div className="w-full max-w-md mx-auto text-center space-y-4">
        <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Unlocking In</h4>
        
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Mins' },
            { value: timeLeft.seconds, label: 'Secs' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-950/40 p-4.5 rounded-2xl border border-purple-500/10 shadow-sm relative overflow-hidden group hover:border-purple-500/30 transition-colors">
              <span className="block font-heading font-extrabold text-2xl sm:text-3.5xl text-purple-200 leading-none mb-1">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block">{item.label}</span>
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-500/10 group-hover:bg-purple-500 transition-colors"></div>
            </div>
          ))}
        </div>

        {/* Instant Unlock Link */}
        <div className="pt-4 opacity-40 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setJourneyStep(1)} 
            className="text-xs text-purple-400 underline cursor-pointer"
          >
            Immediate unlock preview
          </button>
        </div>
      </div>
    </div>
  );
}
