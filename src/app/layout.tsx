"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import "../styles/globals.css";
import RequestIdleCallbackPolyfill from "@/components/RequestIdleCallbackPolyfill";
import { useState, useEffect } from "react";
import GradientBackground from "@/components/GradientBackground";
import { useSwipeable } from "react-swipeable";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1280);
    handleResize(); // on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && setMenuOpen(false),
    onSwipedRight: () => isMobile && setMenuOpen(true),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Of The Day!",
    "url": "https://oftheday.world",
    "description":
      "Discover a new quote, song, game, movie, and word every day on OfTheDay.world.",
    "author": {
      "@type": "Person",
      "name": "Anthony Reynolds",
      "url": "https://www.sloor.dev",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <style>{`html, body { touch-action: pan-y; }`}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans relative`}
      >
        <RequestIdleCallbackPolyfill />
        <GradientBackground>
          <div {...swipeHandlers}>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <main className="pt-16">{children}</main>
          </div>
          <Footer />
          <BuyMeACoffee />
        </GradientBackground>
      </body>
    </html>
  );
}
