"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  GitBranch,
  Link2,
  MapPin,
  Send,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ── Contact info chips ──────────────────────────────────────────────────────
const INFO_ITEMS = [
  {
    icon: MapPin,
    label: "Location",
    value: "Chennai, India",
    href: null,
  },
  {
    icon: Mail,
    label: "Email",
    value: "your.email@gmail.com",
    href: "mailto:your.email@gmail.com",
  },
  {
    icon: GitBranch,
    label: "GitHub",
    value: "github.com/yourusername",
    href: "https://github.com/yourusername",
  },
  {
    icon: Link2,
    label: "LinkedIn",
    value: "linkedin.com/in/yourusername",
    href: "https://linkedin.com/in/yourusername",
  },
];

// ── Animation variants ──────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

// ── Contact form ────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]   = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((er) => ({ ...er, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus("sending");
    try {
      // Using Formspree — replace YOUR_FORM_ID with your actual Formspree ID
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl text-sm bg-white/60 dark:bg-white/5 border ${
      errors[field]
        ? "border-rose-400/60"
        : "border-gray-200 dark:border-white/10"
    } focus:outline-none focus:border-cyan-500/60 dark:focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 backdrop-blur-sm transition-all duration-200`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Name */}
      <div>
        <input
          type="text"
          name="name"
          id="contact-name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className={inputClass("name")}
          disabled={status === "sending" || status === "success"}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          id="contact-email"
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange}
          className={inputClass("email")}
          disabled={status === "sending" || status === "success"}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <textarea
          name="message"
          id="contact-message"
          placeholder="Tell me about your project or just say hi..."
          value={form.message}
          onChange={handleChange}
          rows={5}
          className={`${inputClass("message")} resize-none`}
          disabled={status === "sending" || status === "success"}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-rose-500">{errors.message}</p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        whileHover={status !== "sending" && status !== "success" ? { scale: 1.02 } : {}}
        whileTap={status !== "sending" && status !== "success" ? { scale: 0.97 } : {}}
        disabled={status === "sending" || status === "success"}
        className="group relative w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 transition-all duration-300"
      >
        {status === "sending" ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Message Sent!
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </>
        )}
      </motion.button>

      {/* Error feedback */}
      {status === "error" && (
        <p className="flex items-center gap-1.5 text-xs text-rose-500 text-center justify-center">
          <AlertCircle className="w-3.5 h-3.5" />
          Something went wrong. Please email me directly.
        </p>
      )}
    </form>
  );
}

// ── Main Section ────────────────────────────────────────────────────────────
export default function ContactSection() {
  return (
    <>
      <section id="contact" className="relative w-full py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/8 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Let's Build Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
                Together.
              </span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
              I'm currently available for freelance work, full-time roles, and
              interesting collaborations. My inbox is always open.
            </p>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

            {/* ── Left: Contact Info ────────────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {INFO_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <motion.div
                    key={item.label}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/8 bg-white/60 dark:bg-white/4 backdrop-blur-sm hover:border-cyan-500/30 hover:shadow-sm dark:hover:shadow-black/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-600/15 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
                        {item.value}
                      </p>
                    </div>
                    {item.href && (
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-cyan-500 group-hover:translate-x-0.5 flex-shrink-0 ml-auto transition-all duration-200" />
                    )}
                  </motion.div>
                );

                return item.href ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}

              {/* Response time note */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xs text-gray-400 dark:text-gray-600 mt-2 pl-1"
              >
                ⚡ Typically respond within 24 hours
              </motion.p>
            </div>

            {/* ── Right: Contact Form ───────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-3 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/8 bg-white/60 dark:bg-white/4 backdrop-blur-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Send a Message
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Fill out the form and I'll get back to you shortly.
              </p>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative w-full border-t border-gray-100 dark:border-white/6 py-8 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-600">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-600 dark:text-gray-400">Vishnu</span>
            . All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Built with{" "}
            <span className="font-medium text-gray-500 dark:text-gray-500">Next.js</span>
            {" "}·{" "}
            <span className="font-medium text-gray-500 dark:text-gray-500">Framer Motion</span>
            {" "}·{" "}
            <span className="font-medium text-gray-500 dark:text-gray-500">Tailwind CSS</span>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
          >
            Back to top ↑
          </button>
        </div>
      </footer>
    </>
  );
}