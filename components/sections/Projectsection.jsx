"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Sparkles,
  BookOpen,
  BrainCircuit,
  Map,
  CloudSun,
  Film,
} from "lucide-react";
import Image from "next/image";

// Inline SVG component
function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
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
    image: "/projects/prompt-pilot.png",
  },
  {
    id: 2,
    title: "BlogNest",
    tagline: "A full-stack blogging platform where you can write, publish, and converse in the margins of every story.",
    tech: ["Node.js", "Express.js", "MongoDB", "EJS", "Cloudinary"],
    github: "https://github.com/Shree-VishnuA/My_Blog_App.git",
    demo: "https://my-blog-nest.vercel.app/",
    accent: "from-orange-400 to-amber-600",
    icon: BookOpen,
    color: "from-orange-400/20 to-amber-600/20",
    textColor: "text-orange-400",
    image: "/projects/BlogNest.png",
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
    image: "/projects/Narada.png",
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
    image: "/projects/Arise.png",
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
    image: "/projects/MovieHunt.png",
  },
  {
    id: 6,
    title: "Weatherly",
    tagline: "A real-time weather app with live forecasts, air quality index, UV data, and dynamic location-based UI.",
    tech: ["React", "Weather API", "Rapid API"],
    github: "https://github.com/Shree-VishnuA/Weatherly.git",
    demo: "https://shree-vishnua.github.io/Weatherly/",
    accent: "from-sky-400 to-indigo-600",
    icon: CloudSun,
    color: "from-sky-400/20 to-indigo-600/20",
    textColor: "text-sky-400",
    image: "/projects/Weatherly.png",
  },
];

/* ─────────────────────────── helpers ─────────────────────────── */

const EASE = [0.22, 1, 0.36, 1];

// Where an inactive layer waits: above the active one if it's already been
// scrolled past, below it if it's still to come.
const offsetFor = (index, active, distance) =>
  index === active ? 0 : index < active ? -distance : distance;

/**
 * One image layer. ALL layers stay mounted and are stacked on top of each other,
 * so switching projects is a pure crossfade — no unmount/remount, no waiting for
 * the next image to load, no blank frame between exit and enter.
 */
function ImageLayer({ project, index, activeIndex, reduce, distance, fit, sizes }) {
  const isActive = index === activeIndex;
  const Icon = project.icon;

  return (
    <motion.div
      aria-hidden={!isActive}
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 1.08,
        y: reduce ? 0 : offsetFor(index, activeIndex, distance),
      }}
      transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
      className={`absolute inset-0 bg-linear-to-br ${project.color} will-change-transform`}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={isActive ? project.title : ""}
          fill
          priority={index === 0}
          sizes={sizes}
          className={`${fit} transition-transform duration-700 group-hover:scale-105`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`w-20 h-20 ${project.textColor} drop-shadow-2xl`} />
        </div>
      )}
    </motion.div>
  );
}

/**
 * Text blocks are also always mounted and stacked in one grid cell. The cell is
 * as tall as the tallest block, so the layout never jumps between projects, and
 * the hidden blocks can't be tabbed to or clicked.
 */
function textMotion(index, activeIndex, reduce) {
  const isActive = index === activeIndex;
  return {
    initial: false,
    animate: isActive
      ? { opacity: 1, y: 0, visibility: "visible" }
      : {
          opacity: 0,
          y: reduce ? 0 : offsetFor(index, activeIndex, 24),
          transitionEnd: { visibility: "hidden" },
        },
    transition: {
      duration: reduce ? 0 : 0.5,
      ease: EASE,
      delay: isActive && !reduce ? 0.12 : 0, // outgoing text leaves first
    },
  };
}

function ProgressDots({ activeIndex, onSelect, accent, className = "" }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} role="tablist" aria-label="Projects">
      {projects.map((p, i) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Go to ${p.title}`}
          onClick={() => onSelect(i)}
          className="py-3 px-0.5 cursor-pointer focus-visible:outline-none group/dot"
        >
          <span
            className={`block h-1.5 rounded-full transition-all duration-500 ease-out group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-cyan-400 ${
              i === activeIndex
                ? `w-7 bg-linear-to-r ${accent}`
                : "w-2 bg-gray-300 dark:bg-white/20 group-hover/dot:bg-gray-400 dark:group-hover/dot:bg-white/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────── component ─────────────────────────── */

export default function Projectsection() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(
      Math.max(Math.floor(latest * projects.length), 0),
      projects.length - 1
    );
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  // Tap/click a dot to jump straight to that project
  const scrollToProject = (i) => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const progress = (i + 0.5) / projects.length; // middle of that project's slice
    window.scrollTo({
      top: top + progress * range,
      behavior: reduce ? "auto" : "smooth",
    });
  };

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
          {/* ═════════════ MOBILE (hidden on lg+) ═════════════ */}
          <div className="lg:hidden w-full h-svh flex flex-col pt-20 sm:pt-24 pb-4 px-4">
            {/* Heading now sits in normal flow, so it can never overlap the card */}
            <div className="shrink-0 px-2">
              <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                Projects
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Scroll to explore some of my best works.
              </p>
            </div>

            <div className="flex-1 min-h-0 flex items-center justify-center py-4">
              {/* The card shell is static — only its contents crossfade */}
              <div className="w-full max-w-sm max-h-full flex flex-col rounded-2xl border border-zinc-400/20 overflow-hidden bg-zinc-950">
                {/* Image stack */}
                <div className="group relative shrink-0 h-44 sm:h-52 overflow-hidden">
                  {projects.map((p, i) => (
                    <ImageLayer
                      key={p.id}
                      project={p}
                      index={i}
                      activeIndex={activeIndex}
                      reduce={reduce}
                      distance={28}
                      fit="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, 480px"
                    />
                  ))}
                  {/* Bottom scrim blends the image into the info panel */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-zinc-950 pointer-events-none" />
                </div>

                {/* Info stack */}
                <div className="grid px-4 sm:px-5 pt-1 pb-4 sm:pb-5 flex-1 min-h-0 overflow-y-auto">
                  {projects.map((p, i) => (
                    <motion.div
                      key={p.id}
                      {...textMotion(i, activeIndex, reduce)}
                      aria-hidden={i !== activeIndex}
                      className="col-start-1 row-start-1 flex flex-col gap-2 sm:gap-3 h-full will-change-transform"
                    >
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                        {p.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {p.tagline}
                      </p>

                      <div className="flex flex-wrap gap-1.5 my-1">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] sm:text-[11px] font-medium bg-white/8 border border-white/12 text-gray-200 rounded-full px-2.5 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* ONE set of action buttons (the duplicate overlay buttons are gone) */}
                      <div className="flex items-center gap-2.5 pt-2 mt-auto">
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-white/8 border border-white/10 text-sm font-medium text-gray-200 hover:text-white hover:bg-white/15 active:scale-[0.97] transition-all duration-200"
                        >
                          <GithubIcon className="w-4 h-4" />
                          Source
                        </a>
                        {p.demo && (
                          <a
                            href={p.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 text-sm font-semibold text-white hover:bg-cyan-400 active:scale-[0.97] transition-all duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <ProgressDots
              activeIndex={activeIndex}
              onSelect={scrollToProject}
              accent={active.accent}
              className="shrink-0 justify-center"
            />
          </div>

          {/* ═════════════ DESKTOP (hidden below lg) ═════════════ */}
          <div className="hidden lg:flex w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex-row justify-between items-center gap-12 lg:gap-20">
            {/* Left column: text */}
            <div className="w-1/2 relative z-10 flex flex-col justify-center">
              <div className="mb-10 flex flex-col gap-3">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                  Projects
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Scroll to explore some of my best works and collaborative projects.
                </p>
              </div>

              <div className="grid">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    {...textMotion(i, activeIndex, reduce)}
                    aria-hidden={i !== activeIndex}
                    className="col-start-1 row-start-1 will-change-transform"
                  >
                    <h3 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                      {p.title}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mb-6">
                      {p.tagline}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {p.tech.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="text-[10px] font-medium bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-full px-2.5 py-0.5"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-xs font-semibold px-6 h-9 shadow-none"
                      >
                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <GithubIcon className="w-3.5 h-3.5" />
                          Source
                        </a>
                      </Button>
                      {p.demo && (
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="rounded-full text-xs font-semibold px-6 h-9 border border-gray-300 dark:border-white/15 hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5"
                        >
                          <a href={p.demo} target="_blank" rel="noopener noreferrer">
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <ProgressDots
                activeIndex={activeIndex}
                onSelect={scrollToProject}
                accent={active.accent}
                className="mt-6 -ml-0.5"
              />
            </div>

            {/* Right column: image stack */}
            <div className="w-1/2 relative h-125 flex items-center justify-center">
              <div className="relative w-full max-w-xl aspect-video">
                <div className="group absolute inset-0 rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden bg-zinc-950/40 backdrop-blur-xl">
                  {projects.map((p, i) => (
                    <ImageLayer
                      key={p.id}
                      project={p}
                      index={i}
                      activeIndex={activeIndex}
                      reduce={reduce}
                      distance={48}
                      fit="object-contain object-center"
                      sizes="50vw"
                    />
                  ))}
                  <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}