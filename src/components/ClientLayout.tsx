"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import RequestIdleCallbackPolyfill from "@/components/RequestIdleCallbackPolyfill";
import GradientBackground from "@/components/GradientBackground";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "../styles/globals.css";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1280);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && setMenuOpen(true),
    onSwipedRight: () => isMobile && setMenuOpen(false),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Of The Day!",
    url: "https://oftheday.world",
    description:
      "Discover a new quote, song, game, movie, and word every day on OfTheDay.world.",
    author: {
      "@type": "Person",
      name: "Anthony Reynolds",
      url: "https://www.sloor.dev",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <style>{`html, body { touch-action: pan-y; }`}</style>
      <RequestIdleCallbackPolyfill />
      <GradientBackground>
        <div {...swipeHandlers}>
          <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <main className="pt-16">{children}</main>
        </div>
        <Footer />
        <BuyMeACoffee />
      </GradientBackground>
    </>
  );
}
