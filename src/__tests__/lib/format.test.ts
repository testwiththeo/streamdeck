import {
  formatRuntime,
  formatRating,
  formatDate,
  formatTimestamp,
  formatYear,
  formatVoteCount,
} from '@/lib/utils/format';

describe('formatRuntime', () => {
  it('returns empty string for 0 or negative', () => {
    expect(formatRuntime(0)).toBe('');
    expect(formatRuntime(-10)).toBe('');
  });

  it('formats minutes only', () => {
    expect(formatRuntime(45)).toBe('45m');
  });

  it('formats hours only', () => {
    expect(formatRuntime(120)).toBe('2h');
  });

  it('formats hours and minutes', () => {
    expect(formatRuntime(145)).toBe('2h 25m');
  });
});

describe('formatRating', () => {
  it('formats to 1 decimal place', () => {
    expect(formatRating(8.433)).toBe('8.4');
    expect(formatRating(7)).toBe('7.0');
    expect(formatRating(9.99)).toBe('10.0');
  });
});

describe('formatDate', () => {
  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('formats ISO date string', () => {
    const result = formatDate('2026-06-20');
    expect(result).toContain('2026');
    expect(result).toContain('20');
  });
});

describe('formatTimestamp', () => {
  it('returns 0:00 for negative values', () => {
    expect(formatTimestamp(-1)).toBe('0:00');
  });

  it('formats seconds only', () => {
    expect(formatTimestamp(45)).toBe('0:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatTimestamp(1935)).toBe('32:15');
  });

  it('formats hours, minutes, seconds', () => {
    expect(formatTimestamp(3675)).toBe('1:01:15');
  });

  it('pads minutes and seconds in hour format', () => {
    expect(formatTimestamp(3601)).toBe('1:00:01');
  });
});

describe('formatYear', () => {
  it('returns empty string for empty input', () => {
    expect(formatYear('')).toBe('');
  });

  it('extracts year from date string', () => {
    expect(formatYear('2026-06-20')).toBe('2026');
    expect(formatYear('1999-01-01')).toBe('1999');
  });
});

describe('formatVoteCount', () => {
  it('returns count as string for < 1000', () => {
    expect(formatVoteCount(500)).toBe('500');
    expect(formatVoteCount(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(formatVoteCount(26280)).toBe('26.3K');
    expect(formatVoteCount(1000)).toBe('1.0K');
    expect(formatVoteCount(1500)).toBe('1.5K');
  });
});
