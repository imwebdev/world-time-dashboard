'use client';

import { SavedCity, WeatherData, WikiFact, WeatherCondition } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchWeather, weatherCodeToCondition, weatherCodeToLabel, weatherCodeToIcon } from '@/lib/weather';
import { fetchWikiFact } from '@/lib/wikipedia';
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
  const [wikiFact, setWikiFact] = useState<WikiFact | null>(null);
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
    fetchWikiFact(city.name).then(f => f && setWikiFact(f));
    const interval = setInterval(loadWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city, loadWeather]);

  // AI-generated bg is primary, Unsplash API is fallback
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
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Weather animation background (always rendered, day/night aware) */}
        <WeatherAnimation condition={condition} isDay={isDay} />

        {/* Photo overlay */}
        {bgImageUrl && !imgError && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: imgLoaded ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bgImageUrl}
              alt={city.name}
              className="w-full h-full object-cover"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        )}

        {/* Glass overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-12 text-white">
          {/* City name + country with subtle entrance */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <motion.h1
              className="text-[clamp(2rem,6vw,4rem)] font-light tracking-wider leading-tight"
              animate={{ letterSpacing: ['0.1em', '0.15em', '0.1em'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {city.name}
            </motion.h1>
            <motion.p
              className="text-[clamp(0.9rem,2vw,1.2rem)] font-light opacity-50 tracking-[0.3em] uppercase mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {city.country}
            </motion.p>
          </motion.div>

          {/* Clock */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedClock timezone={city.timezone} />
          </motion.div>

          {/* Weather pill */}
          {weather && (
            <motion.div
              initial={{ y: 25, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center gap-5 shadow-lg shadow-black/10"
            >
              <motion.span
                className="text-2xl"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {weatherCodeToIcon(weather.weatherCode, weather.isDay)}
              </motion.span>
              <div>
                <p className="text-lg font-medium">{weather.temperature}°F</p>
                <p className="text-xs opacity-60">{weatherCodeToLabel(weather.weatherCode)}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-xs opacity-50 space-y-0.5">
                <p>💨 {weather.windSpeed} mph</p>
                <p>💧 {weather.humidity}%</p>
              </div>
            </motion.div>
          )}

          {/* Wiki fact */}
          {wikiFact && (
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-lg w-full"
            >
              <div className="relative px-8 py-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20">
                <span className="absolute -top-3 left-5 text-3xl text-white/20 font-serif leading-none select-none">&ldquo;</span>
                <p className="text-sm text-white/80 leading-relaxed pl-3">
                  {wikiFact.extract}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                  <span className="text-xs text-white/30 font-medium tracking-wide uppercase">About {city.name}</span>
                  <a
                    href={wikiFact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-300/70 hover:text-blue-300 transition-colors underline underline-offset-2"
                  >
                    Wikipedia →
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Unsplash attribution — required by API ToC */}
        {showAttribution && unsplashPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md"
          >
            <span className="text-[10px] text-white/40">Photo by</span>
            <a
              href={unsplashPhoto.photographer.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-white/60 hover:text-white/80 transition-colors underline underline-offset-2"
            >
              {unsplashPhoto.photographer.name}
            </a>
            <span className="text-[10px] text-white/40">on</span>
            <a
              href={unsplashPhoto.unsplashUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-white/60 hover:text-white/80 transition-colors underline underline-offset-2"
            >
              Unsplash
            </a>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
