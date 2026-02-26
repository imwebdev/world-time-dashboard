import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Date Calculator - Days Between Dates & Add/Subtract Days',
  description: 'Free date calculator. Find the exact number of days, weeks, months, and years between two dates, or add and subtract days from any date.',
  openGraph: {
    title: 'Date Calculator - Days Between Dates & Add/Subtract Days',
    description: 'Free date calculator. Find the exact number of days, weeks, months, and years between two dates.',
    type: 'website',
  },
};

export default function DateCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
