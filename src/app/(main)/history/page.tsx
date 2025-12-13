'use client';

import { useState, useMemo } from 'react';

import { useHistoryStore } from '@/store/history-store';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils/cn';
import type { MediaItem } from '@/lib/types/app.types';

type SortOption = 'recent' | 'title';

export default function HistoryPage() {
  const { entries, clearHistory } = useHistoryStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Convert history entries to MediaItem format
  const historyItems: MediaItem[] = useMemo(() => {
    const items = entries.map((entry) => ({
      id: entry.mediaId,
      type: entry.type,
      title: entry.title,
      posterUrl: entry.posterUrl,
      rating: 0,
      year: undefined,
      genreIds: [],
      // Preserve timestamp for sorting
      _timestamp: entry.timestamp,
    }));

    if (sortBy === 'title') {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      items.sort((a, b) => b._timestamp - a._timestamp);
    }

    return items;
  }, [entries, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Watch History</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {entries.length} {entries.length === 1 ? 'title' : 'titles'} watched
          </p>
        </div>
        {entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(true)}
            className="text-text-secondary hover:text-error"
          >
            Clear History
          </Button>
        )}
      </div>

      {historyItems.length === 0 ? (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="No watch history"
          description="Start watching movies and TV shows to build your history. Everything you watch will appear here."
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
            </div>
          </div>

          <MediaGrid items={historyItems} />
        </>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={clearHistory}
        title="Clear History?"
        description="This will permanently remove all your watch history. This action cannot be undone."
        confirmLabel="Clear History"
        variant="danger"
      />
    </div>
  );
}
