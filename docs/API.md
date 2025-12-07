# API Contract Specification
## Movie Streaming Web Application

**Version:** 1.0  
**Date:** June 20, 2026  
**Format:** TypeScript Interface Definitions + OpenAPI 3.0 (External APIs)  
**Status:** Approved

---

## 1. Overview

This application does not expose a public REST API. Instead, it acts as a **consumer** of three external APIs and defines internal contracts between its data layer and UI components.

### External APIs Consumed
| API | Base URL | Auth | Purpose |
|-----|---------|------|---------|
| TMDB | `https://api.themoviedb.org/3` | API Key (query param) | Movie/TV metadata, images, search |
| MyAnimeList | `https://api.myanimelist.net/v2` | Client ID (header) | Anime metadata, episodes |
| VidLink.pro | `https://vidlink.pro` | None | Video player embed URLs |

### Internal Contracts
- TypeScript interfaces define the data shapes flowing from APIs to components
- Custom hooks provide typed data-fetching functions
- Zustand stores expose typed state and actions

---

## 2. TMDB API Contract

### 2.1 Authentication

```typescript
const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE: 'https://image.tmdb.org/t/p',
  API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
} as const;
```

**Image Sizes:**
| Use | Size | Path Example |
|-----|------|-------------|
| Poster (card) | `w342` | `https://image.tmdb.org/t/p/w342/{poster_path}` |
| Poster (detail) | `w500` | `https://image.tmdb.org/t/p/w500/{poster_path}` |
| Backdrop | `w1280` | `https://image.tmdb.org/t/p/w1280/{backdrop_path}` |
| Profile (cast) | `w185` | `https://image.tmdb.org/t/p/w185/{profile_path}` |
| Still (episode) | `w300` | `https://image.tmdb.org/t/p/w300/{still_path}` |
| Original | `original` | `https://image.tmdb.org/t/p/original/{path}` |

---

### 2.2 TMDB Client Interface

```typescript
// src/lib/api/tmdb.ts

interface TMDBClient {
  // Trending
  getTrending(type: 'movie' | 'tv' | 'all', timeWindow: 'day' | 'week'): Promise<TMDBPaginatedResponse<TMDBMediaResult>>;

  // Search
  searchMulti(query: string, page?: number): Promise<TMDBPaginatedResponse<TMDBSearchResult>>;

  // Movie
  getMovie(id: number): Promise<TMDBMovieDetail>;
  getMovieCredits(id: number): Promise<TMDBCredits>;
  getMovieVideos(id: number): Promise<TMDBVideosResponse>;
  getMovieSimilar(id: number): Promise<TMDBPaginatedResponse<TMDBMovieResult>>;

  // TV
  getTVShow(id: number): Promise<TMDBTVDetail>;
  getTVCredits(id: number): Promise<TMDBCredits>;
  getTVVideos(id: number): Promise<TMDBVideosResponse>;
  getTVSimilar(id: number): Promise<TMDBPaginatedResponse<TMDBTVResult>>;
  getTVSeason(id: number, seasonNumber: number): Promise<TMDBSeasonDetail>;

  // Genres
  getMovieGenres(): Promise<TMDBGenresResponse>;
  getTVGenres(): Promise<TMDBGenresResponse>;

  // Discover
  discoverMovies(genreId: number, page?: number): Promise<TMDBPaginatedResponse<TMDBMovieResult>>;
  discoverTV(genreId: number, page?: number): Promise<TMDBPaginatedResponse<TMDBTVResult>>;

  // Popular / Top Rated
  getPopularMovies(page?: number): Promise<TMDBPaginatedResponse<TMDBMovieResult>>;
  getPopularTV(page?: number): Promise<TMDBPaginatedResponse<TMDBTVResult>>;
  getTopRatedMovies(page?: number): Promise<TMDBPaginatedResponse<TMDBMovieResult>>;
  getTopRatedTV(page?: number): Promise<TMDBPaginatedResponse<TMDBTVResult>>;
}
```

---

### 2.3 TMDB Response Types

```typescript
// src/lib/types/tmdb.types.ts

// --- Base Response Types ---

interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

interface TMDBVideosResponse {
  results: TMDBVideo[];
}

// --- Shared Types ---

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBVideo {
  id: string;
  key: string;           // YouTube video ID
  name: string;
  site: 'YouTube' | 'Vimeo';
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette';
  official: boolean;
}

interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

// --- Movie Types ---

interface TMDBMovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

interface TMDBMovieDetail extends TMDBMovieResult {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  genres: TMDBGenre[];
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  homepage: string;
  imdb_id: string;
}

// --- TV Types ---

interface TMDBTVResult {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
}

interface TMDBTVDetail extends TMDBTVResult {
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  type: string;
  genres: TMDBGenre[];
  seasons: TMDBSeasonSummary[];
  created_by: Array<{
    id: number;
    name: string;
    profile_path: string | null;
  }>;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  episode_run_time: number[];
  homepage: string;
  in_production: boolean;
  last_air_date: string;
  next_episode_to_air: TMDBEpisode | null;
  last_episode_to_air: TMDBEpisode | null;
}

interface TMDBSeasonSummary {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
}

interface TMDBSeasonDetail {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episodes: TMDBEpisode[];
}

interface TMDBEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
  season_number: number;
  vote_average: number;
  vote_count: number;
}

// --- Search Types ---

type TMDBSearchResult =
  | (TMDBMovieResult & { media_type: 'movie' })
  | (TMDBTVResult & { media_type: 'tv' })
  | TMDBPersonResult;

interface TMDBPersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  media_type: 'person';
  popularity: number;
  known_for: Array<TMDBMovieResult | TMDBTVResult>;
}

// --- Trending Types ---

type TMDBMediaResult = TMDBMovieResult | TMDBTVResult;
```

---

### 2.4 TMDB Error Handling

```typescript
enum TMDBErrorCode {
  INVALID_API_KEY = 401,
  RESOURCE_NOT_FOUND = 404,
  RATE_LIMITED = 429,
  SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}
```

**Retry Strategy:**
| Error Code | Action |
|-----------|--------|
| 401 | Do not retry — configuration error, log to Sentry |
| 404 | Do not retry — resource does not exist |
| 429 | Retry after `Retry-After` header (or 5s default), max 3 retries |
| 500/503 | Retry with exponential backoff (1s, 2s, 4s), max 3 retries |
| Network error | Retry with exponential backoff, max 3 retries |

---

## 3. MyAnimeList API Contract

### 3.1 Authentication

```typescript
const MAL_CONFIG = {
  BASE_URL: 'https://api.myanimelist.net/v2',
  CLIENT_ID: process.env.NEXT_PUBLIC_MAL_CLIENT_ID,
} as const;
```

**Auth Header:** `X-MAL-CLIENT-ID: {CLIENT_ID}`

### 3.2 MAL Client Interface

```typescript
// src/lib/api/mal.ts

interface MALClient {
  getAnime(id: number, fields?: string[]): Promise<MALAnimeDetail>;
  getAnimeEpisodes(id: number, limit?: number, offset?: number): Promise<MALPaginatedResponse<MALEpisode>>;
  getTopAnime(limit?: number, offset?: number): Promise<MALPaginatedResponse<MALAnimeRanking>>;
}
```

### 3.3 MAL Response Types

```typescript
// src/lib/types/mal.types.ts

interface MALPaginatedResponse<T> {
  data: T[];
  paging: {
    next?: string;
    previous?: string;
  };
}

interface MALAnimeNode {
  node: {
    id: number;
    title: string;
    main_picture: {
      large: string;
      medium: string;
    } | null;
  };
}

interface MALAnimeRanking extends MALAnimeNode {
  ranking: {
    rank: number;
  };
}

interface MALAnimeDetail {
  id: number;
  title: string;
  main_picture: {
    large: string;
    medium: string;
  } | null;
  synopsis: string;
  mean: number;
  rank: number;
  popularity: number;
  num_list_users: number;
  num_scoring_users: number;
  nsfw: string;
  created_at: string;
  updated_at: string;
  media_type: string;
  status: string;
  genres: Array<{ id: number; name: string }>;
  my_list_status: {
    status: string;
    score: number;
    num_episodes_watched: number;
    is_rewatching: boolean;
  } | null;
  num_episodes: number;
  start_season: {
    year: number;
    season: 'winter' | 'spring' | 'summer' | 'fall';
  } | null;
  broadcast: {
    day_of_the_week: string;
    start_time: string;
  } | null;
  source: string;
  average_episode_duration: number;
  rating: string;
  studios: Array<{ id: number; name: string }>;
  pictures: Array<{ large: string; medium: string }>;
  related_anime: Array<{
    node: { id: number; title: string };
    relation_type: string;
    relation_type_formatted: string;
  }>;
  recommendation: Array<{
    node: { id: number; title: string; main_picture: { large: string; medium: string } | null };
    num_recommendations: number;
  }>;
}

interface MALEpisode {
  id: number;
  title: string;
  synopsis: string;
  aired: string | null;
}

interface MALPaginatedResponse<T> {
  data: Array<{ node: T } | T>;
  paging: {
    next?: string;
    previous?: string;
  };
}
```

### 3.4 MAL Error Handling

| Status | Meaning | Action |
|--------|---------|--------|
| 400 | Bad Request | Do not retry, validate inputs |
| 401 | Unauthorized | Do not retry, check CLIENT_ID |
| 403 | Forbidden | Do not retry |
| 404 | Not Found | Do not retry |
| 429 | Rate Limited | Wait and retry (3 req/s limit) |
| 500 | Server Error | Retry with backoff |

---

## 4. VidLink.pro URL Contract

### 4.1 URL Builder Interface

```typescript
// src/lib/vidlink.ts

type MediaType = 'movie' | 'tv' | 'anime';

interface VidLinkConfig {
  type: MediaType;
  tmdbId?: number;
  malId?: number;
  season?: number;
  episode?: number;
  subOrDub?: 'sub' | 'dub';
  options?: PlayerOptions;
}

interface PlayerOptions {
  primaryColor?: string;    // hex without #, e.g., "B20710"
  secondaryColor?: string;  // hex without #
  icons?: 'vid' | 'default';
  iconColor?: string;       // hex without #
  title?: boolean;
  poster?: boolean;
  autoplay?: boolean;
  nextbutton?: boolean;
  player?: 'jw' | 'default';
  startAt?: number;         // seconds
  sub_file?: string;        // URL to .vtt file
  sub_label?: string;
  fallback_url?: string;    // redirect URL on failure
}

function buildVidLinkUrl(config: VidLinkConfig): string;
```

### 4.2 URL Patterns

| Media Type | URL Pattern |
|-----------|------------|
| Movie | `https://vidlink.pro/movie/{tmdbId}?{params}` |
| TV | `https://vidlink.pro/tv/{tmdbId}/{season}/{episode}?{params}` |
| Anime | `https://vidlink.pro/anime/{malId}/{episode}/{subOrDub}?fallback=true&{params}` |

### 4.3 Query Parameter Reference

| Parameter | Type | Required | Default | Example |
|-----------|------|----------|---------|---------|
| `primaryColor` | string (hex, no #) | No | player default | `B20710` |
| `secondaryColor` | string (hex, no #) | No | player default | `333333` |
| `icons` | `"vid"` \| `"default"` | No | `"default"` | `"vid"` |
| `iconColor` | string (hex, no #) | No | player default | `FFFFFF` |
| `title` | boolean | No | `true` | `false` |
| `poster` | boolean | No | `false` | `true` |
| `autoplay` | boolean | No | `false` | `true` |
| `nextbutton` | boolean | No | `false` | `true` |
| `player` | `"jw"` \| `"default"` | No | `"default"` | `"jw"` |
| `startAt` | number (seconds) | No | `0` | `1935` |
| `sub_file` | URL (direct .vtt) | No | — | `https://...subs.vtt` |
| `sub_label` | string | No | `"External Subtitle"` | `"English"` |
| `fallback_url` | URL | No | — | `https://movieapp.com/404` |

### 4.4 Example URLs

```
# Movie with custom colors and autoplay
https://vidlink.pro/movie/550?primaryColor=B20710&autoplay=true

# TV show episode
https://vidlink.pro/tv/1396/2/5?primaryColor=B20710&nextbutton=true

# Anime with sub/dub
https://vidlink.pro/anime/1535/1/sub?fallback=true&primaryColor=B20710

# Movie with resume point
https://vidlink.pro/movie/680?startAt=3240&primaryColor=B20710
```

---

## 5. Application Internal Contracts

### 5.1 App-Level Types

```typescript
// src/lib/types/app.types.ts

type MediaType = 'movie' | 'tv' | 'anime';

interface MediaItem {
  id: number;
  type: MediaType;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  rating: number;
  year?: number;
  genreIds: number[];
  overview?: string;
}

interface WatchHistoryEntry {
  id: string;                  // "${type}-${mediaId}-${season}-${episode}"
  mediaId: number;
  type: MediaType;
  title: string;
  posterUrl: string;
  timestamp: number;
  progress: number;            // 0-100
  completed: boolean;
  season?: number;
  episode?: number;
  subOrDub?: 'sub' | 'dub';
}

interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  playerSettings: PlayerOptions;
  animePreference: {
    subOrDub: 'sub' | 'dub';
  };
  searchHistory: string[];
}

interface PlayerError {
  code: 'LOAD_FAILED' | 'TIMEOUT' | 'UNSUPPORTED' | 'UNKNOWN';
  message: string;
  retryable: boolean;
}
```

### 5.2 Store Contracts

**Settings Store:**
```typescript
// src/store/settings-store.ts

interface PlayerSettingsState {
  primaryColor: string;       // "B20710"
  secondaryColor: string;     // "333333"
  icons: 'vid' | 'default';
  iconColor: string;          // "FFFFFF"
  autoplay: boolean;          // false
  nextbutton: boolean;        // false
  player: 'jw' | 'default';  // "default"
  updateSetting: <K extends keyof Omit<PlayerSettingsState, 'updateSetting' | 'resetToDefaults'>>(
    key: K,
    value: PlayerSettingsState[K]
  ) => void;
  resetToDefaults: () => void;
}
```

**History Store:**
```typescript
// src/store/history-store.ts

interface HistoryState {
  entries: WatchHistoryEntry[];
  addEntry: (entry: WatchHistoryEntry) => void;
  updateProgress: (id: string, progress: number) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  getEntry: (id: string) => WatchHistoryEntry | undefined;
  getContinueWatching: () => WatchHistoryEntry[];  // incomplete, sorted by timestamp
}
```

**UI Store:**
```typescript
// src/store/ui-store.ts

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
  duration?: number;
}

interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
  toasts: Toast[];
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}
```

### 5.3 Hook Contracts

```typescript
// src/hooks/useDebounce.ts
function useDebounce<T>(value: T, delay: number): T;

// src/hooks/useInfiniteSearch.ts
interface UseInfiniteSearchResult {
  data: MediaItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
}
function useInfiniteSearch(query: string): UseInfiniteSearchResult;

// src/hooks/useTmdbData.ts
interface UseTmdbDataOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  enabled?: boolean;
}
function useTmdbData<T>(options: UseTmdbDataOptions<T>): UseQueryResult<T>;

// src/hooks/useWatchHistory.ts
interface UseWatchHistoryReturn {
  history: WatchHistoryEntry[];
  addEntry: (entry: WatchHistoryEntry) => void;
  updateProgress: (id: string, progress: number) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  getEntry: (id: string) => WatchHistoryEntry | undefined;
  continueWatching: WatchHistoryEntry[];
}
function useWatchHistory(): UseWatchHistoryReturn;

// src/hooks/usePlayerSettings.ts
function usePlayerSettings(): PlayerSettingsState;

// src/hooks/useResumePlayback.ts
interface UseResumePlaybackReturn {
  canResume: boolean;
  resumeAt: number;          // seconds
  resumeLabel: string;       // "Resume from 32:15"
  lastEntry: WatchHistoryEntry | null;
}
function useResumePlayback(mediaId: number, type: MediaType, season?: number, episode?: number): UseResumePlaybackReturn;

// src/hooks/useMediaSession.ts
function useMediaSession(metadata: {
  title: string;
  artist?: string;
  album?: string;
  artwork?: string;
}): void;

// src/hooks/useIntersectionObserver.ts
interface UseIntersectionObserverReturn {
  ref: React.RefCallback<Element>;
  isIntersecting: boolean;
}
function useIntersectionObserver(options?: IntersectionObserverInit): UseIntersectionObserverReturn;
```

### 5.4 Utility Contracts

```typescript
// src/lib/utils/cn.ts
function cn(...classes: Array<string | undefined | null | false>): string;

// src/lib/utils/format.ts
function formatRuntime(minutes: number): string;          // "2h 15m"
function formatRating(rating: number): string;            // "8.5"
function formatDate(dateString: string): string;           // "Jun 20, 2026"
function formatTimestamp(timestamp: number): string;       // "32:15" or "1:02:15"
function formatYear(dateString: string): string;           // "2026"

// src/lib/utils/storage.ts
function getFromStorage<T>(key: string, fallback: T): T;
function setToStorage<T>(key: string, value: T): boolean;  // false if quota exceeded
function removeFromStorage(key: string): void;

// src/lib/utils/debounce.ts
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void;

// src/lib/utils/throttle.ts
function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void;
```

---

## 6. Constants

### 6.1 Route Constants

```typescript
// src/lib/constants/routes.ts

const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  MOVIE: (id: number) => `/movie/${id}`,
  TV: (id: number) => `/tv/${id}`,
  ANIME: (id: number) => `/anime/${id}`,
  GENRE: (slug: string) => `/genre/${slug}`,
} as const;
```

### 6.2 Default Settings

```typescript
// src/lib/constants/defaults.ts

const DEFAULT_PLAYER_SETTINGS = {
  primaryColor: 'B20710',
  secondaryColor: '333333',
  icons: 'default' as const,
  iconColor: 'FFFFFF',
  autoplay: false,
  nextbutton: false,
  player: 'default' as const,
};

const STORAGE_KEYS = {
  SETTINGS: 'movie-app:settings',
  HISTORY: 'movie-app:history',
  THEME: 'movie-app:theme',
  SEARCH_HISTORY: 'movie-app:search-history',
  ANIME_PREFERENCE: 'movie-app:anime-pref',
} as const;

const LIMITS = {
  MAX_HISTORY_ENTRIES: 500,
  MAX_SEARCH_HISTORY: 10,
  DEBOUNCE_DELAY_MS: 500,
  ITEMS_PER_PAGE: 20,
} as const;
```

### 6.3 Genre Mapping

```typescript
// src/lib/constants/genres.ts

const MOVIE_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western',
};

const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  10762: 'Kids', 9648: 'Mystery', 10763: 'News', 10764: 'Reality',
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk',
  10768: 'War & Politics', 37: 'Western',
};
```

---

**Document End**
