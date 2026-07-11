"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, BookOpen, Award, Calendar, MapPin, ExternalLink } from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────
const education = [
  {
    id: 2,
    type: "school",
    icon: BookOpen,
    degree: "Higher Secondary (12th)",
    field: "Physics · Chemistry · Mathematics · Computer Science",
    institution: "Your School Name",
    location: "City, State",
    period: "2019 – 2021",
    grade: "Score: XX%",
    accent: "from-violet-500 to-purple-600",
    accentBg: "from-violet-500/10 to-purple-600/10",
    accentBorder: "border-violet-500/30",
    accentText: "text-violet-500 dark:text-violet-400",
    highlights: [
      "Scored distinction in Mathematics",
      "Active in tech clubs and science exhibitions",
    ],
    achievements: [],
  },
  {
    id: 1,
    type: "degree",
    icon: GraduationCap,
    degree: "Bachelor of Technology",
    field: "Computer Science & Engineering",
    institution: "Your College Name",
    location: "City, State",
    period: "2021 – 2025",
    grade: "CGPA: 8.X / 10",
    accent: "from-cyan-500 to-blue-600",
    accentBg: "from-cyan-500/10 to-blue-600/10",
    accentBorder: "border-cyan-500/30",
    accentText: "text-cyan-600 dark:text-cyan-400",
    highlights: [
      "Data Structures & Algorithms",
      "Operating Systems",
      "Database Management",
      "Artificial Intelligence & ML",
      "Computer Networks",
      "Software Engineering",
    ],
    achievements: [
      "🥈 First Runner-Up — CodeFury National Hackathon",
      "Built 6+ full-stack & AI projects during coursework",
    ],
  },
];

const certifications = [
  {
    title: "Full-Stack Web Development",
    issuer: "Udemy / freeCodeCamp",
    year: "2023",
    accent: "from-cyan-500 to-blue-600",
    link: "#",
  },
  {
    title: "React — The Complete Guide",
    issuer: "Udemy",
    year: "2023",
    accent: "from-violet-500 to-purple-600",
    link: "#",
  },
  {
    title: "Google AI Essentials",
    issuer: "Google (Coursera)",
    year: "2024",
    accent: "from-emerald-500 to-teal-600",
    link: "#",
  },
  {
    title: "Node.js & Express Bootcamp",
    issuer: "Udemy",
    year: "2024",
    accent: "from-orange-500 to-rose-600",
    link: "#",
  },
];

// ── Animation variants ──────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// ── Education Card ──────────────────────────────────────────────────────────
function EduCard({ item, index, isLit, lineProgress }) {
  const Icon = item.icon;
  return (
    <motion.div
      variants={cardVariants}
      className="relative flex gap-5 sm:gap-8"
    >
      {/* Timeline connector */}
      <div className="hidden sm:flex flex-col items-center shrink-0 w-10">
        <motion.div
          animate={{
            scale: isLit ? 1.1 : 0.95,
            opacity: isLit ? 1 : 0.45,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-500 z-10 relative ${isLit
              ? `bg-linear-to-br ${item.accent} shadow-xl shadow-cyan-500/25 ring-4 ring-cyan-500/20 dark:ring-cyan-400/20`
              : "bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 shadow-none"
            }`}
        >
          <Icon className={`w-5 h-5 transition-colors duration-500 ${isLit ? "text-white" : "text-gray-400 dark:text-gray-500"}`} />
        </motion.div>
        {index < education.length - 1 && (
          <div className="w-[3px] flex-1 my-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative min-h-[60px]">
            <motion.div
              style={{ scaleY: lineProgress }}
              className="w-full h-full bg-linear-to-b from-cyan-500 via-blue-500 to-violet-600 origin-top"
            />
          </div>
        )}
      </div>

      {/* Card */}
      <motion.div
        animate={{
          opacity: isLit ? 1 : 0.55,
          scale: isLit ? 1.01 : 0.99,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`flex-1 mb-8 rounded-2xl border transition-all duration-500 backdrop-blur-sm p-6 sm:p-7 ${isLit
            ? `${item.accentBorder} bg-white/80 dark:bg-white/6 shadow-xl dark:shadow-black/30`
            : "border-gray-200/60 dark:border-white/5 bg-white/40 dark:bg-white/2 shadow-none"
          }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-widest ${item.accentText} mb-2`}
            >
              {item.type === "degree" ? "University" : "Secondary Education"}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {item.degree}
            </h3>
            <p
              className={`text-sm font-semibold mt-0.5 bg-linear-to-r ${item.accent} bg-clip-text text-transparent`}
            >
              {item.field}
            </p>
          </div>
          {/* Grade badge */}
          <span
            className={`shrink-0 self-start text-xs font-semibold px-3 py-1.5 rounded-full bg-linear-to-r ${item.accentBg} border ${item.accentBorder} ${item.accentText}`}
          >
            {item.grade}
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 mb-5 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {item.institution}, {item.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {item.period}
          </span>
        </div>

        {/* Highlights */}
        {item.highlights.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5">
              {item.type === "degree" ? "Key Subjects" : "Highlights"}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.highlights.map((h) => (
                <span
                  key={h}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/6 border border-gray-200 dark:border-white/8 text-gray-600 dark:text-gray-400"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {item.achievements.length > 0 && (
          <div className="space-y-1.5 mt-4 pt-4 border-t border-gray-100 dark:border-white/6">
            {item.achievements.map((a) => (
              <p key={a} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-linear-to-r from-cyan-500 to-blue-600" style={{ marginTop: "0.4em" }} />
                {a}
              </p>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Certification Card ──────────────────────────────────────────────────────
function CertCard({ cert }) {
  return (
    <motion.a
      variants={cardVariants}
      href={cert.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between p-5 rounded-2xl border border-gray-200 dark:border-white/8 bg-white/60 dark:bg-white/4 backdrop-blur-sm hover:border-cyan-500/30 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <Award
          className={`w-5 h-5 bg-linear-to-br ${cert.accent} text-transparent`}
          style={{ color: "transparent", background: `linear-linear(to bottom right, var(--tw-linear-stops))` }}
        />
        <ExternalLink className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-cyan-500 transition-colors duration-200" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-1">
          {cert.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{cert.issuer}</p>
      </div>
      <span className="mt-3 text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-600 uppercase">
        {cert.year}
      </span>
    </motion.a>
  );
}

// ── Main Section ────────────────────────────────────────────────────────────
export default function Educationsection() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 50%"],
  });

  const [litIndex, setLitIndex] = useState(-1);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest >= 0.75) {
        setLitIndex(1);
      } else if (latest >= 0.15) {
        setLitIndex(0);
      } else {
        setLitIndex(-1);
      }
    });
  }, [scrollYProgress]);

  const lineProgress = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);

  return (
    <section id="education" className="relative w-full py-24 px-6 md:px-12 lg:px-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-16"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">
          Background
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          Education
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
          My academic foundation and continuous learning journey.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Education cards */}
        <motion.div
          ref={timelineRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {education.map((item, i) => (
            <EduCard
              key={item.id}
              item={item}
              index={i}
              isLit={i <= litIndex}
              lineProgress={lineProgress}
            />
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-6"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            Certifications & Courses
          </p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {certifications.map((cert) => (
              <CertCard key={cert.title} cert={cert} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}