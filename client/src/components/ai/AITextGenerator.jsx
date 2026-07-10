import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AITextGenerator({
  showAiPromptField,
  setShowAiPromptField,
  aiMessagePrompt,
  setAiMessagePrompt,
  isGeneratingAiMessage,
  handleGenerateAiMessage
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-[10px] font-bold text-wineDeep uppercase tracking-wider">Surprise Message</label>
        <button
          type="button"
          onClick={() => setShowAiPromptField(!showAiPromptField)}
          className="px-2 py-0.5 bg-rose-50 text-rosePrimary border border-rosePrimary/20 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>AI Writer ✨</span>
        </button>
      </div>
      {showAiPromptField && (
        <div className="mb-2 p-2 bg-rose-50/40 border border-rosePrimary/10 rounded-xl flex gap-1.5 animate-fade-in-up">
          <input
            type="text"
            value={aiMessagePrompt}
            onChange={(e) => setAiMessagePrompt(e.target.value)}
            placeholder="Context (e.g. write about romantic coffee date)"
            className="flex-1 px-2.5 py-1.5 text-xs border rounded-xl bg-white focus:outline-none text-slate-800"
          />
          <button
            type="button"
            onClick={handleGenerateAiMessage}
            disabled={isGeneratingAiMessage || !aiMessagePrompt}
            className="px-3 py-1.5 bg-rosePrimary text-white text-[10px] font-black uppercase rounded-xl disabled:opacity-50 shrink-0 cursor-pointer flex items-center justify-center"
          >
            {isGeneratingAiMessage ? (
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Write'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
