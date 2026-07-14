import React, { Suspense } from 'react';
import ProposalProvider from './ProposalProvider';
import { useProposal } from './hooks/useProposal';
import { ProposalRegistry } from './services/proposalRegistry';
import LivingBackground from '../../components/animations/LivingBackground';
import { Heart, Volume2, VolumeX, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ProposalSurpriseContent() {
  const {
    stage,
    isPlayingMusic,
    isMuted,
    handleToggleMute,
    showHeartRain,
    socketPopup,
    setSocketPopup,
    socketNotification,
    socketLiveMsg,
    config,
    bgAudioRef
  } = useProposal();

  // Resolve active section component from registry
  const currentSection = ProposalRegistry.find(s => s.id === stage);
  const SectionComponent = currentSection ? currentSection.component : null;

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden relative flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      
      {/* Background ambient music */}
      <audio
        ref={bgAudioRef}
        src={config.musicUrl}
        loop
      />

      {/* Twinkling Star/Heart Canvas Background Layer (Global component reuse!) */}
      <LivingBackground />

      {/* Floating audio control bar */}
      {isPlayingMusic && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg">
          <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider animate-pulse">Playing</span>
          <button onClick={handleToggleMute} className="text-white hover:text-rose-400 transition-colors cursor-pointer">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Real-time heart rain overlay */}
      {showHeartRain && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-500 text-2xl"
              initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 0.8, scale: 0.5 + Math.random() }}
              animate={{ y: window.innerHeight + 50, opacity: 0 }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            >
              ❤️
            </motion.div>
          ))}
        </div>
      )}

      {/* Real-time socket message overlays */}
      <AnimatePresence>
        {socketPopup && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          >
            <div className="bg-slate-900 border border-rose-500/20 rounded-[32px] p-6 max-w-sm text-center space-y-4 shadow-2xl relative">
              <button onClick={() => setSocketPopup(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto"><Heart className="w-6 h-6 animate-pulse" /></div>
              <p className="text-sm font-semibold text-rose-200">{socketPopup}</p>
            </div>
          </motion.div>
        )}

        {socketNotification && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-600/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full shadow-lg border border-white/20 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 animate-bounce" />
            <span>{socketNotification}</span>
          </motion.div>
        )}

        {socketLiveMsg && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-3xl max-w-xs shadow-2xl border border-white/10"
          >
            <p className="text-xs font-semibold leading-relaxed">"{socketLiveMsg}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main lazy loading sections container */}
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <Heart className="w-10 h-10 text-rose-500 animate-ping" />
        </div>
      }>
        {SectionComponent && <SectionComponent />}
      </Suspense>

      {/* Footer copyright */}
      <footer className="py-6 text-center text-[9px] uppercase tracking-widest text-slate-600 border-t border-white/5 relative z-10">
        &copy; {new Date().getFullYear()} AnKa Surprises. All rights reserved.
      </footer>
    </div>
  );
}

export default function ProposalSurprise(props) {
  return (
    <ProposalProvider {...props}>
      <ProposalSurpriseContent />
    </ProposalProvider>
  );
}
