import { Poppins } from "next/font/google";
import "./globals.css";
import ParticleField from "@/components/ParticleLayout";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import PageReveal from "@/components/PageReveal";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Vishnu | Full-Stack Developer",
  description:
    "Portfolio of Vishnu - a Full-Stack Developer specializing in React, Next.js, Node.js, and intelligent web applications.",
  keywords: ["Full-Stack Developer", "React", "Next.js", "Node.js", "Portfolio"],
  authors: [{ name: "Shree Vishnu A" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased relative overflow-x-hidden select-none`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {/* Background Layer */}
          <div className="fixed inset-0 -z-10 opacity-60 pointer-events-none">
            <ParticleField />
          </div>

          {/* Page reveal overlay + Foreground Content */}
          <PageReveal>
            <div className="content-layer relative z-10">
              <Navbar />
              {children}
            </div>
          </PageReveal>
        </ThemeProvider>
      </body>
    </html>
  );
}
