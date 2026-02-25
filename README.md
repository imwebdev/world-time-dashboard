# World Time Dashboard

A premium, animated world time dashboard with live weather, city backgrounds, and AI-generated wallpapers.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)

## Features

- **Full-screen city view** with animated clock, weather, and city photos
- **Live weather** via Open-Meteo API (no API key required)
- **Weather animations** -- clear skies, clouds, rain, snow, thunder, fog
- **City search** with autocomplete via Open-Meteo geocoding
- **Wikipedia fun facts** for each city
- **Swipe/keyboard navigation** between cities
- **localStorage persistence** for saved cities
- **AI-generated backgrounds** (optional, requires OpenAI API key)
- **Mobile-first responsive design**
- **Framer Motion** transitions and animations
- **prefers-reduced-motion** support

## APIs Used (No Keys Required)

| API | Purpose |
|-----|---------|
| [Open-Meteo Weather](https://open-meteo.com/) | Current weather data |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search + timezone resolution |
| [Unsplash Source](https://source.unsplash.com/) | City background photos |
| [Wikipedia REST](https://en.wikipedia.org/api/rest_v1/) | City fun facts |

## Optional: AI Backgrounds

Set an OpenAI API key to generate unique DALL-E 3 backgrounds for each city:

```bash
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key
```

If no key is set, the app uses Unsplash photos with CSS weather animation fallbacks.

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Build & Run

```bash
npm run build
npm start
```

## Deploy with Docker

```bash
docker build -t world-time-dashboard .
docker run -p 6005:6005 world-time-dashboard
```

## Keyboard Shortcuts

- Left/Right arrows -- Navigate between cities
- Esc -- Close city drawer

## Touch Gestures

- Swipe left/right to navigate between cities
