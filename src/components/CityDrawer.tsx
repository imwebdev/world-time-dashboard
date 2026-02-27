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
  return <span className="font-mono text-sm text-white/40 tabular-nums">{time}</span>;
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

  useEffect(() => {
    if (!isOpen) setConfirmDelete(null);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] rounded-t-[28px] overflow-hidden
              bg-[#0a0a0a]/95 backdrop-blur-3xl border-t border-white/[0.06]
              md:left-auto md:right-0 md:top-0 md:bottom-0 md:max-h-none md:w-[420px] md:rounded-t-none md:rounded-l-[28px] md:border-t-0 md:border-l"
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center py-3 md:hidden">
              <div className="w-9 h-[3px] bg-white/15 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pt-2 pb-5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-[500] text-white tracking-[-0.01em]">World Clock</h2>
                  <p className="text-[11px] text-white/25 mt-0.5 tracking-wide">Drag to reorder</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <CitySearch onSelect={onAdd} existingIds={existingIds} />
            </div>

            {/* City list */}
            <div className="px-3 pb-6 overflow-y-auto max-h-[55vh] md:max-h-[calc(100vh-220px)]">
              <Reorder.Group
                axis="y"
                values={cities}
                onReorder={onReorder}
                className="space-y-0.5"
              >
                {cities.map(city => (
                  <Reorder.Item
                    key={city.id}
                    value={city}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-200 group ${
                      selectedId === city.id
                        ? 'bg-white/[0.08]'
                        : 'hover:bg-white/[0.04]'
                    }`}
                    whileDrag={{
                      scale: 1.02,
                      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                      zIndex: 50,
                    }}
                  >
                    {/* Left: drag handle + city info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Drag dots */}
                      <div className="flex flex-col gap-[3px] opacity-20 group-hover:opacity-35 transition-opacity flex-shrink-0">
                        <div className="w-3.5 h-[1.5px] bg-white rounded-full" />
                        <div className="w-3.5 h-[1.5px] bg-white rounded-full" />
                        <div className="w-3.5 h-[1.5px] bg-white rounded-full" />
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
                              layoutId="selected-indicator"
                              className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0"
                            />
                          )}
                          <p className="text-[15px] text-white font-[450] truncate">{city.name}</p>
                        </div>
                        <p className="text-white/30 text-[13px] font-[400] truncate mt-0.5">{city.country}</p>
                      </div>
                    </div>

                    {/* Right: time + delete */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <MiniClock timezone={city.timezone} />

                      {cities.length > 1 && (
                        <AnimatePresence mode="wait">
                          {confirmDelete === city.id ? (
                            <motion.div
                              key="confirm"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              className="flex items-center gap-1"
                            >
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  onRemove(city.id);
                                  setConfirmDelete(null);
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/25 transition-colors"
                              >
                                Remove
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setConfirmDelete(null);
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium bg-white/[0.06] text-white/40 rounded-lg hover:bg-white/[0.1] transition-colors"
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
                              className="w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/[0.06] transition-all"
                            >
                              <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/[0.04]">
              <span className="text-[11px] text-white/15 tracking-wide">{cities.length} {cities.length === 1 ? 'city' : 'cities'}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
