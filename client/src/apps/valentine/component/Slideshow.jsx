import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const img1 = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600";
const img2 = "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=600";
const img3 = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600";
const img4 = "https://images.unsplash.com/photo-1501908734255-16579c18c25f?auto=format&fit=crop&q=80&w=600";

const slides = [
  {
    image: img1,
    caption: "A moment that felt like time stopped..."
  },
  {
    image: img2,
    caption: "Some memories never fade."
  },
  {
    image: img3,
    caption: "Close enough to hear a heartbeat."
  },
  {
    image: img4,
    caption: "Where the world disappeared."
  }
];

export default function CinematicSlideshow() {

  const [[index, direction], setIndex] = useState([0, 0]);

  // ⭐ Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [index]);

  const paginate = (dir) => {
    setIndex([(index + dir + slides.length) % slides.length, dir]);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute left-[15%] top-[70%] text-4xl opacity-40"
        >
          ❤️
        </motion.div>

        <motion.div
          animate={{ y: [0, -60, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute right-[20%] top-[75%] text-3xl opacity-30"
        >
          💕
        </motion.div>
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}

          // Swipe detection
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x < -100) paginate(1);
            if (info.offset.x > 100) paginate(-1);
          }}

          initial={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(20px)"
          }}

          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)"
          }}

          exit={{
            opacity: 0,
            scale: 0.95
          }}

          transition={{
            duration: 1.8,
            ease: "easeOut"
          }}

          className="absolute"
        >

          {/* Image */}
          <motion.img
            src={slides[index].image}
            alt="memory"

            // ⭐ Ken Burns zoom
            animate={{ scale: [1, 1.12] }}
            transition={{ duration: 8, ease: "linear" }}

            className="w-[340px] md:w-[700px] rounded-3xl shadow-[0_30px_120px_rgba(255,120,120,0.25)]"
            style={{
              filter:
                "contrast(1.05) saturate(1.1) sepia(0.08) brightness(0.95)"
            }}
          />

          {/* Glass Caption */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="
              absolute bottom-[-70px] left-1/2
              -translate-x-1/2
              backdrop-blur-xl
              bg-white/10
              border border-white/20
              px-8 py-3
              rounded-full
              text-white
              shadow-xl
            "
          >
            {slides[index].caption}
          </motion.div>

        </motion.div>
      </AnimatePresence>

    </section>
  );
}
