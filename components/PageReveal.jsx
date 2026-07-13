"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BIG_TEXT = "SV";
const SUB_TEXT = "Shree Vishnu";

// Deterministic "thrown" origin per letter — varies angle, distance, and spin
function throwFrom(index) {
  const angle = index * 2.4 + (index % 2 === 0 ? 0 : Math.PI);
  const distance = 220 + (index % 3) * 70;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 120, // bias upward, like falling in from above
    rotate: (index % 2 === 0 ? -1 : 1) * (140 + index * 20),
  };
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

function letterVariants(index) {
  const { x, y, rotate } = throwFrom(index);
  return {
    hidden: { opacity: 0, x, y, rotate, scale: 0.4 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 18, mass: 0.9 },
    },
  };
}

function ThrownText({ text, className, startDelay = 0 }) {
  const letters = text.split("");
  return (
    <motion.p
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: startDelay }}
      aria-label={text}
    >
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letterVariants(i)}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          aria-hidden="true"
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}

// Full-screen page reveal that sits above everything (navbar included)
// Letters get thrown in, then the whole overlay fades out
export default function PageReveal({ children }) {
  const [revealed, setRevealed] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true);
      setTimeout(() => setOverlayGone(true), 900);
    }, 1600); // gives the thrown letters time to land before the exit starts
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Render children immediately so the page is ready underneath */}
      <div style={{ visibility: overlayGone ? "visible" : "hidden" }}>
        {children}
      </div>

      {/* Full-viewport overlay — covers navbar + everything */}
      <AnimatePresence>
        {!overlayGone && (
          <motion.div
            className="fixed inset-0 z-9999 bg-white dark:bg-[#080808] flex flex-col items-center justify-center select-none overflow-hidden"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative flex flex-col items-center gap-6 pointer-events-none">
              <div className="absolute inset-0 -m-16 rounded-full bg-linear-to-br from-cyan-500/10 to-blue-600/10 blur-3xl" />

              <ThrownText
                text={BIG_TEXT}
                className="text-[22vw] sm:text-[18vw] lg:text-[14vw] leading-none font-black text-transparent bg-clip-text bg-linear-to-br from-gray-900/25 to-gray-900/8 dark:from-white/20 dark:to-white/5 tracking-tighter"
              />

              <ThrownText
                text={SUB_TEXT}
                className="text-gray-800 dark:text-white text-sm sm:text-base font-medium tracking-[0.5em] uppercase"
                startDelay={0.35}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}