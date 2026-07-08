import React from 'react';
import { Clock } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

export default function Countdown({ targetDate, title = "Countdown to our Special Moment" }) {
  const timeLeft = useCountdown(targetDate);

  if (!targetDate) return null;

  return (
    <div className="glass-card-rose rounded-3xl p-6 text-center border shadow-glass-rose max-w-xl mx-auto">
      <h3 className="font-heading font-bold text-sm text-wineDeep uppercase tracking-wider mb-4 flex items-center justify-center space-x-2">
        <Clock className="w-4 h-4 text-rosePrimary" />
        <span>{title}</span>
      </h3>
      
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Mins' },
          { value: timeLeft.seconds, label: 'Secs' }
        ].map((item, i) => (
          <div key={i} className="bg-white/80 p-3 rounded-2xl border border-rosePrimary/10 shadow-sm">
            <span className="block font-heading font-extrabold text-xl sm:text-3xl text-wineDeep">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
