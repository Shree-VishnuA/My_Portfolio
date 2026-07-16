"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, ArrowRight, Link2, Mail } from "lucide-react";
import HeroModel from "@/components/3d/HeroModel";

// Inline SVG component
function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// ── Config ──────────────────────────────────────────────────────────────────
const ROLES = [
  "Full-Stack Developer",
  "React & Next.js Engineer",
  "Problem Solver",
];
const SOCIALS = [
  { icon: GithubIcon, href: "https://github.com/Shree-VishnuA",  label: "GitHub"   },
  { icon: Link2,     href: "https://www.linkedin.com/in/shree-vishnu-a-0170b1331/", label: "LinkedIn" },
  { icon: Mail,      href: "mailto:shreevishnu1746@gmail.com", label: "Email"    },
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
    <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-cyan-600 dark:from-cyan-400 dark:to-cyan-400">
      {displayed}
      <span className="animate-pulse text-cyan-500 dark:text-cyan-400">|</span>
    </span>
  );
}


// ── Main Section ─────────────────────────────────────────────────────────────
export default function Homesection() {
  const scrollToProjects = () =>
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });

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

            {/* Name */}
            <div className="mb-3">
              <p className="text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 mb-1 tracking-wide">
                Hey there, I'm
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
              I build intelligent web experiences - from pixel-perfect frontends to
              AI-powered backends. Passionate about crafting software that solves
              real problems.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={scrollToProjects}
                className="group cursor-pointer inline-flex items-center justify-center gap-2.5 px-7 py-3.5 border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl font-semibold text-sm backdrop-blur-sm transition-all duration-300"
              >
                View My Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="/vishnu-resume.pdf"
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
            </div>
          </div>

          {/* Right: 3D Model */}
          <HeroModel />
        </div>
      </div>

    </section>
  );
}