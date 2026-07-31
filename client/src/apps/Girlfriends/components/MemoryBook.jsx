import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GirlfriendPlaceholderService from '../services/girlfriendPlaceholderService';

export default function MemoryBook({ onNext, customChapters = [] }) {
  const chapters = customChapters.length > 0 ? customChapters : GirlfriendPlaceholderService.getPlaceholderChapters();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Page Flip Animation State
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' or 'prev'
  const [flipProgress, setFlipProgress] = useState(0); // 0 to 180 degrees
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const currentRotation = useRef(0);

  const totalChapters = chapters.length;
  const currentCh = chapters[currentIndex];
  const nextCh = chapters[Math.min(currentIndex + 1, totalChapters - 1)];
  const prevCh = chapters[Math.max(currentIndex - 1, 0)];

  const layoutTypes = ['editorial', 'dual', 'collage', 'polaroid', 'fullwidth', 'asymmetric', 'journal'];
  const activeLayout = currentCh.layoutStyle || layoutTypes[currentIndex % layoutTypes.length];

  // PAGE TURN NEXT (FORWARD LTR)
  const triggerNextPage = () => {
    if (isFlipping) return;
    if (currentIndex >= totalChapters - 1) {
      onNext();
      return;
    }

    setFlipDirection('next');
    setIsFlipping(true);

    let angle = 0;
    const interval = setInterval(() => {
      angle += 8;
      setFlipProgress(angle);
      if (angle >= 180) {
        clearInterval(interval);
        setCurrentIndex((prev) => prev + 1);
        setIsFlipping(false);
        setFlipProgress(0);
      }
    }, 16);
  };

  // PAGE TURN PREVIOUS (BACKWARD RTL)
  const triggerPrevPage = () => {
    if (isFlipping || currentIndex <= 0) return;

    setFlipDirection('prev');
    setIsFlipping(true);

    let angle = 0;
    const interval = setInterval(() => {
      angle += 8;
      setFlipProgress(angle);
      if (angle >= 180) {
        clearInterval(interval);
        setCurrentIndex((prev) => prev - 1);
        setIsFlipping(false);
        setFlipProgress(0);
      }
    }, 16);
  };

  // POINTER DRAG INTERACTION (REAL-TIME 3D CORNER FLIP FOLD)
  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diffX = dragStartX.current - currentX;

    if (diffX > 20 && currentIndex < totalChapters - 1) {
      // Dragging left = Turn Next
      const calcAngle = Math.min(180, Math.max(0, (diffX / 300) * 180));
      setFlipDirection('next');
      setIsFlipping(true);
      setFlipProgress(calcAngle);
      currentRotation.current = calcAngle;
    } else if (diffX < -20 && currentIndex > 0) {
      // Dragging right = Turn Prev
      const calcAngle = Math.min(180, Math.max(0, (-diffX / 300) * 180));
      setFlipDirection('prev');
      setIsFlipping(true);
      setFlipProgress(calcAngle);
      currentRotation.current = calcAngle;
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (flipProgress > 60) {
      // Complete turn
      let angle = flipProgress;
      const interval = setInterval(() => {
        angle += 10;
        setFlipProgress(angle);
        if (angle >= 180) {
          clearInterval(interval);
          if (flipDirection === 'next') {
            setCurrentIndex((prev) => Math.min(prev + 1, totalChapters - 1));
          } else {
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
          }
          setIsFlipping(false);
          setFlipProgress(0);
        }
      }, 16);
    } else {
      // Reset flip
      setFlipProgress(0);
      setIsFlipping(false);
    }
  };

  // Helper for Drop Cap formatting
  const renderDropCapText = (text) => {
    if (!text) return null;
    const firstLetter = text.charAt(0);
    const restOfText = text.slice(1);

    return (
      <p className="text-sm md:text-base leading-relaxed text-[var(--gf-paper-text)] font-sans font-normal opacity-95">
        <span className="float-left text-4xl md:text-5xl font-bold font-serif leading-none pr-3 pt-1 text-[var(--gf-accent-gold)]">
          {firstLetter}
        </span>
        {restOfText}
      </p>
    );
  };

  // Compute 3D lighting opacity & drop shadow based on flip angle
  const shadowOpacity = Math.sin((flipProgress * Math.PI) / 180) * 0.45;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 bg-[var(--gf-bg-main)] text-[var(--gf-text-primary)] relative overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex items-center justify-between z-10 pt-2 pb-4 border-b border-[var(--gf-border-color)]"
      >
        <div className="space-y-0.5">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--gf-accent-gold)]">
            REALISTIC 3D PAGE-FLIP ENGINE
          </span>
          <h1 className="text-xl md:text-2xl gf-font-serif font-extrabold text-[var(--gf-accent-rose)]">
            Our Memory Scrapbook
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--gf-text-secondary)]">
          <span>PAGE {currentIndex + 1} OF {totalChapters}</span>
        </div>
      </motion.div>

      {/* 3D BOOK STAGE CONTAINER */}
      <div 
        className="my-auto py-6 w-full max-w-6xl z-10"
        style={{ perspective: '2000px' }}
      >
        <div className="w-full min-h-[500px] md:min-h-[580px] rounded-[32px] bg-[var(--gf-paper-bg)] border-4 border-amber-950/20 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative transform-style-3d">
          
          {/* INNER SPINE SHADOW OVERLAY (REALISTIC INNER SHADOW) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/25 via-black/5 to-black/25 pointer-events-none z-30 shadow-inner"></div>

          {/* DYNAMIC DROP SHADOW BENEATH TURNING PAGE */}
          {isFlipping && (
            <div 
              className="absolute top-0 bottom-0 pointer-events-none z-25 bg-black"
              style={{
                left: flipDirection === 'next' ? '50%' : '0',
                width: '50%',
                opacity: shadowOpacity,
                transition: 'opacity 0.1s linear'
              }}
            />
          )}

          {/* BASE UNDERLYING LEFT PAGE */}
          <div className="p-6 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-amber-900/10 relative bg-[var(--gf-paper-bg)]">
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800/60 font-bold block">
                {currentCh.subtitle || `CHAPTER ${currentIndex + 1}`}
              </span>
              <h2 className="text-3xl md:text-4xl gf-font-serif font-extrabold text-[var(--gf-paper-text)] tracking-tight">
                {currentCh.title}
              </h2>
            </div>

            {/* Layout Image Frames */}
            <div className="my-6 space-y-4">
              {activeLayout === 'editorial' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl overflow-hidden border border-amber-900/20 shadow-md h-48 md:h-56">
                    <img src={currentCh.photoLeft1} alt="Editorial 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-amber-900/20 shadow-md h-48 md:h-56 mt-4">
                    <img src={currentCh.photoLeft2 || currentCh.photoLeft1} alt="Editorial 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {activeLayout === 'dual' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden border border-amber-900/20 shadow-md h-52">
                    <img src={currentCh.photoLeft1} alt="Dual 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-amber-900/20 shadow-md h-52">
                    <img src={currentCh.photoLeft2 || currentCh.photoLeft1} alt="Dual 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {activeLayout === 'collage' && (
                <div className="relative h-60 w-full flex items-center justify-center">
                  <div className="absolute left-2 top-0 w-3/5 h-48 rounded-2xl overflow-hidden border-2 border-white shadow-xl -rotate-6 z-10">
                    <img src={currentCh.photoLeft1} alt="Collage 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute right-2 bottom-0 w-3/5 h-48 rounded-2xl overflow-hidden border-2 border-white shadow-xl rotate-6 z-20">
                    <img src={currentCh.photoLeft2 || currentCh.photoLeft1} alt="Collage 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {activeLayout === 'polaroid' && (
                <div className="flex items-center justify-center py-2">
                  <div className="p-4 pb-8 bg-white rounded-xl shadow-2xl border border-slate-200 transform -rotate-3 w-64 text-center space-y-2">
                    <div className="w-full h-52 rounded-lg overflow-hidden bg-slate-100">
                      <img src={currentCh.photoLeft1 || currentCh.photoRight} alt="Polaroid" className="w-full h-full object-cover" />
                    </div>
                    <p className="gf-font-handwriting text-slate-800 text-sm font-bold pt-1">
                      {currentCh.quote || 'Precious moment ❤️'}
                    </p>
                  </div>
                </div>
              )}

              {(activeLayout === 'fullwidth' || activeLayout === 'asymmetric' || activeLayout === 'journal') && (
                <div className="rounded-2xl overflow-hidden border border-amber-900/20 shadow-lg h-60">
                  <img src={currentCh.photoLeft1} alt="Main Memory" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {currentCh.quote && activeLayout !== 'polaroid' && (
              <div className="pt-2 border-t border-amber-900/10">
                <p className="gf-font-handwriting text-base md:text-lg text-[var(--gf-accent-rose)] font-bold italic">
                  "{currentCh.quote}"
                </p>
              </div>
            )}
          </div>

          {/* BASE UNDERLYING RIGHT PAGE */}
          <div className="p-6 md:p-10 flex flex-col justify-between bg-amber-50/20 relative">
            <div className="space-y-6">
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-800/60 font-bold block">
                CHAPTER NARRATIVE
              </span>

              <div className="space-y-4">
                {renderDropCapText(currentCh.memoryText)}
              </div>

              {activeLayout !== 'polaroid' && currentCh.photoRight && (
                <div className="rounded-2xl overflow-hidden border border-amber-900/20 shadow-md h-44 md:h-48 mt-4">
                  <img src={currentCh.photoRight} alt="Right Memory" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Click Corner Hint Indicator for Page Turn */}
            <div 
              onClick={triggerNextPage}
              className="absolute bottom-4 right-4 w-12 h-12 bg-amber-800/10 hover:bg-amber-800/20 rounded-tl-2xl flex items-center justify-center cursor-pointer transition-colors group z-20"
              title="Click corner to flip page"
            >
              <span className="text-amber-900 font-bold text-xs group-hover:scale-125 transition-transform">➔</span>
            </div>

            <div className="pt-6 border-t border-amber-900/10 flex justify-between items-center text-xs font-mono text-amber-900/50">
              <span>MEMORIES DECK</span>
              <span>PAGE {currentIndex * 2 + 2}</span>
            </div>
          </div>

          {/* REAL 3D TURNING FLIP PAGE (HARDWARE ACCELERATED 3D ROTATION) */}
          {isFlipping && (
            <div
              className="hidden lg:block absolute top-0 bottom-0 w-1/2 bg-[var(--gf-paper-bg)] z-40 overflow-hidden shadow-2xl border-l border-amber-900/20"
              style={{
                left: flipDirection === 'next' ? '50%' : '0',
                transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                transform: `rotateY(${flipDirection === 'next' ? -flipProgress : flipProgress}deg)`,
                backfaceVisibility: 'visible',
                willChange: 'transform'
              }}
            >
              {/* Dynamic Curved Gradient Shading on Turning Page */}
              <div 
                className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-r from-black/40 via-transparent to-black/20"
                style={{ opacity: Math.sin((flipProgress * Math.PI) / 180) }}
              />

              {/* Turning Page Front / Back Content */}
              <div className="p-8 flex flex-col justify-between h-full bg-[var(--gf-paper-bg)]">
                {flipProgress < 90 ? (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-amber-800/60 font-bold block">TURNING PAGE...</span>
                    <h3 className="text-2xl font-serif font-bold text-[var(--gf-paper-text)]">
                      {currentCh.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-6">{currentCh.memoryText}</p>
                  </div>
                ) : (
                  <div className="space-y-4 transform rotateY-180">
                    <span className="text-[10px] font-mono uppercase text-amber-800/60 font-bold block">
                      NEXT: {nextCh?.title}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[var(--gf-paper-text)]">
                      {nextCh?.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-6">{nextCh?.memoryText}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* BOTTOM CONTROLS & NAVIGATION BUTTONS */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl flex items-center justify-between gap-4 z-10 pb-2"
      >
        <button
          onClick={triggerPrevPage}
          disabled={currentIndex === 0 || isFlipping}
          className="px-6 py-3 rounded-full bg-[var(--gf-card-bg)] border border-[var(--gf-border-color)] text-[var(--gf-text-primary)] text-xs font-bold disabled:opacity-40 shadow-md cursor-pointer hover:bg-white/20 transition-all"
        >
          ← Previous Page
        </button>

        <button
          onClick={triggerNextPage}
          disabled={isFlipping}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 cursor-pointer hover:opacity-90 transition-all"
        >
          {currentIndex === totalChapters - 1 ? 'Finish Scrapbook ❤️' : 'Next Page →'}
        </button>
      </motion.div>
    </motion.div>
  );
}
