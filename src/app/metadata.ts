// filepath: /Users/anthony/Documents/Dev/Websites/oftheday/src/app/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OfTheDay.world | Daily Quotes, Songs, Games, Movies & More",
    description: "Discover a new quote, song, game, movie, and word every day on OfTheDay.world. Get inspired daily with curated recommendations and fresh content!",
    keywords: ["daily content", "Daily Games", "Daily songs", "Daily Music", "quote of the day", "song of the day", "game discovery", "random album", "oftheday", "movies", "music", "games", "daily inspiration"],
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