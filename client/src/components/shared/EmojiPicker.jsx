import React from 'react';
import { X } from 'lucide-react';

const PREDEFINED_EMOJIS = [
  '❤️', '💖', '💌', '🎵', '🎂', '🌹', '✨', '📸', '🎤', 
  '💬', '🎁', '💍', '🎈', '🎉', '🧸', '🍫', '☕', '🔒', '💝',
  '📅', '🌟', '🧁', '⭐', '🔥', '🍿', '🎸', '🎥', '🥂', '🥳'
];

export default function EmojiPicker({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 w-full max-w-xs border border-rosePrimary/20 shadow-xl space-y-4 text-center animate-scale-in">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-xs font-bold text-wineDeep uppercase tracking-wider">Select Emoji / Icon</span>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3 py-2">
          {PREDEFINED_EMOJIS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="text-2xl p-2 hover:bg-rose-50 rounded-xl transition-all active:scale-90 hover:scale-110 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
