import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import RequestIdleCallbackPolyfill from "@/components/RequestIdleCallbackPolyfill";
import { ReactNode } from "react";

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

export const metadata: Metadata = {
  title: "Of The Day!",
  description: "Discover a new quote, song, game, and more—every day.",
  keywords: ["daily content", "quote of the day", "song of the day", "game discovery", "random album", "oftheday"],
  authors: [{ name: "Anthony Reynolds", url: "https://www.sloor.dev" }],
  creator: "Anthony Reynolds",
  metadataBase: new URL("https://oftheday.world"),
  openGraph: {
    title: "Of The Day!",
    description: "Discover a new quote, song, game, and more—every day.",
    url: "https://oftheday.world",
    siteName: "Of The Day",
    images: [
      {
        url: "https://oftheday.world/cover.png",
        width: 1200,
        height: 630,
        alt: "Of The Day - Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Of The Day!",
    description: "Discover a new quote, song, game, and more—every day.",
    creator: "@sloorjuice",
    images: ["https://oftheday.world/cover.png"],
  },
  themeColor: "#2c3f50",
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Of The Day",
  url: "https://oftheday.world",
  description: "A simple website that beautifully displays Quote of the Day, Songs of the Day, Games of the Day, etc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <RequestIdleCallbackPolyfill />
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
