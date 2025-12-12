import Image from 'next/image';

import { cn } from '@/lib/utils/cn';
import { formatRating, formatDate, formatRuntime, formatVoteCount } from '@/lib/utils/format';
import { getGenreName } from '@/lib/constants/genres';
import { getImageUrl } from '@/lib/api/tmdb';

interface MediaDetailProps {
  title: string;
  tagline?: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  voteCount: number;
  releaseDate?: string;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  genreIds?: number[];
  status?: string;
  children?: React.ReactNode;
  className?: string;
}

export function MediaDetail({
  title,
  tagline,
  overview,
  posterPath,
  backdropPath,
  rating,
  voteCount,
  releaseDate,
  runtime,
  genres,
  genreIds,
  status,
  children,
  className,
}: MediaDetailProps) {
  const backdropUrl = getImageUrl(backdropPath, 'w1280');
  const posterUrl = getImageUrl(posterPath, 'w500');

  // Resolve genre names
  const genreNames = genres
    ? genres.map((g) => g.name)
    : genreIds
      ? genreIds.map(getGenreName).filter((n) => n !== 'Unknown')
      : [];

  return (
    <div className={cn('relative', className)}>
      {/* Backdrop */}
      {backdropPath && (
        <div className="absolute inset-0 -z-10 h-[500px] overflow-hidden">
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="animate-slow-zoom object-cover opacity-20 blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/80 to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Poster — visible on all screen sizes */}
          <div className="mx-auto w-[200px] flex-none animate-fade-in-up sm:mx-0 sm:w-[240px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-card-hover">
              <Image
                src={posterUrl}
                alt={`Poster for ${title}`}
                fill
                sizes="240px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="animate-fade-in-up stagger-1">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{title}</h1>
              {tagline && <p className="mt-1 text-sm italic text-text-tertiary">{tagline}</p>}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary animate-fade-in-up stagger-2">
              {rating > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-accent-gold/15 px-2 py-0.5 font-semibold text-accent-gold">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {formatRating(rating)}
                  <span className="text-text-tertiary">({formatVoteCount(voteCount)})</span>
                </span>
              )}
              {releaseDate && <span>{formatDate(releaseDate)}</span>}
              {runtime != null && runtime > 0 && <span>{formatRuntime(runtime)}</span>}
              {status && (
                <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs uppercase text-text-tertiary">{status}</span>
              )}
            </div>

            {/* Genres */}
            {genreNames.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-fade-in-up stagger-3">
                {genreNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-surface-2 px-3 py-1 text-xs text-text-secondary"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {overview && (
              <div className="animate-fade-in-up stagger-4">
                <h2 className="mb-2 text-lg font-semibold text-text-primary">Synopsis</h2>
                <p className="max-w-3xl leading-relaxed text-text-secondary">{overview}</p>
              </div>
            )}

            {/* Actions slot */}
            <div className="animate-fade-in-up stagger-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
