import React, { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Play, Pause } from "lucide-react";
import backgroundMusic from "../assets/MUSIC/dilMeriNaSune.mp3";

export default function MusicPlayer({ isPlaying, setIsPlaying, isFinale }) {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [showSlider, setShowSlider] = useState(false);

  // Soft romantic ambient piano loop
  const musicSrc = backgroundMusic;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    let targetVolume = isMuted ? 0 : volume;
    if (isFinale) {
      targetVolume = 0.85; // Increase volume for the emotional climax
    }
    audio.volume = targetVolume;

    // Force play on finale
    if (isPlaying || isFinale) {
      audio.play().catch((err) => {
        console.log("Autoplay blocked by browser. Awaiting user interaction.", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isMuted, volume, isFinale]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setIsPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-glass-bg backdrop-blur-md px-4 py-2 rounded-full border border-glass-border shadow-lg pointer-events-auto">
      <audio ref={audioRef} src={musicSrc} />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="text-romantic-pink hover:text-lavender-glow transition-colors duration-200 p-1 cursor-pointer"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 animate-pulse" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      {/* Music Icon & Indicator */}
      <div className="flex items-center gap-1.5 border-l border-glass-border pl-2">
        <Music 
          className={`w-4 h-4 text-romantic-pink transition-transform duration-1000 
            ${isPlaying ? "rotate-360 duration-[5000ms] infinite linear animate-spin" : ""}`} 
        />
        {isPlaying && (
          <div className="flex items-end gap-[2px] h-3 w-4">
            <div className="w-[3px] bg-romantic-pink animate-[bounce_0.8s_infinite_0s] rounded-full h-[60%]" />
            <div className="w-[3px] bg-romantic-pink animate-[bounce_0.8s_infinite_0.2s] rounded-full h-[100%]" />
            <div className="w-[3px] bg-romantic-pink animate-[bounce_0.8s_infinite_0.4s] rounded-full h-[40%]" />
          </div>
        )}
      </div>

      {/* Volume controls */}
      <div 
        className="flex items-center gap-2 border-l border-glass-border pl-2 relative"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        <button
          onClick={toggleMute}
          className="text-romantic-pink hover:text-lavender-glow transition-colors duration-200 p-1 cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {showSlider && (
          <div className="absolute right-0 bottom-full mb-2 bg-glass-bg backdrop-blur-lg border border-glass-border p-2 rounded-lg shadow-lg flex items-center justify-center -rotate-90 origin-bottom translate-y-[-10px] translate-x-[-15px] z-50">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-text-muted/20 rounded-lg appearance-none cursor-pointer accent-romantic-pink"
            />
          </div>
        )}
      </div>
    </div>
  );
}
