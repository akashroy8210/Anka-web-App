import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaxSeal from './WaxSeal';
import { playChime } from '../services/proposalHelpers';

export default function Envelope({ recipientName, title, onOpen }) {
  const [isBroken, setIsBroken] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    playChime();
    setIsBroken(true);
    setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => {
        if (onOpen) onOpen();
      }, 700);
    }, 450);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 flex flex-col items-center justify-center select-none relative">
      
      {/* 3D Envelope Container */}
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.4 }}
        className="relative w-full aspect-[1.58] bg-[#F7F4EB] rounded-2xl shadow-xl overflow-hidden border border-[#DFDAD0]"
        style={{ perspective: "1000px" }}
      >
        {/* Envelope paper textures overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_0)] bg-[size:8px_8px] pointer-events-none" />

        {/* Diagonal folder lines using CSS borders */}
        <div className="absolute inset-0 border-[16px] border-[#E8E2D5] pointer-events-none rounded-2xl" />

        {/* Back and side flap graphics */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 190">
          {/* Side flap left */}
          <path d="M0,0 L115,95 L0,190 Z" fill="#EDE7DB" opacity="0.8" />
          {/* Side flap right */}
          <path d="M300,0 L185,95 L300,190 Z" fill="#EDE7DB" opacity="0.8" />
          {/* Bottom flap */}
          <path d="M0,190 L150,90 L300,190 Z" fill="#F4EDE0" />
        </svg>

        {/* Lid Flap (rotates from top joint) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-x-0 top-0 h-1/2 bg-[#ECE5D8] origin-top rounded-t-2xl shadow-sm border-b border-[#D6CFC1]"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", zIndex: 15 }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 95" preserveAspectRatio="none">
            <path d="M0,0 L150,95 L300,0 Z" fill="#ECE5D8" />
          </svg>
        </motion.div>

        {/* Handwritten Recipient Name */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-1">
          <span className="font-handwritten text-2xl text-slate-700/80 tracking-wide font-black">
            {recipientName || 'Dear You'}
          </span>
          {title && (
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">
              {title}
            </span>
          )}
        </div>

        {/* Wax Seal Container (locks flap in place) */}
        <div className="absolute inset-x-0 bottom-1/2 translate-y-1/2 flex justify-center z-20">
          <WaxSeal isBroken={isBroken} onClick={handleOpen} />
        </div>
      </motion.div>
    </div>
  );
}
