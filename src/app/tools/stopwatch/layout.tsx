import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Stopwatch - Precise Timer with Lap Support',
  description: 'Free online stopwatch with centisecond precision and lap timing. Track intervals, record split times, and identify your best and worst laps.',
  openGraph: {
    title: 'Online Stopwatch - Precise Timer with Lap Support',
    description: 'Free online stopwatch with centisecond precision and lap timing.',
    type: 'website',
  },
};

export default function StopwatchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
