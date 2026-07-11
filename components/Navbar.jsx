"use client";
import ThemeToggle from "./Themetoggle";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { House, Hammer, BriefcaseBusiness, GraduationCap, Phone } from "lucide-react";

const Navbar = () => {
  const navs = [
    { title: "Home", link: "#home", icon: House },
    { title: "Skills", link: "#skills", icon: Hammer },
    { title: "Projects", link: "#projects", icon: BriefcaseBusiness },
    { title: "Education", link: "#education", icon: GraduationCap },
    { title: "Contact", link: "#contact", icon: Phone },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  const ScrollYP = useScroll().scrollYProgress;
  const navWidthDesktop = useTransform(ScrollYP, [0, 1.2], ["95%", "40%"]);

  // Update mobile flag
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);

    // IntersectionObserver-based active section detection.
    // rootMargin "-20% 0px -79% 0px" means a section becomes "active" as
    // soon as its top edge crosses the 20%-from-top line of the viewport.
    // This correctly handles very tall sections (like #projects at 600vh)
    // which would fool the old center-distance approach.
    const observerOptions = {
      rootMargin: "-20% 0px -79% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    // Fallback: run a one-time scroll check so the initial active section
    // is set correctly before any scrolling occurs.
    const setInitialSection = () => {
      const sections = document.querySelectorAll("section[id]");
      const threshold = window.innerHeight * 0.2;
      let active = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= threshold) {
          active = section.id;
        }
      });
      if (active) setActiveSection(active);
    };
    setInitialSection();

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);


  return (
    <motion.nav
      animate={{
        border: isOpen ? 0 : 4,
        height: isOpen ? 56 + menuHeight : 14 * 4,
      }}
      style={{ width: isMobile ? "min(95%, calc(100vw - 1rem))" : navWidthDesktop }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "w-full rounded-3xl mont sticky top-2 sm:top-3 backdrop-blur-3xl h-14 mx-auto flex flex-col justify-center px-5 border border-cyan-600 dark:border-cyan-400 z-50 overflow-hidden"
      )}
    >
      <div className="w-full flex justify-between items-center">
        <a
          href="#home"
          className="flex items-center gap-1.5 select-none"
          aria-label="Home"
        >
          <span className="w-8 h-8 rounded-full  flex items-center justify-center  font-bold text-sm">
            SV
          </span>
        </a>
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
                  <Icon size={15} weight="duotone" className="text-current" />
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

          <button onClick={() => setIsOpen((prev) => !prev)} className="md:hidden">
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              className="w-[18px] h-[1.5px] rounded-full bg-foreground"
            ></motion.div>
            <motion.div
              animate={{
                rotate: isOpen ? -45 : 0,
                width: isOpen ? 18 : 14,
                marginTop: isOpen ? -1 : 4,
              }}
              className="w-[14px] ml-auto h-[1.5px] rounded-full bg-foreground"
            ></motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          animate={{
            height: isOpen ? menuHeight : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{
            height: { duration: 0.3, ease: "easeInOut" },
            opacity: { duration: 0.3, delay: isOpen ? 0.1 : 0 },
          }}
          className="md:hidden w-full h-max"
        >
          <ul className="flex flex-col gap-2 mt-2">
            {isOpen &&
              navs.map((nav, ind) => {
                const sectionId = nav.link.slice(1);
                const isActive = activeSection === sectionId;

                return (
                  <motion.li
                    key={ind}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ ease: "linear", duration: (ind + 1) * 0.1 }}
                    className={cn(
                      "opacity-85 hover:font-semibold hover:opacity-100 border-b last-of-type:border-none my-1 text-lg",
                      isActive
                        ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                        : ""
                    )}
                  >
                    <a href={nav.link}>{nav.title}</a>
                  </motion.li>
                );
              })}
          </ul>
        </motion.div>
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;