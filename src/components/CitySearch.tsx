'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchCities } from '@/lib/geocoding';
import { City, SavedCity } from '@/types';

interface CitySearchProps {
  onSelect: (city: SavedCity) => void;
  existingIds: Set<string>;
}

export default function CitySearch({ onSelect, existingIds }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const cities = await searchCities(q);
    setResults(cities);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  const handleSelect = (city: City) => {
    const saved: SavedCity = { ...city, order: Date.now() };
    onSelect(saved);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cities..."
          className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/15 transition-all text-base"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white/80 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute top-full mt-2 w-full bg-black/70 backdrop-blur-2xl border border-white/15 rounded-2xl overflow-hidden z-50 shadow-2xl"
          >
            {results.map((city, i) => {
              const exists = existingIds.has(city.id);
              return (
                <motion.button
                  key={city.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => !exists && handleSelect(city)}
                  disabled={exists}
                  className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${
                    exists ? 'opacity-40 cursor-default' : 'hover:bg-white/10 cursor-pointer'
                  }`}
                >
                  <div>
                    <p className="text-white font-medium">{city.name}</p>
                    <p className="text-white/50 text-sm">{city.country}</p>
                  </div>
                  {exists && <span className="text-white/30 text-xs">Added</span>}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
