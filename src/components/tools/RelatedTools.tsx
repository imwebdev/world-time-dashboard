import Link from 'next/link';

interface RelatedTool {
  name: string;
  description: string;
  href: string;
  icon: string;
}

const allTools: RelatedTool[] = [
  { name: 'World Clock', description: 'Live time across cities worldwide', href: '/tools/world-clock', icon: '🌍' },
  { name: 'Timezone Converter', description: 'Convert time between any timezones', href: '/tools/timezone-converter', icon: '🔄' },
  { name: 'Date Calculator', description: 'Calculate days between any dates', href: '/tools/date-calculator', icon: '📅' },
  { name: 'Countdown Timer', description: 'Count down to any date and time', href: '/tools/countdown-timer', icon: '⏳' },
  { name: 'Stopwatch', description: 'Precise timing with lap support', href: '/tools/stopwatch', icon: '⏱' },
  { name: 'Meeting Planner', description: 'Find the best meeting time across timezones', href: '/tools/meeting-planner', icon: '🤝' },
];

interface RelatedToolsProps {
  currentHref: string;
}

export default function RelatedTools({ currentHref }: RelatedToolsProps) {
  const related = allTools.filter((tool) => tool.href !== currentHref);

  return (
    <section className="mt-16 pt-12 border-t border-[var(--color-border)]">
      <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-8">
        Related Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-4 p-5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:shadow-sm bg-white transition-all"
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{tool.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-1">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
