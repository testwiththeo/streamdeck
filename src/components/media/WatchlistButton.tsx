'use client';

import { useState } from 'react';

import { useWatchlistStore } from '@/store/watchlist-store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { MediaItem } from '@/lib/types/app.types';

interface WatchlistButtonProps {
  item: MediaItem;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WatchlistButton({
  item,
  variant = 'ghost',
  size = 'sm',
  className,
}: WatchlistButtonProps) {
  const { addItem, removeItem, isInWatchlist } = useWatchlistStore();
  const inList = isInWatchlist(item.id, item.type);
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);

    if (inList) {
      removeItem(item.id, item.type);
    } else {
      addItem(item);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'transition-all duration-fast ease-standard',
        inList && 'text-brand',
        className
      )}
      aria-label={inList ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`}
    >
      <svg
        className={cn(
          'mr-1.5 h-4 w-4 transition-transform duration-fast ease-spring',
          inList && 'fill-current',
          animate && 'animate-heart-pulse'
        )}
        fill={inList ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {inList ? 'In Watchlist' : 'Watchlist'}
    </Button>
  );
}
