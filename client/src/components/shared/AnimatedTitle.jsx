import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedTitle({
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  glow = true,
  className = ''
}) {
  const alignment = align === 'left' ? 'text-left' : 'text-center';

  return (
    <div className={`space-y-2 select-none ${alignment} ${className}`}>
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400 block"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`font-heading font-black text-3xl md:text-4xl leading-tight text-white ${
          glow ? 'filter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]' : ''
        }`}
      >
        {title}
      </motion.h2>
    </div>
  );
}
