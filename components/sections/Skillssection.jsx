"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

// ── Tech stack with real icons from skillicons.dev ──────────────────────────
const techStack = [
  { name: "HTML", icon: "https://skillicons.dev/icons?i=html", category: "Frontend" },
  { name: "CSS", icon: "https://skillicons.dev/icons?i=css", category: "Frontend" },
  { name: "JavaScript", icon: "https://skillicons.dev/icons?i=js", category: "Frontend" },
  { name: "React", icon: "https://skillicons.dev/icons?i=react", category: "Frontend" },
  { name: "Next.js", icon: "https://skillicons.dev/icons?i=nextjs", category: "Frontend" },
  { name: "Tailwind", icon: "https://skillicons.dev/icons?i=tailwind", category: "Frontend" },
  { name: "Vite", icon: "https://skillicons.dev/icons?i=vite", category: "Frontend" },
  { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs", category: "Backend" },
  { name: "Express", icon: "https://skillicons.dev/icons?i=express", category: "Backend" },
  { name: "MongoDB", icon: "https://skillicons.dev/icons?i=mongodb", category: "Backend" },
  { name: "Python", icon: "https://skillicons.dev/icons?i=python", category: "Languages" },
  { name: "C++", icon: "https://skillicons.dev/icons?i=cpp", category: "Languages" },
  { name: "GitHub", icon: "https://skillicons.dev/icons?i=github", category: "Tools" },
  { name: "Postman", icon: "https://skillicons.dev/icons?i=postman", category: "Tools" },
];

const categories = [
  { name: "Frontend", gradient: "from-cyan-500 to-blue-600" },
  { name: "Backend", gradient: "from-emerald-500 to-teal-600" },
  { name: "Languages", gradient: "from-violet-500 to-purple-600" },
  { name: "Tools", gradient: "from-orange-500 to-rose-600" },
];

export default function Skillssection() {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // +1 gives a small buffer at the end so the last icon has time to settle
      const count = Math.floor(latest * (techStack.length + 1));
      setVisibleCount(Math.min(count, techStack.length));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const activeCategory =
    visibleCount > 0
      ? techStack[Math.min(visibleCount - 1, techStack.length - 1)].category
      : null;

  return (
    <section id="skills" className="relative w-full">
      {/* ── Scrollable container — height controls how fast icons reveal ── */}
      <div
        ref={containerRef}
        style={{ height: `${techStack.length * 25 + 80}vh` }}
        className="relative w-full"
      >
        {/* ── Sticky viewport ─────────────────────────────────────────── */}
        <div className="sticky top-14 sm:top-4 lg:top-8 w-full overflow-x-hidden flex items-center min-h-[calc(100dvh-3.5rem)]">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center gap-8 lg:gap-20 py-8 lg:py-0">

            {/* ── Left Column: Title + category progress bars ─────────── */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                Skills
              </h2>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-5 sm:mb-8">
                Scroll to explore my tech stack.
              </p>

              {/* Category progress bars */}
              <div className="flex flex-col gap-4 sm:gap-5">
                {categories.map(({ name, gradient }) => {
                  const catItems = techStack.filter((t) => t.category === name);
                  const firstIdx = techStack.findIndex((t) => t.category === name);
                  const revealed = Math.min(Math.max(visibleCount - firstIdx, 0), catItems.length);
                  const isActive = activeCategory === name;
                  const pct = (revealed / catItems.length) * 100;

                  return (
                    <motion.div
                      key={name}
                      animate={{ opacity: firstIdx < visibleCount ? 1 : 0.3 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-3 sm:gap-4"
                    >
                      {/* Accent bar */}
                      <motion.div
                        animate={{ scaleY: isActive ? 1.3 : 1 }}
                        transition={{ duration: 0.3 }}
                        className={`w-1 h-8 rounded-full bg-linear-to-b ${gradient} shrink-0 origin-center`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p
                            className={`text-sm font-semibold transition-colors duration-300 ${isActive
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-400 dark:text-gray-500"
                              }`}
                          >
                            {name}
                          </p>
                        </div>
                        {/* Progress fill */}
                        <div className="h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-linear-to-r ${gradient} rounded-full`}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>


            </div>

            {/* ── Right Column: Tech icon grid ─────────────────────────── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              {/*
                Desktop: 7 cols → 2 rows of 7 (matching the reference image)
                Mobile:  4 cols → 4 rows of ~3-4
              */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4 lg:gap-6">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.3, y: -32 }}
                    animate={
                      i < visibleCount
                        ? { opacity: 1, scale: 1, y: 0 }
                        : { opacity: 0, scale: 0.3, y: -32 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    }}
                    className="flex flex-col items-center gap-1.5 group cursor-default"
                  >
                    {/* Icon tile */}
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        width={44}
                        height={44}
                        className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium leading-tight">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}