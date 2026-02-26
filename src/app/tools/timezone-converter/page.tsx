'use client';

import { useState, useMemo } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'New York (EST/EDT)', value: 'America/New_York' },
  { label: 'Chicago (CST/CDT)', value: 'America/Chicago' },
  { label: 'Denver (MST/MDT)', value: 'America/Denver' },
  { label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles' },
  { label: 'Anchorage (AKST/AKDT)', value: 'America/Anchorage' },
  { label: 'Honolulu (HST)', value: 'Pacific/Honolulu' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Paris (CET/CEST)', value: 'Europe/Paris' },
  { label: 'Berlin (CET/CEST)', value: 'Europe/Berlin' },
  { label: 'Moscow (MSK)', value: 'Europe/Moscow' },
  { label: 'Istanbul (TRT)', value: 'Europe/Istanbul' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Kolkata (IST)', value: 'Asia/Kolkata' },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong' },
  { label: 'Shanghai (CST)', value: 'Asia/Shanghai' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Seoul (KST)', value: 'Asia/Seoul' },
  { label: 'Sydney (AEST/AEDT)', value: 'Australia/Sydney' },
  { label: 'Auckland (NZST/NZDT)', value: 'Pacific/Auckland' },
  { label: 'Sao Paulo (BRT)', value: 'America/Sao_Paulo' },
  { label: 'Buenos Aires (ART)', value: 'America/Argentina/Buenos_Aires' },
  { label: 'Cairo (EET)', value: 'Africa/Cairo' },
  { label: 'Lagos (WAT)', value: 'Africa/Lagos' },
  { label: 'Nairobi (EAT)', value: 'Africa/Nairobi' },
  { label: 'Johannesburg (SAST)', value: 'Africa/Johannesburg' },
];

function convertTime(hours: number, minutes: number, fromTz: string, toTz: string): { hours: string; minutes: string; period: string; date: string } {
  const baseDate = new Date();
  baseDate.setHours(hours, minutes, 0, 0);

  // Get current offset difference
  const fromOffset = getTimezoneOffsetMinutes(fromTz);
  const toOffset = getTimezoneOffsetMinutes(toTz);
  const offsetDiff = toOffset - fromOffset;

  const convertedDate = new Date(baseDate.getTime() + offsetDiff * 60 * 1000);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const parts = formatter.formatToParts(convertedDate);
  const h = parts.find(p => p.type === 'hour')?.value || '12';
  const m = parts.find(p => p.type === 'minute')?.value || '00';
  const period = parts.find(p => p.type === 'dayPeriod')?.value || 'AM';

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return {
    hours: h,
    minutes: m,
    period,
    date: dateFormatter.format(convertedDate),
  };
}

function getTimezoneOffsetMinutes(tz: string): number {
  const now = new Date();
  const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = now.toLocaleString('en-US', { timeZone: tz });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / (60 * 1000);
}

function TimezoneConverterTool() {
  const [fromTz, setFromTz] = useState('America/New_York');
  const [toTz, setToTz] = useState('Europe/London');
  const [inputTime, setInputTime] = useState('09:00');

  const result = useMemo(() => {
    const [h, m] = inputTime.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      return convertTime(h, m, fromTz, toTz);
    }
    return null;
  }, [inputTime, fromTz, toTz]);

  const swapTimezones = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-2">
        Timezone Converter
      </h1>
      <p className="text-[var(--color-secondary)] mb-8">
        Convert any time between timezones instantly.
      </p>

      <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">From</label>
            <select
              value={fromTz}
              onChange={(e) => setFromTz(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
            <div className="mt-3">
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">Time</label>
              <input
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center md:pb-3">
            <button
              onClick={swapTimezones}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors"
              aria-label="Swap timezones"
            >
              <svg className="w-5 h-5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">To</label>
            <select
              value={toTz}
              onChange={(e) => setToTz(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
            {/* Result */}
            {result && (
              <div className="mt-3 px-4 py-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-[var(--color-muted)] mb-1 font-medium uppercase tracking-wide">Converted Time</p>
                <p className="text-2xl font-bold text-[var(--color-primary)] font-clock">
                  {result.hours}:{result.minutes} <span className="text-lg font-medium text-[var(--color-secondary)]">{result.period}</span>
                </p>
                <p className="text-sm text-[var(--color-secondary)] mt-1">{result.date}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="space-y-8">
      <section id="about">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">About the Timezone Converter</h2>
        <div className="space-y-4 text-[var(--color-secondary)] leading-relaxed">
          <p>
            The Timezone Converter is a free online tool that instantly converts any time between different timezones around the world. Whether you need to schedule a call with a colleague in another country, check business hours in a different city, or plan travel across multiple time zones, this tool does the math for you.
          </p>
          <p>
            Our converter supports over 25 major timezones covering every inhabited continent. It automatically accounts for daylight saving time (DST) transitions, so you always get accurate results regardless of the time of year.
          </p>
          <p>
            Unlike many timezone converters, this tool runs entirely in your browser using JavaScript&apos;s built-in Intl API. No data is sent to any server, making it fast, private, and reliable even without an internet connection after the initial page load.
          </p>
        </div>
      </section>

      <section id="how-to">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">How to Use the Timezone Converter</h3>
        <ol className="space-y-3 text-[var(--color-secondary)] leading-relaxed list-decimal list-inside">
          <li>Select the source timezone from the &quot;From&quot; dropdown menu.</li>
          <li>Enter the time you want to convert using the time input field.</li>
          <li>Select the target timezone from the &quot;To&quot; dropdown menu.</li>
          <li>The converted time appears instantly in the result box, including the day of the week.</li>
          <li>Use the swap button (arrows icon) to quickly reverse the conversion direction.</li>
        </ol>
      </section>

      <section id="faq">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Does this tool handle daylight saving time?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              Yes. The converter uses your browser&apos;s built-in timezone database (IANA Time Zone Database), which includes all daylight saving time rules. Results are always adjusted for the current DST status of each timezone.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Can I convert times for a future date?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              The current version converts times based on today&apos;s date and DST rules. For future-date conversions where DST status may differ, the result shows what the conversion would be using today&apos;s offsets.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">What timezones are supported?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              We support over 25 commonly used timezones covering North America, South America, Europe, Africa, Asia, and Oceania. This includes all major business centers like New York, London, Tokyo, Sydney, Dubai, and Singapore.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Is my data sent to any server?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              No. All conversions happen entirely in your browser. No time data, timezone selections, or any other information is transmitted to our servers or any third party.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

export default function TimezoneConverterPage() {
  return (
    <ToolPageLayout
      toolName="Timezone Converter"
      toolHref="/tools/timezone-converter"
      seoContent={<SeoContent />}
    >
      <TimezoneConverterTool />
    </ToolPageLayout>
  );
}
