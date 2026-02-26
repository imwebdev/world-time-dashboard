import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Countdown Timer - Count Down to Any Date',
  description: 'Free online countdown timer. Create a live countdown to any event, deadline, or special date. Share the countdown link with friends and colleagues.',
  openGraph: {
    title: 'Countdown Timer - Count Down to Any Date',
    description: 'Free online countdown timer. Create a live countdown to any event and share it with others.',
    type: 'website',
  },
};

export default function CountdownTimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
