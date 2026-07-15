"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Clock,
  Send,
  Heart,
  ArrowRight,
  Loader2,
} from "lucide-react";

// Inline SVG components
function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LiveClock() {
  const [timeState, setTimeState] = useState({
    time: null,
    status: "Probably building something cool.",
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hourCycle: "h23",
      });

      const hour = parseInt(formatter.format(now), 10);

      let status = "";

      if (hour >= 0 && hour < 6) {
        status = "Either asleep or fighting the final boss: 'works on my machine'.";
      } else if (hour >= 6 && hour < 9) {
        status = "Getting ready for classes while mentally compiling today's to-do list.";
      } else if (hour >= 9 && hour < 13) {
        status = "Probably in class... or playing table tennis with my friends(if the table is free).";
      } else if (hour >= 13 && hour < 17) {
        status = "Learning AI, building stuff, breaking stuff, then pretending it was part of the plan.";
      } else if (hour >= 17 && hour < 20) {
        status = "Coding, playing chess/carrom, or solving a LeetCode problem";
      } else if (hour >= 20 && hour < 23) {
        status = "Grinding side projects while saying 'this is the last commit' for the fifth time.";
      } else {
        status = "Powered by caffeine, curiosity, and questionable sleep decisions.";
      }

      setTimeState({
        time: timeString,
        status,
      });
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
          Local Time
        </span>
      </div>

      <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
        {timeState.time ?? "..."}
      </div>

      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Bangalore, India.
      </p>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {timeState.status}
      </div>
    </div>
  );
}

// Compliment Form Component
const COOLDOWN_SECONDS = 60;
const MAX_SUBMISSIONS = 5;
const SESSION_KEY = "compliment_count";
const COOLDOWN_KEY = "compliment_last_sent";

function ComplimentForm() {
  const [compliment, setCompliment] = useState("");
  const [status, setStatus] = useState("idle");
  const [honeypot, setHoneypot] = useState(""); // hidden field — bots fill this
  const [cooldown, setCooldown] = useState(0); // seconds remaining in cooldown

  // Tick down the cooldown every second
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Restore cooldown on mount (page refresh mid-cooldown)
  useEffect(() => {
    const lastSent = parseInt(sessionStorage.getItem(COOLDOWN_KEY) || "0", 10);
    const elapsed = Math.floor((Date.now() - lastSent) / 1000);
    const remaining = COOLDOWN_SECONDS - elapsed;
    if (remaining > 0) setCooldown(remaining);
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!compliment.trim()) return;

  // 🍯 Honeypot check — bots fill the hidden field, humans don't
  if (honeypot) return;

  // ⏱ Cooldown check
  if (cooldown > 0) return;

  // 🔢 Max submissions per session
  const count = parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
  if (count >= MAX_SUBMISSIONS) {
    setStatus("limit");
    return;
  }

  setStatus("sending");

  try {
    const response = await fetch("https://formspree.io/f/xqeralke", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        compliment,
      }),
    });

    if (response.ok) {
      setStatus("success");
      setCompliment("");
      sessionStorage.setItem(SESSION_KEY, String(count + 1));
      sessionStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setCooldown(COOLDOWN_SECONDS);
    } else {
      setStatus("error");
    }
  } catch (error) {
    setStatus("error");
  }

  setTimeout(() => setStatus((s) => (s !== "success" ? "idle" : s)), 3000);
};

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-500/20 to-cyan-500/20 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-sm">
          <Heart className="w-6 h-6 text-cyan-500 fill-cyan-500/20" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Send an anonymous compliment
          </h3>
          <p className="text-sm font-medium text-gray-500">
            Make my day with a kind word.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="relative w-full md:w-96 shrink-0">
        {/* 🍯 Honeypot — hidden from humans, bots fill it */}
        <input
          type="text"
          name="_gotcha"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{ display: "none" }}
          aria-hidden="true"
        />

        <input
          type="text"
          value={compliment}
          onChange={(e) => setCompliment(e.target.value)}
          disabled={status !== "idle" || cooldown > 0 || status === "limit"}
          placeholder="You are awesome..."
          maxLength={200}
          className="w-full px-5 py-4 pr-14 rounded-2xl text-sm bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all duration-200 shadow-sm"
        />
        <button
          type="submit"
          disabled={status !== "idle" || !compliment.trim() || cooldown > 0 || status === "limit"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all cursor-pointer duration-200 shadow-md"
        >
          {status === "sending" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === "success" ? (
            <Heart className="w-4 h-4 fill-current" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>

        {/* ⏱ Cooldown badge */}
        {cooldown > 0 && status !== "success" && (
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 text-center">
            Wait <span className="font-semibold text-cyan-500">{cooldown}s</span> before sending another.
          </p>
        )}

        {/* 🚫 Session limit message */}
        {status === "limit" && (
          <p className="mt-2 text-xs text-red-400 text-center font-medium">
            You've sent the maximum compliments for this session. Thank you! 🙏
          </p>
        )}

        {/* Success Overlay */}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-cyan-500/50 shadow-sm z-10"
          >
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
              <Heart className="w-4 h-4 fill-current" />
              Thank you for the compliment!
            </span>
          </motion.div>
        )}
      </form>
    </div>
  );
}

// ── Main Section ────────────────────────────────────────────────────────────
export default function ContactSection() {
  const bentoClass = "relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/8 bg-white/60 dark:bg-white/4 backdrop-blur-md hover:border-cyan-500/30 dark:hover:border-cyan-400/30 transition-colors duration-300 shadow-sm hover:shadow-md";

  return (
    <section id="contact" className="relative w-full py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">
            Let's Build Something{" "}
            <span className="text-transparent bg-clip-text bg-cyan-500">
              Together.
            </span>
          </h2>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Reach out if you're looking for a developer, have a question, or just want to connect.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-min md:auto-rows-[200px]">

          {/* 1. Large CTA Tile (spans 2 rows, 2 cols) */}
          <motion.a
            href="mailto:shreevishnu1746@gmail.com"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 0.98 }}
            className={`col-span-2 md:col-span-2 md:row-span-2 flex flex-col justify-between group p-8 sm:p-10 ${bentoClass} bg-linear-to-br from-cyan-300/10 to-cyan-700/10 dark:from-cyan-300/5 dark:to-cyan-500/5 hover:from-cyan-500/20 hover:to-cyan-600/20 border-cyan-500/20`}
          >
            <div className="absolute bottom-0 right-0 p-8 opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 transform origin-center">
              <Mail className="w-40 h-40 text-cyan-600 dark:text-cyan-400" />
            </div>

            <div className="relative z-10 mt-2">

              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                Have a project<br />in mind?
              </h3>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400 max-w-sm mb-12">
                I'm always open to discussing product design work, new projects, or partnership opportunities.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold tracking-wide group-hover:gap-4 transition-all">
              <span>Shoot me an email</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.a>

          {/* 2. GitHub Tile (1 row, 1 col) */}
          <motion.a
            href="https://github.com/Shree-VishnuA"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`col-span-1 md:col-span-1 flex flex-col items-center justify-center text-center group p-6 sm:p-8 min-h-[160px] sm:min-h-[200px] ${bentoClass}`}
          >
            <div className="absolute inset-0 bg-gray-900 dark:bg-white scale-0 group-hover:scale-100 transition-transform duration-500 rounded-3xl origin-center ease-out" />
            <div className="relative z-10 flex flex-col items-center">
              <GithubIcon className="w-12 h-12 text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 mb-4 transition-colors duration-500" />
              <span className="font-bold tracking-wide text-gray-900 dark:text-white group-hover:text-white dark:group-hover:text-gray-900 transition-colors duration-500">
                GitHub
              </span>
            </div>
          </motion.a>

          {/* 3. LinkedIn Tile (1 row, 1 col) */}
          <motion.a
            href="https://www.linkedin.com/in/shree-vishnu-a-0170b1331/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`col-span-1 md:col-span-1 flex flex-col items-center justify-center text-center group p-6 sm:p-8 min-h-[160px] sm:min-h-[200px] ${bentoClass}`}
          >
            <div className="absolute inset-0 bg-[#0A66C2] scale-0 group-hover:scale-100 transition-transform duration-500 rounded-3xl origin-center ease-out" />
            <div className="relative z-10 flex flex-col items-center">
              <LinkedinIcon className="w-12 h-12 text-gray-700 dark:text-gray-300 group-hover:text-white dark:group-hover:text-gray-900 mb-4 transition-colors duration-500" />
              <span className="font-bold tracking-wide text-gray-900 dark:text-white group-hover:text-white transition-colors duration-500">
                LinkedIn
              </span>
            </div>
          </motion.a>

          {/* 4. Live Clock Tile (1 row, 2 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`col-span-2 md:col-span-2 p-8 sm:p-10 min-h-[200px] ${bentoClass}`}
          >
            <LiveClock />
          </motion.div>

          {/* 5. Fun / Compliment Form Tile (1 row, spans all 4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`col-span-2 md:col-span-4 p-8 sm:p-10 ${bentoClass} flex items-center justify-center`}
          >
            <ComplimentForm />
          </motion.div>

        </div>
      </div>
    </section>
  );
}