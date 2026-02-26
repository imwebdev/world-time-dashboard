'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import ToolPageLayout from '@/components/tools/ToolPageLayout';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const total = target - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((total % (1000 * 60)) / 1000),
    total,
  };
}

function formatDateTimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getDefaultTarget(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(12, 0, 0, 0);
  return formatDateTimeLocal(d);
}

function getUrlParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

function CountdownTimerTool() {
  const [targetInput, setTargetInput] = useState(() => {
    const fromUrl = getUrlParam('target');
    return fromUrl || getDefaultTarget();
  });
  const [eventName, setEventName] = useState(() => {
    return getUrlParam('event') || '';
  });
  const [isRunning, setIsRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 1 });
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetInputRef = useRef(targetInput);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Keep ref in sync
  useEffect(() => {
    targetInputRef.current = targetInput;
  });

  // Run the countdown via interval, reading the latest target from ref
  useEffect(() => {
    if (!mounted) return;

    const tick = () => {
      const target = new Date(targetInputRef.current);
      const tl = getTimeLeft(target);
      setTimeLeft(tl);
      if (tl.total <= 0) {
        setIsRunning(false);
      }
    };

    tick();

    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isRunning, mounted]);

  const targetDate = new Date(targetInput);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('target', targetInput);
    if (eventName) params.set('event', eventName);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-2">
        Countdown Timer
      </h1>
      <p className="text-[var(--color-secondary)] mb-8">
        Count down to any date and time. Share the link with others.
      </p>

      {/* Settings */}
      <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">Event Name (optional)</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Product Launch"
              className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] placeholder:text-[var(--color-muted)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">Target Date &amp; Time</label>
            <input
              type="datetime-local"
              value={targetInput}
              onChange={(e) => {
                setTargetInput(e.target.value);
                setIsRunning(true);
              }}
              className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            {copied ? 'Link Copied!' : 'Copy Share Link'}
          </button>
        </div>
      </div>

      {/* Countdown display */}
      <div className="bg-white border border-[var(--color-border)] rounded-xl p-8 sm:p-12 shadow-sm text-center">
        {eventName && (
          <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-6">
            {eventName}
          </h2>
        )}

        {timeLeft.total <= 0 ? (
          <div className="py-8">
            <p className="text-4xl font-bold text-[var(--color-accent)]">Time is up!</p>
            <p className="text-[var(--color-secondary)] mt-2">The countdown has reached zero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {units.map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl"
              >
                <p className="text-4xl sm:text-5xl font-bold text-[var(--color-primary)] font-clock">
                  {unit.value.toString().padStart(2, '0')}
                </p>
                <p className="text-xs text-[var(--color-muted)] mt-2 font-medium uppercase tracking-wider">
                  {unit.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-sm text-[var(--color-muted)] mt-6">
          Target: {targetDate.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
        </p>
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="space-y-8">
      <section id="about">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">About the Countdown Timer</h2>
        <div className="space-y-4 text-[var(--color-secondary)] leading-relaxed">
          <p>
            The Countdown Timer is a free online tool that creates a live countdown to any date and time you choose. Whether you are counting down to a product launch, a birthday, New Year&apos;s Eve, a vacation departure, or an important deadline, this tool gives you a clear, animated display of exactly how much time remains.
          </p>
          <p>
            The timer updates every second and shows the remaining time broken down into days, hours, minutes, and seconds. You can optionally name your event for a more personalized display. When the countdown reaches zero, a clear &quot;Time is up!&quot; message appears.
          </p>
          <p>
            One of the most useful features is the share link. After setting up your countdown, click the &quot;Copy Share Link&quot; button to generate a URL that includes your target date and event name. Anyone who opens that link will see the same countdown in their own browser, making it perfect for sharing with teammates, friends, or social media followers.
          </p>
          <p>
            The entire tool runs in your browser with no server-side processing. Your event names and dates are never stored or transmitted anywhere.
          </p>
        </div>
      </section>

      <section id="how-to">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">How to Use the Countdown Timer</h3>
        <ol className="space-y-3 text-[var(--color-secondary)] leading-relaxed list-decimal list-inside">
          <li>Optionally type an event name in the &quot;Event Name&quot; field to label your countdown.</li>
          <li>Select your target date and time using the date/time picker.</li>
          <li>The countdown begins automatically and updates every second.</li>
          <li>To share with others, click &quot;Copy Share Link&quot; and paste the URL anywhere.</li>
          <li>When the countdown reaches zero, the display shows a completion message.</li>
        </ol>
      </section>

      <section id="faq">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Does the countdown keep running if I close the tab?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              The countdown calculates the remaining time based on the current clock, so when you reopen the page (or use the share link), it will show the correct remaining time. There is nothing to &quot;pause&quot; -- it always counts down to the target date in real time.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">What timezone does the countdown use?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              The countdown uses your local timezone. When you set a target time, it is interpreted as a time in your own timezone. Shared links will count down to the same absolute moment in time, though the displayed target time may look different in another timezone.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Can I count down to a past date?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              If you set a target date in the past, the countdown will immediately show &quot;Time is up!&quot; with all values at zero. The timer only counts down, not up.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

export default function CountdownTimerPage() {
  return (
    <ToolPageLayout
      toolName="Countdown Timer"
      toolHref="/tools/countdown-timer"
      seoContent={<SeoContent />}
    >
      <CountdownTimerTool />
    </ToolPageLayout>
  );
}
