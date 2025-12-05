/**
 * Format runtime in minutes to a human-readable string.
 * @example formatRuntime(145) => "2h 25m"
 */
export function formatRuntime(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Format a rating number to 1 decimal place.
 * @example formatRating(8.433) => "8.4"
 */
export function formatRating(rating: number): string {
  if (!Number.isFinite(rating)) return '0.0';
  return rating.toFixed(1);
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable date.
 * @example formatDate("2026-06-20") => "Jun 20, 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format a timestamp in seconds to mm:ss or h:mm:ss.
 * @example formatTimestamp(1935) => "32:15"
 * @example formatTimestamp(3675) => "1:01:15"
 */
export function formatTimestamp(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Extract year from a date string.
 * @example formatYear("2026-06-20") => "2026"
 */
export function formatYear(dateString: string): string {
  if (!dateString || dateString.length < 4) return '';
  return dateString.slice(0, 4);
}

/**
 * Format vote count to human readable.
 * @example formatVoteCount(26280) => "26.3K"
 */
export function formatVoteCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) return '0';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
