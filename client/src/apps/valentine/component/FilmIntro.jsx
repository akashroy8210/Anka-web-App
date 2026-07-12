import { motion } from "framer-motion";

export default function FilmIntro() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2.5, delay: 2 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <motion.h1
        initial={{ letterSpacing: "25px", opacity: 0 }}
        animate={{ letterSpacing: "8px", opacity: 1 }}
        transition={{ duration: 2 }}
        className="text-5xl text-white font-light"
      >
        Our Story
      </motion.h1>
    </motion.div>
  );
}
