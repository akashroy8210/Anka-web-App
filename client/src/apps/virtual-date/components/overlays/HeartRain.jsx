import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeartRain() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const generatedHearts = [];
    const count = 90;
    
    // Rich Red & Vibrant Pink Palette
    const colors = [
      "#E63946", // Bright Red
      "#E11D48", // Crimson Rose
      "#F43F5E", // Deep Rose Pink
      "#FF4D6D", // Bright Pink
      "#FF758F", // Coral Pink
      "#FF8FA3", // Soft Rose Pink
      "#D90429", // Ruby Red
      "#FF0054"  // Hot Pink
    ];

    for (let i = 0; i < count; i++) {
      generatedHearts.push({
        id: i,
        x: Math.random() * 100, // horizontal start position (vw)
        delay: Math.random() * 2.5, // staggered arrival delay (seconds)
        duration: 3.5 + Math.random() * 3.5, // fall duration (seconds)
        size: 16 + Math.random() * 26, // dimensions (px)
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
            y: "115vh", // Traverses all the way to bottom of screen
            opacity: [0, 0.95, 0.95, 0.95, 0], // Stays fully visible until reaching bottom
            rotate: h.rotation,
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            ease: "linear",
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
            className="w-full h-full drop-shadow-[0_3px_8px_rgba(225,29,72,0.3)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
