/**
 * String manipulation utilities for the Movie App.
 *
 * @module string
 */

/**
 * Truncates a string to a specified length and adds an ellipsis.
 * Preserves word boundaries when possible.
 *
 * @param str - The string to truncate
 * @param maxLength - Maximum length including the ellipsis
 * @param wordBoundary - Whether to break at word boundaries (default: true)
 * @returns The truncated string with ellipsis, or original if shorter than maxLength
 *
 * @example
 * ```ts
 * truncateString('This is a long description', 15);
 * // => 'This is a long...'
 *
 * truncateString('Short', 15);
 * // => 'Short'
 *
 * truncateString('This is a long description', 15, false);
 * // => 'This is a lon...'
 * ```
 */
export function truncateString(str: string, maxLength: number, wordBoundary = true): string {
  if (!str || str.length <= maxLength) {
    return str;
  }

  if (maxLength <= 3) {
    return str.slice(0, maxLength);
  }

  const truncatedLength = maxLength - 3; // Account for '...'

  if (!wordBoundary) {
    return str.slice(0, truncatedLength) + '...';
  }

  // Find the last space within the limit
  const truncated = str.slice(0, truncatedLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > truncatedLength / 2) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize
 * @returns The string with first letter capitalized
 *
 * @example
 * ```ts
 * capitalize('hello'); // => 'Hello'
 * capitalize('WORLD'); // => 'WORLD'
 * capitalize(''); // => ''
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to a URL-friendly slug.
 *
 * @param str - The string to slugify
 * @returns The slugified string
 *
 * @example
 * ```ts
 * slugify('Hello World!'); // => 'hello-world'
 * slugify('Action & Adventure'); // => 'action-adventure'
 * slugify('  Multiple   Spaces  '); // => 'multiple-spaces'
 * ```
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
