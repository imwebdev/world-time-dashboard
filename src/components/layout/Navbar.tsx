'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tools = [
  { name: 'World Clock', href: '/tools/world-clock' },
  { name: 'Timezone Converter', href: '/tools/timezone-converter' },
  { name: 'Date Calculator', href: '/tools/date-calculator' },
  { name: 'Countdown Timer', href: '/tools/countdown-timer' },
  { name: 'Stopwatch', href: '/tools/stopwatch' },
  { name: 'Meeting Planner', href: '/tools/meeting-planner' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide navbar on world clock page (immersive experience)
  if (pathname === '/tools/world-clock') return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center group-hover:bg-[var(--color-accent-hover)] transition-colors">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-[var(--color-primary)] tracking-tight">
              TimeTools
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {tools.slice(0, 4).map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === tool.href
                    ? 'text-[var(--color-accent)] bg-blue-50'
                    : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-gray-50'
                }`}
              >
                {tool.name}
              </Link>
            ))}
            {/* More dropdown */}
            <div className="relative group">
              <button className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-gray-50 transition-colors flex items-center gap-1">
                More
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-[var(--color-border)] rounded-xl shadow-lg shadow-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-1.5">
                {tools.slice(4).map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === tool.href
                        ? 'text-[var(--color-accent)] bg-blue-50'
                        : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-gray-50'
                    }`}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-[var(--color-border)]"
          >
            <div className="px-4 py-3 space-y-1 bg-white">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === tool.href
                      ? 'text-[var(--color-accent)] bg-blue-50'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-gray-50'
                  }`}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
