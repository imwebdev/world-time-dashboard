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
    <div className="relative w-full">
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
          placeholder="Add a city..."
          className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-[15px] text-white placeholder-white/25 outline-none focus:border-white/[0.15] focus:bg-white/[0.07] transition-all"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {loading ? (
            <motion.div
              className="w-4 h-4 border-[1.5px] border-white/20 border-t-white/60 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1.5 w-full bg-[#111111]/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            {results.map((city, i) => {
              const exists = existingIds.has(city.id);
              return (
                <motion.button
                  key={city.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                  onClick={() => !exists && handleSelect(city)}
                  disabled={exists}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                    exists ? 'opacity-30 cursor-default' : 'hover:bg-white/[0.05] cursor-pointer'
                  }`}
                >
                  <div>
                    <p className="text-[14px] text-white font-[450]">{city.name}</p>
                    <p className="text-white/30 text-[12px] mt-0.5">{city.country}</p>
                  </div>
                  {exists && <span className="text-white/20 text-[11px] font-medium">Added</span>}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
