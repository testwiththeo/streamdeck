'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useState, useMemo } from 'react';

import { MediaCard } from '@/components/media/MediaCard';
import { PosterSkeleton } from '@/components/ui/Skeleton';
import { useInfiniteSearch } from '@/hooks/useInfiniteSearch';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils/cn';
import type { MediaItem } from '@/lib/types/app.types';

type MediaFilter = 'all' | 'movie' | 'tv';

const FILTER_OPTIONS: { value: MediaFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV' },
];

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [filter, setFilter] = useState<MediaFilter>('all');

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteSearch(query);

  const { ref: loadMoreRef } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px',
  });

  const handleIntersection = useCallback(
    (node: Element | null) => {
      if (node && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
      loadMoreRef(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, loadMoreRef]
  );

  const allItems: MediaItem[] =
    data?.pages.flatMap((page) => page.items ?? []) ?? [];

  const filteredItems = useMemo(() => {
    if (filter === 'all') return allItems;
    return allItems.filter((item) => item.type === filter);
  }, [allItems, filter]);

  const handleFilterChange = useCallback(
    (value: MediaFilter) => {
      setFilter(value);
    },
    []
  );

  if (query.length < 2) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-text-secondary">
        <p>Type at least 2 characters to search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Media type filter segmented control */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          {isLoading
            ? 'Searching...'
            : `${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''} for "${query}"`}
        </p>

        <div className="inline-flex rounded-lg bg-surface-1 p-0.5 ring-1 ring-border">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange(value)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-fast ease-standard',
                filter === value
                  ? 'bg-brand text-white'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results grid with staggered reveal */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <PosterSkeleton key={i} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center text-text-secondary">
          <p>No results found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredItems.map((item, index) => (
            <MediaCard
              key={`${item.type}-${item.id}`}
              {...item}
              staggerIndex={index % 12}
            />
          ))}
        </div>
      )}

      {/* Load more with PosterSkeleton instead of spinner */}
      {hasNextPage && (
        <div
          ref={handleIntersection}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <PosterSkeleton key={`load-more-${i}`} />
          ))}
        </div>
      )}

      {isFetchingNextPage && !hasNextPage && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PosterSkeleton key={`fetching-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
