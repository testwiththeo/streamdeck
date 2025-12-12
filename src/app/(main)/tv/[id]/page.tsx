'use client';

import { use, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { MediaDetail } from '@/components/media/MediaDetail';
import { MediaCarousel } from '@/components/media/MediaCarousel';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { WatchlistButton } from '@/components/media/WatchlistButton';
import { SeasonSelector } from '@/components/tv/SeasonSelector';
import { EpisodeList } from '@/components/tv/EpisodeList';
import { BackButton } from '@/components/ui/BackButton';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getTVShow, getTVSeason, getTVSimilar, getImageUrl } from '@/lib/api/tmdb';
import { useUIStore } from '@/store/ui-store';
import type { MediaItem } from '@/lib/types/app.types';

export default function TVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tvId = Number(id);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showPlayer, setShowPlayer] = useState(false);
  const addToast = useUIStore((s) => s.addToast);

  const tvQuery = useQuery({
    queryKey: ['tv', tvId],
    queryFn: () => getTVShow(tvId),
    enabled: !isNaN(tvId),
  });

  const seasonQuery = useQuery({
    queryKey: ['tv-season', tvId, selectedSeason],
    queryFn: () => getTVSeason(tvId, selectedSeason),
    enabled: !isNaN(tvId),
  });

  const similarQuery = useQuery({
    queryKey: ['tv-similar', tvId],
    queryFn: () => getTVSimilar(tvId),
    enabled: !isNaN(tvId),
  });

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      addToast({ message: 'Link copied to clipboard!', type: 'success' });
    });
  }, [addToast]);

  if (tvQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (tvQuery.error || !tvQuery.data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <svg className="h-16 w-16 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h1 className="text-2xl font-bold text-text-primary">TV Show not found</h1>
        <p className="text-text-secondary">The TV show you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const show = tvQuery.data;
  const episodes = seasonQuery.data?.episodes ?? [];
  const tvItem: MediaItem = {
    id: show.id,
    type: 'tv',
    title: show.name,
    posterUrl: getImageUrl(show.poster_path),
    rating: show.vote_average,
    year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : undefined,
    genreIds: show.genres?.map((g) => g.id) ?? [],
  };
  const similarItems: MediaItem[] =
    similarQuery.data?.results.slice(0, 10).map((r) => ({
      id: r.id,
      type: 'tv' as const,
      title: r.name,
      posterUrl: getImageUrl(r.poster_path),
      rating: r.vote_average,
      year: r.first_air_date ? new Date(r.first_air_date).getFullYear() : undefined,
      genreIds: r.genre_ids,
    })) ?? [];

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
  };

  const handleEpisodeSelect = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    setShowPlayer(true);
  };

  return (
    <div>
      <BackButton />

      <MediaDetail
        title={show.name}
        overview=""
        posterPath={show.poster_path}
        backdropPath={show.backdrop_path}
        rating={show.vote_average}
        voteCount={show.vote_count}
        releaseDate={show.first_air_date}
        genres={show.genres}
        status={show.status}
      >
        <p className="text-sm text-text-secondary">
          {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''} &middot;{' '}
          {show.number_of_episodes} Episode{show.number_of_episodes !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <WatchlistButton item={tvItem} variant="ghost" size="lg" />
          <button
            onClick={handleShare}
            aria-label="Share this show"
            className="rounded-lg p-2 text-text-tertiary transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </MediaDetail>

      {/* Season/Episode section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <SeasonSelector
            seasons={show.seasons}
            selectedSeason={selectedSeason}
            onChange={handleSeasonChange}
          />
          {!showPlayer && (
            <Button size="lg" onClick={() => setShowPlayer(true)}>
              <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play S{selectedSeason}E{selectedEpisode}
            </Button>
          )}
        </div>

        {/* Player */}
        {showPlayer && (
          <div className="mb-6 animate-scale-in">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Season {selectedSeason}, Episode {selectedEpisode}
              </p>
              <Button variant="ghost" size="sm" onClick={() => setShowPlayer(false)}>
                Hide Player
              </Button>
            </div>
            <VideoPlayer type="tv" tmdbId={tvId} season={selectedSeason} episode={selectedEpisode} />
          </div>
        )}

        {/* Episode list */}
        <EpisodeList
          episodes={episodes}
          activeEpisode={selectedEpisode}
          onSelectEpisode={handleEpisodeSelect}
          isLoading={seasonQuery.isLoading}
        />
      </div>

      {/* Similar shows */}
      {similarItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <MediaCarousel title="Similar Shows" items={similarItems} />
        </div>
      )}
    </div>
  );
}
