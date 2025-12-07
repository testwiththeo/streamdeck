'use client';

import { EpisodeCard } from './EpisodeCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { TMDBEpisode } from '@/lib/types/tmdb.types';

interface EpisodeListProps {
  episodes: TMDBEpisode[];
  activeEpisode?: number;
  onSelectEpisode: (episodeNumber: number) => void;
  isLoading?: boolean;
}

export function EpisodeList({
  episodes,
  activeEpisode,
  onSelectEpisode,
  isLoading,
}: EpisodeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-2">
            <Skeleton className="h-[65px] w-[120px] flex-none rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-zinc-400">
        No episodes available for this season.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {episodes.map((episode) => (
        <EpisodeCard
          key={episode.id}
          episodeNumber={episode.episode_number}
          name={episode.name}
          overview={episode.overview}
          stillPath={episode.still_path}
          airDate={episode.air_date}
          runtime={episode.runtime}
          isActive={activeEpisode === episode.episode_number}
          onClick={() => onSelectEpisode(episode.episode_number)}
        />
      ))}
    </div>
  );
}
