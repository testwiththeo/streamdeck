'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';
import { MediaCard } from '@/components/media/MediaCard';
import type { MediaItem } from '@/lib/types/app.types';

/**
 * Props for the MediaCarousel component.
 */
interface MediaCarouselProps {
  /** Section heading text */
  title: string;
  /** Array of media items to display */
  items: MediaItem[];
  /** Starting stagger index offset passed through to each MediaCard */
  staggerIndex?: number;
  /** Additional CSS classes for the section wrapper */
  className?: string;
}

/**
 * A horizontal scrollable carousel of media cards with navigation arrows.
 * Features smooth scroll-snap, auto-hiding arrows when all items are visible,
 * and focus-visible rings on navigation buttons.
 */
export function MediaCarousel({ title, items, staggerIndex = 0, className }: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isAllVisible, setIsAllVisible] = useState(false);

  /** Check whether the content overflows and update arrow visibility. */
  const checkOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const allVisible = el.scrollWidth <= el.clientWidth + 1;
    setIsAllVisible(allVisible);
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkOverflow();

    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    el.addEventListener('scroll', checkOverflow, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', checkOverflow);
    };
  }, [checkOverflow, items]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <section className={cn('relative', className)}>
      {/* Section heading */}
      <h2 className="mb-4 px-6 text-xl font-semibold tracking-tight text-text-primary sm:px-12 sm:text-2xl lg:px-16">
        {title}
      </h2>

      {/* Carousel container */}
      <div className="group/carousel relative">
        {/* Left arrow */}
        {!isAllVisible && canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className={cn(
              'absolute top-1/2 left-2 z-10 -translate-y-1/2',
              'flex h-10 w-10 items-center justify-center rounded-full',
              'bg-surface-1/90 text-text-primary shadow-glass backdrop-blur-sm',
              'opacity-0 transition-opacity duration-fast ease-standard',
              'group-hover/carousel:opacity-100',
              'hover:bg-surface-2',
              'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth px-6 pb-4 sm:px-12 lg:px-16"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item, idx) => (
            <div key={item.id} style={{ scrollSnapAlign: 'start' }}>
              <MediaCard
                {...item}
                staggerIndex={staggerIndex + idx + 1}
              />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        {!isAllVisible && canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className={cn(
              'absolute top-1/2 right-2 z-10 -translate-y-1/2',
              'flex h-10 w-10 items-center justify-center rounded-full',
              'bg-surface-1/90 text-text-primary shadow-glass backdrop-blur-sm',
              'opacity-0 transition-opacity duration-fast ease-standard',
              'group-hover/carousel:opacity-100',
              'hover:bg-surface-2',
              'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
