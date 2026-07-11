import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Mic, X } from "lucide-react";

export default function VoiceNoteAlert({ audioUrl, onClose }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log("Voice alert play failed: ", err));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnd);
    };
  }, []);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytVideoId = getYouTubeId(audioUrl);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto">
      <motion.div
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        className="glass-panel max-w-sm w-full p-8 rounded-3xl text-center relative border border-glass-border shadow-2xl flex flex-col items-center gap-6"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            onClose();
          }}
          className="absolute top-4 right-4 text-text-muted hover:text-romantic-pink transition-colors p-1 cursor-pointer"
          aria-label="Close voice alert"
        >
          <X className="w-5 h-5" />
        </button>

        {!ytVideoId && <audio ref={audioRef} src={audioUrl} />}

        {/* Pulsing Mic/Music Graphic */}
        <div className="w-16 h-16 bg-romantic-pink/20 text-romantic-pink rounded-full flex items-center justify-center relative mb-2">
          {ytVideoId ? (
            <span className="text-2xl">🎵</span>
          ) : (
            <Mic className="w-8 h-8 animate-pulse" />
          )}
          <span className="absolute inset-0 bg-romantic-pink/10 rounded-full scale-125 animate-ping" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold font-display text-text-primary">
            A message has arrived...
          </h3>
          <p className="text-sm text-text-muted font-sans font-light italic">
            {ytVideoId ? "Bubu left a song for you." : "Bubu left a voice note for you."}
          </p>
        </div>

        {/* Dynamic player content */}
        {ytVideoId ? (
          <div className="w-full bg-black/20 rounded-2xl p-2 flex flex-col gap-2">
            <iframe
              src={`https://www.youtube.com/embed/${ytVideoId}?autoplay=1`}
              className="w-full h-44 rounded-xl border border-glass-border shadow-inner"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube song note"
            />
            <p className="text-[10px] text-white/40 font-sans">
              Playing Bubu's song from YouTube 🎵
            </p>
          </div>
        ) : (
          /* Wave Bar / Play controller */
          <div className="w-full bg-black/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-text-muted font-sans font-semibold px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            <button
              onClick={handlePlayPause}
              className="w-14 h-14 rounded-full bg-voice-play text-[#120E2E] flex items-center justify-center mx-auto hover:scale-105 active:scale-95 transition-all shadow-lg shadow-voice-play/20 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              )}
            </button>
          </div>
        )}

        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.close ? audioRef.current.close() : audioRef.current.pause();
            onClose();
          }}
          className="w-full py-3 rounded-full border border-glass-border hover:border-romantic-pink text-text-secondary hover:text-romantic-pink text-sm font-semibold transition-all cursor-pointer font-sans"
        >
          Close Note
        </button>
      </motion.div>
    </div>
  );
}
