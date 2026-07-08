import React from 'react';

export default function Confetti({ active }) {
  if (!active) return null;

  const confettiList = Array.from({ length: 40 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${6 + Math.random() * 4}s`,
    color: ['#F43F5E', '#EC4899', '#D946EF', '#A855F7', '#FFD700', '#FF69B4'][Math.floor(Math.random() * 6)],
    size: `${Math.random() * 8 + 6}px`
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-40">
      {confettiList.map((c, i) => (
        <span
          key={i}
          className="falling-petal absolute rounded-full"
          style={{
            left: c.left,
            animationDelay: c.delay,
            animationDuration: c.duration,
            backgroundColor: c.color,
            width: c.size,
            height: c.size,
          }}
        />
      ))}
    </div>
  );
}
