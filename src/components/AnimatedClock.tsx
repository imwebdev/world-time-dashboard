'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getCityTime } from '@/lib/time';

function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -24, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: 24, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function AnimatedClock({ timezone }: { timezone: string }) {
  const [time, setTime] = useState(() => getCityTime(timezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCityTime(timezone));
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="flex flex-col items-center">
      {/* Time display */}
      <div className="flex items-baseline font-clock">
        {/* Hours */}
        <span className="text-[clamp(5rem,18vw,12rem)] font-[200] leading-[0.85] tracking-[-0.02em]">
          <Digit value={time.hours[0]} />
          <Digit value={time.hours[1]} />
        </span>

        {/* Colon */}
        <motion.span
          className="text-[clamp(4rem,14vw,9rem)] font-[100] mx-[0.02em] leading-[0.85] self-center"
          animate={{ opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          :
        </motion.span>

        {/* Minutes */}
        <span className="text-[clamp(5rem,18vw,12rem)] font-[200] leading-[0.85] tracking-[-0.02em]">
          <Digit value={time.minutes[0]} />
          <Digit value={time.minutes[1]} />
        </span>

        {/* Seconds + period */}
        <div className="flex flex-col items-start ml-3 gap-0.5">
          <span className="text-[clamp(1.1rem,3.5vw,2.2rem)] font-[300] opacity-50 font-clock tracking-tight">
            <Digit value={time.seconds[0]} />
            <Digit value={time.seconds[1]} />
          </span>
          <span className="text-[clamp(0.65rem,1.8vw,1rem)] font-medium opacity-30 uppercase tracking-[0.25em]">
            {time.period}
          </span>
        </div>
      </div>

      {/* Date + offset */}
      <div className="flex flex-col items-center gap-1.5 mt-5">
        <p className="text-[clamp(0.85rem,2.2vw,1.15rem)] font-[300] opacity-50 tracking-[0.05em]">
          {time.date}
        </p>
        <p className="text-[clamp(0.65rem,1.4vw,0.85rem)] font-mono opacity-25 tracking-[0.15em] uppercase">
          {time.utcOffset}
        </p>
      </div>
    </div>
  );
}
