'use client';

import { useState, useMemo } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';

function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function calculateDifference(start: Date, end: Date) {
  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const absDays = Math.abs(totalDays);

  const weeks = Math.floor(absDays / 7);
  const remainingDays = absDays % 7;

  // Calculate months and years
  const startDate = totalDays >= 0 ? start : end;
  const endDate = totalDays >= 0 ? end : start;

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    totalDays,
    absDays,
    weeks,
    remainingDays,
    years,
    months,
    days,
    isPast: totalDays < 0,
  };
}

function DateCalculatorTool() {
  const today = new Date();
  const [mode, setMode] = useState<'difference' | 'add'>('difference');
  const [startDate, setStartDate] = useState(formatDateInput(today));
  const [endDate, setEndDate] = useState(formatDateInput(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)));
  const [addDays, setAddDays] = useState(30);
  const [addOperation, setAddOperation] = useState<'add' | 'subtract'>('add');

  const differenceResult = useMemo(() => {
    const s = new Date(startDate + 'T00:00:00');
    const e = new Date(endDate + 'T00:00:00');
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    return calculateDifference(s, e);
  }, [startDate, endDate]);

  const addResult = useMemo(() => {
    const s = new Date(startDate + 'T00:00:00');
    if (isNaN(s.getTime())) return null;
    const daysToAdd = addOperation === 'add' ? addDays : -addDays;
    const result = new Date(s.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return result.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [startDate, addDays, addOperation]);

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-2">
        Date Calculator
      </h1>
      <p className="text-[var(--color-secondary)] mb-8">
        Calculate the difference between dates or add/subtract days.
      </p>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] w-fit mb-8">
        <button
          onClick={() => setMode('difference')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'difference'
              ? 'bg-white text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--color-muted)] hover:text-[var(--color-secondary)]'
          }`}
        >
          Date Difference
        </button>
        <button
          onClick={() => setMode('add')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'add'
              ? 'bg-white text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--color-muted)] hover:text-[var(--color-secondary)]'
          }`}
        >
          Add/Subtract Days
        </button>
      </div>

      {mode === 'difference' ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          {differenceResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)] font-clock">{differenceResult.absDays}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1 font-medium uppercase tracking-wide">Total Days</p>
              </div>
              <div className="p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)] font-clock">{differenceResult.weeks}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1 font-medium uppercase tracking-wide">Weeks</p>
              </div>
              <div className="p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)] font-clock">{differenceResult.months}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1 font-medium uppercase tracking-wide">Months</p>
              </div>
              <div className="p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)] font-clock">{differenceResult.years}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1 font-medium uppercase tracking-wide">Years</p>
              </div>
              <div className="col-span-2 sm:col-span-4 p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-center">
                <p className="text-sm text-[var(--color-secondary)]">
                  {differenceResult.years > 0 && <span>{differenceResult.years} year{differenceResult.years !== 1 ? 's' : ''}, </span>}
                  {differenceResult.months > 0 && <span>{differenceResult.months} month{differenceResult.months !== 1 ? 's' : ''}, </span>}
                  <span>{differenceResult.days} day{differenceResult.days !== 1 ? 's' : ''}</span>
                  {differenceResult.isPast && <span className="text-[var(--color-muted)]"> (end date is before start date)</span>}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">Operation</label>
              <select
                value={addOperation}
                onChange={(e) => setAddOperation(e.target.value as 'add' | 'subtract')}
                className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
              >
                <option value="add">Add days</option>
                <option value="subtract">Subtract days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">Number of Days</label>
              <input
                type="number"
                min={0}
                value={addDays}
                onChange={(e) => setAddDays(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          {addResult && (
            <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl text-center">
              <p className="text-xs text-[var(--color-muted)] mb-1 font-medium uppercase tracking-wide">Result</p>
              <p className="text-xl font-bold text-[var(--color-primary)]">{addResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SeoContent() {
  return (
    <div className="space-y-8">
      <section id="about">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">About the Date Calculator</h2>
        <div className="space-y-4 text-[var(--color-secondary)] leading-relaxed">
          <p>
            The Date Calculator is a versatile tool that helps you work with dates in two ways: finding the exact difference between any two dates, or adding and subtracting a specific number of days from a given date. It is useful for project management, event planning, age calculations, and more.
          </p>
          <p>
            In &quot;Date Difference&quot; mode, the calculator gives you a comprehensive breakdown of the time between two dates. You will see the total number of days, the equivalent in weeks, months, and years, as well as a combined human-readable format like &quot;2 years, 3 months, and 15 days.&quot;
          </p>
          <p>
            In &quot;Add/Subtract Days&quot; mode, you can start from any date and move forward or backward by any number of days. This is particularly helpful for calculating deadlines, determining delivery dates, or figuring out what date falls a certain number of business days in the future.
          </p>
          <p>
            The calculator handles month lengths, leap years, and all calendar irregularities correctly. It uses your browser&apos;s built-in date handling, so all calculations are accurate and instant.
          </p>
        </div>
      </section>

      <section id="how-to">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">How to Use the Date Calculator</h3>
        <ol className="space-y-3 text-[var(--color-secondary)] leading-relaxed list-decimal list-inside">
          <li>Choose your mode: &quot;Date Difference&quot; to compare two dates, or &quot;Add/Subtract Days&quot; to offset from a single date.</li>
          <li>For Date Difference: select a start date and an end date. Results appear automatically.</li>
          <li>For Add/Subtract: pick a start date, choose whether to add or subtract, and enter the number of days.</li>
          <li>All results update in real time as you change inputs.</li>
        </ol>
      </section>

      <section id="faq">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Does the calculator account for leap years?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              Yes. The Date Calculator correctly handles leap years, including the special rules for century years. February 29 is properly accounted for in all date difference and addition calculations.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">Can I calculate business days only?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              The current version calculates calendar days (including weekends and holidays). For business-day calculations, you can use the result as a starting point and manually adjust for weekends and local holidays.
            </div>
          </details>
          <details className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 bg-[var(--color-surface-alt)] hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-[var(--color-primary)]">How far into the past or future can I calculate?</span>
              <svg className="w-4 h-4 text-[var(--color-muted)] faq-chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="px-5 py-4 text-sm text-[var(--color-secondary)] leading-relaxed">
              The calculator supports any date that your browser&apos;s date input allows. Most browsers support dates from the year 0001 to 9999, giving you virtually unlimited range for historical and future calculations.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

export default function DateCalculatorPage() {
  return (
    <ToolPageLayout
      toolName="Date Calculator"
      toolHref="/tools/date-calculator"
      seoContent={<SeoContent />}
    >
      <DateCalculatorTool />
    </ToolPageLayout>
  );
}
