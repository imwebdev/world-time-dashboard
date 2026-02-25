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

export default function CityView({ city, direction }: CityViewProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [wikiFact, setWikiFact] = useState<WikiFact | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { url: aiUrl } = useAIBackground(city, weather);

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

  const unsplashUrl = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(city.name + ' city skyline')}`;
  const bgImageUrl = aiUrl || unsplashUrl;

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
        {/* Weather animation background (always rendered) */}
        <WeatherAnimation condition={condition} isDay={isDay} />

        {/* Photo overlay */}
        {!imgError && (
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

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-white">
          {/* City name + country */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-[clamp(2rem,6vw,4rem)] font-light tracking-wider leading-tight">{city.name}</h1>
            <p className="text-[clamp(0.9rem,2vw,1.2rem)] font-light opacity-50 tracking-[0.3em] uppercase mt-1">
              {city.country}
            </p>
          </motion.div>

          {/* Clock */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AnimatedClock timezone={city.timezone} />
          </motion.div>

          {/* Weather pill */}
          {weather && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center gap-4"
            >
              <span className="text-2xl">{weatherCodeToIcon(weather.weatherCode, weather.isDay)}</span>
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
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 max-w-md text-center"
            >
              <p className="text-sm opacity-50 leading-relaxed italic">&ldquo;{wikiFact.extract}&rdquo;</p>
              <a
                href={wikiFact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs opacity-40 hover:opacity-70 transition-opacity underline underline-offset-2"
              >
                More on Wikipedia →
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
