export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  MOVIE: (id: number) => `/movie/${id}` as const,
  TV: (id: number) => `/tv/${id}` as const,
  ANIME: (id: number) => `/anime/${id}` as const,
  GENRE: (slug: string) => `/genre/${slug}` as const,
  HISTORY: '/history',
  WATCHLIST: '/watchlist',
  SETTINGS: '/settings',
} as const;
