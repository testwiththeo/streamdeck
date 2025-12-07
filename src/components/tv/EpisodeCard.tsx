import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import { getImageUrl } from '@/lib/api/tmdb';

interface EpisodeCardProps {
  episodeNumber: number;
  name: string;
  overview?: string;
  stillPath: string | null;
  airDate?: string;
  runtime?: number | null;
  isActive?: boolean;
  onClick?: () => void;
}

export function EpisodeCard({
  episodeNumber,
  name,
  overview,
  stillPath,
  airDate,
  runtime,
  isActive,
  onClick,
}: EpisodeCardProps) {
  const stillUrl = stillPath ? getImageUrl(stillPath, 'w300') : null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full gap-3 rounded-lg p-2 text-left transition-colors',
        'hover:bg-zinc-800/50',
        isActive && 'bg-zinc-800 ring-1 ring-red-500'
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-[65px] w-[120px] flex-none overflow-hidden rounded-md bg-zinc-800">
        {stillUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={stillUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <span className="text-lg font-bold">{episodeNumber}</span>
          </div>
        )}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-zinc-500">Episode {episodeNumber}</p>
        <p className="truncate text-sm font-medium text-white">{name}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
          {airDate && <span>{formatDate(airDate)}</span>}
          {runtime && <span>{runtime}m</span>}
        </div>
        {overview && (
          <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{overview}</p>
        )}
      </div>
    </button>
  );
}
