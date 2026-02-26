'use client';

import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { SavedCity } from '@/types';
import CitySearch from './CitySearch';
import { getCityTime } from '@/lib/time';
import { useEffect, useState } from 'react';

interface CityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cities: SavedCity[];
  selectedId: string | null;
  onSelect: (city: SavedCity) => void;
  onRemove: (id: string) => void;
  onAdd: (city: SavedCity) => void;
  onReorder: (cities: SavedCity[]) => void;
}

function MiniClock({ timezone }: { timezone: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const t = getCityTime(timezone);
      setTime(`${t.hours}:${t.minutes} ${t.period}`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [timezone]);
  return <span className="font-mono text-sm opacity-60">{time}</span>;
}

export default function CityDrawer({
  isOpen,
  onClose,
  cities,
  selectedId,
  onSelect,
  onRemove,
  onAdd,
  onReorder,
}: CityDrawerProps) {
  const existingIds = new Set(cities.map(c => c.id));
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Reset confirm state when drawer closes
  useEffect(() => {
    if (!isOpen) setConfirmDelete(null);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-black/80 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl overflow-hidden md:left-auto md:right-0 md:top-0 md:bottom-0 md:max-h-none md:w-[400px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l"
          >
            {/* Handle */}
            <div className="flex justify-center py-3 md:hidden">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="px-6 pt-2 pb-4">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-white">Your Cities</h2>
                  <p className="text-xs text-white/30 mt-0.5">Drag to reorder</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <CitySearch onSelect={onAdd} existingIds={existingIds} />
            </div>

            <div className="px-4 pb-6 overflow-y-auto max-h-[55vh] md:max-h-[calc(100vh-200px)]">
              <Reorder.Group
                axis="y"
                values={cities}
                onReorder={onReorder}
                className="space-y-1"
              >
                {cities.map(city => (
                  <Reorder.Item
                    key={city.id}
                    value={city}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-grab active:cursor-grabbing transition-colors group ${
                      selectedId === city.id
                        ? 'bg-white/15 border border-white/20'
                        : 'hover:bg-white/8 border border-transparent'
                    }`}
                    whileDrag={{
                      scale: 1.02,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      zIndex: 50,
                    }}
                  >
                    {/* Drag handle */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex flex-col gap-[3px] opacity-30 group-hover:opacity-50 transition-opacity flex-shrink-0">
                        <div className="w-4 h-[2px] bg-white/60 rounded-full" />
                        <div className="w-4 h-[2px] bg-white/60 rounded-full" />
                        <div className="w-4 h-[2px] bg-white/60 rounded-full" />
                      </div>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          onSelect(city);
                          onClose();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {selectedId === city.id && (
                            <motion.div
                              layoutId="selected-dot"
                              className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"
                            />
                          )}
                          <p className="text-white font-medium truncate">{city.name}</p>
                        </div>
                        <p className="text-white/40 text-sm truncate">{city.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <MiniClock timezone={city.timezone} />
                      {/* Delete button with confirmation */}
                      {cities.length > 1 && (
                        <AnimatePresence mode="wait">
                          {confirmDelete === city.id ? (
                            <motion.div
                              key="confirm"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1"
                            >
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  onRemove(city.id);
                                  setConfirmDelete(null);
                                }}
                                className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                              >
                                Remove
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setConfirmDelete(null);
                                }}
                                className="px-2 py-1 text-xs bg-white/10 text-white/50 rounded-lg hover:bg-white/20 transition-colors"
                              >
                                Keep
                              </button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="delete"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={e => {
                                e.stopPropagation();
                                setConfirmDelete(city.id);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                            >
                              <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            {/* Footer with city count */}
            <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/20">{cities.length} {cities.length === 1 ? 'city' : 'cities'} saved</span>
              <span className="text-xs text-white/20">Swipe or use arrows to navigate</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
