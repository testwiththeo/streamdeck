/**
 * Utility functions index.
 * Re-exports all utility functions for convenient imports.
 *
 * @module utils
 */

export { cn } from './cn';
export { debounce } from './debounce';
export { getFromStorage, setToStorage, removeFromStorage } from './storage';
export {
  formatRuntime,
  formatRating,
  formatDate,
  formatTimestamp,
  formatYear,
  formatVoteCount,
} from './format';
export { truncateString, capitalize, slugify } from './string';
export { clamp, lerp, mapRange, roundTo } from './number';
export { formatDateRelative, isToday, isPast, daysBetween } from './date';
export {
  isMediaType,
  isObject,
  isNonEmptyString,
  isMovie,
  isTVShow,
  isAnime,
  isDefined,
} from './typeGuards';
