/**
 * TMDB API client for fetching movie and TV data.
 * Uses server-side caching with Next.js ISR (1 hour revalidation).
 *
 * @module tmdb
 * @see https://developer.themoviedb.org/reference
 */

import { TMDB_CONFIG } from '@/lib/constants/defaults';
import type {
  TMDBPaginatedResponse,
  TMDBMovieResult,
  TMDBMovieDetail,
  TMDBTVResult,
  TMDBTVDetail,
  TMDBTrendingResult,
  TMDBSearchResult,
  TMDBGenresResponse,
  TMDBCredits,
  TMDBVideosResponse,
  TMDBSeasonDetail,
} from '@/lib/types/tmdb.types';

const { BASE_URL, API_KEY } = TMDB_CONFIG;

/**
 * Generic fetch wrapper for TMDB API with error handling.
 * @template T - Expected response type
 * @param endpoint - API endpoint path (e.g., '/movie/123')
 * @param params - Additional query parameters
 */
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ status_message: 'Unknown error' }));
    throw new Error(`TMDB API Error (${res.status}): ${error.status_message || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ============================================================================
// Trending
// ============================================================================

/**
 * Fetches trending movies, TV shows, or all media.
 * @param type - Media type to fetch ('movie', 'tv', or 'all')
 * @param timeWindow - Time window for trending ('day' or 'week')
 * @returns Paginated list of trending items
 * @example
 * ```ts
 * const weekly = await getTrending('all', 'week');
 * const dailyMovies = await getTrending('movie', 'day');
 * ```
 */
export async function getTrending(
  type: 'movie' | 'tv' | 'all' = 'all',
  timeWindow: 'day' | 'week' = 'week'
): Promise<TMDBPaginatedResponse<TMDBTrendingResult>> {
  return tmdbFetch(`/trending/${type}/${timeWindow}`);
}

// ============================================================================
// Search
// ============================================================================

/**
 * Searches across movies, TV shows, and people.
 * @param query - Search query string
 * @param page - Page number for pagination
 * @returns Paginated search results
 * @example
 * ```ts
 * const results = await searchMulti('star wars', 1);
 * ```
 */
export async function searchMulti(
  query: string,
  page = 1
): Promise<TMDBPaginatedResponse<TMDBSearchResult>> {
  return tmdbFetch('/search/multi', { query, page: String(page), include_adult: 'false' });
}

// ============================================================================
// Movies
// ============================================================================

/**
 * Fetches detailed information about a movie.
 * @param id - TMDB movie ID
 * @returns Complete movie details including genres, runtime, budget, etc.
 * @example
 * ```ts
 * const movie = await getMovie(550); // Fight Club
 * ```
 */
export async function getMovie(id: number): Promise<TMDBMovieDetail> {
  return tmdbFetch(`/movie/${id}`);
}

/**
 * Fetches cast and crew credits for a movie.
 * @param id - TMDB movie ID
 * @returns Credits object with cast and crew arrays
 */
export async function getMovieCredits(id: number): Promise<TMDBCredits> {
  return tmdbFetch(`/movie/${id}/credits`);
}

/**
 * Fetches videos (trailers, teasers) for a movie.
 * @param id - TMDB movie ID
 * @returns Videos response with YouTube/Vimeo links
 */
export async function getMovieVideos(id: number): Promise<TMDBVideosResponse> {
  return tmdbFetch(`/movie/${id}/videos`);
}

/**
 * Fetches similar movies to the given movie.
 * @param id - TMDB movie ID
 * @returns Paginated list of similar movies
 */
export async function getMovieSimilar(
  id: number
): Promise<TMDBPaginatedResponse<TMDBMovieResult>> {
  return tmdbFetch(`/movie/${id}/similar`);
}

// ============================================================================
// TV Shows
// ============================================================================

/**
 * Fetches detailed information about a TV show.
 * @param id - TMDB TV show ID
 * @returns Complete TV show details including seasons, networks, etc.
 * @example
 * ```ts
 * const show = await getTVShow(1396); // Breaking Bad
 * ```
 */
export async function getTVShow(id: number): Promise<TMDBTVDetail> {
  return tmdbFetch(`/tv/${id}`);
}

/**
 * Fetches cast and crew credits for a TV show.
 * @param id - TMDB TV show ID
 * @returns Credits object with cast and crew arrays
 */
export async function getTVCredits(id: number): Promise<TMDBCredits> {
  return tmdbFetch(`/tv/${id}/credits`);
}

/**
 * Fetches videos (trailers, teasers) for a TV show.
 * @param id - TMDB TV show ID
 * @returns Videos response with YouTube/Vimeo links
 */
export async function getTVVideos(id: number): Promise<TMDBVideosResponse> {
  return tmdbFetch(`/tv/${id}/videos`);
}

/**
 * Fetches similar TV shows to the given show.
 * @param id - TMDB TV show ID
 * @returns Paginated list of similar TV shows
 */
export async function getTVSimilar(
  id: number
): Promise<TMDBPaginatedResponse<TMDBTVResult>> {
  return tmdbFetch(`/tv/${id}/similar`);
}

/**
 * Fetches detailed information about a specific season of a TV show.
 * @param id - TMDB TV show ID
 * @param seasonNumber - Season number (0 for specials)
 * @returns Season details with episode list
 * @example
 * ```ts
 * const season1 = await getTVSeason(1396, 1); // Breaking Bad Season 1
 * ```
 */
export async function getTVSeason(id: number, seasonNumber: number): Promise<TMDBSeasonDetail> {
  return tmdbFetch(`/tv/${id}/season/${seasonNumber}`);
}

// ============================================================================
// Genres
// ============================================================================

/**
 * Fetches all movie genres.
 * @returns List of movie genres with IDs and names
 * @example
 * ```ts
 * const { genres } = await getMovieGenres();
 * // [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, ...]
 * ```
 */
export async function getMovieGenres(): Promise<TMDBGenresResponse> {
  return tmdbFetch('/genre/movie/list');
}

/**
 * Fetches all TV show genres.
 * @returns List of TV genres with IDs and names
 */
export async function getTVGenres(): Promise<TMDBGenresResponse> {
  return tmdbFetch('/genre/tv/list');
}

// ============================================================================
// Discover
// ============================================================================

/**
 * Discovers movies by genre, sorted by popularity.
 * @param genreId - TMDB genre ID to filter by
 * @param page - Page number for pagination
 * @returns Paginated list of movies in the specified genre
 * @example
 * ```ts
 * const actionMovies = await discoverMovies(28, 1); // Action genre
 * ```
 */
export async function discoverMovies(
  genreId: number,
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovieResult>> {
  return tmdbFetch('/discover/movie', {
    with_genres: String(genreId),
    page: String(page),
    sort_by: 'popularity.desc',
  });
}

/**
 * Discovers TV shows by genre, sorted by popularity.
 * @param genreId - TMDB genre ID to filter by
 * @param page - Page number for pagination
 * @returns Paginated list of TV shows in the specified genre
 */
export async function discoverTV(
  genreId: number,
  page = 1
): Promise<TMDBPaginatedResponse<TMDBTVResult>> {
  return tmdbFetch('/discover/tv', {
    with_genres: String(genreId),
    page: String(page),
    sort_by: 'popularity.desc',
  });
}

// ============================================================================
// Popular / Top Rated
// ============================================================================

/**
 * Fetches popular movies, sorted by popularity.
 * @param page - Page number for pagination
 * @returns Paginated list of popular movies
 */
export async function getPopularMovies(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovieResult>> {
  return tmdbFetch('/movie/popular', { page: String(page) });
}

/**
 * Fetches popular TV shows, sorted by popularity.
 * @param page - Page number for pagination
 * @returns Paginated list of popular TV shows
 */
export async function getPopularTV(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBTVResult>> {
  return tmdbFetch('/tv/popular', { page: String(page) });
}

/**
 * Fetches top-rated movies.
 * @param page - Page number for pagination
 * @returns Paginated list of top-rated movies
 */
export async function getTopRatedMovies(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovieResult>> {
  return tmdbFetch('/movie/top_rated', { page: String(page) });
}

/**
 * Fetches top-rated TV shows.
 * @param page - Page number for pagination
 * @returns Paginated list of top-rated TV shows
 */
export async function getTopRatedTV(
  page = 1
): Promise<TMDBPaginatedResponse<TMDBTVResult>> {
  return tmdbFetch('/tv/top_rated', { page: String(page) });
}

// ============================================================================
// Image URL Helper
// ============================================================================

/**
 * Builds a complete TMDB image URL from a path.
 * Returns a placeholder image if the path is null.
 * @param path - Image path from TMDB (e.g., '/abc123.jpg')
 * @param size - Image size preset (default: 'w342')
 * @returns Complete image URL or placeholder
 * @example
 * ```ts
 * const url = getImageUrl('/abc123.jpg', 'w500');
 * // => 'https://image.tmdb.org/t/p/w500/abc123.jpg'
 *
 * const fallback = getImageUrl(null);
 * // => '/placeholder-poster.jpg'
 * ```
 */
export function getImageUrl(path: string | null, size: string = 'w342'): string {
  if (!path) return '/placeholder-poster.jpg';
  return `${TMDB_CONFIG.IMAGE_BASE}/${size}${path}`;
}
