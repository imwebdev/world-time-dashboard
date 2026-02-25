'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getCityTime } from '@/lib/time';

function Digit({ value, className }: { value: string; className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-baseline gap-1">
        <div className="flex items-baseline font-clock tracking-tight">
          <span className="text-[clamp(4rem,15vw,10rem)] font-extralight leading-none">
            <Digit value={time.hours[0]} />
            <Digit value={time.hours[1]} />
          </span>
          <motion.span
            className="text-[clamp(3rem,12vw,8rem)] font-extralight mx-1 opacity-60"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            :
          </motion.span>
          <span className="text-[clamp(4rem,15vw,10rem)] font-extralight leading-none">
            <Digit value={time.minutes[0]} />
            <Digit value={time.minutes[1]} />
          </span>
        </div>
        <div className="flex flex-col items-start ml-2">
          <span className="text-[clamp(1.2rem,3vw,2rem)] font-light opacity-70">
            <Digit value={time.seconds[0]} />
            <Digit value={time.seconds[1]} />
          </span>
          <span className="text-[clamp(0.8rem,2vw,1.2rem)] font-medium opacity-50 uppercase tracking-widest">
            {time.period}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 mt-2">
        <p className="text-[clamp(0.9rem,2.5vw,1.3rem)] font-light opacity-70 tracking-wide">
          {time.date}
        </p>
        <p className="text-[clamp(0.7rem,1.5vw,0.9rem)] font-mono opacity-40 tracking-widest">
          {time.utcOffset}
        </p>
      </div>
    </div>
  );
}
