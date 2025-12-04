/**
 * Type guard utilities for runtime type checking.
 *
 * @module typeGuards
 */

import type { MediaItem, MediaType } from '@/lib/types/app.types';

/**
 * Checks if a value is a valid MediaType.
 *
 * @param value - The value to check
 * @returns true if the value is a valid MediaType
 *
 * @example
 * ```ts
 * isMediaType('movie'); // => true
 * isMediaType('anime'); // => true
 * isMediaType('invalid'); // => false
 * ```
 */
export function isMediaType(value: unknown): value is MediaType {
  return typeof value === 'string' && ['movie', 'tv', 'anime'].includes(value);
}

/**
 * Checks if a value is a non-null object.
 *
 * @param value - The value to check
 * @returns true if the value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Checks if a value is a non-empty string.
 *
 * @param value - The value to check
 * @returns true if the value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Checks if a MediaItem is a movie.
 *
 * @param item - The media item to check
 * @returns true if the item is a movie
 */
export function isMovie(item: MediaItem): boolean {
  return item.type === 'movie';
}

/**
 * Checks if a MediaItem is a TV show.
 *
 * @param item - The media item to check
 * @returns true if the item is a TV show
 */
export function isTVShow(item: MediaItem): boolean {
  return item.type === 'tv';
}

/**
 * Checks if a MediaItem is an anime.
 *
 * @param item - The media item to check
 * @returns true if the item is an anime
 */
export function isAnime(item: MediaItem): boolean {
  return item.type === 'anime';
}

/**
 * Narrows a value to a specific type using a predicate.
 * Useful for filtering arrays with type safety.
 *
 * @template T - The expected type
 * @param predicate - Type guard function
 * @returns A filter function that narrows to type T
 *
 * @example
 * ```ts
 * const items = [1, null, 2, undefined, 3];
 * const numbers = items.filter(isDefined<number>);
 * // numbers: number[]
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
