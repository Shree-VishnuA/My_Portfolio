"use client";

import { useState, useEffect } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const NAME = "Shree Vishnu";
const EXPO = [0.76, 0, 0.24, 1]; // calm in-out, used for the shutters
const SOFT = [0.22, 1, 0.36, 1]; // soft ease-out, used for the drawing + text

// Timeline (seconds)
const COUNT_DURATION = 1.5; // 000 → 100
const SHOW_FOR = 1750; // ms before the shutters open
const SHUTTER_TIME = 1100; // ms the shutter animation needs before we unmount

// The "SV" monogram, drawn as two strokes on a 188 × 112 grid.
// S: one continuous curve. V: a single chevron.
const S_PATH =
  "M 66 30 C 66 14, 50 8, 38 8 C 22 8, 10 18, 10 32 C 10 46, 22 52, 38 56 C 54 60, 66 66, 66 80 C 66 94, 54 104, 38 104 C 24 104, 12 98, 10 84";
const V_PATH = "M 84 8 L 120 104 L 156 8";

function Stroke({ d, delay, duration }) {
  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-gray-900 dark:stroke-white"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: { duration, delay, ease: SOFT },
        // keeps the round cap from showing as a dot before the stroke starts
        opacity: { duration: 0.01, delay },
      }}
    />
  );
}

// Full-screen page reveal that sits above everything (navbar included).
// A monogram draws itself while a counter runs to 100, then the screen
// parts like shutters to show the page underneath.
export default function PageReveal({ children }) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);

  // Counter + progress line share one motion value
  const count = useMotionValue(0);
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const progress = useTransform(count, [0, 100], [0, 1]);

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: reduce ? 0.4 : COUNT_DURATION,
      delay: reduce ? 0 : 0.1,
      ease: [0.65, 0, 0.35, 1],
    });
    return () => controls.stop();
  }, [count, reduce]);

  useEffect(() => {
    const showFor = reduce ? 600 : SHOW_FOR;
    const exitFor = reduce ? 400 : SHUTTER_TIME;
    const t1 = setTimeout(() => setRevealed(true), showFor);
    const t2 = setTimeout(() => setOverlayGone(true), showFor + exitFor);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce]);

  useEffect(() => {
    document.body.style.overflow = overlayGone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayGone]);

  return (
    <>
      {/* Page renders underneath. It becomes visible as the shutters open, not after. */}
      <div style={{ visibility: revealed ? "visible" : "hidden" }}>{children}</div>

      {!overlayGone && (
        <div
          className="fixed inset-0 z-9999 select-none overflow-hidden"
          role="status"
          aria-label="Loading"
        >
          {/* Shutters: two halves that part to reveal the page */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{
              y: reduce ? "0%" : revealed ? "-100%" : "0%",
              opacity: reduce && revealed ? 0 : 1,
            }}
            transition={{ duration: reduce ? 0.35 : 0.9, ease: EXPO, delay: reduce ? 0 : 0.15 }}
            className="absolute inset-x-0 top-0 h-[calc(50%+1px)] bg-white dark:bg-[#080808]"
          />
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{
              y: reduce ? "0%" : revealed ? "100%" : "0%",
              opacity: reduce && revealed ? 0 : 1,
            }}
            transition={{ duration: reduce ? 0.35 : 0.9, ease: EXPO, delay: reduce ? 0 : 0.15 }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-white dark:bg-[#080808]"
          />

          {/* Content: fades out just before the shutters move */}
          <motion.div
            initial={false}
            animate={{ opacity: revealed ? 0 : 1, scale: revealed && !reduce ? 0.96 : 1 }}
            transition={{ duration: 0.35, ease: SOFT }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Monogram */}
            <svg
              viewBox="0 0 188 112"
              className="w-40 sm:w-56 lg:w-64 overflow-visible"
              aria-hidden="true"
            >
              <Stroke d={S_PATH} delay={reduce ? 0 : 0.1} duration={reduce ? 0.2 : 0.7} />
              <Stroke d={V_PATH} delay={reduce ? 0 : 0.4} duration={reduce ? 0.2 : 0.7} />
              <motion.circle
                cx="174"
                cy="101"
                r="6"
                className="fill-cyan-500"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 16,
                  delay: reduce ? 0 : 1.05,
                }}
              />
            </svg>

            {/* Name: slides up out of a clipped line */}
            <span className="mt-8 sm:mt-10 block overflow-hidden py-1">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: reduce ? 0 : 0.7, ease: SOFT, delay: reduce ? 0 : 0.8 }}
                className="block text-sm sm:text-base font-medium tracking-[0.2em] text-gray-800 dark:text-white"
              >
                {NAME}
              </motion.span>
            </span>
          </motion.div>

          {/* Bottom bar: progress line + counter */}
          <motion.div
            initial={false}
            animate={{ opacity: revealed ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-0 bottom-0 px-6 sm:px-10 pb-6 sm:pb-8 pointer-events-none"
          >
            <div className="flex items-end justify-between mb-3">
              <motion.span
                aria-hidden="true"
                className="text-xs sm:text-sm font-medium tabular-nums tracking-widest text-gray-500 dark:text-gray-400"
              >
                {label}
              </motion.span>
              <span className="text-xs sm:text-sm font-medium tracking-widest text-gray-400 dark:text-gray-500">
                Portfolio
              </span>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-white/10">
              <motion.div
                className="h-px origin-left bg-gray-900 dark:bg-white"
                style={{ scaleX: progress }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}