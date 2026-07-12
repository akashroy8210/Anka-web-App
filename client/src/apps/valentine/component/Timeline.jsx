import { motion } from "framer-motion";
import { useState } from "react";


const journey = [
  {
    title: "First Meeting",
    icon: "✨",
    text: "The day everything quietly changed."
  },
  {
    title: "First Laugh",
    icon: "💫",
    text: "A moment that felt effortless and real."
  },
  {
    title: "The Kiss",
    icon: "❤️",
    text: "When the world faded and only we existed."
  }
];

export default function CinematicTimeline() {

  const [open, setOpen] = useState(false);
  const [letter, setLetter] = useState("");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (

    <motion.section
      onMouseMove={(e)=>{
        setMouse({x:e.clientX, y:e.clientY})
      }}

      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}

      className="relative min-h-screen flex flex-col items-center justify-center gap-24 bg-black overflow-hidden text-white"
    >

      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(
            500px at ${mouse.x}px ${mouse.y}px,
            rgba(255,120,150,0.15),
            transparent 70%
          )`,
        }}
      />

      {/* Film Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,black_90%)]"/>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-5xl font-semibold"
      >
        Our Journey
      </motion.h2>

      {/* Timeline */}
      <div className="relative w-full max-w-5xl">

        {/* Line */}
        <motion.div
          style={{ y: -40 }}
          className="absolute left-1/2 top-0 h-full w-[2px]
          bg-gradient-to-b from-pink-500 to-transparent"
        />

        {journey.map((item, i) => (

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 120, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: i * 0.2 }}
            className={`relative flex items-center mb-28
            ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >

            {/* Card */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.07 }}
              onClick={()=>{
                setLetter(item.text);
                setOpen(true);
              }}
              className="
                relative z-10 w-[300px]
                backdrop-blur-xl
                bg-white/10
                border border-white/20
                rounded-2xl
                p-6
                cursor-pointer
                shadow-[0_25px_70px_rgba(255,120,150,0.25)]
              "
            >

              {/* Heartbeat Icon */}
              <motion.div
                whileHover={{ scale:[1,1.18,1] }}
                transition={{ duration:0.8, repeat:Infinity }}
                className="text-3xl mb-2"
              >
                {item.icon}
              </motion.div>

              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>

              <p className="opacity-80 text-sm mt-2">
                {item.text}
              </p>

              {/* Sparkles (FIXED — no click blocking) */}
              {/* Sparkles */}
<motion.div
  className="absolute inset-0 pointer-events-none"
  initial={{ opacity: 0 }}
  whileHover={{ opacity: 1 }}
>
  {[...Array(6)].map((_, i) => (
    <motion.span
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        top: `${20 + i * 10}%`,
        left: `${15 + i * 12}%`,
      }}
      animate={{
        y: [-10, -25],
        opacity: [0, 1, 0],
        scale: [0.5, 1.4, 0.5],
      }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        delay: i * 0.2,
      }}
    />
  ))}
</motion.div>


            </motion.div>

          </motion.div>
        ))}
      </div>

      {/* LOVE LETTER MODAL */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={()=>setOpen(false)}
        >
          <motion.div
            onClick={(e)=>e.stopPropagation()}
            initial={{ scale: 0.6, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120 }}

            className="
              bg-white text-black
              p-10 rounded-2xl
              max-w-md text-center
              shadow-2xl
            "
          >
            💌

            <h3 className="text-2xl font-semibold mt-4">
              A Memory For You
            </h3>

            <p className="mt-4">
              {letter}
            </p>

            <p className="mt-6 text-sm opacity-70">
              (tap anywhere outside to close)
            </p>

          </motion.div>
        </motion.div>
      )}

    </motion.section>
  );
}
