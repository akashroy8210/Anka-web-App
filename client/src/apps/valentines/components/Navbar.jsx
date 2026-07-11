import React, { useState, useEffect } from "react";
import MusicPlayer from "./MusicPlayer";
import ThemeToggle from "./ThemeToggle";
import { Heart } from "lucide-react";

export default function Navbar({ isMusicPlaying, setIsMusicPlaying, welcomeEntered, theme, setTheme, isFinale }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Background shading on scroll
      setIsScrolled(window.scrollY > 50);

      // Scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 
        ${isScrolled 
          ? "py-3 bg-glass-bg/60 backdrop-blur-md border-b border-glass-border shadow-sm" 
          : "py-5 bg-transparent"
        } 
        ${welcomeEntered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}`}
    >
      {/* Scroll Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-romantic-pink to-lavender-glow transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#welcome" 
          className="flex items-center gap-2 text-romantic-pink font-display text-lg md:text-xl font-semibold hover:opacity-80 transition-opacity"
        >
          <Heart className="w-5 h-5 fill-current animate-pulse text-romantic-pink" />
          <span className="hidden sm:inline font-bold tracking-wide">A Place Just For Us</span>
        </a>

        {/* Floating Menu Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <MusicPlayer isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} isFinale={isFinale} />
        </div>
      </div>
    </header>
  );
}
