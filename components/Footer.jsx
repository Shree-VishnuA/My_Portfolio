import React from "react";

export default function Footer() {
  return (
    <footer className="relative w-full backdrop-blur-sm border-t border-gray-100 dark:border-white/6 py-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-600">
        <p>
          <span className="font-semibold text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400">Shree Vishnu A</span>
        </p>
        <p className="flex items-center gap-1.5">
          Built with{" "}
          <span className="font-medium text-gray-500 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400">Next.js</span>
          {" "}·{" "}
          <span className="font-medium text-gray-500 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400">Framer Motion</span>
          {" "}·{" "}
          <span className="font-medium text-gray-500 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400">Three.js</span>
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
