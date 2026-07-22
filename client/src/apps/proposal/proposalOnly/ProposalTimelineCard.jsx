import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/shared/GlassCard';
import MediaViewer from '../../../components/shared/MediaViewer';
import { Lock } from 'lucide-react';

export default function ProposalTimelineCard({ item, index }) {
  const [localUnlocked, setLocalUnlocked] = useState(false);
  const [inputAnswer, setInputAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);

  const hasLock = item.question?.trim() && item.answer?.trim();
  const isUnlocked = !hasLock || localUnlocked;

  const handleVerify = (e) => {
    e.preventDefault();
    if (!inputAnswer.trim()) return;

    if (inputAnswer.trim().toLowerCase() === item.answer.trim().toLowerCase()) {
      setErrorMsg('');
      setLocalUnlocked(true);
    } else {
      setErrorMsg('Not quite right. Try again! 🤭');
    }
  };

  return (
    <motion.div
      initial={{ x: -15, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="relative space-y-3 pl-6"
    >
      {/* Dynamic timeline node */}
      <div className="absolute -left-[7px] top-2.5 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-950 shadow-[0_0_10px_rgba(244,63,94,0.6)] z-10" />
      
      {isUnlocked ? (
        <GlassCard glowColor="rose" className="border-rose-500/10 hover:border-rose-500/20 shadow-lg !p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/5 pb-2">
            <h4 className="font-heading font-black text-sm text-rose-100">{item.title}</h4>
            <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
              {item.date && <span>📅 {item.date}</span>}
              {item.location && <span>📍 {item.location}</span>}
            </div>
          </div>
          {item.photo && (
            <MediaViewer
              src={item.photo}
              alt={item.title}
              aspectRatio="aspect-video"
            />
          )}
          {item.description && (
            <p className="text-xs text-slate-300 font-light leading-relaxed">{item.description}</p>
          )}
        </GlassCard>
      ) : (
        <form
          onSubmit={handleVerify}
          className="bg-slate-950/80 backdrop-blur-xl border border-rose-500/15 rounded-[24px] p-5 shadow-2xl flex flex-col items-center justify-center text-center space-y-3.5 max-w-[360px]"
        >
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center relative">
            <Lock className="w-4 h-4 text-rose-400" />
            <span className="absolute inset-0 bg-rose-500/5 rounded-full scale-125 animate-pulse" />
          </div>

          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wider">Locked Milestone</h4>
            <p className="text-[9px] text-slate-400">Answer this question to reveal this memory:</p>
          </div>

          <div className="w-full p-3 bg-black/40 border border-white/5 rounded-xl text-left">
            <p className="text-xs text-rose-100 font-semibold leading-relaxed font-sans">
              {item.question}
            </p>
          </div>

          <div className="w-full space-y-1">
            <input
              type="text"
              value={inputAnswer}
              onChange={(e) => {
                setInputAnswer(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Type answer here..."
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50 text-center font-sans"
              autoComplete="off"
            />
            {errorMsg && (
              <p className="text-[9px] text-rose-400 font-bold animate-pulse font-sans">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-sans"
          >
            Verify Answer 🔑
          </button>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-[8px] font-bold text-rose-450 hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none font-sans"
          >
            <span>{showHint ? 'Hide Hint' : 'Need a hint? 💡'}</span>
          </button>
          {showHint && (
            <div className="w-full p-2 bg-rose-950/20 border border-rose-900/35 rounded-lg text-left">
              <p className="text-[9px] text-rose-300 font-light leading-relaxed font-sans">
                Hint: The answer matches {item.answer}.
              </p>
            </div>
          )}
        </form>
      )}
    </motion.div>
  );
}
