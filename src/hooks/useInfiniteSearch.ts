import { useInfiniteQuery } from '@tanstack/react-query';

import { searchMulti, getImageUrl } from '@/lib/api/tmdb';
import type { MediaItem } from '@/lib/types/app.types';
import type { TMDBSearchResult, TMDBMovieResult, TMDBTVResult } from '@/lib/types/tmdb.types';

/**
 * Maps a TMDB search result to an app MediaItem.
 * Only processes movie and TV results; people results are filtered out.
 *
 * @param result - The TMDB search result to map
 * @returns A MediaItem or null if the result type is not supported
 */
function mapToMediaItem(result: TMDBSearchResult): MediaItem | null {
  if (result.media_type === 'movie') {
    const r = result as TMDBMovieResult;
    return {
      id: r.id,
      type: 'movie',
      title: r.title,
      posterUrl: getImageUrl(r.poster_path),
      rating: r.vote_average,
      year: r.release_date ? new Date(r.release_date).getFullYear() : undefined,
      genreIds: r.genre_ids,
      overview: r.overview,
    };
  }
  if (result.media_type === 'tv') {
    const r = result as TMDBTVResult;
    return {
      id: r.id,
      type: 'tv',
      title: r.name,
      posterUrl: getImageUrl(r.poster_path),
      rating: r.vote_average,
      year: r.first_air_date ? new Date(r.first_air_date).getFullYear() : undefined,
      genreIds: r.genre_ids,
      overview: r.overview,
    };
  }
  // Skip people results
  return null;
}

/**
 * Hook for performing paginated multi-search across movies and TV shows.
 * Uses infinite query for automatic pagination and result mapping.
 *
 * @param query - The search query string (minimum 2 characters)
 * @returns TanStack Query result with paginated and mapped MediaItems
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteSearch('star wars');
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {data.pages.map((page) =>
 *       page.items.map((item) => (
 *         <MediaCard key={item.id} item={item} />
 *       ))
 *     )}
 *     {hasNextPage && (
 *       <button onClick={() => fetchNextPage()}>Load More</button>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useInfiniteSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await searchMulti(query, pageParam);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: query.length >= 2,
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.results.map(mapToMediaItem).filter(Boolean) as MediaItem[],
      })),
    }),
  });
}
