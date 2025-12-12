'use client';

import { use, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { MediaDetail } from '@/components/media/MediaDetail';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { WatchlistButton } from '@/components/media/WatchlistButton';
import { TabbedContent } from '@/components/ui/TabbedContent';
import { BackButton } from '@/components/ui/BackButton';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getMovie, getMovieCredits, getMovieSimilar, getImageUrl } from '@/lib/api/tmdb';
import { useUIStore } from '@/store/ui-store';
import type { MediaItem } from '@/lib/types/app.types';

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movieId = Number(id);
  const [showPlayer, setShowPlayer] = useState(false);
  const addToast = useUIStore((s) => s.addToast);

  const movieQuery = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovie(movieId),
    enabled: !isNaN(movieId),
  });

  const creditsQuery = useQuery({
    queryKey: ['movie-credits', movieId],
    queryFn: () => getMovieCredits(movieId),
    enabled: !isNaN(movieId),
  });

  const similarQuery = useQuery({
    queryKey: ['movie-similar', movieId],
    queryFn: () => getMovieSimilar(movieId),
    enabled: !isNaN(movieId),
  });

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      addToast({ message: 'Link copied to clipboard!', type: 'success' });
    });
  }, [addToast]);

  if (movieQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (movieQuery.error || !movieQuery.data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <svg className="h-16 w-16 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h1 className="text-2xl font-bold text-text-primary">Movie not found</h1>
        <p className="text-text-secondary">The movie you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const movie = movieQuery.data;
  const cast = creditsQuery.data?.cast.slice(0, 12) ?? [];
  const movieItem: MediaItem = {
    id: movie.id,
    type: 'movie',
    title: movie.title,
    posterUrl: getImageUrl(movie.poster_path),
    rating: movie.vote_average,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined,
    genreIds: movie.genres?.map((g) => g.id) ?? [],
  };

  const similarItems: MediaItem[] =
    similarQuery.data?.results.slice(0, 10).map((r) => ({
      id: r.id,
      type: 'movie' as const,
      title: r.title,
      posterUrl: getImageUrl(r.poster_path),
      rating: r.vote_average,
      year: r.release_date ? new Date(r.release_date).getFullYear() : undefined,
      genreIds: r.genre_ids,
    })) ?? [];

  // Tab content
  const overviewContent = (
    <div className="space-y-6">
      {movie.overview && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Synopsis</h3>
          <p className="max-w-3xl leading-relaxed text-text-secondary">{movie.overview}</p>
        </div>
      )}
      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {movie.tagline && (
          <div>
            <p className="text-xs text-text-tertiary">Tagline</p>
            <p className="text-sm text-text-secondary">{movie.tagline}</p>
          </div>
        )}
        {movie.status && (
          <div>
            <p className="text-xs text-text-tertiary">Status</p>
            <p className="text-sm text-text-secondary">{movie.status}</p>
          </div>
        )}
        {movie.runtime > 0 && (
          <div>
            <p className="text-xs text-text-tertiary">Runtime</p>
            <p className="text-sm text-text-secondary">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
          </div>
        )}
        {movie.release_date && (
          <div>
            <p className="text-xs text-text-tertiary">Release Date</p>
            <p className="text-sm text-text-secondary">{movie.release_date}</p>
          </div>
        )}
      </div>
    </div>
  );

  const castContent = (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
      {cast.map((member) => (
        <a
          key={member.id}
          href={`https://www.themoviedb.org/person/${member.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group w-[100px] flex-none text-center transition-transform duration-fast ease-standard hover:scale-[1.03]"
        >
          <div className="relative mx-auto h-[100px] w-[100px] overflow-hidden rounded-full bg-surface-2 ring-2 ring-transparent transition-all duration-fast ease-standard group-hover:ring-brand">
            {member.profile_path ? (
              <Image
                src={getImageUrl(member.profile_path, 'w185')}
                alt={member.name}
                fill
                sizes="100px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-tertiary">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs font-medium text-text-primary">{member.name}</p>
          <p className="text-xs text-text-tertiary">{member.character}</p>
        </a>
      ))}
    </div>
  );

  const similarContent = similarItems.length > 0 ? (
    <MediaCarousel title="" items={similarItems} />
  ) : (
    <p className="text-text-tertiary">No similar movies found.</p>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', content: overviewContent },
    ...(cast.length > 0 ? [{ id: 'cast', label: 'Cast', content: castContent }] : []),
    ...(similarItems.length > 0 ? [{ id: 'similar', label: 'Similar', content: similarContent }] : []),
  ];

  return (
    <div>
      <BackButton />

      <MediaDetail
        title={movie.title}
        tagline={movie.tagline}
        overview=""
        posterPath={movie.poster_path}
        backdropPath={movie.backdrop_path}
        rating={movie.vote_average}
        voteCount={movie.vote_count}
        releaseDate={movie.release_date}
        runtime={movie.runtime}
        genres={movie.genres}
        status={movie.status}
      >
        <div className="flex items-center gap-3 pt-2">
          {!showPlayer ? (
            <Button size="lg" onClick={() => setShowPlayer(true)}>
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play Now
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setShowPlayer(false)}>
              Hide Player
            </Button>
          )}
          <WatchlistButton item={movieItem} variant="ghost" size="lg" />
          <button
            onClick={handleShare}
            aria-label="Share this movie"
            className="rounded-lg p-2 text-text-tertiary transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </MediaDetail>

      {/* Player */}
      {showPlayer && (
        <div className="mx-auto max-w-5xl px-4 pb-8 animate-scale-in">
          <VideoPlayer type="movie" tmdbId={movieId} />
        </div>
      )}

      {/* Tabbed content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <TabbedContent tabs={tabs} />
      </div>
    </div>
  );
}
