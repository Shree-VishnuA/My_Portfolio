"use client";
import ThemeToggle from "./Themetoggle";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { House, Hammer, BriefcaseBusiness, GraduationCap, Phone } from "lucide-react";

const Navbar = () => {
  const navs = [
    { title: "Home",      link: "#home",      icon: House },
    { title: "Skills",    link: "#skills",    icon: Hammer },
    { title: "Projects",  link: "#projects",  icon: BriefcaseBusiness },
    { title: "Education", link: "#education", icon: GraduationCap },
    { title: "Contact",   link: "#contact",   icon: Phone },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  const ScrollYP = useScroll().scrollYProgress;
  const navWidthDesktop = useTransform(ScrollYP, [0, 1.2], ["95%", "40%"]);

  // Mobile flag
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close on desktop resize & track active section
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);

    const observerOptions = {
      rootMargin: "-20% 0px -79% 0px",
      threshold: 0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, observerOptions);
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));

    // Initial section
    const sections = document.querySelectorAll("section[id]");
    const threshold = window.innerHeight * 0.2;
    let active = null;
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= threshold) active = s.id;
    });
    if (active) setActiveSection(active);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  // Close menu & scroll when a mobile nav link is clicked
  const handleMobileNav = (link) => {
    setIsOpen(false);
    const id = link.slice(1);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <motion.nav
      animate={{
        height: isOpen ? "auto" : 56,
      }}
      style={{ width: isMobile ? "min(95%, calc(100vw - 1rem))" : navWidthDesktop }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "rounded-3xl sticky top-2 sm:top-3 backdrop-blur-3xl mx-auto flex flex-col justify-start px-5 border border-cyan-600 dark:border-cyan-400 z-50 overflow-hidden"
      )}
    >
      {/* Top bar — always visible */}
      <div className="w-full flex justify-between items-center h-14 shrink-0">
        <a href="#home" className="flex items-center gap-1.5 select-none" aria-label="Home">
          <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            SV
          </span>
        </a>

        {/* Desktop nav links */}
        <nav>
          <ul className="flex gap-4 lg:gap-8 max-md:hidden relative">
            {navs.map(({ title, link, icon: Icon }, ind) => {
              const sectionId = link.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <motion.a
                  key={ind}
                  href={link}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ind * 0.1 }}
                  className={cn(
                    "cursor-pointer relative px-2 py-1 transition",
                    isActive
                      ? "text-cyan-600 dark:text-cyan-400 font-semibold text-sm flex justify-center items-center gap-1"
                      : "text-gray-700 dark:text-gray-200 flex justify-center text-sm items-center gap-2"
                  )}
                >
                  <Icon size={15} className="text-current" />
                  {title}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-600 dark:bg-cyan-400 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-center">
          <ThemeToggle />
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ gap: isOpen ? "0px" : "6px" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col justify-center"
              style={{ alignItems: "end" }}
            >
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-6 h-[2px] rounded-full bg-foreground"
              />
              <motion.div
                animate={{ rotate: isOpen ? -45 : 0, width: isOpen ? 24 : 16 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="h-[2px] rounded-full bg-foreground"
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile menu — slides open below the top bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden flex flex-col gap-1 pb-4 pt-1"
          >
            {navs.map((nav, ind) => {
              const sectionId = nav.link.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <motion.li
                  key={ind}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: ind * 0.05, duration: 0.2 }}
                  className={cn(
                    "border-b border-gray-100 dark:border-white/8 last:border-none",
                    isActive ? "text-cyan-600 dark:text-cyan-400 font-semibold" : "text-gray-700 dark:text-gray-200"
                  )}
                >
                  <button
                    onClick={() => handleMobileNav(nav.link)}
                    className="w-full flex items-center gap-3 py-3 text-left text-base font-medium"
                  >
                    <nav.icon size={16} className="text-current shrink-0" />
                    {nav.title}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    )}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;