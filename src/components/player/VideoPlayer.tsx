'use client';

import { useMemo, useState } from 'react';

import { buildVidLinkUrl } from '@/lib/api/vidlink';
import { useSettingsStore } from '@/store/settings-store';
import { cn } from '@/lib/utils/cn';
import type { VideoPlayerProps } from '@/lib/types/player.types';

export function VideoPlayer({
  type,
  tmdbId,
  malId,
  season,
  episode,
  subOrDub,
  options,
  onError,
  className,
}: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const settings = useSettingsStore();

  const mergedOptions = useMemo(
    () => ({
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      icons: settings.icons,
      iconColor: settings.iconColor,
      autoplay: settings.autoplay,
      nextbutton: settings.nextbutton,
      player: settings.player,
      title: settings.title,
      poster: settings.poster,
      ...options,
    }),
    [settings, options]
  );

  const src = useMemo(() => {
    try {
      return buildVidLinkUrl({
        type,
        tmdbId,
        malId,
        season,
        episode,
        subOrDub,
        options: mergedOptions,
      });
    } catch {
      return '';
    }
  }, [type, tmdbId, malId, season, episode, subOrDub, mergedOptions]);

  const handleError = () => {
    setHasError(true);
    onError?.({ code: 'LOAD_FAILED', message: 'Failed to load video player', retryable: true });
  };

  const handleRetry = () => {
    setHasError(false);
  };

  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-zinc-900">
        <p className="text-zinc-400">No video source available.</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-xl bg-zinc-900">
        <svg
          className="h-12 w-12 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p className="text-sm text-zinc-400">Failed to load video player.</p>
        <button
          onClick={handleRetry}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden rounded-xl bg-black', className)}>
      <iframe
        src={src}
        title="Video Player"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="no-referrer"
        className="h-full w-full"
        onError={handleError}
      />
    </div>
  );
}
