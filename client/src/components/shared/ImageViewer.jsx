import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageViewer({
  config,
  activeMemoryIndex,
  setActiveMemoryIndex,
  handlePrevMemory,
  handleNextMemory
}) {
  // Lock body scrolling when active
  useEffect(() => {
    if (activeMemoryIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeMemoryIndex]);

  if (activeMemoryIndex === null || !config.memories || !config.memories[activeMemoryIndex]) {
    return null;
  }

  const currentMemory = config.memories[activeMemoryIndex];
  const imageUrl = currentMemory.imageUrl || (config.photos && config.photos[activeMemoryIndex]) || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600";

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in-up"
      onClick={() => setActiveMemoryIndex(null)}
    >
      <button
        onClick={() => setActiveMemoryIndex(null)}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all cursor-pointer z-50"
        title="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-slate-900 border border-purple-500/20 rounded-[32px] p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Navigation arrows */}
        <button
          onClick={handlePrevMemory}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextMemory}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Left Side: Zoom Image */}
        <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden border border-purple-500/10 bg-slate-950 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Zoom Memory"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Right Side: Description */}
        <div className="w-full md:w-1/2 text-left space-y-4">
          <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest bg-purple-950/60 border border-purple-500/20 px-3 py-1 rounded-full inline-block">
            Memory #{activeMemoryIndex + 1}
          </span>
          
          <h3 className="font-heading font-black text-2xl sm:text-3.5xl text-white">
            {currentMemory.title || `Memory #${activeMemoryIndex + 1}`}
          </h3>

          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed italic border-l-2 border-purple-500 pl-4">
            {currentMemory.description || 'They say a picture is worth a thousand words, but this memory of us is worth a lifetime of happiness.'}
          </p>
        </div>

      </div>
    </div>
  );
}
