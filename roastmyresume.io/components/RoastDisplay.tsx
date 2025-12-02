import React, { useState, useEffect } from 'react';
import { Share2, RefreshCw, Flame, ChevronLeft, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { INTENSITY_CONFIG } from '../constants';

export const RoastDisplay = ({ data, intensity, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const config = INTENSITY_CONFIG[intensity];
  const controls = useAnimation();
  const isFinished = currentIndex >= data.roasts.length;

  // Motion values for the active card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Background card transformations
  const bgScale = useTransform(x, [-200, 0, 200], [1, 0.95, 1]);

  const handleDragEnd = async (event, info) => {
    const threshold = 50; // Reduced threshold for easier swipe
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 200) { // Lower velocity threshold
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.1 } }); // Faster exit
      setCurrentIndex((prev) => prev + 1);
      x.set(0);
    } else if (info.offset.x < -threshold || velocity < -200) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.1 } }); // Faster exit
      setCurrentIndex((prev) => prev + 1);
      x.set(0);
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } }); // Snappier return
    }
  };

  const handleNext = async () => {
    if (currentIndex < data.roasts.length) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.1 } });
      setCurrentIndex((prev) => prev + 1);
      x.set(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      // Reset animation state for the returning card
      controls.set({ x: -500, opacity: 0 });
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, data.roasts.length]);

  const showToast = () => {
    const insults = [
      "You thought you'd get a 10? Delusional.",
      "Rating: -5/10. Go cry about it.",
      "I've seen better resumes on a bathroom stall.",
      "Your rating is 404: Talent Not Found.",
      "Even a participation trophy is too good for this.",
      "On a scale of 1 to 10, you're a mistake.",
      "Don't embarrass yourself further.",
      "My rating? Burn it and start over."
    ];
    setToastMessage(insults[Math.floor(Math.random() * insults.length)]);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full pb-20 flex flex-col items-center justify-center min-h-[600px] relative">

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 z-50 px-6 py-4 bg-red-900/90 backdrop-blur-md border border-red-500/50 rounded-2xl shadow-2xl shadow-red-900/50 flex items-center gap-3 max-w-md mx-4"
          >
            <AlertTriangle className="text-red-400 w-6 h-6 shrink-0" />
            <p className="text-white font-medium text-sm md:text-base">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Stack Container */}
      {!isFinished && (
        <div className="relative w-full max-w-2xl mx-auto h-[500px] flex items-center justify-center perspective-1000">

          {/* Cards Stack */}
          <div className="relative w-full h-full flex items-center justify-center">
            {data.roasts.map((roast, index) => {
              // Only render relevant cards
              if (index < currentIndex - 1 || index > currentIndex + 3) return null;

              const isFront = index === currentIndex;
              const offset = index - currentIndex; // 0, 1, 2...

              // Alternating Stack Logic
              const rotationDir = index % 2 === 0 ? 1 : -1;
              const rotation = isFront ? 0 : (offset * 4 * rotationDir);
              const yOffset = isFront ? 0 : (offset * 8);
              const scale = isFront ? 1 : (1 - offset * 0.05);

              return (
                <motion.div
                  key={index}
                  className="absolute w-[380px] max-w-[90vw] cursor-grab active:cursor-grabbing origin-bottom"
                  style={{
                    zIndex: isFront ? 100 : 50 - offset,
                    x: isFront ? x : 0,
                    rotate: isFront ? rotate : rotation,
                    scale: scale,
                    y: yOffset,
                  }}
                  animate={isFront ? controls : {}}
                  initial={isFront ? { x: 0, opacity: 1 } : {}}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                  whileTap={{ cursor: "grabbing" }}
                >
                  <div className={`
                    relative p-5 md:p-6 rounded-2xl flex flex-col gap-3 min-h-[220px] justify-center
                    shadow-2xl shadow-black/50 border border-white/10
                    transition-colors duration-300 bg-dark-card/90 backdrop-blur-md
                    ${isFront ? 'border-primary/20 shadow-primary/10' : 'opacity-80'}
                  `}>
                    {/* Card Header */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-3xl font-display font-bold text-white/10 select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className={`p-1.5 rounded-full bg-white/5 border border-white/5`}>
                        <Flame className={`w-4 h-4 ${config.color} opacity-80`} />
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed relative z-10 tracking-wide select-none">
                      "{roast}"
                    </p>

                    {/* Swipe Hint Overlay */}
                    {isFront && (
                      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 opacity-30">
                        <div className="h-1 w-10 rounded-full bg-white/20"></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      )}

      {/* Controls (Only visible when swiping) */}
      {!isFinished && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-4 rounded-full bg-dark-surface border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:hover:scale-100"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="text-sm font-medium text-gray-500 tracking-widest">
            {currentIndex + 1} / {data.roasts.length}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= data.roasts.length}
            className="p-4 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Final Verdict Screen */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto text-center space-y-10"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center p-1.5 px-4 bg-dark-surface/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg animate-float">
                <span className="text-xs font-bold tracking-widest text-primary-light uppercase">THE FINAL VERDICT</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight drop-shadow-2xl text-glow-strong px-4">
                {data.verdict}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold text-lg rounded-full hover:bg-primary-hover transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95"
              >
                <RotateCcw size={20} />
                Roast Me Again
              </button>

              <button
                className="flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-medium text-lg rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={() => alert("Copied to clipboard. Go cry on LinkedIn.")}
              >
                <Share2 size={20} />
                Share the Pain
              </button>
            </div>

            {/* The Trap Button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  const insults = [
                    "Rating: 404. Talent not found. Try again in another life.",
                    "I'd give you a 0, but that's an insult to the number 0.",
                    "You're the reason we need universal basic income.",
                    "If disappointment had a resume, this would be it.",
                    "I've seen blank pages with more potential.",
                    "Your career trajectory is a flatline. beep... beep... beep...",
                    "Is this a resume or a cry for help?",
                    "I'm not saying it's bad, but I wouldn't hire you to water my plants.",
                    "Error: Resume too pathetic to rate. System crashing from cringe.",
                    "You have the professional appeal of a wet sock."
                  ];
                  setToastMessage(insults[Math.floor(Math.random() * insults.length)]);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
              >
                <AlertTriangle size={16} className="text-primary" />
                Check my Resume Rating (out of 10)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};