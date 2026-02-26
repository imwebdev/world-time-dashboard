import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meeting Planner - Find the Best Time Across Timezones',
  description: 'Free meeting planner for distributed teams. Visualize overlapping business hours across multiple timezones and find the best time for everyone.',
  openGraph: {
    title: 'Meeting Planner - Find the Best Time Across Timezones',
    description: 'Free meeting planner for distributed teams. Visualize overlapping business hours across timezones.',
    type: 'website',
  },
};

export default function MeetingPlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
