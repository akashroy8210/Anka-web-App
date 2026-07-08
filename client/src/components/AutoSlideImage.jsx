import React, { useState, useEffect } from 'react';

export default function AutoSlideImage({ images, alt }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Transition every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
        No Image
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`${alt || 'Slide'} ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
      
      {/* Bottom shadow overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-wineDeep/40 via-transparent to-transparent opacity-80 z-20" />
      
      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-30">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
