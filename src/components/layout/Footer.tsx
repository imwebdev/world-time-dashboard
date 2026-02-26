'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const toolLinks = [
  { name: 'World Clock', href: '/tools/world-clock' },
  { name: 'Timezone Converter', href: '/tools/timezone-converter' },
  { name: 'Date Calculator', href: '/tools/date-calculator' },
  { name: 'Countdown Timer', href: '/tools/countdown-timer' },
  { name: 'Stopwatch', href: '/tools/stopwatch' },
  { name: 'Meeting Planner', href: '/tools/meeting-planner' },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on world clock page (immersive experience)
  if (pathname === '/tools/world-clock') return null;

  return (
    <footer className="bg-[var(--color-navy)] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">TimeTools</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Free, fast, and reliable time and date tools. No signup required, works on any device.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">About</h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-white/50">Built with precision for teams, travelers, and anyone who works across time zones.</span>
              </li>
              <li className="pt-2">
                <span className="text-sm text-white/40">All tools run entirely in your browser. No data is sent to servers.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} TimeTools. All rights reserved.
          </p>
          <p className="text-sm text-white/30">
            Free time and date tools for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
}
