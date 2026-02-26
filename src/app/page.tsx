'use client';

import { motion } from 'framer-motion';
import ToolCard from '@/components/tools/ToolCard';
import AdSlot from '@/components/layout/AdSlot';

const tools = [
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    name: 'World Clock',
    description: 'View the current time in cities around the globe with live weather data, animated backgrounds, and detailed city information.',
    href: '/tools/world-clock',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    name: 'Timezone Converter',
    description: 'Instantly convert any time between timezones. Perfect for scheduling calls with international colleagues or planning travel.',
    href: '/tools/timezone-converter',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
    name: 'Date Calculator',
    description: 'Calculate the exact number of days, weeks, and months between two dates, or add and subtract days from any date.',
    href: '/tools/date-calculator',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    name: 'Countdown Timer',
    description: 'Create a live countdown to any event -- birthdays, launches, deadlines, or holidays. Share the link with friends and colleagues.',
    href: '/tools/countdown-timer',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h-6M12 3v3" />
      </svg>
    ),
    name: 'Stopwatch',
    description: 'A precise online stopwatch with lap timing. Great for workouts, cooking, presentations, or any activity that needs accurate timing.',
    href: '/tools/stopwatch',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    name: 'Meeting Planner',
    description: 'Find the best meeting time for participants across multiple timezones. Visualize overlapping business hours at a glance.',
    href: '/tools/meeting-planner',
  },
];

const stats = [
  { label: 'Tools Available', value: '6' },
  { label: 'Price', value: 'Free' },
  { label: 'Signup Required', value: 'None' },
  { label: 'Works On', value: 'Any Device' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 -right-1/4 w-[800px] h-[800px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #0073e6, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, #0073e6, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] tracking-tight leading-[1.1]">
              Free Time &amp; Date{' '}
              <span className="text-[var(--color-accent)]">Tools</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[var(--color-secondary)] leading-relaxed max-w-2xl">
              Everything you need to work across time zones. World clock, timezone converter, date calculator, countdown timer, and more -- all free, no signup required.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#tools"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors shadow-sm"
              >
                Explore Tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <a
                href="/tools/world-clock"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-primary)] text-sm font-semibold rounded-lg border border-[var(--color-border)] hover:border-[var(--color-secondary)]/30 hover:bg-gray-50 transition-colors"
              >
                Launch World Clock
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ad slot */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AdSlot className="my-4" />
      </div>

      {/* Tools grid */}
      <section id="tools" className="bg-[var(--color-surface-alt)] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] tracking-tight">
              All the tools you need
            </h2>
            <p className="mt-4 text-lg text-[var(--color-secondary)] max-w-2xl mx-auto">
              Each tool is designed to be fast, accurate, and easy to use. Pick the one you need and get started instantly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <ToolCard key={tool.href} {...tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Ad slot */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AdSlot className="my-4" />
      </div>

      {/* Stats section */}
      <section className="bg-[var(--color-navy)] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-white/50 uppercase tracking-wider font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content section */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6">
              Why Use Online Time Tools?
            </h2>
            <div className="space-y-4 text-[var(--color-secondary)] leading-relaxed">
              <p>
                In an increasingly connected world, managing time across different zones is essential. Whether you are a remote worker coordinating with colleagues in London, Tokyo, and New York, or a traveler planning your next trip, having reliable time tools at your fingertips makes all the difference.
              </p>
              <p>
                TimeTools provides a suite of free, browser-based utilities designed for speed and accuracy. Our world clock lets you track multiple cities simultaneously with live weather data. The timezone converter handles the math of crossing time zone boundaries so you do not have to. Our date calculator makes it easy to figure out exactly how many days until a deadline, while the countdown timer gives you a visual representation of time remaining.
              </p>
              <p>
                Every tool runs entirely in your browser. There is no data sent to external servers, no account to create, and no software to install. Simply open the tool you need and start using it. TimeTools works on desktop, tablet, and mobile -- any device with a modern web browser.
              </p>
              <p>
                For teams that work across borders, our meeting planner is invaluable. Add the timezones of every participant and instantly see which hours overlap with standard business hours. No more accidentally scheduling a 3 AM call for your colleague in Singapore.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom ad slot */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
        <AdSlot />
      </div>
    </main>
  );
}
