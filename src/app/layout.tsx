import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'TimeTools - Free Time & Date Tools',
    template: '%s | TimeTools',
  },
  description: 'Free online time and date tools: world clock, timezone converter, date calculator, countdown timer, stopwatch, and meeting planner. No signup required.',
  openGraph: {
    title: 'TimeTools - Free Time & Date Tools',
    description: 'Free online time and date tools for teams, travelers, and remote workers. World clock, timezone converter, date calculator, and more.',
    type: 'website',
    siteName: 'TimeTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeTools - Free Time & Date Tools',
    description: 'Free online time and date tools for teams, travelers, and remote workers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
