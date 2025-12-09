import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/utils/cn';
import { formatRating, formatYear } from '@/lib/utils/format';
import { ROUTES } from '@/lib/constants/routes';
import type { MediaItem } from '@/lib/types/app.types';

interface MediaCardProps extends MediaItem {
  className?: string;
  /** Watch progress (0-100). Shows a progress bar when provided. */
  progress?: number;
  /** Stagger index for entry animation delay */
  staggerIndex?: number;
}

export function MediaCard({
  id,
  type,
  title,
  posterUrl,
  rating,
  year,
  className,
  progress,
  staggerIndex,
}: MediaCardProps) {
  const href =
    type === 'movie'
      ? ROUTES.MOVIE(id)
      : type === 'tv'
        ? ROUTES.TV(id)
        : ROUTES.ANIME(id);

  const staggerClass = staggerIndex != null ? `stagger-${Math.min(staggerIndex + 1, 12)}` : '';

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg',
        'transition-all duration-normal ease-standard',
        'hover:scale-[1.03] hover:z-10 hover:shadow-card-hover',
        'active:scale-[0.98] active:duration-instant',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
        staggerClass && `animate-fade-in-up ${staggerClass}`,
        className
      )}
      aria-label={`View details for ${title}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface-2">
        <Image
          src={posterUrl || '/placeholder-poster.jpg'}
          alt={`Poster for ${title}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          className="object-cover transition-transform duration-normal ease-standard group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover overlay — gradient + info */}
        <div
          className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent
                     opacity-0 transition-opacity duration-normal ease-standard group-hover:opacity-100"
        >
          <div className="p-3">
            <h3 className="line-clamp-2 text-sm font-semibold text-white">{title}</h3>
            <div className="mt-1 flex items-center gap-2">
              {rating > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-accent-gold">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {formatRating(rating)}
                </span>
              )}
              {year && (
                <span className="text-xs text-zinc-300">{formatYear(String(year))}</span>
              )}
            </div>
          </div>
        </div>

        {/* Rating badge (always visible) */}
        {rating > 0 && (
          <div className="absolute top-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-accent-gold backdrop-blur-sm">
            {formatRating(rating)}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2 rounded-md bg-brand/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          {type}
        </div>

        {/* Progress bar */}
        {progress != null && progress > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1 bg-black/50"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(progress)}% watched`}
          >
            <div
              className="h-full rounded-r-full bg-brand transition-all duration-slow ease-standard"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Info below poster */}
      <div className="mt-2 space-y-0.5 px-0.5">
        <h3 className="line-clamp-1 text-sm font-medium text-text-primary">{title}</h3>
        {year && <p className="text-xs text-text-tertiary">{formatYear(String(year))}</p>}
      </div>
    </Link>
  );
}
