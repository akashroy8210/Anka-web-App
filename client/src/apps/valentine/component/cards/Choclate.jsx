import React, { useState, useEffect, useRef } from "react";
import chocolate from "../../assets/image/choclate.svg"; // ✅ FIXED IMAGE PATH
const music = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3";

function Choclate() {

  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const audioRef = useRef(null);

  // Cursor Glow
  useEffect(() => {
    const moveCursor = (e) => {
      setCursor({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };
  const text="i love you babu 💕 You know baby why i dont want choclate too much because these choclate is not a choclate real choclate is you i want to eat you baby🙈 you are so important baby i love you babu i dont need anyone other than you one thing little bit i dont understand you and you dont understand me. but you love me alot you know bbau i will  never forget about how we are in lajwaab restaurent i will never forget i will never"

  return (
    <div className="relative h-screen w-full bg-[#2A1810] overflow-hidden flex items-center justify-center">

      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{
          background: "#D4A373",
          left: cursor.x - 150,
          top: cursor.y - 150,
        }}
      />

      {/* Music */}
      <audio ref={audioRef} src={music} loop />

      <button
        onClick={toggleMusic}
        className="absolute top-6 right-6 bg-[#5C3A2E] text-[#FFF8F0] px-4 py-2 rounded-full hover:scale-105 transition duration-300"
      >
        🎵 Music
      </button>

      {/* CLOSED GIFT */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer group"
        >
          <div className="h-100 w-100 rounded-3xl flex flex-col items-center justify-center 
          transform transition duration-700 group-hover:scale-105 relative">
            <img src={chocolate} alt="" className="text-[#FFF8F0] -rotate-45 text-3xl font-['Playfair_Display'] tracking-wide"/>
            <p className="absolute -bottom-6 right-6 text-white font-bold text-2xl text-center p-2 animate-down">
              Tap to bite 🍫
            </p>
          </div>
        </div>
        
      )}

      {/* OPEN STATE */}
      {open && (
        <div className="text-center px-6 shadow-2xl py-3 animate-[fadeIn_1.2s_ease]">

          <h1 className="text-5xl mb-6 text-[#FFF8F0] animate-down  font-['Playfair_Display']">
            Happy Chocolate Day 🍫
          </h1>

          <p className="text-[#D4A373] max-w-lg font-['Inter'] text-lg leading-relaxed">
            {text.split(" ").map((word, i) => (
            <span
              key={i}
              className="inline-block opacity-0 animate-word"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {word}&nbsp;
            </span>
          ))}
              
          </p>

        </div>
      )}

    </div>
  );
}

export default Choclate;
