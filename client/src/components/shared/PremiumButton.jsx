import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  className = '',
  disabled = false,
  loading = false,
  ...props
}) {
  const baseStyle = "relative overflow-hidden px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md select-none outline-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] border border-rose-450",
    secondary: "bg-slate-900/80 backdrop-blur-md text-rose-200 border border-rose-500/20 hover:bg-slate-900 hover:border-rose-500/40 shadow-sm",
    ghost: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.25)] border border-red-500"
  };

  const getStyle = () => {
    return `${baseStyle} ${variants[variant]} ${className}`;
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={getStyle()}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
