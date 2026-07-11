"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, GitBranch, Sparkles, BookOpen, BrainCircuit, Map, CloudSun, Clock, Film } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "PromptPilot",
    tagline: "AI-powered prompt creation, optimization & management platform.",
    description:
      "PromptPilot is a full-stack AI application built to help prompt engineers and AI enthusiasts manage their prompt library in one place. Instead of storing prompts in random text files or notes, users can organize them into categories, optimize prompts using AI, and quickly retrieve previous versions whenever needed.",
    features: [
      "AI Prompt Optimization",
      "JWT Authentication",
      "Prompt History",
      "Categories & Tags",
      "Search Functionality",
      "Favorite Prompts",
      "Responsive Dashboard",
    ],
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT", "Gemini API"],
    challenges: [
      "Scalable backend APIs",
      "JWT auth flow",
      "Prompt engineering",
      "AI API integration",
      "State management",
    ],
    github: "https://github.com/Shree-VishnuA/promptPilot.git",
    demo: "https://prompt-pilot-zeta.vercel.app/",
    accent: "from-cyan-500 to-blue-600",
    icon: Sparkles,
    color: "from-cyan-500/20 to-blue-600/20",
    textColor: "text-cyan-500",
    image: "/projects/prompt-pilot.png"
  },
  {
    id: 2,
    title: "BlogNest",
    tagline: "A modern full-stack blogging platform for writers and readers.",
    description:
      "BlogNest is a blogging platform where users can securely authenticate, publish articles, upload cover images, and interact through comments. Built to understand backend architecture, authentication, file uploads, and database design, with a focus on clean content presentation and secure CRUD operations.",
    features: [
      "User Authentication",
      "Create / Edit / Delete Blogs",
      "Cover Image Upload",
      "Comments",
      "User Profiles",
      "Responsive Design",
    ],
    tech: ["Node.js", "Express.js", "MongoDB", "EJS", "Tailwind CSS", "Cloudinary", "JWT"],
    challenges: [
      "Authentication system",
      "Cloudinary integration",
      "MongoDB relationships",
      "Server-side rendering",
      "File uploads",
    ],
    github: "https://github.com/Shree-VishnuA/My_Blog_App.git",
    demo: "https://my-blog-nest.vercel.app/",
    accent: "from-violet-500 to-purple-700",
    icon: BookOpen,
    color: "from-violet-500/20 to-purple-700/20",
    textColor: "text-violet-500",
    image: "/projects/BlogNest.png"
  },
  {
    id: 3,
    title: "Narada",
    tagline: "An Agentic AI assistant with intelligent multi-step reasoning.",
    description:
      "Narada is my most advanced AI project that explores Agentic AI systems. Instead of behaving like a normal chatbot, Narada reasons through complex tasks, maintains conversational context, uses external tools, and breaks problems into multiple logical steps. It represents my transition from AI-powered apps to building autonomous AI agents.",
    features: [
      "Agentic AI Workflow",
      "Multi-step Reasoning",
      "Persistent Memory",
      "Tool Calling",
      "Context-aware Conversations",
      "Modern AI Interface",
    ],
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Gemini API", "Agentic AI Concepts"],
    challenges: [
      "Agent workflow design",
      "AI reasoning chains",
      "Memory handling",
      "LLM integration",
      "Prompt engineering",
    ],
    github: "https://github.com/Shree-VishnuA/Narada-AI.git",
    accent: "from-emerald-500 to-teal-700",
    icon: BrainCircuit,
    color: "from-emerald-500/20 to-teal-700/20",
    textColor: "text-emerald-500",
    image: "/projects/Narada.png"
  },
  {
    id: 4,
    title: "ARISE",
    tagline: "AI-powered platform preserving India's art & cultural heritage.",
    description:
      "ARISE was developed during the CodeFury Hackathon to make Indian art more accessible through technology. Users can discover regional artists, explore artworks, purchase art, and interact with an AI chatbot for cultural info. Features an interactive map of India for state-based artist discovery.",
    badge: "🥈 First Runner-Up — CodeFury National Hackathon",
    features: [
      "Interactive India Map",
      "Artist Discovery",
      "Artwork Marketplace",
      "AI Chatbot",
      "Cultural Information",
      "Regional Art Exploration",
    ],
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Gemini API"],
    challenges: [
      "Team collaboration",
      "Hackathon development",
      "AI chatbot integration",
      "Interactive UI",
      "Large-scale React",
    ],
    github: "https://github.com/Shree-VishnuA/Arise-Codefury.git",
    demo: "https://github.com/Shree-VishnuA/Narada-AI.git",
    accent: "from-orange-500 to-rose-600",
    icon: Map,
    color: "from-orange-500/20 to-rose-600/20",
    textColor: "text-orange-500",
    image: "/projects/Arise.png"
  },
  {
    id: 5,
    title: "MovieHunt",
    tagline: "A modern movie discovery platform powered by the TMDB API.",
    description:
      "MovieHunt is a responsive movie discovery application that allows users to explore trending movies, TV shows, and popular personalities. It features advanced search, detailed information pages, and a sleek, cinematic UI. Building this project helped me gain hands-on experience with API integration, asynchronous data fetching, React Router, and responsive UI design.",
    features: [
      "Trending Movies",
      "Trending TV Shows",
      "Popular People",
      "Advanced Search",
      "Detailed Movie Information",
      "Responsive Cinematic UI",
    ],
    tech: [
      "React",
      "Tailwind CSS",
      "React Router",
      "TMDB API",
      "Axios"
    ],
    challenges: [
      "TMDB API integration",
      "Managing asynchronous data",
      "Dynamic routing",
      "Responsive UI design",
    ],
    github: "https://github.com/Shree-VishnuA/Movie-Explorer.git",
    demo: "https://shree-vishnua.github.io/Movie-Explorer/",
    accent: "from-red-500 to-orange-600",
    icon: Film,
    color: "from-red-500/20 to-orange-600/20",
    textColor: "text-red-500",
    image: "/projects/MovieHunt.png"
  },
  {
    id: 6,
    title: "Weatherly",
    tagline: "Beautiful weather forecasting app with dynamic UI.",
    description:
      "Weatherly provides real-time weather information using live weather APIs. It automatically detects the user's location while also allowing manual city searches. Dynamic backgrounds and responsive components create an engaging and visually rich weather experience.",
    features: [
      "Live Weather Data",
      "Location Detection",
      "City Search",
      "Weather Forecast",
      "Responsive Design",
      "Dynamic Backgrounds",
    ],
    tech: ["React", "Weather API", "Tailwind CSS"],
    challenges: [
      "API integration",
      "Geolocation API",
      "Loading states",
      "Error handling",
      "Responsive design",
    ],
    github: "https://github.com/Shree-VishnuA/Weatherly.git",
    demo: "https://shree-vishnua.github.io/Weatherly/",
    accent: "from-sky-500 to-indigo-600",
    icon: CloudSun,
    color: "from-sky-500/20 to-indigo-600/20",
    textColor: "text-sky-500",
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

  return (
    <section id="projects" className="relative w-full pt-10">
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        style={{ height: `${projects.length * 100}vh` }}
        className="relative w-full"
      >
        {/* Sticky Viewport */}
        <div className="sticky top-20 w-full flex items-center overflow-hidden min-h-screen">

          {/* ═══════════════════════════════════════════════════════════════
              MOBILE PORTRAIT CARD  (hidden on lg+)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:hidden w-full h-[100svh] px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full h-full flex flex-col overflow-hidden shadow-2xl"
              >
                {/* ── Top: Project image / icon ── */}
                <div className={`relative w-full bg-linear-to-br ${projects[activeIndex].color} overflow-hidden flex-shrink-0`} style={{ height: '45%' }}>
                  {projects[activeIndex].image ? (
                    <Image
                      src={projects[activeIndex].image}
                      alt={projects[activeIndex].title}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 90vw, 384px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {(() => {
                        const Icon = projects[activeIndex].icon;
                        return <Icon className={`w-20 h-20 ${projects[activeIndex].textColor} drop-shadow-2xl`} />;
                      })()}
                    </div>
                  )}
                  {/* gradient scrim so image bleeds into the dark panel below */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-zinc-950/90 pointer-events-none" />
                </div>

                {/* ── Bottom: Details panel ── */}
                <div className="bg-zinc-950 px-5 py-5 flex flex-col gap-3 flex-1 overflow-y-auto">
                  {projects[activeIndex].badge && (
                    <span className="text-[9px] tracking-widest font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full uppercase w-fit">
                      {projects[activeIndex].badge}
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {projects[activeIndex].title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                      {projects[activeIndex].description}
                    </p>
                  </div>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {projects[activeIndex].tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium bg-white/8 border border-white/10 text-gray-300 rounded-full px-2.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Action icon buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={projects[activeIndex].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/15 transition-all duration-200"
                    >
                      <GitBranch className="w-4 h-4" />
                    </a>
                    {projects[activeIndex].demo && (
                      <a
                        href={projects[activeIndex].demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/15 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots — pinned above bottom edge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {projects.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? `w-6 bg-linear-to-r ${projects[activeIndex].accent}`
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

            {/* Left Column: Text Content */}
            <div className="w-1/2 relative z-10 flex flex-col justify-center min-h-[500px]">
              <div className="mb-8 flex flex-col gap-3">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                  Projects
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Scroll to explore some of my best works and collaborative projects.
                </p>
              </div>

              <div className="relative min-h-[450px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 w-full"
                  >
                    {projects[activeIndex].badge && (
                      <span className="inline-block text-[10px] tracking-widest font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase mb-3">
                        {projects[activeIndex].badge}
                      </span>
                    )}
                    <h3 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                      {projects[activeIndex].title}
                    </h3>
                    <p className={`text-sm mb-4 font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-linear-to-r ${projects[activeIndex].accent}`}>
                      {projects[activeIndex].tagline}
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mb-6 line-clamp-4">
                      {projects[activeIndex].description}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-2 mb-6 max-w-lg">
                      {projects[activeIndex].features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className={`w-1.5 h-1.5 shrink-0 rounded-full bg-linear-to-r ${projects[activeIndex].accent}`} />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {projects[activeIndex].tech.map((t) => (
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
                        <a href={projects[activeIndex].github} target="_blank" rel="noopener noreferrer">
                          Source
                        </a>
                      </Button>
                      {projects[activeIndex].demo && (
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="rounded-full text-xs font-semibold px-6 h-9 border border-gray-300 dark:border-white/15 hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5"
                        >
                          <a href={projects[activeIndex].demo} target="_blank" rel="noopener noreferrer">
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-2 mt-4">
                {projects.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? `w-8 bg-linear-to-r ${projects[activeIndex].accent}`
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
                  <div className={`w-full h-full rounded-3xl bg-linear-to-br ${projects[activeIndex].color} border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden group relative`}>
                    {projects[activeIndex].image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={projects[activeIndex].image}
                          alt={projects[activeIndex].title}
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
                          className={`absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-linear-to-br ${projects[activeIndex].color} opacity-40 dark:opacity-20 blur-3xl`}
                        />
                        {(() => {
                          const Icon = projects[activeIndex].icon;
                          return <Icon className={`w-32 h-32 ${projects[activeIndex].textColor} drop-shadow-2xl relative z-10`} />;
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