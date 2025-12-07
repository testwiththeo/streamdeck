import type { PlayerOptions } from '@/lib/types/player.types';

export const DEFAULT_PLAYER_SETTINGS: PlayerOptions = {
  primaryColor: 'B20710',
  secondaryColor: '333333',
  icons: 'default',
  iconColor: 'FFFFFF',
  autoplay: false,
  nextbutton: false,
  player: 'default',
  title: true,
  poster: false,
};

export const STORAGE_KEYS = {
  SETTINGS: 'movie-app:settings',
  HISTORY: 'movie-app:history',
  THEME: 'movie-app:theme',
  SEARCH_HISTORY: 'movie-app:search-history',
  ANIME_PREFERENCE: 'movie-app:anime-pref',
  WATCHLIST: 'movie-app:watchlist',
} as const;

export const LIMITS = {
  MAX_HISTORY_ENTRIES: 500,
  MAX_SEARCH_HISTORY: 10,
  MAX_WATCHLIST_ITEMS: 200,
  DEBOUNCE_DELAY_MS: 500,
  ITEMS_PER_PAGE: 20,
} as const;

export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE: 'https://image.tmdb.org/t/p',
  API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY ?? '',
} as const;

export const MAL_CONFIG = {
  BASE_URL: 'https://api.myanimelist.net/v2',
  CLIENT_ID: process.env.NEXT_PUBLIC_MAL_CLIENT_ID ?? '',
} as const;

export const VIDLINK_BASE = 'https://vidlink.pro' as const;
