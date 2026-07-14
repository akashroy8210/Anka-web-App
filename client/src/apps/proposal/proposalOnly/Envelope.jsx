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
    // 1. Lift envelope and grow realistic shadow
    setIsLifting(true);
    
    // 2. Crack seal after lift
    setTimeout(() => {
      setIsBroken(true);
      playChime();
      
      // 3. Open lid flap
      setTimeout(() => {
        setIsOpen(true);
        
        // 4. Slide letter sheets upwards
        setTimeout(() => {
          setIsSliding(true);
          
          // 5. Open final popup letter
          setTimeout(() => {
            if (onOpen) onOpen();
            // Reset in background
            setIsLifting(false);
            setIsBroken(false);
            setIsOpen(false);
            setIsSliding(false);
          }, 850);
        }, 650);
      }, 500);
    }, 450);
  };

  return (
    <div className="w-full max-w-[350px] md:max-w-[440px] lg:max-w-[480px] mx-auto p-4 flex flex-col items-center justify-center select-none relative">
      
      {/* 3D Premium stationery shadow/lift effects */}
      <motion.div
        animate={isLifting ? { y: -25, scale: 1.05 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full aspect-[1.55] bg-[#F9F6EE] rounded-3xl border border-[#DFDAD0]/80 transition-shadow duration-500 z-10 ${
          isLifting 
            ? 'shadow-[0_45px_80px_-20px_rgba(0,0,0,0.7)]' 
            : 'shadow-[0_15px_40px_-10px_rgba(0,0,0,0.45)]'
        }`}
        style={{ perspective: "1500px" }}
      >
        {/* Luxury gold double foil lining around the border */}
        <div className="absolute inset-2.5 rounded-[18px] border border-amber-500/20 pointer-events-none z-10" />
        <div className="absolute inset-3 rounded-[16px] border border-amber-500/10 pointer-events-none z-10" />

        {/* Paper texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_0)] bg-[size:8px_8px] pointer-events-none opacity-80" />

        {/* Diagonal side flap left */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden rounded-l-3xl z-10">
          <svg className="w-full h-full" viewBox="0 0 150 190" preserveAspectRatio="none">
            <path d="M0,0 L118,95 L0,190 Z" fill="#EFE8DC" opacity="0.98" />
            <path d="M0,0 L118,95 L0,190" stroke="rgba(245,158,11,0.06)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Diagonal side flap right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden rounded-r-3xl z-10">
          <svg className="w-full h-full" viewBox="0 0 150 190" preserveAspectRatio="none">
            <path d="M150,0 L32,95 L150,190 Z" fill="#EFE8DC" opacity="0.98" />
            <path d="M150,0 L32,95 L150,190" stroke="rgba(245,158,11,0.06)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Bottom flap */}
        <div className="absolute inset-x-0 bottom-0 h-[66%] pointer-events-none overflow-hidden rounded-b-3xl z-10">
          <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
            <path d="M0,120 L150,0 L300,120 Z" fill="#FAF4E7" />
            <path d="M0,120 L150,0 L300,120" stroke="rgba(245,158,11,0.08)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Sliding Letter Card (slides up further out of envelope) */}
        <AnimatePresence>
          {isSliding && (
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: -140, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-10 top-4 bottom-4 bg-[#FCFBF8] rounded-xl border border-[#EDE8DE] shadow-xl z-0 flex flex-col p-5 space-y-3"
            >
              <div className="w-10 h-1 bg-rose-300/30 rounded-full mx-auto" />
              <div className="space-y-1.5 pt-2">
                <div className="h-2 w-20 bg-slate-200 rounded" />
                <div className="h-1.5 w-full bg-slate-100 rounded" />
                <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Handwritten Recipient Name - Placed high to avoid wax seal overlaps */}
        <div className="absolute inset-x-0 top-6 text-center select-none z-10">
          <span className="font-handwritten text-3xl sm:text-4xl text-slate-700 font-bold tracking-wide block filter drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
            {recipientName || 'Dear You'}
          </span>
          {title && (
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-[0.25em] block mt-1.5">
              {title}
            </span>
          )}
        </div>

        {/* Lid Flap (rotates from top origin) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 15 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-3xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 95" preserveAspectRatio="none">
            <path d="M0,0 L150,95 L300,0 Z" fill="#F0E9DD" stroke="#DCD5C6" strokeWidth="0.5" />
          </svg>

          {/* Wax Seal at the center bottom edge (falls down on break) */}
          <div className="absolute inset-x-0 bottom-0 translate-y-1/2 flex justify-center z-25">
            <WaxSeal isBroken={isBroken} onClick={handleOpen} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
