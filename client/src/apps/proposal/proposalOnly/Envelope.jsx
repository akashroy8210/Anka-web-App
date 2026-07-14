import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaxSeal from './WaxSeal';
import { playChime } from '../services/proposalHelpers';

export default function Envelope({ recipientName, title, onOpen }) {
  const [isBroken, setIsBroken] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLifting, setIsLifting] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const handleOpen = () => {
    // 1. Lift envelope and increase shadow
    setIsLifting(true);
    
    // 2. Crack seal (play chime sound) after lift
    setTimeout(() => {
      setIsBroken(true);
      playChime();
      
      // 3. Unfold flap naturally
      setTimeout(() => {
        setIsOpen(true);
        
        // 4. Slide letter sheets upwards
        setTimeout(() => {
          setIsSliding(true);
          
          // 5. Open final popup letter
          setTimeout(() => {
            if (onOpen) onOpen();
            // Reset state in background for safety
            setIsLifting(false);
            setIsBroken(false);
            setIsOpen(false);
            setIsSliding(false);
          }, 800);
        }, 600);
      }, 500);
    }, 400);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 flex flex-col items-center justify-center select-none relative">
      
      {/* Dynamic Lift and Shadow Sequence */}
      <motion.div
        animate={isLifting ? { y: -12, scale: 1.02 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full aspect-[1.58] bg-[#F7F4EB] rounded-2xl border border-[#DFDAD0] transition-shadow duration-500 ${
          isLifting ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]' : 'shadow-xl'
        }`}
        style={{ perspective: "1200px" }}
      >
        {/* Envelope paper textures overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_0)] bg-[size:8px_8px] pointer-events-none" />

        {/* Diagonal folder lines using CSS borders */}
        <div className="absolute inset-0 border-[16px] border-[#E8E2D5] pointer-events-none rounded-2xl z-10" />

        {/* Side flap left */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden rounded-l-2xl z-10">
          <svg className="w-full h-full" viewBox="0 0 150 190" preserveAspectRatio="none">
            <path d="M0,0 L115,95 L0,190 Z" fill="#EDE7DB" opacity="0.9" />
          </svg>
        </div>

        {/* Side flap right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden rounded-r-2xl z-10">
          <svg className="w-full h-full" viewBox="0 0 150 190" preserveAspectRatio="none">
            <path d="M150,0 L35,95 L150,190 Z" fill="#EDE7DB" opacity="0.9" />
          </svg>
        </div>

        {/* Bottom flap */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] pointer-events-none overflow-hidden rounded-b-2xl z-10">
          <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
            <path d="M0,120 L150,0 L300,120 Z" fill="#F4EDE0" />
          </svg>
        </div>

        {/* Sliding Letter Card (slides up after flap unfolds) */}
        <AnimatePresence>
          {isSliding && (
            <motion.div
              initial={{ y: 20, opacity: 0.5 }}
              animate={{ y: -90, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-x-6 top-4 bottom-4 bg-[#FCF9F2] rounded-lg border border-[#EDE5D6] shadow-md z-0 flex flex-col p-4 space-y-2"
            >
              <div className="w-8 h-1.5 bg-rose-200/50 rounded-full mx-auto" />
              <div className="space-y-1">
                <div className="h-2 w-16 bg-slate-200 rounded" />
                <div className="h-1.5 w-full bg-slate-100 rounded" />
                <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Handwritten Recipient Name (Separated at top-6 to avoid wax seal overlap) */}
        <div className="absolute inset-x-0 top-6 text-center select-none z-10">
          <span className="font-handwritten text-3xl text-slate-700/95 tracking-wide font-bold block filter drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {recipientName || 'Dear You'}
          </span>
          {title && (
            <span className="text-[8px] uppercase font-bold text-slate-400 tracking-[0.2em] block mt-1">
              {title}
            </span>
          )}
        </div>

        {/* Lid Flap (rotates from top origin) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 15 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 95" preserveAspectRatio="none">
            <path d="M0,0 L150,95 L300,0 Z" fill="#ECE5D8" stroke="#D6CFC1" strokeWidth="0.5" />
          </svg>

          {/* Wax Seal sits at the tip of the triangular flap (moves up when open) */}
          <div className="absolute inset-x-0 bottom-0 translate-y-1/2 flex justify-center z-25">
            <WaxSeal isBroken={isBroken} onClick={handleOpen} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
