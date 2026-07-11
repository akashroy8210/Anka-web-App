import React from 'react';
import { Edit3, Trash2, Check, X, ExternalLink, Sparkles } from 'lucide-react';

export default function ThemeCard({
  d,
  cat,
  token,
  handleStartEditDemo,
  handleDeleteDemo,
  handleOpenCreateDemoLinkModal
}) {
  return (
    <div className="bg-slate-50 border rounded-2xl p-4 flex flex-col justify-between space-y-3">
      
      <div>
        <div className="flex justify-between items-start">
          <h6 className="font-bold text-sm text-wineDeep">{d.name}</h6>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleStartEditDemo(d, cat._id)}
              className="text-rosePrimary hover:text-wineDeep p-1 cursor-pointer"
              title="Edit Theme Details"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteDemo(d._id, cat._id, token)}
              className="text-red-655 hover:text-red-800 p-1 cursor-pointer"
              title="Delete Theme"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono mt-1 block">Theme Slug: {d.themeSlug}</span>
      </div>



      <div className="flex gap-2 pt-1 border-t border-slate-100/50">
        <a href={d.liveDemoUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-white border rounded-lg text-slate-500 hover:text-rosePrimary text-[9px] font-semibold uppercase tracking-wider flex items-center space-x-1">
          <ExternalLink className="w-3 h-3" />
          <span>Demo link</span>
        </a>
        <button
          type="button"
          onClick={() => handleOpenCreateDemoLinkModal(cat, d)}
          className="p-1.5 bg-rosePrimary/10 hover:bg-rosePrimary/20 border border-rosePrimary/20 rounded-lg text-rosePrimary text-[9px] font-black uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>Config Demo Link</span>
        </button>
      </div>
    </div>
  );
}
