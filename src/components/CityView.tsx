'use client';

import { SavedCity, WeatherData, WeatherCondition } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchWeather, weatherCodeToCondition, weatherCodeToLabel, weatherCodeToIcon } from '@/lib/weather';
import WeatherAnimation from './WeatherAnimations';
import AnimatedClock from './AnimatedClock';

interface CityViewProps {
  city: SavedCity;
  direction: number;
}

interface UnsplashPhoto {
  url: string;
  photographer: {
    name: string;
    username: string;
    profileUrl: string;
  };
  unsplashUrl: string;
}

function useAIBackground(city: SavedCity, weather: WeatherData | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const attemptedRef = useRef<string>('');

  useEffect(() => {
    const key = `${city.id}-${weather?.weatherCode}`;
    if (attemptedRef.current === key) return;
    attemptedRef.current = key;

    const cached = sessionStorage.getItem(`ai-bg-${city.id}`);
    if (cached) {
      setUrl(cached);
      return;
    }

    setLoading(true);
    fetch('/api/generate-bg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: city.name,
        country: city.country,
        weather: weather ? weatherCodeToLabel(weather.weatherCode) : 'clear skies',
        isDay: weather?.isDay ?? true,
      }),
    })
      .then(r => {
        if (!r.ok) throw new Error('not available');
        return r.json();
      })
      .then(data => {
        if (data.url) {
          sessionStorage.setItem(`ai-bg-${city.id}`, data.url);
          setUrl(data.url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city, weather]);

  return { url, loading };
}

function useUnsplashPhoto(city: SavedCity) {
  const [photo, setPhoto] = useState<UnsplashPhoto | null>(null);
  const attemptedRef = useRef<string>('');

  useEffect(() => {
    if (attemptedRef.current === city.id) return;
    attemptedRef.current = city.id;

    const cacheKey = `unsplash-${city.id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setPhoto(JSON.parse(cached));
        return;
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    fetch(`/api/unsplash?city=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}`)
      .then(r => {
        if (!r.ok) throw new Error('not available');
        return r.json();
      })
      .then(data => {
        if (data.url) {
          const photoData: UnsplashPhoto = {
            url: data.url,
            photographer: data.photographer,
            unsplashUrl: data.unsplashUrl,
          };
          sessionStorage.setItem(cacheKey, JSON.stringify(photoData));
          setPhoto(photoData);
        }
      })
      .catch(() => {});
  }, [city]);

  return photo;
}

export default function CityView({ city, direction }: CityViewProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { url: aiUrl } = useAIBackground(city, weather);
  const unsplashPhoto = useUnsplashPhoto(city);

  const condition: WeatherCondition = weather ? weatherCodeToCondition(weather.weatherCode) : 'clear';
  const isDay = weather?.isDay ?? true;

  const loadWeather = useCallback(async () => {
    const data = await fetchWeather(city.latitude, city.longitude);
    if (data) setWeather(data);
  }, [city.latitude, city.longitude]);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    loadWeather();
    const interval = setInterval(loadWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city, loadWeather]);

  const bgImageUrl = aiUrl || unsplashPhoto?.url || null;
  const showAttribution = !aiUrl && unsplashPhoto;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={city.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Weather animation background */}
        <WeatherAnimation condition={condition} isDay={isDay} />

        {/* Photo overlay */}
        {bgImageUrl && !imgError && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: imgLoaded ? 1 : 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bgImageUrl}
              alt={city.name}
              className="w-full h-full object-cover"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </motion.div>
        )}

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-white">
          {/* City name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-6"
          >
            <h1 className="text-[clamp(1.8rem,5vw,3.5rem)] font-[300] tracking-[0.12em] uppercase leading-tight">
              {city.name}
            </h1>
            <motion.p
              className="text-[clamp(0.75rem,1.8vw,1rem)] font-[400] opacity-40 tracking-[0.3em] uppercase mt-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {city.country}
            </motion.p>
          </motion.div>

          {/* Clock */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedClock timezone={city.timezone} />
          </motion.div>

          {/* Weather pill */}
          {weather && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <div className="flex items-center gap-4 px-7 py-3.5 rounded-full bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <span className="text-xl">
                  {weatherCodeToIcon(weather.weatherCode, weather.isDay)}
                </span>
                <span className="text-lg font-[300] tracking-wide">
                  {weather.temperature}°
                </span>
                <span className="w-px h-5 bg-white/15" />
                <span className="text-sm font-[300] opacity-50">
                  {weatherCodeToLabel(weather.weatherCode)}
                </span>
                <span className="w-px h-5 bg-white/15" />
                <div className="flex items-center gap-3 text-xs opacity-35 font-[400]">
                  <span>{weather.windSpeed} mph</span>
                  <span>{weather.humidity}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Unsplash attribution */}
        {showAttribution && unsplashPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 text-[10px] text-white/25"
          >
            <span>Photo</span>
            <a
              href={unsplashPhoto.photographer.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors underline underline-offset-2"
            >
              {unsplashPhoto.photographer.name}
            </a>
            <span>/</span>
            <a
              href={unsplashPhoto.unsplashUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors underline underline-offset-2"
            >
              Unsplash
            </a>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
