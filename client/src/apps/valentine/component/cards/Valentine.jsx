// import React, { useRef, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import loveSong from "../../assets/music/kanomebali.mp3";

// function Valentine(){

// const [open,setOpen] = useState(false);
// const audioRef = useRef(null);
// const fadeRef = useRef(null);

// /* ---------------- SAFE MUSIC FADE ---------------- */

// const playMusic = async ()=>{

//  if(!audioRef.current) return;

//  try{
//    await audioRef.current.play();
//  }catch{
//    return; // browser blocked — ignore safely
//  }

//  audioRef.current.volume = 0;

//  let vol = 0;

//  fadeRef.current = setInterval(()=>{

//    if(vol < 0.35){
//      vol += 0.02;
//      audioRef.current.volume = vol;
//    }else{
//      clearInterval(fadeRef.current);
//    }

//  },120);

// };

// /* ---------------- OPEN SCENE ---------------- */

// const openValentine = ()=>{

//  playMusic();
//  setOpen(true);

// };

// /* ---------------- STABLE PARTICLES ---------------- */

// const particles = useMemo(()=>{

//  return Array.from({length:18}).map(()=>({
//    left:`${Math.random()*100}%`,
//    top:`${Math.random()*100}%`,
//    size:`${6+Math.random()*10}px`,
//    duration:`${6+Math.random()*6}s`
//  }));

// },[]);


// return(

// <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070508] text-white">

// <audio ref={audioRef} src={loveSong} loop />

// {/* 🌸 CINEMATIC GLOW */}
// <div className="absolute w-[500px] h-[500px] bg-pink-500/20 blur-[160px] rounded-full animate-pulse"/>
// <div className="absolute w-[350px] h-[350px] bg-rose-400/20 blur-[140px] rounded-full top-[10%] left-[70%]"/>

// {/* 🎬 FILM GRAIN */}
// <div
//  className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
//  style={{
//    backgroundImage:"url('https://grainy-gradients.vercel.app/noise.svg')",
//  }}
// />

// {/* ✨ FLOATING PARTICLES */}
// {
// particles.map((p,i)=>(
// <motion.span
//  key={i}
//  className="absolute text-pink-200"
//  style={{
//    left:p.left,
//    top:p.top,
//    fontSize:p.size
//  }}
//  animate={{y:[0,-30,0],opacity:[0,1,0]}}
//  transition={{duration:8,repeat:Infinity,delay:i*.3}}
// >
// ✦
// </motion.span>
// ))
// }

// {/* 🎬 CINEMATIC TRANSITION */}
// <AnimatePresence mode="wait">

// {!open ? (

// <motion.div
//  key="intro"
//  initial={{opacity:0,scale:.96}}
//  animate={{opacity:1,scale:1}}
//  exit={{opacity:0,scale:1.05}}
//  transition={{duration:1.4}}
//  className="text-center px-6"
// >

// <motion.h1
//  initial={{y:80,opacity:0}}
//  animate={{y:0,opacity:1}}
//  transition={{duration:1.2}}
//  className="text-5xl md:text-7xl font-serif mb-12 max-w-3xl mx-auto leading-tight"
// >
// In all the noise of the world…  
// I still found you.
// </motion.h1>


// <motion.button
//  onClick={openValentine}
//  whileHover={{scale:1.08}}
//  whileTap={{scale:.95}}
//  className="
//  px-10 py-4
//  rounded-full
//  bg-gradient-to-r
//  from-pink-400
//  to-rose-400
//  text-black
//  font-semibold
//  shadow-[0_20px_60px_rgba(255,105,180,.45)]
// "
// >
// Open Your Valentine ❤️
// </motion.button>

// </motion.div>

// ) : (

// <motion.div
//  key="final"
//  initial={{opacity:0,filter:"blur(10px)"}}
//  animate={{opacity:1,filter:"blur(0px)"}}
//  transition={{duration:1.6}}
//  className="text-center max-w-2xl px-6"
// >

// <motion.h1
//  initial={{y:60,opacity:0}}
//  animate={{y:0,opacity:1}}
//  transition={{duration:1}}
//  className="text-6xl md:text-7xl font-serif mb-6"
// >
// Happy Valentine’s Day ❤️
// </motion.h1>

// <motion.p
//  initial={{opacity:0}}
//  animate={{opacity:1}}
//  transition={{delay:.6,duration:1.2}}
//  className="text-xl leading-relaxed text-pink-100"
// >
// If I could give you one thing,  
// it would be the ability to see yourself  
// through my eyes…

// Only then would you realize  
// how incredibly special you are.
// </motion.p>

// <motion.div
//  initial={{opacity:0}}
//  animate={{opacity:1}}
//  transition={{delay:1.2}}
//  className="mt-10 text-2xl italic text-pink-200"
// >
// — Yours, always
// </motion.div>

// </motion.div>

// )}

// </AnimatePresence>

// </div>
// );
// }

// export default Valentine;

import React, { useState } from "react";
import { motion } from "framer-motion";

const photos = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
  "https://images.unsplash.com/photo-1511988617509-a57c8a288659",
  "https://images.unsplash.com/photo-1501908734255-16579c18c25f",
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
];

const themes = {
  classic: {
    background: "#FFF5F7",
    gradientFrom: "#F8C8DC",
    gradientTo: "#FFF5F7",
    accent: "#8B0000",
    border: "#D4AF37",
    text: "#8B0000",
  },
  pastel: {
    background: "#FFF8E7",
    gradientFrom: "#FFD1DC",
    gradientTo: "#E6E6FA",
    accent: "#B76E79",
    border: "#E6E6FA",
    text: "#B76E79",
  },
  bold: {
    background: "#5B0E2D",
    gradientFrom: "#5B0E2D",
    gradientTo: "#FF4F81",
    accent: "#FF4F81",
    border: "#F2F2F2",
    text: "#FFFFFF",
  },
};

export default function ValentineRotatingGallery() {
  const [activeTheme, setActiveTheme] = useState("classic");
  const theme = themes[activeTheme];
  const radius = 220;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
      }}
    >
      <h1
        className="text-4xl md:text-6xl font-bold mb-8 text-center"
        style={{ color: theme.text }}
      >
        Happy Valentine’s Day ❤️
      </h1>

      {/* Theme Buttons */}
      <div className="flex gap-4 mb-12">
        <button
          onClick={() => setActiveTheme("classic")}
          className="px-6 py-2 rounded-full shadow-lg"
          style={{ backgroundColor: "#B11226", color: "white" }}
        >
          Classic
        </button>
        <button
          onClick={() => setActiveTheme("pastel")}
          className="px-6 py-2 rounded-full shadow-lg"
          style={{ backgroundColor: "#FFD1DC", color: "#B76E79" }}
        >
          Pastel
        </button>
        <button
          onClick={() => setActiveTheme("bold")}
          className="px-6 py-2 rounded-full shadow-lg"
          style={{ backgroundColor: "#FF4F81", color: "white" }}
        >
          Bold
        </button>
      </div>

      {/* 3D Perspective */}
      <div
        className="relative w-[450px] h-[450px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          {photos.map((src, index) => {
            const angle = (360 / photos.length) * index;

            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) translate(-50%, -50%)`,
                }}
              >
                <img
                  src={`${src}?w=400&h=400&fit=crop`}
                  alt="valentine"
                  className="w-40 h-40 object-cover rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-110"
                  style={{ border: `4px solid ${theme.border}` }}
                />
              </div>
            );
          })}
        </motion.div>

        {/* Center Heart */}
        <div
          className="absolute w-36 h-36 rounded-full flex items-center justify-center shadow-2xl z-10 animate-pulse"
          style={{ backgroundColor: theme.accent }}
        >
          <span className="text-4xl" style={{ color: theme.text }}>
            💖
          </span>
        </div>
      </div>

      <p
        className="mt-16 text-lg text-center max-w-lg"
        style={{ color: theme.text }}
      >
        A 3D rotating carousel styled with romantic Valentine color palettes.
      </p>
    </div>
  );
}
