import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ROTATIONS = [
  '-rotate-[3deg] hover:rotate-[1deg]',
  'rotate-[4deg] hover:rotate-[1deg]',
  '-rotate-[2deg] hover:rotate-[2deg]',
  'rotate-[3deg] hover:-rotate-[1deg]',
  '-rotate-[4deg] hover:rotate-[2deg]',
  'rotate-[2deg] hover:-rotate-[2deg]',
];

export default function PhotoCollage({ config }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const photos = config.photos || [];
  if (photos.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[10px] font-black uppercase tracking-widest inline-block">
          📸 Polaroid Snapshots
        </span>
        <h3 className="font-romantic text-4xl sm:text-5xl text-white" style={{ textShadow: '0 0 30px rgba(225,29,72,0.3)' }}>
          Our Memories
        </h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto">
        {photos.slice(0, 6).map((item, i) => {
          const imgUrl = typeof item === 'object' ? item.url : item;
          const displayTitle = typeof item === 'object' && item.title ? item.title : `#${i + 1}`;
          
          return (
            <div
              key={i}
              onClick={() => setActivePhotoIndex(i)}
              className={`bg-white p-3 pb-8 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform ${ROTATIONS[i % ROTATIONS.length]} hover:scale-110 hover:-translate-y-2 transition-all duration-500 cursor-pointer w-48 sm:w-56 shrink-0`}
            >
              <div className="aspect-square bg-slate-100 overflow-hidden rounded-sm">
                <img src={imgUrl} alt={displayTitle} className="w-full h-full object-cover" />
              </div>
              <p className="font-romantic text-center text-slate-600 text-lg mt-1 leading-none truncate px-1">
                {displayTitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Photo Zoom Modal rendered via React Portal */}
      {activePhotoIndex !== null && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-[#08050f]/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in-up"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all cursor-pointer z-50 animate-pulse"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Card */}
          <div 
            className="max-w-2xl w-full flex flex-col items-center bg-[#140e24]/90 border border-white/10 rounded-[32px] p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/5">
              <img
                src={typeof photos[activePhotoIndex] === 'object' ? photos[activePhotoIndex].url : photos[activePhotoIndex]}
                alt={`Zoom Photo ${activePhotoIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 text-center space-y-1">
              <p className="font-romantic text-2xl text-rose-300">
                {typeof photos[activePhotoIndex] === 'object' && photos[activePhotoIndex].title 
                  ? photos[activePhotoIndex].title 
                  : `Memory #${activePhotoIndex + 1}`}
              </p>
              {typeof photos[activePhotoIndex] === 'object' && photos[activePhotoIndex].caption && (
                <p className="text-slate-350 text-sm italic font-light">
                  {photos[activePhotoIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
