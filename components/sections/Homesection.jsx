"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Download, ArrowRight, GitBranch, Link2, Mail, ChevronDown } from "lucide-react";

// ── Config ──────────────────────────────────────────────────────────────────
const ROLES = [
  "Full-Stack Developer",
  "AI Application Builder",
  "React & Next.js Engineer",
  "Problem Solver",
];
const SOCIALS = [
  { icon: GitBranch, href: "https://github.com/",  label: "GitHub"   },
  { icon: Link2,     href: "https://linkedin.com/", label: "LinkedIn" },
  { icon: Mail,      href: "mailto:your@email.com", label: "Email"    },
];

// ── Typewriter ───────────────────────────────────────────────────────────────
function TypewriterText({ roles }) {
  const [index, setIndex]         = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting]   = useState(false);
  const [paused, setPaused]       = useState(false);

  useEffect(() => {
    const current = roles[index];
    let t;
    if (paused) {
      t = setTimeout(() => { setPaused(false); setDeleting(true); }, 1800);
    } else if (deleting) {
      if (displayed.length === 0) { setDeleting(false); setIndex(i => (i + 1) % roles.length); }
      else t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 40);
    } else {
      if (displayed.length === current.length) setPaused(true);
      else t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 70);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, paused, index, roles]);

  return (
    <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
      {displayed}
      <span className="animate-pulse text-cyan-500 dark:text-cyan-400">|</span>
    </span>
  );
}

// ── Intro Splash Overlay (Displays giant initials for 1.6s on load) ──────────
function RevealOverlay({ onRevealed }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRevealed();
    }, 1600);
    return () => clearTimeout(timer);
  }, [onRevealed]);

  return (
    <div className="absolute inset-0 z-20 bg-white dark:bg-[#080808] flex flex-col items-center justify-center select-none">
      {/* Giant initials */}
      <div className="relative flex flex-col items-center gap-6 pointer-events-none">
        <div className="absolute inset-0 -m-16 rounded-full bg-linear-to-br from-cyan-500/10 to-blue-600/10 blur-3xl" />
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-[22vw] sm:text-[18vw] lg:text-[14vw] leading-none font-black text-transparent bg-clip-text bg-linear-to-br from-gray-900/25 to-gray-900/8 dark:from-white/20 dark:to-white/5 tracking-tighter"
        >
          SV
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-800 dark:text-white text-sm sm:text-base font-medium tracking-[0.5em] uppercase"
        >
          Shree Vishnu
        </motion.p>
      </div>

      {/* Skip button right away if user prefers not waiting */}
      <button
        onClick={() => onRevealed()}
        className="absolute bottom-8 right-8 text-[11px] text-gray-400 hover:text-gray-600 dark:text-white/30 dark:hover:text-white/70 transition-colors duration-300 tracking-widest uppercase font-medium cursor-pointer"
      >
        Skip →
      </button>
    </div>
  );
}

// ── 3D Tilt Avatar (Clean, no shadows, no blue shine) ────────────────────────
function TiltAvatar() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative shrink-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 order-1 lg:order-2 cursor-pointer group [perspective:1000px]"
    >
      {/* Main 3D Circle without shadows */}
      <div
        style={{ transform: "translateZ(20px)" }}
        className="relative w-full h-full rounded-full border-2 border-cyan-500/30 bg-linear-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-cyan-500/60"
      >
        {/* Inner popped letter 'V' */}
        <motion.span
          style={{ transform: "translateZ(50px)" }}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-br from-cyan-500 to-blue-600 select-none"
        >
          V
        </motion.span>

        {/* Decorative inner ring */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="absolute inset-3 rounded-full border border-cyan-500/15 pointer-events-none group-hover:border-cyan-500/40 transition-colors duration-300"
        />
      </div>
    </motion.div>
  );
}


// ── Main Section ─────────────────────────────────────────────────────────────
export default function Homesection() {
  const [revealed, setRevealed]       = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);

  const scrollToProjects = () =>
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });

  const handleRevealed = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    setTimeout(() => setOverlayGone(true), 900);
  }, [revealed]);

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-linear(rgba(6,182,212,0.03)_1px,transparent_1px),linear-linear(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-linear(ellipse_80%_60%_at_50%_50%,black,transparent)] pointer-events-none" />

      {/* ── HERO CONTENT — always fully visible so the mask hole reveals it ── */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24  pb-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left: Text */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">

            {/* Status badge */}
            <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 tracking-wide">
                Open to opportunities
              </span>
            </div>

            {/* Name */}
            <div className="mb-3">
              <p className="text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 mb-1 tracking-wide">
                Hey there 👋, I'm
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                Vishnu
              </h1>
            </div>

            {/* Typewriter role — always running */}
            <div className="text-2xl md:text-3xl font-semibold mb-5 h-10">
              <TypewriterText roles={ROLES} />
            </div>

            {/* Bio */}
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mb-8">
              I build intelligent web experiences — from pixel-perfect frontends to
              AI-powered backends. Passionate about crafting software that solves
              real problems.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={scrollToProjects}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all duration-300"
              >
                View My Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="/resume.pdf"
                download
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl font-semibold text-sm backdrop-blur-sm transition-all duration-300"
              >
                Resume
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </motion.a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-50/60 dark:hover:bg-cyan-500/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 backdrop-blur-sm transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
              <span className="text-xs text-gray-400 dark:text-gray-600 ml-1 select-none">
                Let's connect
              </span>
            </div>
          </div>

          {/* Right: Avatar */}
          <TiltAvatar />
        </div>
      </div>

      {/* ── REVEAL OVERLAY — sits on top; mask hole exposes the hero beneath ── */}
      <AnimatePresence>
        {!overlayGone && (
          <motion.div
            className="absolute inset-0 z-20"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <RevealOverlay onRevealed={handleRevealed} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}