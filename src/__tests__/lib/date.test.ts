import { formatDateRelative, isToday, isPast, daysBetween } from '@/lib/utils/date';

describe('date utilities', () => {
  describe('formatDateRelative', () => {
    it('returns "just now" for recent dates', () => {
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30000);
      expect(formatDateRelative(thirtySecondsAgo, now)).toBe('just now');
    });

    it('formats minutes ago', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      expect(formatDateRelative(fiveMinutesAgo, now)).toBe('5 minutes ago');
    });

    it('formats singular minute', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      expect(formatDateRelative(oneMinuteAgo, now)).toBe('1 minute ago');
    });

    it('formats hours ago', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      expect(formatDateRelative(twoHoursAgo, now)).toBe('2 hours ago');
    });

    it('formats days ago', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(formatDateRelative(threeDaysAgo, now)).toBe('3 days ago');
    });

    it('formats weeks ago', () => {
      const now = new Date();
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      expect(formatDateRelative(twoWeeksAgo, now)).toBe('2 weeks ago');
    });

    it('formats future dates', () => {
      const now = new Date();
      const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      expect(formatDateRelative(inTwoHours, now)).toBe('in 2 hours');
    });

    it('handles string dates', () => {
      const baseDate = new Date('2024-06-15');
      expect(formatDateRelative('2024-06-10', baseDate)).toBe('5 days ago');
    });

    it('handles timestamp numbers', () => {
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;
      expect(formatDateRelative(oneHourAgo, new Date(now))).toBe('1 hour ago');
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('returns false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });

    it('handles string dates', () => {
      const todayStr = new Date().toISOString().split('T')[0];
      expect(isToday(todayStr)).toBe(true);
    });
  });

  describe('isPast', () => {
    it('returns true for past dates', () => {
      expect(isPast(new Date('2020-01-01'))).toBe(true);
    });

    it('returns false for future dates', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(isPast(future)).toBe(false);
    });

    it('handles string dates', () => {
      expect(isPast('2020-01-01')).toBe(true);
    });
  });

  describe('daysBetween', () => {
    it('calculates days between dates', () => {
      const d1 = new Date('2024-01-01');
      const d2 = new Date('2024-01-10');
      expect(daysBetween(d1, d2)).toBe(9);
    });

    it('returns positive value regardless of order', () => {
      const d1 = new Date('2024-01-10');
      const d2 = new Date('2024-01-01');
      expect(daysBetween(d1, d2)).toBe(9);
    });

    it('returns 0 for same day', () => {
      const date = new Date('2024-01-01');
      expect(daysBetween(date, date)).toBe(0);
    });

    it('handles string dates', () => {
      expect(daysBetween('2024-01-01', '2024-01-05')).toBe(4);
    });
  });
});
