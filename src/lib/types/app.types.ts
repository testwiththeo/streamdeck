/**
 * Application-specific type definitions for the Movie App.
 * These types are used throughout the application for media items,
 * user preferences, and application state.
 *
 * @module app.types
 */

/**
 * Supported media types in the application.
 * - 'movie': TMDB movie content
 * - 'tv': TMDB TV show content
 * - 'anime': MyAnimeList anime content
 */
export type MediaType = 'movie' | 'tv' | 'anime';

/**
 * Represents a media item (movie, TV show, or anime) in the application.
 * Used for displaying media cards and lists.
 */
export interface MediaItem {
  /** Unique identifier from the source API (TMDB or MAL) */
  id: number;
  /** Type of media content */
  type: MediaType;
  /** Display title of the media */
  title: string;
  /** URL to the poster image */
  posterUrl: string;
  /** URL to the backdrop image (optional) */
  backdropUrl?: string;
  /** Average rating (typically 0-10 scale) */
  rating: number;
  /** Release year (optional) */
  year?: number;
  /** Array of genre IDs from TMDB */
  genreIds: number[];
  /** Brief description or synopsis (optional) */
  overview?: string;
}

/**
 * Represents a user's watch history entry for a media item.
 * Stored in localStorage for persistence.
 */
export interface WatchHistoryEntry {
  /** Unique identifier for this history entry */
  id: string;
  /** ID of the media item from source API */
  mediaId: number;
  /** Type of media content */
  type: MediaType;
  /** Title of the media at time of watching */
  title: string;
  /** URL to the poster image */
  posterUrl: string;
  /** Unix timestamp of when the item was watched */
  timestamp: number;
  /** Playback progress (0-100 percentage) */
  progress: number;
  /** Whether the media was watched to completion */
  completed: boolean;
  /** Season number (for TV shows) */
  season?: number;
  /** Episode number (for TV shows) */
  episode?: number;
  /** Subtitle/dub preference (for anime) */
  subOrDub?: 'sub' | 'dub';
}

/**
 * User preferences stored in application state.
 * Includes theme, player settings, and search history.
 */
export interface UserPreferences {
  /** Theme preference */
  theme: 'dark' | 'light' | 'system';
  /** Video player configuration options */
  playerSettings: import('./player.types').PlayerOptions;
  /** Anime viewing preferences */
  animePreference: {
    /** Default subtitle/dub preference */
    subOrDub: 'sub' | 'dub';
  };
  /** Recent search queries (most recent first) */
  searchHistory: string[];
}

/**
 * Represents an error that occurred during video playback.
 */
export interface PlayerError {
  /** Error code identifying the type of error */
  code: 'LOAD_FAILED' | 'TIMEOUT' | 'UNSUPPORTED' | 'UNKNOWN';
  /** Human-readable error message */
  message: string;
  /** Whether the error can be retried */
  retryable: boolean;
}

/**
 * Represents a toast notification in the UI.
 */
export interface Toast {
  /** Unique identifier for the toast */
  id: string;
  /** Message to display */
  message: string;
  /** Type of toast affecting its appearance */
  type: 'info' | 'error' | 'success' | 'warning';
  /** Auto-dismiss duration in milliseconds (optional for persistent toasts) */
  duration?: number;
}
