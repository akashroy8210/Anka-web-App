import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Crash({ onNext }) {
  const [phase, setPhase] = useState(0); // 0: blackout, 1: text reveal, 2: glow transition

  useEffect(() => {
    // 1. Synthesize dramatic crash impact sound using Web Audio API
    const playCrashSound = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        // Low boom oscillator (140Hz -> 25Hz low frequency drop)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);

        // Noise crash impact buffer
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        whiteNoise.start();
        whiteNoise.stop(ctx.currentTime + 0.4);
      } catch (err) {
        // Fallback silently if audio context is blocked
      }
    };

    playCrashSound();

    // 2. Trigger mobile haptic vibration sequence upon blackout/crash
    if (typeof window !== 'undefined' && 'navigator' in window && typeof window.navigator.vibrate === 'function') {
      try {
        window.navigator.vibrate([150, 70, 250, 100, 400]);
      } catch (err) {
        // Fallback silently
      }
    }

    // Phase 0: Silent blackout (500ms)
    // Phase 1: Romantic quote reveal (1.2s)
    // Phase 2: Restored transition (600ms -> onNext)
    const timer1 = setTimeout(() => {
      setPhase(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setPhase(2);
      setTimeout(() => {
        onNext();
      }, 700);
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onNext]);

  const handleSkip = () => {
    onNext();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleSkip}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6 text-white overflow-hidden select-none cursor-pointer"
    >
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div 
            key="phase-quote"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="max-w-md text-center space-y-4"
          >
            <p className="text-xl md:text-2xl font-light text-rose-200 gf-font-serif italic leading-relaxed">
              "I almost lost every memory we created..."
            </p>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div 
            key="phase-restored"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-t from-rose-950/40 via-amber-950/20 to-black flex items-center justify-center"
          >
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-xs font-bold tracking-widest uppercase text-amber-200"
            >
              Memories Restored ❤️
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
