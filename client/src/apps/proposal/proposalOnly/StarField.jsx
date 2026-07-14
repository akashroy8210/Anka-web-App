import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function StarField({ count = 80 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      twinkleDuration: 2 + Math.random() * 4,
      delay: Math.random() * 2
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{ 
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.25, 1]
          }}
          transition={{ 
            duration: star.twinkleDuration, 
            repeat: Infinity, 
            delay: star.delay,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-slate-200"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            filter: star.size > 1 ? 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))' : 'none'
          }}
        />
      ))}
    </div>
  );
}
