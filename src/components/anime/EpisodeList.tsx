'use client';

import { cn } from '@/lib/utils/cn';
import { Skeleton } from '@/components/ui/Skeleton';

interface AnimeEpisodeListProps {
  totalEpisodes: number;
  activeEpisode?: number;
  onSelectEpisode: (episodeNumber: number) => void;
  isLoading?: boolean;
}

export function AnimeEpisodeList({
  totalEpisodes,
  activeEpisode,
  onSelectEpisode,
  isLoading,
}: AnimeEpisodeListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-md" />
        ))}
      </div>
    );
  }

  if (totalEpisodes === 0) {
    return (
      <div className="py-8 text-center text-sm text-zinc-400">
        Episode count not available.
      </div>
    );
  }

  const episodes = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
      {episodes.map((ep) => (
        <button
          key={ep}
          onClick={() => onSelectEpisode(ep)}
          className={cn(
            'rounded-md py-2 text-center text-sm font-medium transition-colors',
            activeEpisode === ep
              ? 'bg-red-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
          )}
        >
          {ep}
        </button>
      ))}
    </div>
  );
}
