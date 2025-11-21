/**
 * VidLink.pro URL builder for generating embed URLs.
 * VidLink provides embedded video players for movies, TV shows, and anime.
 *
 * @module vidlink
 * @see https://vidlink.pro
 */

import { VIDLINK_BASE } from '@/lib/constants/defaults';
import type { VidLinkConfig, PlayerOptions } from '@/lib/types/player.types';

/**
 * Builds a VidLink.pro embed URL for the given media configuration.
 * Supports movies, TV shows, and anime with customizable player options.
 *
 * @param config - VidLink configuration including media type, IDs, and player options
 * @returns Complete VidLink embed URL ready for iframe embedding
 * @throws Error if required IDs are missing for the media type
 *
 * @example
 * ```ts
 * // Movie embed
 * const movieUrl = buildVidLinkUrl({
 *   type: 'movie',
 *   tmdbId: 550,
 *   options: { autoplay: true }
 * });
 * // => 'https://vidlink.pro/movie/550?autoplay=true'
 *
 * // TV episode embed
 * const tvUrl = buildVidLinkUrl({
 *   type: 'tv',
 *   tmdbId: 1396,
 *   season: 1,
 *   episode: 1,
 *   options: { primaryColor: '#e50914' }
 * });
 * // => 'https://vidlink.pro/tv/1396/1/1?primaryColor=%23e50914'
 *
 * // Anime embed
 * const animeUrl = buildVidLinkUrl({
 *   type: 'anime',
 *   malId: 1,
 *   episode: 1,
 *   subOrDub: 'sub'
 * });
 * // => 'https://vidlink.pro/anime/1/1/sub?fallback=true'
 * ```
 */
export function buildVidLinkUrl(config: VidLinkConfig): string {
  let path: string;

  switch (config.type) {
    case 'movie':
      if (!config.tmdbId) throw new Error('tmdbId is required for movies');
      path = `/movie/${config.tmdbId}`;
      break;
    case 'tv':
      if (!config.tmdbId || config.season == null || config.episode == null) {
        throw new Error('tmdbId, season, and episode are required for TV shows');
      }
      path = `/tv/${config.tmdbId}/${config.season}/${config.episode}`;
      break;
    case 'anime':
      if (!config.malId || config.episode == null || !config.subOrDub) {
        throw new Error('malId, episode, and subOrDub are required for anime');
      }
      path = `/anime/${config.malId}/${config.episode}/${config.subOrDub}?fallback=true`;
      break;
    default:
      throw new Error(`Unknown media type: ${config.type}`);
  }

  const params = buildParams(config.options);
  if (!params) return `${VIDLINK_BASE}${path}`;

  const separator = path.includes('?') ? '&' : '?';
  return `${VIDLINK_BASE}${path}${separator}${params}`;
}

/**
 * Converts PlayerOptions to URL search parameters.
 * Only includes options that are explicitly set.
 *
 * @param options - Player configuration options
 * @returns URL-encoded parameter string, or empty string if no options
 */
function buildParams(options?: PlayerOptions): string {
  if (!options) return '';

  const params = new URLSearchParams();

  if (options.primaryColor) params.set('primaryColor', options.primaryColor);
  if (options.secondaryColor) params.set('secondaryColor', options.secondaryColor);
  if (options.icons) params.set('icons', options.icons);
  if (options.iconColor) params.set('iconColor', options.iconColor);
  if (options.title !== undefined) params.set('title', String(options.title));
  if (options.poster !== undefined) params.set('poster', String(options.poster));
  if (options.autoplay !== undefined) params.set('autoplay', String(options.autoplay));
  if (options.nextbutton !== undefined) params.set('nextbutton', String(options.nextbutton));
  if (options.player) params.set('player', options.player);
  if (options.startAt !== undefined && options.startAt > 0) {
    params.set('startAt', String(Math.floor(options.startAt)));
  }
  if (options.sub_file) params.set('sub_file', options.sub_file);
  if (options.sub_label) params.set('sub_label', options.sub_label);
  if (options.fallback_url) params.set('fallback_url', options.fallback_url);

  return params.toString();
}
