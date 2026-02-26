import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'World Clock - Live Time in Cities Worldwide',
  description: 'View the current time in cities around the world with live weather, animated backgrounds, and city information. Add and organize multiple cities.',
  openGraph: {
    title: 'World Clock - Live Time in Cities Worldwide',
    description: 'View the current time in cities around the world with live weather, animated backgrounds, and city information.',
    type: 'website',
  },
};

export default function WorldClockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
