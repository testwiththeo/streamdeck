import { MediaCard } from '@/components/media/MediaCard';
import { PosterSkeleton } from '@/components/ui/Skeleton';
import type { MediaItem } from '@/lib/types/app.types';

interface MediaGridProps {
  items: MediaItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function MediaGrid({ items, isLoading, emptyMessage = 'No results found.' }: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <PosterSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-zinc-400">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={`${item.type}-${item.id}`} {...item} />
      ))}
    </div>
  );
}
