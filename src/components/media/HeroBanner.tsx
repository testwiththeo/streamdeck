'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';
import { formatRating } from '@/lib/utils/format';
import { getImageUrl } from '@/lib/api/tmdb';
import { ROUTES } from '@/lib/constants/routes';
import { MOVIE_GENRES } from '@/lib/constants/genres';
import type { MediaItem } from '@/lib/types/app.types';
import { WatchlistButton } from '@/components/media/WatchlistButton';
import { Button } from '@/components/ui/Button';

/** Auto-rotation interval in milliseconds. */
const ROTATE_INTERVAL = 8000;

/**
 * Props for the HeroBanner component.
 */
interface HeroBannerProps {
  /** Array of trending media items to display in the banner */
  items: MediaItem[];
}

/**
 * Full-bleed cinematic hero banner with auto-rotating backdrop images.
 * Features crossfade transitions, gradient overlays, metadata, and CTA buttons.
 * Respects prefers-reduced-motion by disabling auto-rotation.
 */
export function HeroBanner({ items }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mql.matches;

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index === currentIndex || isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      // Allow crossfade to complete before unlocking
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [currentIndex, isTransitioning]
  );

  const goNext = useCallback(() => {
    if (items.length <= 1) return;
    goTo((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, goTo]);

  // Auto-rotation timer
  useEffect(() => {
    if (items.length <= 1 || prefersReducedMotion.current) return;

    timerRef.current = setInterval(goNext, ROTATE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext, items.length]);

  // Reset timer on manual navigation
  const handleDotClick = useCallback(
    (index: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      goTo(index);
      // Restart timer if motion is allowed
      if (!prefersReducedMotion.current && items.length > 1) {
        timerRef.current = setInterval(goNext, ROTATE_INTERVAL);
      }
    },
    [goTo, goNext, items.length]
  );

  if (items.length === 0) return null;

  const current = items[currentIndex];
  const detailHref =
    current.type === 'tv' ? ROUTES.TV(current.id) : ROUTES.MOVIE(current.id);

  // Show up to 3 genre chips
  const visibleGenres = current.genreIds
    .slice(0, 3)
    .map((id) => MOVIE_GENRES[id])
    .filter(Boolean);

  return (
    <section
      aria-label="Featured content"
      className="relative h-[70vh] w-full overflow-hidden sm:h-[80vh]"
    >
      {/* Backdrop images — current and previous for crossfade */}
      {items.map((item, idx) => {
        const src = item.backdropUrl
          ? getImageUrl(item.backdropUrl, 'original')
          : getImageUrl(item.posterUrl, 'original');
        const isActive = idx === currentIndex;

        return (
          <div
            key={item.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-cinematic ease-gentle',
              isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
            )}
            aria-hidden={!isActive}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              priority={idx === 0}
              className={cn(
                'object-cover',
                !prefersReducedMotion.current && 'animate-slow-zoom'
              )}
            />
          </div>
        );
      })}

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-surface-0 via-surface-0/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-surface-0/90 via-surface-0/30 to-transparent" />

      {/* Content */}
      <div className="relative z-30 flex h-full flex-col justify-end px-6 pb-16 sm:px-12 sm:pb-20 lg:px-16 lg:pb-24">
        <div
          key={current.id}
          className={cn(
            'max-w-2xl animate-fade-in-up',
            !prefersReducedMotion.current && 'opacity-0'
          )}
        >
          {/* Title */}
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {current.title}
          </h1>

          {/* Metadata row */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Rating pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold/15 px-3 py-1 text-sm font-semibold text-accent-gold">
              <span>★</span>
              {formatRating(current.rating)}
            </span>

            {/* Genre chips */}
            {visibleGenres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-surface-2/70 px-3 py-1 text-xs font-medium text-text-secondary backdrop-blur-sm"
              >
                {genre}
              </span>
            ))}

            {/* Year */}
            {current.year && (
              <span className="text-sm text-text-tertiary">{current.year}</span>
            )}
          </div>

          {/* Overview */}
          {current.overview && (
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {current.overview}
            </p>
          )}

          {/* CTA buttons */}
          <div className="mt-6 flex items-center gap-3">
            <Link href={detailHref}>
              <Button size="lg" className="gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
                Play Now
              </Button>
            </Link>

            <WatchlistButton item={current} variant="ghost" size="lg" />
          </div>
        </div>

        {/* Dot indicators */}
        {items.length > 1 && (
          <div
            className="mt-8 flex items-center gap-2"
            role="tablist"
            aria-label="Banner navigation"
          >
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Show item ${idx + 1}`}
                onClick={() => handleDotClick(idx)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-normal ease-standard',
                  idx === currentIndex
                    ? 'w-8 bg-brand'
                    : 'w-1.5 bg-text-tertiary hover:bg-text-secondary'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
