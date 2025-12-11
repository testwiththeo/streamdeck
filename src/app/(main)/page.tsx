import Link from 'next/link';

import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getImageUrl,
} from '@/lib/api/tmdb';
import { ROUTES } from '@/lib/constants/routes';
import type { MediaItem } from '@/lib/types/app.types';
import type { TMDBMovieResult, TMDBTVResult, TMDBTrendingResult } from '@/lib/types/tmdb.types';

import { HeroBanner } from '@/components/media/HeroBanner';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { ContinueWatchingSection } from './ContinueWatchingSection';

// =============================================================================
// Data Transformers
// =============================================================================

function trendingToMediaItem(item: TMDBTrendingResult): MediaItem {
  const isMovie = 'title' in item;
  const movie = item as TMDBMovieResult;
  const show = item as TMDBTVResult;
  return {
    id: item.id,
    type: isMovie ? 'movie' : 'tv',
    title: isMovie ? movie.title : show.name,
    posterUrl: getImageUrl(item.poster_path),
    backdropUrl: item.backdrop_path ?? undefined,
    rating: item.vote_average,
    year: isMovie
      ? movie.release_date ? Number(movie.release_date.slice(0, 4)) : undefined
      : show.first_air_date ? Number(show.first_air_date.slice(0, 4)) : undefined,
    genreIds: item.genre_ids ?? [],
    overview: item.overview,
  };
}

function movieToMediaItem(movie: TMDBMovieResult): MediaItem {
  return {
    id: movie.id,
    type: 'movie',
    title: movie.title,
    posterUrl: getImageUrl(movie.poster_path),
    backdropUrl: movie.backdrop_path ?? undefined,
    rating: movie.vote_average,
    year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : undefined,
    genreIds: movie.genre_ids,
    overview: movie.overview,
  };
}

function tvToMediaItem(show: TMDBTVResult): MediaItem {
  return {
    id: show.id,
    type: 'tv',
    title: show.name,
    posterUrl: getImageUrl(show.poster_path),
    backdropUrl: show.backdrop_path ?? undefined,
    rating: show.vote_average,
    year: show.first_air_date ? Number(show.first_air_date.slice(0, 4)) : undefined,
    genreIds: show.genre_ids,
    overview: show.overview,
  };
}

// =============================================================================
// Genre Chips Data
// =============================================================================

const GENRE_CHIPS = [
  { slug: 'action', label: 'Action' },
  { slug: 'comedy', label: 'Comedy' },
  { slug: 'drama', label: 'Drama' },
  { slug: 'horror', label: 'Horror' },
  { slug: 'sci-fi', label: 'Sci-Fi' },
  { slug: 'thriller', label: 'Thriller' },
  { slug: 'animation', label: 'Animation' },
  { slug: 'romance', label: 'Romance' },
] as const;

// =============================================================================
// Page
// =============================================================================

export default async function HomePage() {
  // Fetch all data in parallel with error handling for build-time
  const [trendingData, popularMovies, popularTV, topRatedMovies] = await Promise.all([
    getTrending('all', 'week').catch(() => ({ results: [] as TMDBTrendingResult[], page: 1, total_pages: 0, total_results: 0 })),
    getPopularMovies().catch(() => ({ results: [] as TMDBMovieResult[], page: 1, total_pages: 0, total_results: 0 })),
    getPopularTV().catch(() => ({ results: [] as TMDBTVResult[], page: 1, total_pages: 0, total_results: 0 })),
    getTopRatedMovies().catch(() => ({ results: [] as TMDBMovieResult[], page: 1, total_pages: 0, total_results: 0 })),
  ]);

  // Transform data
  const trendingItems = trendingData.results.map(trendingToMediaItem);

  const heroItems = trendingItems.slice(0, 5);

  const popularMovieItems = popularMovies.results.map(movieToMediaItem);
  const popularTVItems = popularTV.results.map(tvToMediaItem);
  const topRatedMovieItems = topRatedMovies.results.map(movieToMediaItem);

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Hero Banner */}
      <HeroBanner items={heroItems} />

      {/* Continue Watching (client component with history store) */}
      <ContinueWatchingSection />

      {/* Trending This Week */}
      <MediaCarousel
        title="Trending This Week"
        items={trendingItems}
        staggerIndex={0}
      />

      {/* Popular Movies */}
      <MediaCarousel
        title="Popular Movies"
        items={popularMovieItems}
        staggerIndex={0}
      />

      {/* Popular TV Shows */}
      <MediaCarousel
        title="Popular TV Shows"
        items={popularTVItems}
        staggerIndex={0}
      />

      {/* Top Rated Movies */}
      <MediaCarousel
        title="Top Rated Movies"
        items={topRatedMovieItems}
        staggerIndex={0}
      />

      {/* Browse by Genre */}
      <section className="px-6 sm:px-12 lg:px-16">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
          Browse by Genre
        </h2>
        <div
          className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {GENRE_CHIPS.map((genre) => (
            <Link
              key={genre.slug}
              href={ROUTES.GENRE(genre.slug)}
              className="shrink-0 scroll-snap-align-start rounded-full bg-surface-2 px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors duration-fast ease-standard hover:bg-surface-3 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 active:bg-brand active:text-white"
              style={{ scrollSnapAlign: 'start' }}
            >
              {genre.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
