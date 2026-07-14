import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MediaViewer({
  src,
  alt = 'Surprise Media',
  className = '',
  aspectRatio = 'aspect-video', // 'aspect-video' | 'aspect-square' | 'aspect-[4/3]' | 'aspect-auto'
  allowLightbox = true
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <div className={`relative group w-full overflow-hidden rounded-2xl bg-black/40 border border-white/5 shadow-inner ${aspectRatio} ${className}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-contain"
        />
        
        {allowLightbox && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-slate-900/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
