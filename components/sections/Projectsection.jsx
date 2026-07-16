"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, BookOpen, BrainCircuit, Map, CloudSun, Film } from "lucide-react";
import Image from "next/image";

// Inline SVG component
function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const projects = [
  {
    id: 1,
    title: "PromptPilot",
    tagline: "An AI-powered tool to optimize and manage prompts for ChatGPT, Gemini, Claude, and more.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Gemini API"],
    github: "https://github.com/Shree-VishnuA/promptPilot.git",
    demo: "https://prompt-pilot-zeta.vercel.app/",
    accent: "from-cyan-400 to-violet-600",
    icon: Sparkles,
    color: "from-cyan-400/20 to-violet-600/20",
    textColor: "text-cyan-400",
    image: "/projects/prompt-pilot.png"
  },
  {
    id: 2,
    title: "BlogNest",
    tagline: "A full-stack blogging platform where you can write, publish, and converse in the margins of every story.",
    tech: ["Node.js", "Express.js", "MongoDB", "EJS","Cloudinary"],
    github: "https://github.com/Shree-VishnuA/My_Blog_App.git",
    demo: "https://my-blog-nest.vercel.app/",
    accent: "from-orange-400 to-amber-600",
    icon: BookOpen,
    color: "from-orange-400/20 to-amber-600/20",
    textColor: "text-orange-400",
    image: "/projects/BlogNest.png"
  },
  {
    id: 3,
    title: "Narada",
    tagline: "An agentic AI assistant with multi-step reasoning, tool calling, and persistent conversational memory.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Gemini API", "Agentic AI"],
    github: "https://github.com/Shree-VishnuA/Narada-AI.git",
    accent: "from-emerald-400 to-teal-600",
    icon: BrainCircuit,
    color: "from-emerald-400/20 to-teal-600/20",
    textColor: "text-emerald-400",
    image: "/projects/Narada.png"
  },
  {
    id: 4,
    title: "ARISE",
    tagline: "A platform to preserve traditional Indian art forms by connecting local artists with art lovers and buyers.",
    tech: ["React", "Node.js", "Next.js", "MongoDB", "Gemini API"],
    github: "https://github.com/Shree-VishnuA/Arise-Codefury.git",
    demo: "https://arise-codefury.vercel.app/",
    accent: "from-purple-500 to-pink-600",
    icon: Map,
    color: "from-purple-500/20 to-pink-600/20",
    textColor: "text-purple-500",
    image: "/projects/Arise.png"
  },
  {
    id: 5,
    title: "MovieHunt",
    tagline: "A cinematic movie discovery app for browsing trending films, TV shows, and popular personalities.",
    tech: ["React", "TMDB API"],
    github: "https://github.com/Shree-VishnuA/Movie-Explorer.git",
    demo: "https://shree-vishnua.github.io/Movie-Explorer/",
    accent: "from-red-500 to-rose-600",
    icon: Film,
    color: "from-red-500/20 to-rose-600/20",
    textColor: "text-red-400",
    image: "/projects/MovieHunt.png"
  },
  {
    id: 6,
    title: "Weatherly",
    tagline: "A real-time weather app with live forecasts, air quality index, UV data, and dynamic location-based UI.",
    tech: ["React", "Weather API","Rapid API"],
    github: "https://github.com/Shree-VishnuA/Weatherly.git",
    demo: "https://shree-vishnua.github.io/Weatherly/",
    accent: "from-sky-400 to-indigo-600",
    icon: CloudSun,
    color: "from-sky-400/20 to-indigo-600/20",
    textColor: "text-sky-400",
    image: "/projects/Weatherly.png"
  },
];


export default function Projectsection() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.min(
        Math.floor(latest * projects.length),
        projects.length - 1
      );
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const active = projects[activeIndex];

  return (
    <section id="projects" className="relative w-full pt-10">
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        style={{ height: `${projects.length * 100}vh` }}
        className="relative w-full"
      >
        {/* Sticky Viewport */}
        <div className="sticky top-0 w-full flex items-center overflow-hidden min-h-screen">

          {/* ═══════════════════════════════════════════════════════════════
              MOBILE PORTRAIT CARD  (hidden on lg+)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:hidden w-full h-svh flex flex-col items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-8 px-4">
            
            {/* Mobile Heading */}
            <div className="absolute top-20 sm:top-24 left-0 w-full px-6 z-20 text-left pointer-events-none">
              <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                Projects
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Scroll to explore some of my best works.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-sm mx-auto rounded-2xl border border-zinc-400/20 overflow-hidden shadow-2xl flex flex-col bg-zinc-950 mt-16 sm:mt-20"
                style={{ maxHeight: "calc(100svh - 175px)" }}
              >
                {/* ── Image area ── */}
                <div className={`relative w-full bg-linear-to-br ${active.color} shrink-0 h-44 sm:h-52`}>
                  {active.image ? (
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, 480px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {(() => {
                        const Icon = active.icon;
                        return <Icon className={`w-20 h-20 ${active.textColor} drop-shadow-2xl`} />;
                      })()}
                    </div>
                  )}

                  {/* Bottom scrim */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-zinc-950 pointer-events-none" />

                  {/* Circular action buttons — overlaid bottom-left of image */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <a
                      href={active.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-all duration-200"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    {active.demo && (
                      <a
                        href={active.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* ── Info panel ── */}
                <div className="bg-zinc-950 px-4 sm:px-5 py-4 sm:py-5 flex flex-col gap-2 sm:gap-3 flex-1 overflow-y-auto">
                  {active.badge && (
                    <span className="text-[9px] tracking-widest font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full uppercase w-fit">
                      {active.badge}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {active.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {active.tagline}
                  </p>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1.5 my-1">
                    {active.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] sm:text-[11px] font-medium bg-white/8 border border-white/12 text-gray-200 rounded-full px-2.5 py-0.5 shrink-0"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Square action buttons at bottom */}
                  <div className="flex items-center gap-3 pt-1 mt-auto">
                    <a
                      href={active.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/15 transition-all duration-200"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    {active.demo && (
                      <a
                        href={active.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/15 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {projects.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? `w-6 bg-linear-to-r ${active.accent}`
                      : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>


          {/* ═══════════════════════════════════════════════════════════════
              DESKTOP TWO-COLUMN LAYOUT  (hidden below lg)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:flex w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex-row justify-between items-center gap-12 lg:gap-20">

            {/* Left Column: Text Content (crisp) */}
            <div className="w-1/2 relative z-10 flex flex-col justify-center">
              <div className="mb-10 flex flex-col gap-3">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                  Projects
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Scroll to explore some of my best works and collaborative projects.
                </p>
              </div>

              <div className="relative min-h-[220px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 w-full"
                  >
                    {active.badge && (
                      <span className="inline-block text-[10px] tracking-widest font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase mb-3">
                        {active.badge}
                      </span>
                    )}
                    <h3 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                      {active.title}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mb-6">
                      {active.tagline}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {active.tech.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="text-[10px] font-medium bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-full px-2.5 py-0.5"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-xs font-semibold px-6 h-9 shadow-none"
                      >
                        <a href={active.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <GithubIcon className="w-3.5 h-3.5" />
                          Source
                        </a>
                      </Button>
                      {active.demo && (
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="rounded-full text-xs font-semibold px-6 h-9 border border-gray-300 dark:border-white/15 hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5"
                        >
                          <a href={active.demo} target="_blank" rel="noopener noreferrer">
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-2 mt-8">
                {projects.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? `w-8 bg-linear-to-r ${active.accent}`
                        : "w-2 bg-gray-200 dark:bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Visual Content */}
            <div className="w-1/2 relative h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 z-10 pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-xl aspect-video"
                >
                  <div className={`w-full h-full rounded-3xl bg-linear-to-br ${active.color} border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden group relative`}>
                    {active.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={active.image}
                          alt={active.title}
                          fill
                          className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                          sizes="50vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className={`absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-linear-to-br ${active.color} opacity-40 dark:opacity-20 blur-3xl`}
                        />
                        {(() => {
                          const Icon = active.icon;
                          return <Icon className={`w-32 h-32 ${active.textColor} drop-shadow-2xl relative z-10`} />;
                        })()}
                        <div className="absolute inset-0 bg-white/50 dark:bg-white/5 backdrop-blur-[1px]" />
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}