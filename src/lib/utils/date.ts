/**
 * Date manipulation utilities for the Movie App.
 *
 * @module date
 */

/**
 * Time intervals in milliseconds for relative date formatting.
 */
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Formats a date as a relative time string (e.g., "2 hours ago", "in 3 days").
 *
 * @param date - The date to format (Date object, timestamp, or ISO string)
 * @param baseDate - The reference date to compare against (default: now)
 * @returns A human-readable relative time string
 *
 * @example
 * ```ts
 * formatDateRelative(new Date(Date.now() - 60000));
 * // => '1 minute ago'
 *
 * formatDateRelative(new Date(Date.now() + 3600000));
 * // => 'in 1 hour'
 *
 * formatDateRelative('2024-01-01', new Date('2024-01-05'));
 * // => '4 days ago'
 * ```
 */
export function formatDateRelative(date: Date | number | string, baseDate: Date = new Date()): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const diff = baseDate.getTime() - dateObj.getTime();
  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;

  const format = (value: number, unit: string): string => {
    const plural = value !== 1 ? 's' : '';
    return isFuture ? `in ${value} ${unit}${plural}` : `${value} ${unit}${plural} ago`;
  };

  if (absDiff < MINUTE) {
    return 'just now';
  }

  if (absDiff < HOUR) {
    const minutes = Math.floor(absDiff / MINUTE);
    return format(minutes, 'minute');
  }

  if (absDiff < DAY) {
    const hours = Math.floor(absDiff / HOUR);
    return format(hours, 'hour');
  }

  if (absDiff < WEEK) {
    const days = Math.floor(absDiff / DAY);
    return format(days, 'day');
  }

  if (absDiff < MONTH) {
    const weeks = Math.floor(absDiff / WEEK);
    return format(weeks, 'week');
  }

  if (absDiff < YEAR) {
    const months = Math.floor(absDiff / MONTH);
    return format(months, 'month');
  }

  const years = Math.floor(absDiff / YEAR);
  return format(years, 'year');
}

/**
 * Checks if a date is today.
 *
 * @param date - The date to check
 * @returns true if the date is today
 *
 * @example
 * ```ts
 * isToday(new Date()); // => true
 * isToday(new Date('2020-01-01')); // => false
 * ```
 */
export function isToday(date: Date | number | string): boolean {
  const dateObj = date instanceof Date ? date : new Date(date);
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is in the past.
 *
 * @param date - The date to check
 * @returns true if the date is in the past
 *
 * @example
 * ```ts
 * isPast(new Date('2020-01-01')); // => true
 * isPast(new Date('2099-01-01')); // => false
 * ```
 */
export function isPast(date: Date | number | string): boolean {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.getTime() < Date.now();
}

/**
 * Gets the number of days between two dates.
 *
 * @param date1 - The first date
 * @param date2 - The second date (default: now)
 * @returns The number of days between the dates (always positive)
 *
 * @example
 * ```ts
 * daysBetween(new Date('2024-01-01'), new Date('2024-01-10')); // => 9
 * daysBetween(new Date('2024-01-10'), new Date('2024-01-01')); // => 9
 * ```
 */
export function daysBetween(date1: Date | number | string, date2: Date | number | string = new Date()): number {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / DAY);
}
