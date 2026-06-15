import { skipToken, useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { getPlaylist } from '@/api/services/spotify/get-playlist'
import { getPlaylistItems } from '@/api/services/spotify/get-playlist-items'

const FIVE_MIN = 5 * 60 * 1000
const PAGE_SIZE = 50

export function usePlaylist(id: string | undefined) {
  const query = useQuery({
    queryKey: ['playlist', id],
    queryFn: id ? () => getPlaylist(id) : skipToken,
    staleTime: FIVE_MIN,
  })
  return {
    playlist: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export function usePlaylistTracks(id: string | undefined) {
  const query = useInfiniteQuery({
    queryKey: ['playlist-items', id],
    queryFn: id
      ? ({ pageParam }) =>
          getPlaylistItems({ id, limit: PAGE_SIZE, offset: pageParam })
      : skipToken,
    initialPageParam: 0,
    getNextPageParam: (last) => (last.next ? last.offset + last.limit : undefined),
    staleTime: FIVE_MIN,
  })

  const tracks = query.data?.pages.flatMap((p) => p.items) ?? []

  return {
    tracks,
    total: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  }
}
