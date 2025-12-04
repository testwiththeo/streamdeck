/**
 * TMDB genre constants for movies and TV shows.
 * Genre IDs are stable across the TMDB API.
 *
 * @module genres
 * @see https://developer.themoviedb.org/reference/genre-movie-list
 */

/**
 * TMDB movie genre IDs mapped to their display names.
 */
export const MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

/**
 * TMDB TV show genre IDs mapped to their display names.
 */
export const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
};

/**
 * Combined genres from both movies and TV shows.
 * Note: Some IDs appear in both with different names (e.g., 16 Animation).
 */
export const ALL_GENRES: Record<number, string> = {
  ...MOVIE_GENRES,
  ...TV_GENRES,
};

/**
 * Gets the display name for a genre ID.
 *
 * @param id - TMDB genre ID
 * @returns The genre name or 'Unknown' if not found
 *
 * @example
 * ```ts
 * getGenreName(28); // => 'Action'
 * getGenreName(35); // => 'Comedy'
 * getGenreName(999); // => 'Unknown'
 * ```
 */
export function getGenreName(id: number): string {
  return ALL_GENRES[id] ?? 'Unknown';
}

/**
 * Gets multiple genre names as a formatted string.
 *
 * @param ids - Array of TMDB genre IDs
 * @param separator - Separator between genre names (default: ', ')
 * @returns Formatted string of genre names
 *
 * @example
 * ```ts
 * getGenreNames([28, 12, 878]); // => 'Action, Adventure, Sci-Fi'
 * getGenreNames([28, 12], ' | '); // => 'Action | Adventure'
 * ```
 */
export function getGenreNames(ids: number[], separator = ', '): string {
  return ids.map(getGenreName).join(separator);
}
