// TMDB API response types

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: 'YouTube' | 'Vimeo';
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette';
  official: boolean;
}

export interface TMDBVideosResponse {
  results: TMDBVideo[];
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCredits {
  cast: TMDBCastMember[];
  crew: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }>;
}

// Movie types
export interface TMDBMovieResult {
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
  media_type?: 'movie';
}

export interface TMDBMovieDetail extends TMDBMovieResult {
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
  homepage: string;
  imdb_id: string;
}

// TV types
export interface TMDBTVResult {
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
  media_type?: 'tv';
}

export interface TMDBTVDetail extends TMDBTVResult {
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
}

export interface TMDBSeasonSummary {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
}

export interface TMDBSeasonDetail {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episodes: TMDBEpisode[];
}

export interface TMDBEpisode {
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

// Search types
export interface TMDBPersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  media_type: 'person';
  popularity: number;
  known_for: Array<TMDBMovieResult | TMDBTVResult>;
}

export type TMDBSearchResult =
  | (TMDBMovieResult & { media_type: 'movie' })
  | (TMDBTVResult & { media_type: 'tv' })
  | TMDBPersonResult;

export type TMDBTrendingResult = TMDBMovieResult | TMDBTVResult;

export interface TMDBErrorResponse {
  status_code: number;
  status_message: string;
  success: boolean;
}
