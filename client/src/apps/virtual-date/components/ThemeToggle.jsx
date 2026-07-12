import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center bg-white/10 dark:bg-black/25 backdrop-blur-md p-2.5 rounded-full border border-white/20 dark:border-white/10 shadow-lg text-romantic-pink hover:text-lavender-glow transition-all duration-300 pointer-events-auto hover:scale-105 active:scale-95 cursor-pointer"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`w-5 h-5 absolute transition-all duration-500 transform text-amber-highlight
            ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-5 h-5 absolute transition-all duration-500 transform text-lavender-glow
            ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}
        />
      </div>
    </button>
  );
}
