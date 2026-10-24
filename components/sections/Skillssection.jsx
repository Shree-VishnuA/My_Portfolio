"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────────────────────────── */

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
  { name: "SQL", icon: "https://skillicons.dev/icons?i=postgresql", category: "Backend" },
  { name: "Python", icon: "https://skillicons.dev/icons?i=python", category: "Languages" },
  { name: "C++", icon: "https://skillicons.dev/icons?i=cpp", category: "Languages" },
  { name: "GitHub", icon: "https://skillicons.dev/icons?i=github", category: "Tools" },
  { name: "Postman", icon: "https://skillicons.dev/icons?i=postman", category: "Tools" },
];

// Ordered BOTTOM → TOP. The stack is built from the ground up, so rank 0 lands first.
const layers = [
  {
    name: "Tools",
    blurb: "How I ship, test, and keep everything in sync.",
    c1: "#fb923c",
    c2: "#fb923c",
    text: "text-orange-400",
    pill: "bg-orange-500",
    dot: "bg-orange-400",
  },
  {
    name: "Languages",
    blurb: "The foundations everything else is written in.",
    c1: "#8b5cf6",
    c2: "#8b5cf6",
    text: "text-violet-400",
    pill: "bg-violet-500",
    dot: "bg-violet-400",
  },
  {
    name: "Backend",
    blurb: "Servers, APIs, and where the data lives.",
    c1: "#34d399",
    c2: "#34d399",
    text: "text-emerald-400",
    pill: "bg-emerald-500",
    dot: "bg-emerald-400",
  },
  {
    name: "Frontend",
    blurb: "What people actually see and touch.",
    c1: "#22d3ee",
    c2: "#22d3ee",
    text: "text-cyan-400",
    pill: "bg-cyan-500",
    dot: "bg-cyan-400",
  },
].map((l) => ({ ...l, items: techStack.filter((t) => t.category === l.name) }));

/* ────────────────────────────────────────────────────────────────────────────
   GEOMETRY + SCROLL TIMELINE
──────────────────────────────────────────────────────────────────────────── */

// Isometric slab (all numbers are SVG units inside the viewBox)
const A = 190; // half-width of the diamond
const B = 62; // half-height of the diamond
const T = 12; // slab thickness
const GAP = 135; // vertical distance between slabs
const CX = 230;
const CY_BOTTOM = 515;
const VB_W = 460;
const VB_H = 610;
const ICON = 42;

const cyOf = (rank) => CY_BOTTOM - rank * GAP;

const TOP = `M ${-A} 0 L 0 ${-B} L ${A} 0 L 0 ${B} Z`;
const LEFT = `M ${-A} 0 L 0 ${B} L 0 ${B + T} L ${-A} ${T} Z`;
const RIGHT = `M ${A} 0 L 0 ${B} L 0 ${B + T} L ${A} ${T} Z`;
const k = 0.92;
const INLAY = `M ${-A * k} 0 L 0 ${-B * k} L ${A * k} 0 L 0 ${B * k} Z`;

// Scroll timeline (0 → 1 across the whole section)
const START = 0.06; // first slab starts to fall
const STEP = 0.215; // one slab every STEP
const LAND = 0.09; // how long a slab takes to land
const ICON_DELAY = 0.07; // icons start this long after their slab starts falling
const ICON_STAGGER = 0.014;
const ICON_DUR = 0.035;
const FULL_AT = 0.905; // after this, the whole stack is "complete"

const rankFor = (p) => {
  if (p < START) return -1;
  if (p >= FULL_AT) return layers.length; // 4 = everything lit
  return Math.min(layers.length - 1, Math.floor((p - START) / STEP));
};

// Icon positions on a slab, in screen space relative to the slab centre.
// ≤4 icons → one row. More → two rows (4 + 3 for Frontend).
function slotsFor(n) {
  const rowsOf = n <= 4 ? [n] : [Math.ceil(n / 2), Math.floor(n / 2)];
  const tVals = rowsOf.length === 1 ? [0] : [-0.4, 0.4];
  const out = [];
  let j = 0;
  rowsOf.forEach((count, r) => {
    for (let i = 0; i < count; i++) {
      const s = (i - (count - 1) / 2) * 0.5;
      const t = tVals[r];
      out.push({ j: j++, x: (s - t) * (A / 2), y: (s + t) * (B / 2) });
    }
  });
  // paint back-to-front so nearer icons overlap farther ones
  return out.sort((a, b) => a.y - b.y);
}

const EASE = [0.22, 1, 0.36, 1];

/* ────────────────────────────────────────────────────────────────────────────
   SVG PIECES
──────────────────────────────────────────────────────────────────────────── */

function StackIcon({ tech, x, y, at, p, reduce }) {
  const opacity = useTransform(p, [at, at + ICON_DUR], [0, 1]);
  const drop = useTransform(p, [at, at + ICON_DUR], [reduce ? 0 : -28, 0]);
  const shadow = useTransform(p, [at, at + ICON_DUR], [0, 0.3]);

  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.ellipse cx="0" cy="0" rx="18" ry="5" fill="#000" style={{ opacity: shadow }} />
      <motion.g style={{ opacity, y: drop }}>
        <title>{tech.name}</title>
        <image href={tech.icon} x={-ICON / 2} y={-ICON} width={ICON} height={ICON} />
      </motion.g>
    </g>
  );
}

function Slab({ layer, rank, p, activeRank, reduce }) {
  const start = START + rank * STEP;
  const cy = cyOf(rank);

  const fall = useTransform(p, [start, start + LAND], [reduce ? 0 : -190, 0]);
  const appear = useTransform(p, [start, start + LAND * 0.6], [0, 1]);
  const ghost = useTransform(p, [start, start + LAND], [1, 0]);
  const guides = useTransform(p, [start + LAND * 0.7, start + LAND + 0.03], [0, 0.35]);

  const isActive = activeRank === rank;
  const dimmed = activeRank >= 0 && activeRank < layers.length && !isActive;
  const slots = slotsFor(layer.items.length);

  return (
    <g transform={`translate(${CX} ${cy})`}>
      {/* Blueprint outline: shows where this slab will land */}
      <motion.path
        d={TOP}
        fill="none"
        strokeWidth="1.5"
        strokeDasharray="5 6"
        className="stroke-gray-400/70 dark:stroke-white/25"
        style={{ opacity: ghost }}
      />

      {/* Exploded-view guide lines down to the slab below */}
      {rank > 0 && (
        <motion.g
          style={{ opacity: guides }}
          strokeWidth="1"
          strokeDasharray="3 5"
          className="stroke-gray-500 dark:stroke-white/60"
        >
          <line x1={-A} y1={T} x2={-A} y2={GAP} />
          <line x1={A} y1={T} x2={A} y2={GAP} />
          <line x1={0} y1={B + T} x2={0} y2={B + GAP} />
        </motion.g>
      )}

      {/* The falling slab */}
      <motion.g style={{ y: fall, opacity: appear }}>
        {/* active slab lifts a little and the rest step back */}
        <motion.g
          initial={false}
          animate={{ y: isActive ? -10 : 0, opacity: dimmed ? 0.45 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
        >
          {/* glow */}
          <motion.path
            d={TOP}
            fill={layer.c1}
            filter="url(#sk-blur)"
            initial={false}
            animate={{ opacity: isActive ? 0.55 : 0 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
          />

          {/* thickness */}
          <path d={LEFT} fill={layer.c1} />
          <path d={LEFT} fill="#000" fillOpacity="0.25" />
          <path d={RIGHT} fill={layer.c1} />
          <path d={RIGHT} fill="#000" fillOpacity="0.45" />

          {/* top face */}
          <path d={TOP} fill={layer.c1} />
          <path d={INLAY} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.5" />

          {/* icons standing on the slab */}
          {slots.map(({ j, x, y }) => (
            <StackIcon
              key={layer.items[j].name}
              tech={layer.items[j]}
              x={x}
              y={y}
              p={p}
              at={start + ICON_DELAY + j * ICON_STAGGER}
              reduce={reduce}
            />
          ))}
        </motion.g>
      </motion.g>
    </g>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   LEFT-PANEL TEXT
──────────────────────────────────────────────────────────────────────────── */

// Blocks: 0 = intro, 1..4 = layers (bottom → top), 5 = complete
const BLOCK_COUNT = layers.length + 2;

function blockMotion(index, activeBlock, reduce) {
  const isActive = index === activeBlock;
  return {
    initial: false,
    animate: isActive
      ? { opacity: 1, y: 0, visibility: "visible" }
      : {
          opacity: 0,
          y: reduce ? 0 : index < activeBlock ? -16 : 16,
          transitionEnd: { visibility: "hidden" },
        },
    transition: {
      duration: reduce ? 0 : 0.45,
      ease: EASE,
      delay: isActive && !reduce ? 0.1 : 0,
    },
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   SECTION
──────────────────────────────────────────────────────────────────────────── */

export default function Skillssection() {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();
  const [activeRank, setActiveRank] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smoothed progress drives every animation, so it feels weighty instead of twitchy
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.5 });
  const p = reduce ? scrollYProgress : smooth;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = rankFor(latest);
    setActiveRank((prev) => (prev === next ? prev : next));
  });

  const jumpTo = (rank) => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const target = START + rank * STEP + 0.15; // after the icons have landed
    window.scrollTo({
      top: top + target * range,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const activeBlock = activeRank + 1;

  return (
    <section id="skills" className="relative w-full">
      <div ref={containerRef} style={{ height: "500vh" }} className="relative w-full">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <div className="h-full w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-20 pb-4 lg:pt-16 lg:pb-0 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-12">
            {/* ═════════ Left: heading, live info, layer nav ═════════ */}
            <div className="w-full lg:w-5/12 shrink-0 flex flex-col">
              <h2 className="text-4xl sm:text-5xl font-bold mb-1 lg:mb-2 text-gray-900 dark:text-white">
                Skills
              </h2>
              <p className="text-base lg:text-lg text-gray-500 dark:text-gray-400 [@media(max-height:700px)]:hidden">
                Scroll to build my tech stack.
              </p>

              {/* All blocks share one grid cell → height = tallest block, so nothing jumps */}
              <div className="grid mt-4 lg:mt-10">
                {/* intro */}
                <motion.div
                  {...blockMotion(0, activeBlock, reduce)}
                  aria-hidden={activeBlock !== 0}
                  className="col-start-1 row-start-1"
                >
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                    Four layers, built from the ground up. Keep scrolling and each one
                    lands in place.
                  </p>
                </motion.div>

                {/* one block per layer */}
                {layers.map((layer, rank) => (
                  <motion.div
                    key={layer.name}
                    {...blockMotion(rank + 1, activeBlock, reduce)}
                    aria-hidden={activeBlock !== rank + 1}
                    className="col-start-1 row-start-1"
                  >
                    <h3
                      className={`text-2xl sm:text-3xl font-bold leading-tight pb-0.5 ${layer.text}`}
                    >
                      {layer.name}
                    </h3>
                    <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md [@media(max-height:700px)]:hidden">
                      {layer.blurb}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 max-w-md">
                      {layer.items.map((t) => (
                        <span
                          key={t.name}
                          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium rounded-full px-2.5 py-1 border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${layer.dot}`} />
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* complete */}
                <motion.div
                  {...blockMotion(BLOCK_COUNT - 1, activeBlock, reduce)}
                  aria-hidden={activeBlock !== BLOCK_COUNT - 1}
                  className="col-start-1 row-start-1"
                >
                  <h3 className="text-2xl sm:text-3xl font-bold leading-tight pb-0.5 text-gray-900 dark:text-white">
                    The full stack
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md">
                    {techStack.length} tools across {layers.length} layers. Everything I build
                    sits on these.
                  </p>
                </motion.div>
              </div>

              {/* Layer nav: listed top → bottom, same as the diagram */}
              <div className="mt-4 lg:mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Stack layers">
                {[...layers].map((l, rank) => ({ l, rank })).reverse().map(({ l, rank }) => {
                  const on = activeRank === rank;
                  return (
                    <button
                      key={l.name}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => jumpTo(rank)}
                      className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        on
                          ? `border-transparent ${l.pill} text-white`
                          : "border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/30"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-white" : l.dot}`} />
                      {l.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ═════════ Right: the stack ═════════ */}
            <div className="relative flex-1 min-h-0 w-full lg:flex-none lg:w-7/12 lg:h-[80vh]">
              <svg
                viewBox={`0 0 ${VB_W} ${VB_H}`}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Exploded diagram of my tech stack in four layers: Tools, Languages, Backend and Frontend"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                <defs>
                  <filter id="sk-blur" x="-30%" y="-90%" width="160%" height="280%">
                    <feGaussianBlur stdDeviation="16" />
                  </filter>
                </defs>

                {/* bottom → top so upper slabs and their icons paint last */}
                {layers.map((layer, rank) => (
                  <Slab
                    key={layer.name}
                    layer={layer}
                    rank={rank}
                    p={p}
                    activeRank={activeRank}
                    reduce={reduce}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}