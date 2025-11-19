/**
 * Player and VidLink configuration types.
 * Used for configuring the embedded video player.
 *
 * @module player.types
 */

import type { MediaType, PlayerError } from './app.types';

/**
 * Configuration options for the VidLink embedded player.
 * These options control the appearance and behavior of the video player.
 */
export interface PlayerOptions {
  /** Primary color for player UI elements (hex color) */
  primaryColor?: string;
  /** Secondary color for player UI elements (hex color) */
  secondaryColor?: string;
  /** Icon set to use in the player */
  icons?: 'vid' | 'default';
  /** Color for player icons (hex color) */
  iconColor?: string;
  /** Whether to show the title in the player */
  title?: boolean;
  /** Whether to show the poster before playback */
  poster?: boolean;
  /** Whether to start playback automatically */
  autoplay?: boolean;
  /** Whether to show the next episode button */
  nextbutton?: boolean;
  /** Player implementation to use */
  player?: 'jw' | 'default';
  /** Timestamp (in seconds) to start playback at */
  startAt?: number;
  /** URL to a subtitle file */
  sub_file?: string;
  /** Label to display for subtitles */
  sub_label?: string;
  /** Fallback URL if primary source fails */
  fallback_url?: string;
}

/**
 * Props for the VideoPlayer component.
 */
export interface VideoPlayerProps {
  /** Type of media to play */
  type: MediaType;
  /** TMDB ID for movies and TV shows */
  tmdbId?: number;
  /** MyAnimeList ID for anime */
  malId?: number;
  /** Season number (for TV shows) */
  season?: number;
  /** Episode number (for TV shows and anime) */
  episode?: number;
  /** Subtitle/dub preference (for anime) */
  subOrDub?: 'sub' | 'dub';
  /** Player configuration options */
  options?: PlayerOptions;
  /** Callback fired with playback progress (0-100) */
  onProgress?: (progress: number) => void;
  /** Callback fired when a player error occurs */
  onError?: (error: PlayerError) => void;
  /** Additional CSS classes for the player container */
  className?: string;
}

/**
 * Configuration for generating a VidLink embed URL.
 */
export interface VidLinkConfig {
  /** Type of media to play */
  type: MediaType;
  /** TMDB ID for movies and TV shows */
  tmdbId?: number;
  /** MyAnimeList ID for anime */
  malId?: number;
  /** Season number (for TV shows) */
  season?: number;
  /** Episode number (for TV shows and anime) */
  episode?: number;
  /** Subtitle/dub preference (for anime) */
  subOrDub?: 'sub' | 'dub';
  /** Player configuration options */
  options?: PlayerOptions;
}
