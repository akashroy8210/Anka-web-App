import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
const kiss = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600";

export default function Hero() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.width / 2);
    y.set(e.clientY - rect.height / 2);
  };

  const [displayText, setDisplayText] = useState("");
  const sequence = [
    "Some moments feel like forever...",
    "Some kisses feel like home."
  ];
  const [seqIdx, setSeqIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = sequence[seqIdx];
    let timer;
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentText.substring(0, charIdx - 1));
        setCharIdx(prev => prev - 1);
      }, 30);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentText.substring(0, charIdx + 1));
        setCharIdx(prev => prev + 1);
      }, 75);
    }

    if (!isDeleting && charIdx === currentText.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setSeqIdx(prev => (prev + 1) % sequence.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, seqIdx]);

  return (
    <section
      onMouseMove={handleMouse}
      className="h-screen flex flex-col items-center justify-center text-white relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, #1a1a2e, #0f0f1a 60%, #000)",
      }}
    >
      {/* Mouse Glow */}
      <div className="absolute w-[400px] h-[400px] bg-pink-500 opacity-20 blur-[140px] rounded-full animate-pulse" />

      {/* Heartbeat */}
      <div className="absolute w-[250px] h-[250px] bg-red-500 rounded-full blur-[120px] opacity-30 animate-ping" />

      <motion.img
        src={kiss}
        style={{ rotateX, rotateY }}
        initial={{ scale: 1.3, filter: "blur(40px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2 }}
        className="w-[320px] md:w-[520px] rounded-3xl shadow-2xl"
      />

      <h1 className="text-6xl mt-10 font-semibold">
        Happy Kiss Day ❤️
      </h1>

      {/* Cinematic typing */}
      <div className="mt-6 text-xl text-gray-300 min-h-[30px]">
        {displayText}
        <span className="animate-pulse ml-0.5 font-bold">|</span>
      </div>
    </section>
  );
}
