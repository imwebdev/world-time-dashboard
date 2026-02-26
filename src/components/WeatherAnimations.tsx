'use client';

import { WeatherCondition } from '@/types';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

/* ============================================================
   CLEAR SKY — Day: Golden sun with light rays | Night: Starfield with moon
   ============================================================ */
function ClearAnimation({ isDay }: { isDay: boolean }) {
  const stars = useMemo(
    () =>
      [...Array(60)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          isDay
            ? 'bg-gradient-to-b from-sky-400 via-blue-300 to-amber-100'
            : 'bg-gradient-to-b from-[#0a0e27] via-[#111b47] to-[#1a1a3e]'
        }`}
      />
      {isDay ? (
        <>
          {/* Sun glow */}
          <motion.div
            className="absolute -top-20 right-[15%] w-[300px] h-[300px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,220,100,0.6) 0%, rgba(255,180,50,0.2) 40%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Light rays */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute origin-top-right"
              style={{
                top: 0,
                right: '20%',
                width: '2px',
                height: '100vh',
                background: 'linear-gradient(to bottom, rgba(255,220,130,0.3), transparent 60%)',
                transform: `rotate(${-30 + i * 12}deg)`,
              }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeInOut',
              }}
            />
          ))}
          {/* Floating warm particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-amber-200/20 blur-sm"
              style={{
                width: `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, -15, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      ) : (
        <>
          {/* Moon */}
          <motion.div
            className="absolute top-[8%] right-[18%] w-[80px] h-[80px] rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #f0f0f0 0%, #d4d4d4 50%, #a0a0a0 100%)',
              boxShadow: '0 0 60px rgba(200,200,255,0.3), 0 0 120px rgba(200,200,255,0.1)',
            }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Moon craters (subtle) */}
          <div
            className="absolute top-[9%] right-[19%] w-[15px] h-[15px] rounded-full opacity-10"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          />
          {/* Stars */}
          {stars.map(s => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{
                width: s.size,
                height: s.size,
                top: `${s.y}%`,
                left: `${s.x}%`,
              }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                delay: s.delay,
              }}
            />
          ))}
          {/* Shooting star (occasional) */}
          <motion.div
            className="absolute w-[2px] h-[80px] bg-gradient-to-b from-white/80 to-transparent rounded-full"
            style={{ top: '15%', left: '60%', transform: 'rotate(-45deg)' }}
            animate={{
              x: [0, -200],
              y: [0, 200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 12,
              delay: 5,
              ease: 'easeIn',
            }}
          />
        </>
      )}
    </div>
  );
}

/* ============================================================
   CLOUDS — Day: White puffy clouds | Night: Dark brooding clouds with moonlight
   ============================================================ */
function CloudAnimation({ isDay }: { isDay: boolean }) {
  const clouds = useMemo(
    () =>
      [...Array(8)].map((_, i) => ({
        id: i,
        size: 150 + Math.random() * 250,
        top: Math.random() * 70,
        delay: i * 2.5,
        duration: 30 + Math.random() * 20,
        opacity: isDay ? 0.5 + Math.random() * 0.3 : 0.2 + Math.random() * 0.2,
      })),
    [isDay]
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[2000ms] ${
        isDay
          ? 'bg-gradient-to-b from-slate-400 via-blue-300/80 to-slate-300'
          : 'bg-gradient-to-b from-[#111827] via-[#1e293b] to-[#0f172a]'
      }`}
    >
      {/* Ambient light glow */}
      {isDay ? (
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)' }}
        />
      ) : (
        <motion.div
          className="absolute top-[5%] right-[20%] w-[60px] h-[60px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(200,210,255,0.6), transparent)', boxShadow: '0 0 40px rgba(200,210,255,0.2)' }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {clouds.map(c => (
        <motion.div
          key={c.id}
          className={`absolute rounded-full blur-2xl ${
            isDay ? 'bg-white/60' : 'bg-slate-400/15'
          }`}
          style={{ width: c.size, height: c.size * 0.45, top: `${c.top}%` }}
          animate={{ x: ['-25vw', '125vw'] }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            delay: c.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   RAIN — Day: Grey sky with visible drops | Night: Dark with blue-tinted rain
   ============================================================ */
function RainAnimation({ isDay }: { isDay: boolean }) {
  const drops = useMemo(
    () =>
      [...Array(80)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.4,
        height: 15 + Math.random() * 25,
        opacity: 0.3 + Math.random() * 0.4,
      })),
    []
  );

  const ripples = useMemo(
    () =>
      [...Array(12)].map((_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        delay: i * 0.4 + Math.random() * 0.3,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[2000ms] ${
        isDay
          ? 'bg-gradient-to-b from-slate-600 via-slate-500 to-slate-400'
          : 'bg-gradient-to-b from-[#0c1220] via-[#172033] to-[#1a2540]'
      }`}
    >
      {/* Rain drops */}
      {drops.map(d => (
        <motion.div
          key={d.id}
          className={`absolute w-[1px] rounded-full ${
            isDay
              ? 'bg-gradient-to-b from-transparent to-blue-300/60'
              : 'bg-gradient-to-b from-transparent to-blue-400/40'
          }`}
          style={{ left: `${d.left}%`, height: d.height }}
          animate={{
            y: ['-10vh', '110vh'],
            opacity: [0, d.opacity, 0],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: 'linear',
          }}
        />
      ))}
      {/* Ripples at the bottom */}
      {ripples.map(r => (
        <motion.div
          key={`ripple-${r.id}`}
          className={`absolute bottom-[2%] rounded-full border ${
            isDay ? 'border-blue-300/30' : 'border-blue-400/20'
          }`}
          style={{ left: `${r.left}%` }}
          animate={{
            width: [0, 35],
            height: [0, 12],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: r.delay }}
        />
      ))}
      {/* Rain mist at the bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[15%] ${
          isDay
            ? 'bg-gradient-to-t from-slate-400/30 to-transparent'
            : 'bg-gradient-to-t from-blue-900/20 to-transparent'
        }`}
        style={{ filter: 'blur(8px)' }}
      />
    </div>
  );
}

/* ============================================================
   SNOW — Day: Bright white sky | Night: Deep blue with glowing flakes
   ============================================================ */
function SnowAnimation({ isDay }: { isDay: boolean }) {
  const flakes = useMemo(
    () =>
      [...Array(60)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 6,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        wobble: 20 + Math.random() * 40,
        blur: Math.random() > 0.7,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[2000ms] ${
        isDay
          ? 'bg-gradient-to-b from-slate-300 via-blue-100 to-white'
          : 'bg-gradient-to-b from-[#0f1729] via-[#1a2744] to-[#1e2d4a]'
      }`}
    >
      {/* Ground snow accumulation glow */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[8%] ${
          isDay
            ? 'bg-gradient-to-t from-white/60 to-transparent'
            : 'bg-gradient-to-t from-blue-200/10 to-transparent'
        }`}
      />
      {flakes.map(f => (
        <motion.div
          key={f.id}
          className={`absolute rounded-full ${f.blur ? 'blur-[1px]' : ''} ${
            isDay ? 'bg-white shadow-sm' : 'bg-blue-100/80'
          }`}
          style={{
            width: f.size,
            height: f.size,
            left: `${f.left}%`,
            ...(isDay ? {} : { boxShadow: '0 0 4px rgba(200,220,255,0.3)' }),
          }}
          animate={{
            y: ['-5vh', '105vh'],
            x: [-f.wobble, f.wobble, -f.wobble],
            opacity: [0, 0.9, 0.7, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            delay: f.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   THUNDERSTORM — Day: Dark angry sky | Night: Near-black with dramatic flashes
   ============================================================ */
function ThunderAnimation({ isDay }: { isDay: boolean }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[2000ms] ${
        isDay
          ? 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600'
          : 'bg-gradient-to-b from-[#050810] via-[#0d1117] to-[#111827]'
      }`}
    >
      {/* Rain layer underneath */}
      <RainAnimation isDay={isDay} />

      {/* Lightning bolt SVG flash */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`bolt-${i}`}
          className="absolute"
          style={{
            top: '5%',
            left: `${20 + i * 25}%`,
            width: '3px',
            height: '40vh',
            background: isDay
              ? 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(200,200,255,0.4), transparent)'
              : 'linear-gradient(to bottom, rgba(200,200,255,0.9), rgba(100,100,255,0.4), transparent)',
            filter: 'blur(1px)',
            transformOrigin: 'top',
            transform: `rotate(${-5 + Math.random() * 10}deg)`,
          }}
          animate={{
            opacity: [0, 0, 0, 1, 0, 0.3, 0, 0, 0, 0, 0, 0, 0, 0],
            scaleY: [0, 0, 0, 1, 0.5, 0.8, 0, 0, 0, 0, 0, 0, 0, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 3.5 + Math.random() * 2,
          }}
        />
      ))}
      {/* Flash illumination */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`flash-${i}`}
          className={`absolute inset-0 ${isDay ? 'bg-white/15' : 'bg-purple-200/10'}`}
          animate={{
            opacity: [0, 0, 0, 1, 0, 0.4, 0, 0, 0, 0, 0, 0, 0, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 3.5 + Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   FOG — Day: Soft grey mist | Night: Dark mysterious fog
   ============================================================ */
function FogAnimation({ isDay }: { isDay: boolean }) {
  const layers = useMemo(
    () =>
      [...Array(7)].map((_, i) => ({
        id: i,
        top: 10 + i * 12,
        duration: 15 + Math.random() * 12,
        delay: i * 1.5,
        height: 80 + Math.random() * 60,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[2000ms] ${
        isDay
          ? 'bg-gradient-to-b from-slate-400 via-gray-300 to-slate-300'
          : 'bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#111827]'
      }`}
    >
      {layers.map(l => (
        <motion.div
          key={l.id}
          className={`absolute w-[250%] blur-3xl ${
            isDay ? 'bg-white/35' : 'bg-slate-400/10'
          }`}
          style={{ top: `${l.top}%`, height: l.height }}
          animate={{ x: ['-60%', '10%', '-60%'] }}
          transition={{
            duration: l.duration,
            repeat: Infinity,
            delay: l.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Low-hanging fog at bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[25%] ${
          isDay ? 'bg-white/30' : 'bg-slate-600/15'
        }`}
        style={{ filter: 'blur(20px)' }}
      />
    </div>
  );
}

/* ============================================================
   DRIZZLE — Day: Misty light rain | Night: Soft dim drizzle
   ============================================================ */
function DrizzleAnimation({ isDay }: { isDay: boolean }) {
  const drops = useMemo(
    () =>
      [...Array(35)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.2 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-[2000ms] ${
        isDay
          ? 'bg-gradient-to-b from-slate-500 via-slate-400 to-gray-300'
          : 'bg-gradient-to-b from-[#111827] via-[#1a2332] to-[#1e293b]'
      }`}
    >
      {/* Mist layer */}
      <motion.div
        className={`absolute inset-0 ${isDay ? 'bg-white/10' : 'bg-slate-500/5'}`}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {drops.map(d => (
        <motion.div
          key={d.id}
          className={`absolute w-[1px] h-2 rounded-full ${
            isDay ? 'bg-blue-200/50' : 'bg-blue-300/30'
          }`}
          style={{ left: `${d.left}%` }}
          animate={{
            y: ['-5vh', '105vh'],
            opacity: [0, isDay ? 0.5 : 0.3, 0],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   MAIN EXPORT — Routes condition + isDay to the right animation
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
