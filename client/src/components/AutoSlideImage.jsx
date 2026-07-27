import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AutoSlideImage({ images, alt }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!images || images.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Autoplay transition every 4 seconds
  }, [images]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetTimer();
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetTimer();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrev(e);
    if (e.key === 'ArrowRight') handleNext(e);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 select-none">
        No Image
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full h-full relative overflow-hidden bg-slate-100 group outline-none select-none"
    >
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`${alt || 'Slide'} ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
      
      {/* Bottom shadow overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-wineDeep/40 via-transparent to-transparent opacity-80 z-20 pointer-events-none" />
      
      {/* Interactive Previous / Next Controls */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-rosePrimary/80 text-white backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer opacity-80 md:opacity-0 md:group-hover:opacity-100 shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-rosePrimary/80 text-white backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer opacity-80 md:opacity-0 md:group-hover:opacity-100 shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-30">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
                resetTimer();
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
