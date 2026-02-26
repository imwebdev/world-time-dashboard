'use client';

import { useState, useMemo } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';

const TIMEZONE_OPTIONS = [
  { label: 'New York (EST/EDT)', value: 'America/New_York' },
  { label: 'Chicago (CST/CDT)', value: 'America/Chicago' },
  { label: 'Denver (MST/MDT)', value: 'America/Denver' },
  { label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Paris (CET/CEST)', value: 'Europe/Paris' },
  { label: 'Berlin (CET/CEST)', value: 'Europe/Berlin' },
  { label: 'Moscow (MSK)', value: 'Europe/Moscow' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Kolkata (IST)', value: 'Asia/Kolkata' },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Shanghai (CST)', value: 'Asia/Shanghai' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Seoul (KST)', value: 'Asia/Seoul' },
  { label: 'Sydney (AEST/AEDT)', value: 'Australia/Sydney' },
  { label: 'Auckland (NZST/NZDT)', value: 'Pacific/Auckland' },
  { label: 'Sao Paulo (BRT)', value: 'America/Sao_Paulo' },
  { label: 'UTC', value: 'UTC' },
];

interface SelectedTimezone {
  id: string;
  timezone: string;
  label: string;
}

function getHourInTimezone(baseHour: number, tz: string): number {
  const refDate = new Date();
  refDate.setUTCHours(baseHour, 0, 0, 0);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    hour12: false,
  });

  const hourStr = formatter.format(refDate);
  let hour = parseInt(hourStr);
  if (hour === 24) hour = 0;
  return hour;
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

function isBusinessHour(hour: number): boolean {
  return hour >= 9 && hour < 17;
}

function MeetingPlannerTool() {
  const [selectedTimezones, setSelectedTimezones] = useState<SelectedTimezone[]>([
    { id: '1', timezone: 'America/New_York', label: 'New York (EST/EDT)' },
    { id: '2', timezone: 'Europe/London', label: 'London (GMT/BST)' },
    { id: '3', timezone: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  ]);
  const [addTz, setAddTz] = useState('');

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const timeGrid = useMemo(() => {
    return hours.map((utcHour) => {
      const cells = selectedTimezones.map((tz) => {
        const localHour = getHourInTimezone(utcHour, tz.timezone);
        return {
          hour: localHour,
          isBusinessHour: isBusinessHour(localHour),
          formatted: formatHour(localHour),
        };
      });
      const allBusiness = cells.every((c) => c.isBusinessHour);
      return { utcHour, cells, allBusiness };
    });
  }, [hours, selectedTimezones]);

  const addTimezone = () => {
    if (!addTz) return;
    const opt = TIMEZONE_OPTIONS.find((o) => o.value === addTz);
    if (!opt) return;
    if (selectedTimezones.some((t) => t.timezone === addTz)) return;
    setSelectedTimezones([
      ...selectedTimezones,
      { id: Date.now().toString(), timezone: opt.value, label: opt.label },
    ]);
    setAddTz('');
  };

  const removeTimezone = (id: string) => {
    if (selectedTimezones.length <= 2) return;
    setSelectedTimezones(selectedTimezones.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-2">
        Meeting Planner
      </h1>
      <p className="text-[var(--color-secondary)] mb-8">
        Find the best meeting time across multiple timezones.
      </p>

      {/* Timezone management */}
      <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-4">Participants&apos; Timezones</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTimezones.map((tz) => (
            <span
              key={tz.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-sm text-[var(--color-primary)]"
            >
              {tz.label}
              {selectedTimezones.length > 2 && (
                <button
                  onClick={() => removeTimezone(tz.id)}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors text-[var(--color-muted)]"
                  aria-label={`Remove ${tz.label}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <select
            value={addTz}
            onChange={(e) => setAddTz(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
          >
            <option value="">Add a timezone...</option>
            {TIMEZONE_OPTIONS.filter((o) => !selectedTimezones.some((s) => s.timezone === o.value)).map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
          <button
            onClick={addTimezone}
            disabled={!addTz}
            className="px-5 py-2.5 bg-[var(--color-accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
          <span className="text-xs text-[var(--color-secondary)]">Business hours (9 AM - 5 PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/20 border border-green-400" />
          <span className="text-xs text-[var(--color-secondary)]">All in business hours</span>
        </div>
      </div>

      {/* Time grid */}
      <div className="bg-white border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap sticky left-0 bg-[var(--color-surface-alt)] z-10">
                  UTC
                </th>
                {selectedTimezones.map((tz) => (
                  <th key={tz.id} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">
                    {tz.label.split(' (')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeGrid.map((row) => (
                <tr
                  key={row.utcHour}
                  className={`border-b border-[var(--color-border-light)] last:border-b-0 ${
                    row.allBusiness ? 'bg-green-50/60' : ''
                  }`}
                >
                  <td className={`px-4 py-2.5 font-mono text-xs whitespace-nowrap sticky left-0 z-10 ${
                    row.allBusiness ? 'bg-green-50/60 font-semibold text-green-700' : 'bg-white text-[var(--color-secondary)]'
                  }`}>
                    {formatHour(row.utcHour)}
                    {row.allBusiness && (
                      <span className="ml-2 text-green-500">*</span>
                    )}
                  </td>
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-2.5 font-mono text-xs whitespace-nowrap ${
                        cell.isBusinessHour
                          ? 'bg-green-50 text-green-800 font-medium'
                          : cell.hour >= 22 || cell.hour < 6
                          ? 'text-[var(--color-muted)]/60 bg-gray-50/50'
                          : 'text-[var(--color-secondary)]'
                      }`}
                    >
                      {cell.formatted}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="space-y-8">
      <section id="about">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">About the Meeting Planner</h2>
        <div className="space-y-4 text-[var(--color-secondary)] leading-relaxed">
          <p>
            The Meeting Planner is a free tool designed for distributed teams and international collaborators. It helps you find the best time for a meeting when participants are spread across different timezones. Instead of manually calculating time differences, the planner displays a visual grid showing what time it is in each timezone for every hour of the day.
          </p>
          <p>
            Business hours (9 AM to 5 PM) are highlighted in green for each timezone. When a particular UTC hour falls within business hours for all participants, the entire row is highlighted, making it immediately obvious which times work for everyone. This visual approach eliminates the confusion and errors that come with manual timezone math.
          </p>
          <p>
            You can add as many timezones as you need. The tool supports all major global timezones including North America, Europe, Asia, the Middle East, Africa, and Oceania. Timezones can be removed just as easily -- simply click the X button on any timezone pill.
          </p>
          <p>
            The Meeting Planner is especially valuable for companies with remote workers across the globe, freelancers working with international clients, and anyone who regularly coordinates across time zone boundaries. It removes the guesswork from scheduling and helps ensure that meeting times are respectful of everyone&apos;s working hours.
          </p>
        </div>
      </section>

      <section id="how-to">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">How to Use the Meeting Planner</h3>
        <ol className="space-y-3 text-[var(--color-secondary)] leading-relaxed list-decimal list-inside">
          <li>Start with the default timezones or remove them and add your own using the dropdown.</li>
          <li>Add each participant&apos;s timezone by selecting it from the dropdown and clicking &quot;Add.&quot;</li>
          <li>Look at the time grid below. Green-shaded cells indicate business hours (9 AM - 5 PM).</li>
          <li>Rows where all timezones are in green are the ideal meeting times -- they fall within business hours for everyone.</li>
          <li>Rows marked with a star (*) in the UTC column indicate that all participants are in business hours.</li>
          <li>To remove a timezone, click the X on its pill badge above the grid.</li>
        </ol>
      </section>

      <section id="faq">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">What counts as &quot;business hours&quot;?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              Business hours are defined as 9:00 AM to 5:00 PM (9:00-17:00) in each respective timezone. This is a standard international convention, though actual working hours may vary by company or culture.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Does this account for daylight saving time?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              Yes. The tool uses the IANA timezone database (via your browser&apos;s Intl API), which includes all current daylight saving time rules. The grid reflects the actual offsets in effect today.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">What if there is no overlapping business hour?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              When participants are in timezones that are very far apart (for example, New York and Tokyo), there may be no hour where all participants are in standard business hours. In that case, no rows will be fully highlighted. Look for times where most participants are in business hours, or consider alternative arrangements like rotating meeting times.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">How many timezones can I add?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              You can add as many timezones as are available in the dropdown (currently 19 major timezones). The grid scrolls horizontally on smaller screens to accommodate multiple columns. A minimum of 2 timezones is required.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

export default function MeetingPlannerPage() {
  return (
    <ToolPageLayout
      toolName="Meeting Planner"
      toolHref="/tools/meeting-planner"
      seoContent={<SeoContent />}
    >
      <MeetingPlannerTool />
    </ToolPageLayout>
  );
}
