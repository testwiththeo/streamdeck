'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { MediaGrid } from '@/components/media/MediaGrid';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils/cn';
import { discoverMovies, discoverTV, getImageUrl } from '@/lib/api/tmdb';
import { MOVIE_GENRES, TV_GENRES } from '@/lib/constants/genres';
import type { MediaItem } from '@/lib/types/app.types';

const GENRE_SLUGS: Record<string, { id: number; type: 'movie' | 'tv' }> = {
  action: { id: 28, type: 'movie' },
  adventure: { id: 12, type: 'movie' },
  animation: { id: 16, type: 'movie' },
  comedy: { id: 35, type: 'movie' },
  crime: { id: 80, type: 'movie' },
  documentary: { id: 99, type: 'movie' },
  drama: { id: 18, type: 'movie' },
  family: { id: 10751, type: 'movie' },
  fantasy: { id: 14, type: 'movie' },
  history: { id: 36, type: 'movie' },
  horror: { id: 27, type: 'movie' },
  mystery: { id: 9648, type: 'movie' },
  romance: { id: 10749, type: 'movie' },
  'sci-fi': { id: 878, type: 'movie' },
  thriller: { id: 53, type: 'movie' },
  war: { id: 10752, type: 'movie' },
  western: { id: 37, type: 'movie' },
  'tv-drama': { id: 18, type: 'tv' },
  'tv-comedy': { id: 35, type: 'tv' },
  'tv-animation': { id: 16, type: 'tv' },
  'tv-crime': { id: 80, type: 'tv' },
  'tv-documentary': { id: 99, type: 'tv' },
  'sci-fi-fantasy': { id: 10765, type: 'tv' },
};

const ALL_GENRE_LABELS: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(MOVIE_GENRES).map(([id, name]) => {
      const slug = Object.entries(GENRE_SLUGS).find(([, v]) => v.id === Number(id) && v.type === 'movie');
      return slug ? [slug[0], name] : [id, name];
    })
  ),
  ...Object.fromEntries(
    Object.entries(TV_GENRES).map(([id, name]) => {
      const slug = Object.entries(GENRE_SLUGS).find(([, v]) => v.id === Number(id) && v.type === 'tv');
      return slug ? [slug[0], name] : [id, name];
    })
  ),
};

export default function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');

  const genreInfo = GENRE_SLUGS[slug];
  const genreId = genreInfo?.id;
  const genreName = ALL_GENRE_LABELS[slug] ?? slug.replace(/-/g, ' ');

  const query = useQuery({
    queryKey: ['genre', slug, mediaType],
    queryFn: async () => {
      if (!genreId) return { results: [] };
      if (mediaType === 'tv') return discoverTV(genreId);
      return discoverMovies(genreId);
    },
    enabled: !!genreId,
  });

  const items: MediaItem[] =
    query.data?.results.map((r: { id: number; poster_path: string | null; vote_average: number; genre_ids: number[] } & (
      | { title: string; release_date: string }
      | { name: string; first_air_date: string }
    )) => ({
      id: r.id,
      type: mediaType,
      title: 'title' in r ? r.title : (r as { name: string }).name,
      posterUrl: getImageUrl(r.poster_path),
      rating: r.vote_average,
      year:
        'release_date' in r
          ? r.release_date
            ? new Date(r.release_date).getFullYear()
            : undefined
          : (r as { first_air_date?: string }).first_air_date
            ? new Date((r as { first_air_date: string }).first_air_date).getFullYear()
            : undefined,
      genreIds: r.genre_ids,
    })) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Genre title */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold capitalize text-text-primary sm:text-3xl">
          {genreName}
        </h1>
        <div className="inline-flex rounded-lg bg-surface-1 p-0.5 ring-1 ring-border">
          <button
            onClick={() => setMediaType('movie')}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-fast ease-standard',
              mediaType === 'movie'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Movies
          </button>
          <button
            onClick={() => setMediaType('tv')}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-fast ease-standard',
              mediaType === 'tv'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            TV Shows
          </button>
        </div>
      </div>

      {/* Genre chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(GENRE_SLUGS)
          .filter(([, v]) => v.type === mediaType)
          .map(([key, value]) => {
            const label = ALL_GENRE_LABELS[key] ?? key;
            return (
              <Link
                key={key}
                href={`/genre/${key}`}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-all duration-fast ease-standard',
                  slug === key
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary active:scale-[0.97]'
                )}
              >
                {label}
              </Link>
            );
          })}
      </div>

      {/* Results */}
      {!genreId ? (
        <div className="flex min-h-[200px] items-center justify-center text-text-secondary">
          <p>Genre not found.</p>
        </div>
      ) : query.isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {items.length > 0 && (
            <p className="mb-4 text-sm text-text-secondary">
              {items.length} {mediaType === 'movie' ? 'movies' : 'TV shows'} in {genreName}
            </p>
          )}
          <MediaGrid items={items} emptyMessage={`No ${mediaType === 'movie' ? 'movies' : 'TV shows'} found for this genre.`} />
        </>
      )}
    </div>
  );
}
