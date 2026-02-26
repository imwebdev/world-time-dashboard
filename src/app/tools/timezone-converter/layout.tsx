import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timezone Converter - Convert Time Between Timezones',
  description: 'Free timezone converter tool. Instantly convert any time between 25+ major timezones worldwide. Accounts for daylight saving time automatically.',
  openGraph: {
    title: 'Timezone Converter - Convert Time Between Timezones',
    description: 'Free timezone converter tool. Instantly convert any time between 25+ major timezones worldwide.',
    type: 'website',
  },
};

export default function TimezoneConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
