export function getCityTime(timezone: string): { hours: string; minutes: string; seconds: string; period: string; date: string; utcOffset: string } {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const parts = formatter.formatToParts(now);
  const hours = parts.find(p => p.type === 'hour')?.value || '12';
  const minutes = parts.find(p => p.type === 'minute')?.value || '00';
  const seconds = parts.find(p => p.type === 'second')?.value || '00';
  const period = parts.find(p => p.type === 'dayPeriod')?.value || 'AM';

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const date = dateFormatter.format(now);

  // Calculate UTC offset
  const utcFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
  });
  const offsetPart = utcFormatter.formatToParts(now).find(p => p.type === 'timeZoneName');
  const utcOffset = offsetPart?.value || 'UTC';

  return { hours, minutes, seconds, period, date, utcOffset };
}
