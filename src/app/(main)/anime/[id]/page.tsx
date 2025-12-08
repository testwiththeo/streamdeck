'use client';

import { use, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { MediaDetail } from '@/components/media/MediaDetail';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { WatchlistButton } from '@/components/media/WatchlistButton';
import { SubDubToggle } from '@/components/anime/SubDubToggle';
import { AnimeEpisodeList } from '@/components/anime/EpisodeList';
import { BackButton } from '@/components/ui/BackButton';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getAnime } from '@/lib/api/mal';
import { getFromStorage, setToStorage } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/constants/defaults';
import { useUIStore } from '@/store/ui-store';
import type { MediaItem } from '@/lib/types/app.types';

export default function AnimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const animeId = Number(id);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [subOrDub, setSubOrDub] = useState<'sub' | 'dub'>(
    () => getFromStorage<'sub' | 'dub'>(STORAGE_KEYS.ANIME_PREFERENCE, 'sub')
  );
  const [showPlayer, setShowPlayer] = useState(false);
  const addToast = useUIStore((s) => s.addToast);

  const animeQuery = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => getAnime(animeId),
    enabled: !isNaN(animeId),
  });

  const handleSubDubChange = (value: 'sub' | 'dub') => {
    setSubOrDub(value);
    setToStorage(STORAGE_KEYS.ANIME_PREFERENCE, value);
  };

  const handleEpisodeSelect = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
  };

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      addToast({ message: 'Link copied to clipboard!', type: 'success' });
    });
  }, [addToast]);

  if (animeQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (animeQuery.error || !animeQuery.data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <svg className="h-16 w-16 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <h1 className="text-2xl font-bold text-text-primary">Anime not found</h1>
        <p className="text-text-secondary">The anime you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const anime = animeQuery.data;
  const animeItem: MediaItem = {
    id: anime.id,
    type: 'anime',
    title: anime.title,
    posterUrl: anime.main_picture?.large ?? '',
    rating: anime.mean ?? 0,
    year: anime.start_season?.year,
    genreIds: anime.genres.map((g) => g.id),
  };

  const genreItems = anime.genres.map((g) => ({ id: g.id, name: g.name }));

  return (
    <div>
      <BackButton />

      <MediaDetail
        title={anime.title}
        overview=""
        posterPath={anime.main_picture?.large ?? null}
        backdropPath={null}
        rating={anime.mean ?? 0}
        voteCount={0}
        genres={genreItems}
        status={anime.status}
      >
        <div className="space-y-2 text-sm text-text-secondary">
          {anime.num_episodes > 0 && (
            <p>{anime.num_episodes} Episodes</p>
          )}
          {anime.studios && anime.studios.length > 0 && (
            <p>Studio: {anime.studios.map((s) => s.name).join(', ')}</p>
          )}
          {anime.start_season && (
            <p>{anime.start_season.season} {anime.start_season.year}</p>
          )}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <WatchlistButton item={animeItem} variant="ghost" size="lg" />
          <button
            onClick={handleShare}
            aria-label="Share this anime"
            className="rounded-lg p-2 text-text-tertiary transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </MediaDetail>

      {/* Episode section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <SubDubToggle value={subOrDub} onChange={handleSubDubChange} />
          {!showPlayer && (
            <Button size="lg" onClick={() => setShowPlayer(true)}>
              <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play Episode {selectedEpisode}
            </Button>
          )}
        </div>

        {/* Player */}
        {showPlayer && (
          <div className="mb-6 animate-scale-in">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Episode {selectedEpisode} ({subOrDub.toUpperCase()})
              </p>
              <Button variant="ghost" size="sm" onClick={() => setShowPlayer(false)}>
                Hide Player
              </Button>
            </div>
            <VideoPlayer
              type="anime"
              malId={animeId}
              episode={selectedEpisode}
              subOrDub={subOrDub}
            />
          </div>
        )}

        {/* Episode grid */}
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Episodes</h3>
        <AnimeEpisodeList
          totalEpisodes={anime.num_episodes || 24}
          activeEpisode={selectedEpisode}
          onSelectEpisode={handleEpisodeSelect}
          isLoading={animeQuery.isLoading}
        />
      </div>

      {/* Related anime */}
      {anime.related_anime && anime.related_anime.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Related Anime</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {anime.related_anime.map((related) => (
              <Link
                key={related.node.id}
                href={`/anime/${related.node.id}`}
                className="group rounded-lg bg-surface-2/50 p-3 transition-all duration-fast ease-standard hover:bg-surface-2 hover:shadow-card active:scale-[0.98]"
              >
                <p className="text-sm font-medium text-text-primary transition-colors group-hover:text-brand">
                  {related.node.title}
                </p>
                <p className="text-xs text-text-tertiary">{related.relation_type_formatted}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
