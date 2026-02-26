'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/tools/ToolPageLayout';

interface Lap {
  id: number;
  time: number;
  split: number;
}

function formatTime(ms: number): { minutes: string; seconds: string; centiseconds: string } {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    centiseconds: centiseconds.toString().padStart(2, '0'),
  };
}

function formatTimeString(ms: number): string {
  const t = formatTime(ms);
  return `${t.minutes}:${t.seconds}.${t.centiseconds}`;
}

function StopwatchTool() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const startTimeRef = useRef(0);
  const elapsedRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const updateRef = useRef<() => void>(() => {});
  const elapsedStateRef = useRef(0);

  // Keep a ref of elapsed in sync for use in callbacks
  useEffect(() => {
    elapsedStateRef.current = elapsed;
  });

  // Set up the animation loop function in a ref to avoid self-reference
  useEffect(() => {
    updateRef.current = () => {
      const now = performance.now();
      const total = elapsedRef.current + (now - startTimeRef.current);
      setElapsed(total);
      animFrameRef.current = requestAnimationFrame(() => updateRef.current());
    };
  });

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    animFrameRef.current = requestAnimationFrame(() => updateRef.current());
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    cancelAnimationFrame(animFrameRef.current);
    elapsedRef.current = elapsedStateRef.current;
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    cancelAnimationFrame(animFrameRef.current);
    setElapsed(0);
    elapsedRef.current = 0;
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    setLaps((prev) => {
      const lastLapTime = prev.length > 0 ? prev[0].time : 0;
      const currentElapsed = elapsedStateRef.current;
      return [
        { id: prev.length + 1, time: currentElapsed, split: currentElapsed - lastLapTime },
        ...prev,
      ];
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const time = formatTime(elapsed);

  // Find best and worst laps for highlighting
  const bestLap = laps.length > 1 ? laps.reduce((min, l) => (l.split < min.split ? l : min), laps[0]) : null;
  const worstLap = laps.length > 1 ? laps.reduce((max, l) => (l.split > max.split ? l : max), laps[0]) : null;

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-2">
        Stopwatch
      </h1>
      <p className="text-[var(--color-secondary)] mb-8">
        Precise online stopwatch with lap timing.
      </p>

      <div className="bg-white border border-[var(--color-border)] rounded-xl p-8 sm:p-12 shadow-sm">
        {/* Time display */}
        <div className="text-center mb-10">
          <div className="inline-flex items-baseline font-clock">
            <span className="text-6xl sm:text-8xl font-light text-[var(--color-primary)] tracking-tight">
              {time.minutes}:{time.seconds}
            </span>
            <span className="text-3xl sm:text-4xl font-light text-[var(--color-muted)] ml-1">
              .{time.centiseconds}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {!isRunning ? (
            <>
              <button
                onClick={start}
                className="px-8 py-3.5 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors min-w-[120px]"
              >
                {elapsed > 0 ? 'Resume' : 'Start'}
              </button>
              {elapsed > 0 && (
                <button
                  onClick={reset}
                  className="px-8 py-3.5 bg-[var(--color-surface-alt)] text-[var(--color-secondary)] text-sm font-semibold rounded-lg border border-[var(--color-border)] hover:bg-gray-50 transition-colors min-w-[120px]"
                >
                  Reset
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={stop}
                className="px-8 py-3.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors min-w-[120px]"
              >
                Stop
              </button>
              <button
                onClick={lap}
                className="px-8 py-3.5 bg-[var(--color-surface-alt)] text-[var(--color-secondary)] text-sm font-semibold rounded-lg border border-[var(--color-border)] hover:bg-gray-50 transition-colors min-w-[120px]"
              >
                Lap
              </button>
            </>
          )}
        </div>

        {/* Laps */}
        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-[var(--color-border)] pt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-primary)]">Laps</h3>
                <span className="text-xs text-[var(--color-muted)]">{laps.length} lap{laps.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {laps.map((l) => {
                  const isBest = bestLap?.id === l.id;
                  const isWorst = worstLap?.id === l.id;
                  return (
                    <motion.div
                      key={l.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm ${
                        isBest
                          ? 'bg-green-50 border border-green-100'
                          : isWorst
                          ? 'bg-red-50 border border-red-100'
                          : 'bg-[var(--color-surface-alt)]'
                      }`}
                    >
                      <span className={`font-medium ${isBest ? 'text-green-700' : isWorst ? 'text-red-700' : 'text-[var(--color-secondary)]'}`}>
                        Lap {l.id}
                        {isBest && <span className="ml-2 text-xs text-green-500">Best</span>}
                        {isWorst && <span className="ml-2 text-xs text-red-500">Slowest</span>}
                      </span>
                      <div className="flex items-center gap-6 font-clock">
                        <span className="text-[var(--color-muted)] text-xs">Split: {formatTimeString(l.split)}</span>
                        <span className={`font-medium ${isBest ? 'text-green-700' : isWorst ? 'text-red-700' : 'text-[var(--color-primary)]'}`}>
                          {formatTimeString(l.time)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="space-y-8">
      <section id="about">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">About the Online Stopwatch</h2>
        <div className="space-y-4 text-[var(--color-secondary)] leading-relaxed">
          <p>
            This free online stopwatch provides precise timing with centisecond accuracy. It is designed for anyone who needs to measure elapsed time accurately, whether for athletic training, cooking, presentations, scientific experiments, or everyday tasks.
          </p>
          <p>
            The stopwatch features a clean, distraction-free interface with large, easily readable digits. The display shows minutes, seconds, and centiseconds (hundredths of a second), giving you the precision you need without unnecessary complexity.
          </p>
          <p>
            The lap feature lets you record split times without stopping the main timer. This is essential for runners tracking intervals, swimmers timing individual laps, or anyone monitoring recurring time periods. Laps are automatically analyzed to highlight your fastest (green) and slowest (red) splits, making it easy to spot patterns in your performance.
          </p>
          <p>
            Under the hood, the stopwatch uses the browser&apos;s high-resolution <code>performance.now()</code> API and <code>requestAnimationFrame</code> for smooth, accurate updates. This provides better precision than traditional <code>setInterval</code> approaches and keeps the display perfectly in sync with your screen&apos;s refresh rate.
          </p>
        </div>
      </section>

      <section id="how-to">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">How to Use the Stopwatch</h3>
        <ol className="space-y-3 text-[var(--color-secondary)] leading-relaxed list-decimal list-inside">
          <li>Click &quot;Start&quot; to begin timing. The display begins counting immediately.</li>
          <li>While running, click &quot;Lap&quot; to record a split time without stopping the timer.</li>
          <li>Click &quot;Stop&quot; to pause the timer. You can resume by clicking &quot;Resume.&quot;</li>
          <li>Click &quot;Reset&quot; to clear the timer and all recorded laps.</li>
          <li>Lap times are displayed below the main timer, with the best and worst splits highlighted.</li>
        </ol>
      </section>

      <section id="faq">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">How accurate is this stopwatch?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              The stopwatch uses the browser&apos;s high-resolution timer (<code>performance.now()</code>), which provides sub-millisecond precision. The display updates at your screen&apos;s refresh rate (typically 60fps). Practical accuracy is within a few milliseconds -- more than sufficient for most timing needs.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Will the stopwatch keep running if I switch tabs?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              Yes. The stopwatch tracks elapsed time based on timestamps, not frame counts. If you switch to another tab and come back, the elapsed time will be correct. The visual display may slow down while the tab is in the background, but the time measurement remains accurate.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Can I export my lap times?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              The current version displays laps on screen. You can manually copy the lap data. An export feature for CSV or clipboard is planned for a future update.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Is there a maximum time limit?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              There is no built-in time limit. The stopwatch can run indefinitely, limited only by your browser session. The display will continue showing minutes:seconds.centiseconds format, so for very long durations (over 99 minutes), the minutes portion will simply grow larger.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

export default function StopwatchPage() {
  return (
    <ToolPageLayout
      toolName="Stopwatch"
      toolHref="/tools/stopwatch"
      seoContent={<SeoContent />}
    >
      <StopwatchTool />
    </ToolPageLayout>
  );
}
