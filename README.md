# 🌎 OfTheDay

A web app that shows a new curated set of content every day — including music, games, movies, and more.

Live Site: https://www.oftheday.world  
GitHub: https://github.com/sloorjuice/OfTheDay

---

## Overview

OfTheDay is a Next.js application that delivers daily-changing content such as:

- Song/Abum/Artist of the Day (from Deezer)
- Games of the Day (From RAWG)
- Movie/tv of the Day (From TMDb)
- Anime of the day (From MAL)
- Book of the day (From Google Play)
- Word of the Day (Web Scraping)
- Quote of the Day (From ZenQuotes)
- Joke of the Day (From JokeAPI)

It uses date-based deterministic seeding to ensure every user sees the same content for a given day.

---

## Tech Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- APIs: Deezer, RAWG, TMDb, ZenQuotes, GooglePlay, MAL, ZenQuotes, JokeAPI
- Plus Some Web Scraping
- Hosting: Netlify (with serverless functions)

---

### As a Bonus

- Visit https://somethingtoday.netlify.app/.netlify/functions/getSongOfTheDay for a raw jason of the music of the day
- Visit https://somethingtoday.netlify.app/.netlify/functions/getMovieOfTheDay for a raw jason of the movies of the day
- Visit https://somethingtoday.netlify.app/.netlify/functions/getTvOfTheDay for a raw jason of the tv of the day
- Visit https://somethingtoday.netlify.app/.netlify/functions/getGameOfTheDay for a raw jason of the games of the day

It would be cool to see someone use this in their own project.

---

## Author

Created by Anthony Reynolds (aka sloorjuice)  
Personal site: https://www.sloor.dev

---

## License

MIT License

---
