import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeartRain() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const generatedHearts = [];
    const count = 100;
    const colors = ["#FFB3C6", "#F8C8DC", "#FFD6E0", "#E7C6FF"]; // Premium pastel tones

    for (let i = 0; i < count; i++) {
      generatedHearts.push({
        id: i,
        x: Math.random() * 100, // horizontal start position (vw)
        delay: Math.random() * 4, // staggered arrival delay (seconds)
        duration: 4 + Math.random() * 4, // float fall duration (seconds)
        size: 14 + Math.random() * 24, // dimensions (px)
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: (Math.random() - 0.5) * 90 // rotation angle (deg)
      });
    }
    setHearts(generatedHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: "-15vh", x: `${h.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "115vh",
            opacity: [0, 0.85, 0.85, 0],
            rotate: h.rotation,
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            ease: "easeOut",
          }}
          className="absolute"
          style={{
            width: h.size,
            height: h.size,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={h.color}
            className="w-full h-full drop-shadow-[0_2px_5px_rgba(244,63,94,0.15)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
