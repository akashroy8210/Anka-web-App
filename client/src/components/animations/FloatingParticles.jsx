import React from 'react';

export default function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      
      {/* Top-Right Decorative Botanical Watermark (Large) */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 text-rosePrimary/5 transform translate-x-12 -translate-y-12 opacity-80">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4">
          {/* Stem */}
          <path d="M10,90 Q30,60 50,50 Q70,40 90,10" />
          {/* Leaf 1 */}
          <path d="M30,60 Q20,50 30,40 Q40,50 30,60 Z" fill="currentColor" fillOpacity="0.05" />
          {/* Leaf 2 */}
          <path d="M50,50 Q40,35 50,25 Q60,35 50,50 Z" fill="currentColor" fillOpacity="0.05" />
          {/* Leaf 3 */}
          <path d="M70,28 Q60,15 70,5 Q80,15 70,28 Z" fill="currentColor" fillOpacity="0.05" />
          {/* Leaf 4 (opposite) */}
          <path d="M38,58 Q48,52 48,42 Q38,48 38,58 Z" fill="currentColor" fillOpacity="0.05" />
          {/* Leaf 5 (opposite) */}
          <path d="M58,42 Q68,36 68,26 Q58,32 58,42 Z" fill="currentColor" fillOpacity="0.05" />
        </svg>
      </div>

      {/* Bottom-Left Decorative Botanical Watermark (Large) */}
      <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 text-rosePrimary/5 transform -translate-x-12 translate-y-12 opacity-80">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.4">
          {/* Stem */}
          <path d="M90,90 Q70,60 50,50 Q30,40 10,10" />
          {/* Leaf 1 */}
          <path d="M70,60 Q80,50 70,40 Q60,50 70,60 Z" fill="currentColor" fillOpacity="0.05" />
          {/* Leaf 2 */}
          <path d="M50,50 Q60,35 50,25 Q40,35 50,50 Z" fill="currentColor" fillOpacity="0.05" />
          {/* Leaf 3 */}
          <path d="M30,28 Q40,15 30,5 Q20,15 30,28 Z" fill="currentColor" fillOpacity="0.05" />
          {/* Leaf 4 (opposite) */}
          <path d="M62,58 Q52,52 52,42 Q62,48 62,58 Z" fill="currentColor" fillOpacity="0.05" />
          {/* Leaf 5 (opposite) */}
          <path d="M42,42 Q32,32 32,22 Q42,28 42,42 Z" fill="currentColor" fillOpacity="0.05" />
        </svg>
      </div>

      {/* Scattered Mid-Page Soft Watermarks */}
      <div className="absolute top-1/4 left-8 w-12 h-12 text-rosePrimary/4 opacity-40">
        <svg className="w-full h-full" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div className="absolute bottom-1/3 right-10 w-16 h-16 text-rosePrimary/4 opacity-40">
        <svg className="w-full h-full" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" fill="none">
          <path d="M12 2a4 4 0 00-4 4 4 4 0 001.2 2.8 4 4 0 00-2.8 1.2 4 4 0 00-4 4 4 4 0 004 4 4 4 0 002.8-1.2 4 4 0 001.2 2.8 4 4 0 004-4 4 4 0 00-1.2-2.8 4 4 0 002.8-1.2 4 4 0 004-4 4 4 0 00-4-4 4 4 0 00-2.8 1.2A4 4 0 0012 2zm0 8a2 2 0 110 4 2 2 0 010-4z"/>
        </svg>
      </div>

    </div>
  );
}
