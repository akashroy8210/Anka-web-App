import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

export default function ValentineCustomizer({
  valentineGreeting,
  setValentineGreeting,
  valentineProposalText,
  setValentineProposalText,
  unlockAllDays,
  setUnlockAllDays
}) {
  return (
    <div className="bg-white border border-rosePrimary/10 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
      <h3 className="font-heading font-bold text-base text-wineDeep flex items-center space-x-2 border-b border-rosePrimary/10 pb-3">
        <Calendar className="w-4 h-4 text-rosePrimary animate-pulse" />
        <span>Valentine's Week Settings 🌸</span>
      </h3>

      {/* Main Page Greeting Title */}
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Special Delivery Greeting Header
        </label>
        <input
          type="text"
          value={valentineGreeting || ''}
          onChange={(e) => setValentineGreeting(e.target.value)}
          placeholder="e.g. For You Baby (-ve♥️)💕"
          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800"
        />
        <span className="text-[9px] text-slate-400 font-light mt-1 block">
          This header message will pop up at the top of your custom valentine envelope.
        </span>
      </div>

      {/* Climax Proposal Letter Text */}
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Climax Proposal Letter Text
        </label>
        <textarea
          rows={3}
          value={valentineProposalText || ''}
          onChange={(e) => setValentineProposalText(e.target.value)}
          placeholder="e.g. I've planned a day full of sweet moments, but it's missing the most important ingredient:"
          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-rosePrimary text-slate-800 resize-none font-sans"
        />
        <span className="text-[9px] text-slate-400 font-light mt-1 block">
          This will override the romantic letter text shown when the recipient unlocks the final Valentine Day proposal card.
        </span>
      </div>

      {/* Unlock All Days Checkbox */}
      <div className="flex items-center space-x-3 bg-rose-50/20 border border-rosePrimary/10 p-4 rounded-2xl">
        <input
          type="checkbox"
          id="unlockAllDays"
          checked={!!unlockAllDays}
          onChange={(e) => setUnlockAllDays(e.target.checked)}
          className="w-4 h-4 text-rosePrimary focus:ring-rosePrimary border-slate-350 rounded cursor-pointer"
        />
        <div className="text-left">
          <label htmlFor="unlockAllDays" className="text-xs font-bold text-slate-700 uppercase tracking-wide block cursor-pointer">
            Bypass Lock Date Constraint (Unlock All Days)
          </label>
          <span className="text-[9.5px] text-slate-500 font-light leading-normal block mt-0.5">
            Check this box to unlock all seven days immediately (Rose, Teddy, Promise, Kiss, Hug, chocolate) so the recipient can view them all at once without waiting for the exact dates in February!
          </span>
        </div>
      </div>
    </div>
  );
}
