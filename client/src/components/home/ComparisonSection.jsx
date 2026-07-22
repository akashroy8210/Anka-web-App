import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-rosePrimary/10">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-rosePrimary/10 text-rosePrimary text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Why Choose AnKa?</span>
        </span>
        <h2 className="font-heading font-black text-2xl sm:text-4xl text-wineDeep">How We Compare</h2>
        <p className="text-sm text-slate-500 font-light leading-relaxed">
          See how AnKa's modern digital experiences completely redefine romantic gifting compared to traditional platforms.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-[32px] border border-rosePrimary/10 shadow-lg bg-white/70 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-rosePrimary/5">
              <th className="p-6 text-sm font-black text-wineDeep uppercase tracking-wider">Features</th>
              <th className="p-6 text-sm font-black text-rosePrimary uppercase tracking-wider bg-rosePrimary/5">AnKa Surprises 💖</th>
              <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider">Other Gifting Websites</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-6 text-sm font-bold text-wineDeep">Interactive Real-time Control</td>
              <td className="p-6 text-xs bg-rosePrimary/5 text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Yes (Trigger Live Rain, Music & Confetti)</span>
                </div>
              </td>
              <td className="p-6 text-xs text-slate-500 font-light">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>No (Static pages or plain greetings)</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-6 text-sm font-bold text-wineDeep">Delivery Speed</td>
              <td className="p-6 text-xs bg-rosePrimary/5 text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant (Under 2 Minutes)</span>
                </div>
              </td>
              <td className="p-6 text-xs text-slate-500 font-light">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>3 to 7 Days (Subject to courier delays)</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-6 text-sm font-bold text-wineDeep">Long Distance Vibe</td>
              <td className="p-6 text-xs bg-rosePrimary/5 text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Perfect (Share a single romantic link globally)</span>
                </div>
              </td>
              <td className="p-6 text-xs text-slate-500 font-light">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Expensive international shipping & customs</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-6 text-sm font-bold text-wineDeep">Personalization Level</td>
              <td className="p-6 text-xs bg-rosePrimary/5 text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>High (Record voice notes, upload tracks & messages)</span>
                </div>
              </td>
              <td className="p-6 text-xs text-slate-500 font-light">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Basic (Upload one photo & standard print text)</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-6 text-sm font-bold text-wineDeep">Pricing & Value</td>
              <td className="p-6 text-xs bg-rosePrimary/5 text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Extremely budget friendly (starts at just ₹49)</span>
                </div>
              </td>
              <td className="p-6 text-xs text-slate-500 font-light">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Premium price tag (starts at ₹1,500+)</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-6 text-sm font-bold text-wineDeep">Environmental Impact</td>
              <td className="p-6 text-xs bg-rosePrimary/5 text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Eco-friendly (100% Digital & Zero Waste)</span>
                </div>
              </td>
              <td className="p-6 text-xs text-slate-500 font-light">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Non-biodegradable packaging & delivery footprint</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
