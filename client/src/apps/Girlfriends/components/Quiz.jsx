import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GirlfriendPlaceholderService from '../services/girlfriendPlaceholderService';
import HeartRain from '../../virtual-date/components/overlays/HeartRain';

export default function Quiz({ onNext, customQuestions = [], boyfriendPhoto, onSendWish, onSendKiss }) {
  const questions = customQuestions.length > 0 ? customQuestions : GirlfriendPlaceholderService.getPlaceholderQuestions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isWrongAnimation, setIsWrongAnimation] = useState(false);
  const [showHeartsRain, setShowHeartsRain] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Wish state
  const [wishText, setWishText] = useState("");
  const [wishSubmitted, setWishSubmitted] = useState(false);

  // Kisses state
  const [kissesSent, setKissesSent] = useState(0);
  const [flyingKisses, setFlyingKisses] = useState([]);

  const currentQ = questions[currentIndex];
  const kissesOwed = wrongCount * 10;

  const handleOptionClick = (idx) => {
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      setShowHeartsRain(true);
      setTimeout(() => setShowHeartsRain(false), 2500);
    } else {
      setWrongCount((prev) => prev + 1);
      setIsWrongAnimation(true);
      setTimeout(() => setIsWrongAnimation(false), 1500);
    }

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 700);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
      }, 900);
    }
  };

  const handleSubmitWish = (e) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    if (onSendWish) onSendWish(wishText);
    setWishSubmitted(true);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  const handleSendKissClick = () => {
    if (kissesSent >= kissesOwed) return;

    const newSent = kissesSent + 1;
    setKissesSent(newSent);
    if (onSendKiss) onSendKiss(newSent, kissesOwed);

    const kissId = Date.now() + Math.random();
    setFlyingKisses((prev) => [...prev, { id: kissId }]);
    setTimeout(() => {
      setFlyingKisses((prev) => prev.filter((k) => k.id !== kissId));
    }, 1000);

    if (newSent >= kissesOwed) {
      setTimeout(() => {
        onNext();
      }, 1500);
    }
  };

  const isPerfect = wrongCount === 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[var(--gf-bg-main)] text-[var(--gf-text-primary)] relative overflow-hidden"
    >
      {/* Heart Rain Component */}
      {showHeartsRain && <HeartRain />}

      {/* Shattering Heart Overlay */}
      <AnimatePresence>
        {isWrongAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          >
            <div className="text-8xl gf-shatter-anim">💔</div>
            <p className="text-rose-400 font-bold text-xl mt-4 animate-pulse">+10 Kisses Owed! 💋</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Live Counter */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 right-6 flex items-center justify-between z-20 max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full gf-glass-card text-xs font-semibold">
          <span>Question {currentIndex + 1} / {questions.length}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-xs">
            💋 {kissesOwed} Kisses
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold text-xs">
            🎁 {score === questions.length ? 1 : 0} Wish
          </div>
        </div>
      </motion.div>

      {!isCompleted ? (
        /* Quiz Interface */
        <div className="max-w-xl w-full text-center space-y-8 my-auto pt-16">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[var(--gf-accent-gold)] font-bold">
                  {currentQ.section}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold gf-font-serif">
                  {currentQ.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4">
                {currentQ.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionClick(idx)}
                    className="w-full py-4 px-6 rounded-2xl gf-glass-card text-left text-sm md:text-base font-medium hover:border-[var(--gf-accent-gold)] transition-all cursor-pointer"
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Quiz Completion Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="max-w-md w-full gf-glass-card p-8 rounded-3xl text-center space-y-6 my-auto relative"
        >
          {isPerfect ? (
            <form onSubmit={handleSubmitWish} className="space-y-4">
              <div className="text-5xl animate-bounce">🏆</div>
              <h2 className="text-3xl font-bold gf-font-serif text-[var(--gf-accent-gold)]">
                You Won ❤️
              </h2>
              <p className="text-sm opacity-80">
                You scored a perfect 20/20! What would you like from your boyfriend?
              </p>

              <textarea
                rows={3}
                required
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Write your secret wish here..."
                className="w-full p-4 rounded-xl border border-[var(--gf-border-color)] bg-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gf-accent-gold)]"
              />

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={wishSubmitted}
                className="gf-btn-primary w-full py-3 text-base cursor-pointer"
              >
                {wishSubmitted ? 'Wish Sent! ❤️' : 'Send My Wish 🎁'}
              </motion.button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={boyfriendPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                  alt="Boyfriend"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[var(--gf-border-color)] shadow-xl"
                />
                {flyingKisses.map((k) => (
                  <span key={k.id} className="gf-flying-kiss text-3xl">💋</span>
                ))}
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold gf-font-serif">
                  You owe {kissesOwed} kisses 💋
                </h2>
                <p className="text-xs opacity-70">
                  Click the button below to send all required kisses to your boyfriend!
                </p>
              </div>

              <div className="text-xl font-bold text-rose-500">
                💋 {kissesSent} / {kissesOwed}
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSendKissClick}
                disabled={kissesSent >= kissesOwed}
                className="gf-btn-primary w-full py-3.5 text-lg cursor-pointer"
              >
                {kissesSent >= kissesOwed ? 'All Kisses Sent! ❤️' : 'Send Kiss 💋'}
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
