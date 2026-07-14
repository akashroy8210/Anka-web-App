import React from 'react';
import { motion } from 'framer-motion';

export default function SectionWrapper({
  children,
  className = '',
  maxWidth = 'max-w-xl', // 'max-w-md' | 'max-w-xl' | 'max-w-2xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-none'
  animate = true,
  ...props
}) {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo style
        staggerChildren: 0.12
      }
    }
  };

  const content = (
    <div className={`w-full ${maxWidth} mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center space-y-6 md:space-y-8 ${className}`}>
      {children}
    </div>
  );

  if (!animate) {
    return <section className="flex-1 flex flex-col justify-center w-full" {...props}>{content}</section>;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="flex-1 flex flex-col justify-center w-full"
      {...props}
    >
      {content}
    </motion.section>
  );
}
