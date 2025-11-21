/**
 * MyAnimeList API client for fetching anime data.
 * Uses server-side caching with Next.js ISR (1 hour revalidation).
 *
 * @module mal
 * @see https://myanimelist.net/apiconfig/references/api/v2
 */

import { MAL_CONFIG } from '@/lib/constants/defaults';

/**
 * Detailed anime information from MyAnimeList.
 */
interface MALAnimeDetail {
  /** MyAnimeList anime ID */
  id: number;
  /** Anime title */
  title: string;
  /** Poster images in different sizes */
  main_picture: { large: string; medium: string } | null;
  /** Anime synopsis/description */
  synopsis: string;
  /** Mean user rating (0-10) */
  mean: number;
  /** Global rank */
  rank: number;
  /** Popularity rank */
  popularity: number;
  /** Total number of episodes */
  num_episodes: number;
  /** Airing status (e.g., 'currently_airing', 'finished_airing') */
  status: string;
  /** List of genres */
  genres: Array<{ id: number; name: string }>;
  /** Media type (e.g., 'tv', 'movie', 'ova') */
  media_type: string;
  /** Animation studios */
  studios: Array<{ id: number; name: string }>;
  /** Starting season information */
  start_season: { year: number; season: string } | null;
  /** Average episode duration in seconds */
  average_episode_duration: number;
  /** Content rating (e.g., 'pg_13', 'r') */
  rating: string;
  /** Related anime entries */
  related_anime: Array<{
    node: { id: number; title: string };
    relation_type_formatted: string;
  }>;
  /** Recommended similar anime */
  recommendation: Array<{
    node: { id: number; title: string; main_picture: { large: string; medium: string } | null };
    num_recommendations: number;
  }>;
}

/**
 * Episode information from MyAnimeList.
 */
interface MALEpisode {
  /** Episode number/ID */
  id: number;
  /** Episode title */
  title: string;
  /** Episode synopsis */
  synopsis: string;
  /** Air date (ISO format) or null if not yet aired */
  aired: string | null;
}

/**
 * Response structure for episode list queries.
 */
interface MALEpisodesResponse {
  /** List of episodes with node wrapper */
  data: Array<{ node: MALEpisode }>;
  /** Pagination information */
  paging: { next?: string };
}

/**
 * Fields to request from the MAL API for anime details.
 * Comma-separated list of field names.
 */
const ANIME_FIELDS =
  'id,title,main_picture,synopsis,mean,rank,popularity,num_episodes,status,genres,media_type,studios,start_season,average_episode_duration,rating,related_anime,recommendation';

/**
 * Generic fetch wrapper for MyAnimeList API with error handling.
 * @template T - Expected response type
 * @param endpoint - API endpoint path (e.g., '/anime/1')
 * @param params - Additional query parameters
 */
async function malFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${MAL_CONFIG.BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    headers: { 'X-MAL-CLIENT-ID': MAL_CONFIG.CLIENT_ID },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`MAL API Error (${res.status}): ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Fetches detailed information about an anime.
 * @param id - MyAnimeList anime ID
 * @returns Complete anime details including genres, studios, related anime
 * @example
 * ```ts
 * const anime = await getAnime(1); // Cowboy Bebop
 * console.log(anime.title, anime.mean);
 * ```
 */
export async function getAnime(id: number): Promise<MALAnimeDetail> {
  return malFetch(`/anime/${id}`, { fields: ANIME_FIELDS });
}

/**
 * Fetches episodes for an anime with pagination.
 * @param id - MyAnimeList anime ID
 * @param limit - Maximum number of episodes to fetch (default: 100)
 * @param offset - Number of episodes to skip (for pagination)
 * @returns Paginated episode list
 * @example
 * ```ts
 * // Fetch first 100 episodes
 * const response = await getAnimeEpisodes(1);
 *
 * // Fetch next page
 * const nextPage = await getAnimeEpisodes(1, 100, 100);
 * ```
 */
export async function getAnimeEpisodes(
  id: number,
  limit = 100,
  offset = 0
): Promise<MALEpisodesResponse> {
  return malFetch(`/anime/${id}/episodes`, {
    limit: String(limit),
    offset: String(offset),
  });
}

export type { MALAnimeDetail, MALEpisode, MALEpisodesResponse };
