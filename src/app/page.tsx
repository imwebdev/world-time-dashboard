'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { SavedCity } from '@/types';
import { getSavedCities, saveCities, getSelectedCityId, setSelectedCityId } from '@/lib/storage';
import CityView from '@/components/CityView';
import CityDrawer from '@/components/CityDrawer';
import { motion } from 'framer-motion';

export default function Home() {
  const [cities, setCities] = useState<SavedCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<SavedCity | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const saved = getSavedCities();
    setCities(saved);
    const selId = getSelectedCityId();
    const sel = saved.find(c => c.id === selId) || saved[0] || null;
    setSelectedCity(sel);
    setMounted(true);
  }, []);

  const selectCity = useCallback(
    (city: SavedCity, dir?: number) => {
      if (city.id === selectedCity?.id) return;
      const currentIdx = cities.findIndex(c => c.id === selectedCity?.id);
      const newIdx = cities.findIndex(c => c.id === city.id);
      setDirection(dir ?? (newIdx > currentIdx ? 1 : -1));
      setSelectedCity(city);
      setSelectedCityId(city.id);
    },
    [cities, selectedCity]
  );

  const navigateCity = useCallback(
    (dir: number) => {
      if (!selectedCity || cities.length < 2) return;
      const idx = cities.findIndex(c => c.id === selectedCity.id);
      const nextIdx = (idx + dir + cities.length) % cities.length;
      selectCity(cities[nextIdx], dir);
    },
    [cities, selectedCity, selectCity]
  );

  const addCity = useCallback(
    (city: SavedCity) => {
      const newCities = [...cities, city];
      setCities(newCities);
      saveCities(newCities);
      selectCity(city, 1);
    },
    [cities, selectCity]
  );

  const removeCity = useCallback(
    (id: string) => {
      if (cities.length <= 1) return;
      const newCities = cities.filter(c => c.id !== id);
      setCities(newCities);
      saveCities(newCities);
      if (selectedCity?.id === id) {
        const newSel = newCities[0];
        setSelectedCity(newSel);
        setSelectedCityId(newSel.id);
      }
    },
    [cities, selectedCity]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigateCity(-1);
      else if (e.key === 'ArrowRight') navigateCity(1);
      else if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigateCity]);

  // Touch swipe
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        navigateCity(dx > 0 ? -1 : 1);
      }
      touchStartRef.current = null;
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigateCity]);

  if (!mounted) {
    return <div className="h-screen w-screen bg-black" />;
  }

  return (
    <main className="h-screen w-screen relative select-none">
      {/* City View */}
      {selectedCity && <CityView city={selectedCity} direction={direction} />}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-full hover:bg-white/15 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span className="text-sm font-medium">{cities.length} Cities</span>
        </motion.button>

        {/* Nav arrows */}
        {cities.length > 1 && (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateCity(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/15 hover:bg-white/15 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateCity(1)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/15 hover:bg-white/15 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        )}
      </div>

      {/* City indicator dots */}
      {cities.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
          {cities.map(c => (
            <motion.button
              key={c.id}
              onClick={() => selectCity(c)}
              className={`rounded-full transition-all ${
                c.id === selectedCity?.id
                  ? 'w-6 h-2 bg-white/80'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              layout
            />
          ))}
        </div>
      )}

      {/* Drawer */}
      <CityDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cities={cities}
        selectedId={selectedCity?.id ?? null}
        onSelect={selectCity}
        onRemove={removeCity}
        onAdd={addCity}
      />
    </main>
  );
}
