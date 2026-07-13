"use client";

import { useEffect } from "react";

import Homesection from "@/components/sections/Homesection";
import Skillssection from "@/components/sections/Skillssection";
import Projectsection from "@/components/sections/Projectsection";
// import Educationsection from "@/components/sections/Educationsection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Always reset scroll position on reload
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <Homesection />
      <Skillssection />
      <Projectsection />
      {/* <Educationsection /> */}
      <ContactSection />
      <Footer />
    </div>
  );
}