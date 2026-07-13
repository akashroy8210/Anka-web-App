import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Mic, Heart } from "lucide-react";
import { useCustomConfig } from "../contexts/CustomConfigContext";

export default function VoiceNote() {
  const configContext = useCustomConfig();
  const { config, isEditing, updateConfig } = configContext || {};
  const voiceNote = config?.voiceNote || {
    intro: "Bubu, I know today wasn't the easiest day, so I thought I'd stay here with you for a bit. Put on your headphones, close your eyes, and play this."
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  // A soft guitar/piano track or placeholder voice note
  const audioSrc = voiceNote.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnd = () => {
      setIsPlaying(false);
      window.dispatchEvent(new CustomEvent("voice-note-playing", { detail: { playing: false } }));
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnd);

    const handlePauseAll = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("pause-all-voice-notes", handlePauseAll);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnd);
      window.removeEventListener("pause-all-voice-notes", handlePauseAll);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        window.dispatchEvent(new CustomEvent("voice-note-playing", { detail: { playing: false } }));
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Cleanup active playing states if component unmounts
  useEffect(() => {
    return () => {
      if (isPlaying) {
        window.dispatchEvent(new CustomEvent("voice-note-playing", { detail: { playing: false } }));
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      window.dispatchEvent(new CustomEvent("voice-note-playing", { detail: { playing: false } }));
    } else {
      window.dispatchEvent(new CustomEvent("pause-all-voice-notes"));
      window.dispatchEvent(new CustomEvent("voice-note-playing", { detail: { playing: true } }));
      audioRef.current.play().catch(err => console.log("Play failed", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleScrub = (e) => {
    const val = parseFloat(e.target.value);
    audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Wave visualizer bars definition (static keys, random base heights)
  const waveBarsCount = 28;
  const barHeights = Array.from({ length: waveBarsCount }, (_, i) => 15 + Math.sin(i * 0.4) * 15 + Math.random() * 10);

  return (
    <section id="voice-note" className="py-24 px-4 max-w-3xl mx-auto relative z-10">
      {/* Title */}
      <div className="text-center mb-12 space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-romantic-pink/10 text-romantic-pink border border-romantic-pink/20"
        >
          <Mic className="w-3.5 h-3.5" />
          A Voice From Me
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold font-display text-text-primary"
        >
          A Little Message From Me
        </motion.h2>
        {isEditing ? (
          <textarea
            value={voiceNote.intro}
            onChange={(e) => updateConfig("voiceNote", "intro", e.target.value)}
            className="text-text-muted text-xs leading-relaxed font-sans font-light bg-transparent border border-dashed border-white/20 rounded-lg p-2 outline-none w-full max-w-md mx-auto text-center z-20 pointer-events-auto"
          />
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-muted max-w-md mx-auto text-sm md:text-base font-sans"
          >
            {voiceNote.intro}
          </motion.p>
        )}
      </div>

      {/* Custom Audio Player Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel bg-voice-bg p-6 md:p-8 rounded-3xl shadow-2xl pointer-events-auto flex flex-col gap-6 relative overflow-hidden"
      >
        {/* Decorative soft glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-lavender-glow/5 blur-2xl pointer-events-none" />

        <audio ref={audioRef} src={audioSrc} />

        {/* Audio Wave Visualizer */}
        <div className="h-24 w-full flex items-center justify-between gap-[2px] md:gap-[4px] px-2 md:px-4 border-b border-divider-color pb-6">
          {barHeights.map((h, i) => {
            const progress = duration > 0 ? currentTime / duration : 0;
            const barProgress = i / waveBarsCount;
            const isPlayed = progress >= barProgress;

            // Generate customized animation speed for wave movement
            const animDuration = 0.5 + Math.random() * 0.8;

            return (
              <motion.div
                key={i}
                animate={
                  isPlaying
                    ? {
                        height: [h, h * 1.8, h * 0.5, h],
                      }
                    : { height: h }
                }
                transition={
                  isPlaying
                    ? {
                        duration: animDuration,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: i * 0.03,
                      }
                    : { duration: 0.3 }
                }
                className={`flex-1 rounded-full transition-colors duration-300
                  ${
                    isPlayed 
                      ? "bg-voice-wave" 
                      : "bg-text-muted/20"
                  }`}
                style={{ height: `${h}px` }}
              />
            );
          })}
        </div>

        {/* Time Progress Slider & Labels */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1.5 bg-text-muted/20 rounded-lg appearance-none cursor-pointer accent-voice-play hover:opacity-95 transition-opacity"
          />
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted font-sans px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls Layout */}
        <div className="flex items-center justify-between">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="p-3 rounded-full hover:bg-white/10 text-voice-control transition-colors cursor-pointer"
            aria-label={isMuted ? "Unmute voice" : "Mute voice"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Master Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-voice-play hover:scale-105 active:scale-95 transition-all text-[#120E2E] shadow-lg shadow-voice-play/25 relative cursor-pointer"
            aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
            <span className="absolute inset-0 rounded-full bg-voice-play animate-ping opacity-15 scale-110 pointer-events-none" />
          </button>

          {/* Accenting Heart */}
          <div className="p-3 text-voice-control/40">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
