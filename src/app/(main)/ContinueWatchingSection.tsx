'use client';

import { useMemo } from 'react';

import { MediaCard } from '@/components/media/MediaCard';
import { useHistoryStore } from '@/store/history-store';
import type { MediaItem } from '@/lib/types/app.types';

/**
 * Client component that displays the "Continue Watching" section.
 * Reads watch history from the Zustand store and shows cards with progress bars.
 */
export function ContinueWatchingSection() {
  // Select the stable entries array, not a computed method (which returns a new array every call)
  const entries = useHistoryStore((s) => s.entries);

  // Derive continue watching list with useMemo to avoid re-computation
  const continueWatching = useMemo(
    () =>
      entries
        .filter((e) => !e.completed && e.progress > 5 && e.progress < 95)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10),
    [entries]
  );

  const items: { media: MediaItem; progress: number }[] = useMemo(
    () =>
      continueWatching.map((entry) => ({
        media: {
          id: entry.mediaId,
          type: entry.type,
          title: entry.title,
          posterUrl: entry.posterUrl,
          rating: 0,
          genreIds: [],
        },
        progress: entry.progress,
      })),
    [continueWatching]
  );

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 px-6 text-xl font-semibold tracking-tight text-text-primary sm:px-12 sm:text-2xl lg:px-16">
        Continue Watching
      </h2>
      <div
        className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth px-6 pb-4 sm:px-12 lg:px-16"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map(({ media, progress }, idx) => (
          <div key={media.id} style={{ scrollSnapAlign: 'start' }}>
            <MediaCard
              {...media}
              progress={progress}
              staggerIndex={idx + 1}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
