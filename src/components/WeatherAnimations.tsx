'use client';

import { WeatherCondition } from '@/types';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

function ClearAnimation({ isDay }: { isDay: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          isDay
            ? 'bg-gradient-to-b from-sky-400 via-blue-300 to-amber-100'
            : 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-800'
        }`}
      />
      {isDay && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-yellow-200/20 rounded-full blur-3xl"
              style={{
                width: `${200 + i * 80}px`,
                height: `${200 + i * 80}px`,
                top: `${-50 + i * 10}%`,
                left: `${20 + i * 15}%`,
              }}
              animate={{
                x: [0, 30, -20, 0],
                y: [0, -20, 10, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}
      {!isDay && (
        <>
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

function CloudAnimation() {
  const clouds = useMemo(
    () =>
      [...Array(6)].map((_, i) => ({
        id: i,
        size: 150 + Math.random() * 200,
        top: Math.random() * 60,
        delay: i * 3,
        duration: 25 + Math.random() * 15,
        opacity: 0.4 + Math.random() * 0.3,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-500 via-slate-400 to-slate-300">
      {clouds.map(c => (
        <motion.div
          key={c.id}
          className="absolute rounded-full bg-white/60 blur-2xl"
          style={{ width: c.size, height: c.size * 0.5, top: `${c.top}%` }}
          animate={{ x: ['-20vw', '120vw'] }}
          transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function RainAnimation() {
  const drops = useMemo(
    () =>
      [...Array(60)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.6 + Math.random() * 0.4,
        height: 15 + Math.random() * 20,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500">
      {drops.map(d => (
        <motion.div
          key={d.id}
          className="absolute w-[1px] bg-gradient-to-b from-transparent to-blue-300/60 rounded-full"
          style={{ left: `${d.left}%`, height: d.height }}
          animate={{ y: ['-10vh', '110vh'], opacity: [0, 0.8, 0] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'linear' }}
        />
      ))}
      {/* ripples */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute bottom-0 rounded-full border border-blue-300/30"
          style={{ left: `${10 + Math.random() * 80}%` }}
          animate={{ width: [0, 30], height: [0, 10], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

function SnowAnimation() {
  const flakes = useMemo(
    () =>
      [...Array(50)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
        wobble: 20 + Math.random() * 40,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-300 via-blue-100 to-white">
      {flakes.map(f => (
        <motion.div
          key={f.id}
          className="absolute rounded-full bg-white shadow-sm"
          style={{ width: f.size, height: f.size, left: `${f.left}%` }}
          animate={{
            y: ['-5vh', '105vh'],
            x: [-f.wobble, f.wobble, -f.wobble],
            opacity: [0, 1, 0.8, 0],
          }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function ThunderAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-900 via-gray-800 to-slate-700">
      <RainAnimation />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`flash-${i}`}
          className="absolute inset-0 bg-white/20"
          animate={{ opacity: [0, 0, 1, 0, 0.5, 0, 0, 0, 0, 0, 0, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: i * 3 + Math.random() * 2 }}
        />
      ))}
    </div>
  );
}

function FogAnimation() {
  const layers = useMemo(
    () =>
      [...Array(5)].map((_, i) => ({
        id: i,
        top: 20 + i * 15,
        duration: 15 + Math.random() * 10,
        delay: i * 2,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-400 via-gray-300 to-slate-300">
      {layers.map(l => (
        <motion.div
          key={l.id}
          className="absolute w-[200%] h-32 bg-white/40 blur-3xl"
          style={{ top: `${l.top}%` }}
          animate={{ x: ['-50%', '0%', '-50%'] }}
          transition={{ duration: l.duration, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function DrizzleAnimation() {
  const drops = useMemo(
    () =>
      [...Array(30)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.2 + Math.random() * 0.8,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-500 via-slate-400 to-gray-300">
      {drops.map(d => (
        <motion.div
          key={d.id}
          className="absolute w-[1px] h-2 bg-blue-200/50 rounded-full"
          style={{ left: `${d.left}%` }}
          animate={{ y: ['-5vh', '105vh'], opacity: [0, 0.5, 0] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

export default function WeatherAnimation({
  condition,
  isDay = true,
}: {
  condition: WeatherCondition;
  isDay?: boolean;
}) {
  const components: Record<WeatherCondition, React.ReactNode> = {
    clear: <ClearAnimation isDay={isDay} />,
    clouds: <CloudAnimation />,
    rain: <RainAnimation />,
    snow: <SnowAnimation />,
    thunder: <ThunderAnimation />,
    fog: <FogAnimation />,
    drizzle: <DrizzleAnimation />,
  };

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {components[condition]}
    </motion.div>
  );
}
