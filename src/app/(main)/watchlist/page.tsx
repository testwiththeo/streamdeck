'use client';

import { useState, useMemo } from 'react';

import { useWatchlistStore } from '@/store/watchlist-store';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils/cn';
import type { MediaItem } from '@/lib/types/app.types';

type SortOption = 'recent' | 'title' | 'rating';

export default function WatchlistPage() {
  const { items, clearWatchlist } = useWatchlistStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const sortedItems: MediaItem[] = useMemo(() => {
    const sorted = [...items];

    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
      default:
        // Array order represents recency (newest first)
        break;
    }

    return sorted;
  }, [items, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">My Watchlist</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {items.length} {items.length === 1 ? 'title' : 'titles'} saved
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(true)}
            className="text-text-secondary hover:text-error"
          >
            Clear Watchlist
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="h-16 w-16 text-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          }
          title="Watchlist is empty"
          description="Add movies and TV shows to your watchlist to keep track of what you want to watch later."
        />
      ) : (
        <>
          {/* Sort control */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm text-text-tertiary">Sort by:</span>
            <div className="inline-flex rounded-lg bg-surface-1 p-0.5 ring-1 ring-border">
              <button
                onClick={() => setSortBy('recent')}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors duration-fast ease-standard',
                  sortBy === 'recent'
                    ? 'bg-brand text-white'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy('title')}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors duration-fast ease-standard',
                  sortBy === 'title'
                    ? 'bg-brand text-white'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Title
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors duration-fast ease-standard',
                  sortBy === 'rating'
                    ? 'bg-brand text-white'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Rating
              </button>
            </div>
          </div>

          <MediaGrid items={sortedItems} />
        </>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={clearWatchlist}
        title="Clear Watchlist?"
        description="This will permanently remove all items from your watchlist. This action cannot be undone."
        confirmLabel="Clear Watchlist"
        variant="danger"
      />
    </div>
  );
}
