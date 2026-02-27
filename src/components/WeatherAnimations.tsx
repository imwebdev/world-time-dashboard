'use client';

import { WeatherCondition } from '@/types';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

/* ============================================================
   CLEAR SKY
   ============================================================ */
function ClearAnimation({ isDay }: { isDay: boolean }) {
  const stars = useMemo(
    () =>
      [...Array(50)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 1.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-[3000ms] ${
          isDay
            ? 'bg-gradient-to-b from-[#4a9eed] via-[#6bb3f0] to-[#f0c27f]'
            : 'bg-gradient-to-b from-[#070b1a] via-[#0d1633] to-[#151d3b]'
        }`}
      />
      {isDay ? (
        <>
          <motion.div
            className="absolute -top-16 right-[12%] w-[280px] h-[280px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,230,120,0.5) 0%, rgba(255,200,60,0.15) 40%, transparent 65%)',
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute origin-top-right"
              style={{
                top: 0,
                right: '18%',
                width: '1.5px',
                height: '80vh',
                background: 'linear-gradient(to bottom, rgba(255,220,130,0.2), transparent 50%)',
                transform: `rotate(${-25 + i * 10}deg)`,
              }}
              animate={{ opacity: [0.05, 0.25, 0.05] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
            />
          ))}
        </>
      ) : (
        <>
          <motion.div
            className="absolute top-[7%] right-[16%] w-[70px] h-[70px] rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #eee 0%, #ccc 50%, #999 100%)',
              boxShadow: '0 0 50px rgba(200,200,255,0.25), 0 0 100px rgba(200,200,255,0.08)',
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {stars.map(s => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{ width: s.size, height: s.size, top: `${s.y}%`, left: `${s.x}%` }}
              animate={{ opacity: [0.15, 0.8, 0.15] }}
              transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
            />
          ))}
          <motion.div
            className="absolute w-[1.5px] h-[70px] bg-gradient-to-b from-white/70 to-transparent rounded-full"
            style={{ top: '12%', left: '55%', transform: 'rotate(-45deg)' }}
            animate={{ x: [0, -180], y: [0, 180], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 15, delay: 6, ease: 'easeIn' }}
          />
        </>
      )}
    </div>
  );
}

/* ============================================================
   CLOUDS
   ============================================================ */
function CloudAnimation({ isDay }: { isDay: boolean }) {
  const clouds = useMemo(
    () =>
      [...Array(7)].map((_, i) => ({
        id: i,
        size: 160 + Math.random() * 220,
        top: Math.random() * 65,
        delay: i * 2.5,
        duration: 35 + Math.random() * 20,
        opacity: isDay ? 0.4 + Math.random() * 0.25 : 0.12 + Math.random() * 0.12,
      })),
    [isDay]
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[3000ms] ${
        isDay
          ? 'bg-gradient-to-b from-[#8ba4b8] via-[#9bb5cc] to-[#b8c9d6]'
          : 'bg-gradient-to-b from-[#0e1520] via-[#182030] to-[#0d1218]'
      }`}
    >
      {isDay ? (
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[350px] h-[180px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.4), transparent)' }}
        />
      ) : (
        <motion.div
          className="absolute top-[5%] right-[18%] w-[50px] h-[50px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(200,210,255,0.5), transparent)', boxShadow: '0 0 30px rgba(200,210,255,0.15)' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {clouds.map(c => (
        <motion.div
          key={c.id}
          className={`absolute rounded-full blur-2xl ${isDay ? 'bg-white/50' : 'bg-slate-400/10'}`}
          style={{ width: c.size, height: c.size * 0.4, top: `${c.top}%` }}
          animate={{ x: ['-20vw', '120vw'] }}
          transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   RAIN
   ============================================================ */
function RainAnimation({ isDay }: { isDay: boolean }) {
  const drops = useMemo(
    () =>
      [...Array(70)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.4,
        height: 15 + Math.random() * 20,
        opacity: 0.25 + Math.random() * 0.35,
      })),
    []
  );

  const ripples = useMemo(
    () =>
      [...Array(10)].map((_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        delay: i * 0.4 + Math.random() * 0.3,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[3000ms] ${
        isDay
          ? 'bg-gradient-to-b from-[#4a5568] via-[#5a6a7a] to-[#6b7d8d]'
          : 'bg-gradient-to-b from-[#0a0f1a] via-[#121d2e] to-[#162038]'
      }`}
    >
      {drops.map(d => (
        <motion.div
          key={d.id}
          className={`absolute w-[1px] rounded-full ${
            isDay
              ? 'bg-gradient-to-b from-transparent to-blue-200/50'
              : 'bg-gradient-to-b from-transparent to-blue-300/30'
          }`}
          style={{ left: `${d.left}%`, height: d.height }}
          animate={{ y: ['-10vh', '110vh'], opacity: [0, d.opacity, 0] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'linear' }}
        />
      ))}
      {ripples.map(r => (
        <motion.div
          key={`ripple-${r.id}`}
          className={`absolute bottom-[2%] rounded-full border ${
            isDay ? 'border-blue-200/25' : 'border-blue-300/15'
          }`}
          style={{ left: `${r.left}%` }}
          animate={{ width: [0, 30], height: [0, 10], opacity: [0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: r.delay }}
        />
      ))}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[12%] ${
          isDay ? 'bg-gradient-to-t from-slate-400/20 to-transparent' : 'bg-gradient-to-t from-blue-900/15 to-transparent'
        }`}
        style={{ filter: 'blur(6px)' }}
      />
    </div>
  );
}

/* ============================================================
   SNOW
   ============================================================ */
function SnowAnimation({ isDay }: { isDay: boolean }) {
  const flakes = useMemo(
    () =>
      [...Array(50)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 6,
        wobble: 20 + Math.random() * 35,
        blur: Math.random() > 0.7,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[3000ms] ${
        isDay
          ? 'bg-gradient-to-b from-[#b0bec5] via-[#cfd8dc] to-[#eceff1]'
          : 'bg-gradient-to-b from-[#0d1525] via-[#172240] to-[#1a2845]'
      }`}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 h-[6%] ${
          isDay ? 'bg-gradient-to-t from-white/50 to-transparent' : 'bg-gradient-to-t from-blue-100/8 to-transparent'
        }`}
      />
      {flakes.map(f => (
        <motion.div
          key={f.id}
          className={`absolute rounded-full ${f.blur ? 'blur-[1px]' : ''} ${
            isDay ? 'bg-white shadow-sm' : 'bg-blue-100/70'
          }`}
          style={{
            width: f.size,
            height: f.size,
            left: `${f.left}%`,
            ...(isDay ? {} : { boxShadow: '0 0 3px rgba(200,220,255,0.25)' }),
          }}
          animate={{
            y: ['-5vh', '105vh'],
            x: [-f.wobble, f.wobble, -f.wobble],
            opacity: [0, 0.85, 0.6, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   THUNDERSTORM
   ============================================================ */
function ThunderAnimation({ isDay }: { isDay: boolean }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[3000ms] ${
        isDay
          ? 'bg-gradient-to-b from-[#37474f] via-[#455a64] to-[#546e7a]'
          : 'bg-gradient-to-b from-[#040608] via-[#0a0e17] to-[#0e1520]'
      }`}
    >
      <RainAnimation isDay={isDay} />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`bolt-${i}`}
          className="absolute"
          style={{
            top: '5%',
            left: `${20 + i * 25}%`,
            width: '2px',
            height: '35vh',
            background: isDay
              ? 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(200,200,255,0.3), transparent)'
              : 'linear-gradient(to bottom, rgba(200,200,255,0.8), rgba(100,100,255,0.3), transparent)',
            filter: 'blur(0.5px)',
            transformOrigin: 'top',
            transform: `rotate(${-5 + Math.random() * 10}deg)`,
          }}
          animate={{
            opacity: [0, 0, 0, 1, 0, 0.3, 0, 0, 0, 0, 0, 0, 0, 0],
            scaleY: [0, 0, 0, 1, 0.5, 0.8, 0, 0, 0, 0, 0, 0, 0, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: i * 3.5 + Math.random() * 2 }}
        />
      ))}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`flash-${i}`}
          className={`absolute inset-0 ${isDay ? 'bg-white/12' : 'bg-purple-200/8'}`}
          animate={{ opacity: [0, 0, 0, 1, 0, 0.3, 0, 0, 0, 0, 0, 0, 0, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: i * 3.5 + Math.random() * 2 }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   FOG
   ============================================================ */
function FogAnimation({ isDay }: { isDay: boolean }) {
  const layers = useMemo(
    () =>
      [...Array(6)].map((_, i) => ({
        id: i,
        top: 10 + i * 14,
        duration: 18 + Math.random() * 12,
        delay: i * 1.5,
        height: 70 + Math.random() * 50,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[3000ms] ${
        isDay
          ? 'bg-gradient-to-b from-[#90a4ae] via-[#b0bec5] to-[#cfd8dc]'
          : 'bg-gradient-to-b from-[#0e1520] via-[#1a2332] to-[#0e1520]'
      }`}
    >
      {layers.map(l => (
        <motion.div
          key={l.id}
          className={`absolute w-[200%] blur-3xl ${isDay ? 'bg-white/30' : 'bg-slate-400/8'}`}
          style={{ top: `${l.top}%`, height: l.height }}
          animate={{ x: ['-50%', '5%', '-50%'] }}
          transition={{ duration: l.duration, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
        />
      ))}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[20%] ${
          isDay ? 'bg-white/25' : 'bg-slate-600/10'
        }`}
        style={{ filter: 'blur(16px)' }}
      />
    </div>
  );
}

/* ============================================================
   DRIZZLE
   ============================================================ */
function DrizzleAnimation({ isDay }: { isDay: boolean }) {
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
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[3000ms] ${
        isDay
          ? 'bg-gradient-to-b from-[#607d8b] via-[#78909c] to-[#90a4ae]'
          : 'bg-gradient-to-b from-[#0e1520] via-[#162030] to-[#1a2535]'
      }`}
    >
      <motion.div
        className={`absolute inset-0 ${isDay ? 'bg-white/8' : 'bg-slate-500/4'}`}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {drops.map(d => (
        <motion.div
          key={d.id}
          className={`absolute w-[1px] h-2 rounded-full ${
            isDay ? 'bg-blue-200/40' : 'bg-blue-300/25'
          }`}
          style={{ left: `${d.left}%` }}
          animate={{ y: ['-5vh', '105vh'], opacity: [0, isDay ? 0.4 : 0.25, 0] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   MAIN EXPORT
   ============================================================ */
export default function WeatherAnimation({
  condition,
  isDay = true,
}: {
  condition: WeatherCondition;
  isDay?: boolean;
}) {
  const components: Record<WeatherCondition, React.ReactNode> = {
    clear: <ClearAnimation isDay={isDay} />,
    clouds: <CloudAnimation isDay={isDay} />,
    rain: <RainAnimation isDay={isDay} />,
    snow: <SnowAnimation isDay={isDay} />,
    thunder: <ThunderAnimation isDay={isDay} />,
    fog: <FogAnimation isDay={isDay} />,
    drizzle: <DrizzleAnimation isDay={isDay} />,
  };

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {components[condition]}
    </motion.div>
  );
}
