import React from 'react';
import { motion } from 'framer-motion';

export default function ConstellationLines({ stars = [] }) {
  if (stars.length < 2) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <linearGradient id="constLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(253, 224, 71, 0.2)" />
          <stop offset="50%" stopColor="rgba(244, 63, 94, 0.25)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.2)" />
        </linearGradient>
      </defs>
      
      {stars.map((star, idx) => {
        if (idx === stars.length - 1) return null;
        const x1 = 15 + (idx * 33) % 70;
        const y1 = 15 + (idx * 27) % 70;
        const nextIdx = idx + 1;
        const x2 = 15 + (nextIdx * 33) % 70;
        const y2 = 15 + (nextIdx * 27) % 70;
        
        return (
          <motion.line
            key={idx}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke="url(#constLineGrad)"
            strokeWidth="1.6"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: idx * 0.15 }}
          />
        );
      })}
    </svg>
  );
}
