import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import {
  getUserPlaylists,
  type SpotifyPlaylist,
} from '@/api/services/spotify/user/get-user-playlists'
import { getUserTopArtists } from '@/api/services/spotify/user/get-user-top-artists'
import { getUserTopTracks } from '@/api/services/spotify/user/get-user-top-tracks'
import { getFollowedArtists } from '@/api/services/spotify/user/get-followed-artists'
import { getSavedAlbums } from '@/api/services/spotify/user/get-saved-albums'
import type {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPaging,
  SpotifyTrack,
} from '@/api/services/spotify/type'

const FIVE_MIN = 5 * 60 * 1000
const PAGE_SIZE = 12

/** Uniform shape every SectionRow consumes — flat items plus carousel controls. */
export interface HomeSection<T> {
  items: T[]
  isLoading: boolean
  isError: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  /** Safe to call repeatedly — no-ops when already fetching or fully loaded. */
  loadMore: () => void
}

/** offset-based collections (`/me/playlists`, `/me/top/*`, `/me/albums`). */
function nextOffset<T>(lastPage: SpotifyPaging<T>): number | undefined {
  const offset = lastPage.offset + lastPage.limit
  return offset < lastPage.total ? offset : undefined
}

export function useHomeData() {
  const playlistsQuery = useInfiniteQuery({
    queryKey: ['home', 'playlists'],
    queryFn: ({ pageParam }) =>
      getUserPlaylists({ limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: nextOffset,
    staleTime: FIVE_MIN,
  })

  const topArtistsQuery = useInfiniteQuery({
    queryKey: ['home', 'top-artists'],
    queryFn: ({ pageParam }) =>
      getUserTopArtists({ limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: nextOffset,
    staleTime: FIVE_MIN,
  })

  const topTracksQuery = useInfiniteQuery({
    queryKey: ['home', 'top-tracks'],
    queryFn: ({ pageParam }) =>
      getUserTopTracks({ limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: nextOffset,
    staleTime: FIVE_MIN,
  })

  const followedArtistsQuery = useInfiniteQuery({
    queryKey: ['home', 'followed-artists'],
    queryFn: ({ pageParam }) =>
      getFollowedArtists({ limit: PAGE_SIZE, after: pageParam }),
    // `/me/following` is cursor-based: the next `after` is the last artist id,
    // and `next` is null once the list is exhausted.
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.next ? (lastPage.items.at(-1)?.id ?? undefined) : undefined,
    staleTime: FIVE_MIN,
  })

  const savedAlbumsQuery = useInfiniteQuery({
    queryKey: ['home', 'saved-albums'],
    queryFn: ({ pageParam }) =>
      getSavedAlbums({ limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: nextOffset,
    staleTime: FIVE_MIN,
  })

  const playlists = useSection<SpotifyPlaylist>(playlistsQuery)
  const topArtists = useSection<SpotifyArtist>(topArtistsQuery)
  const topTracks = useSection<SpotifyTrack>(topTracksQuery)
  const followedArtists = useSection<SpotifyArtist>(followedArtistsQuery)
  const savedAlbums = useSection<SpotifyAlbum>(savedAlbumsQuery)

  return { playlists, topArtists, topTracks, followedArtists, savedAlbums }
}

type InfiniteResult<T> = ReturnType<
  typeof useInfiniteQuery<SpotifyPaging<T>>
>

function useSection<T>(query: InfiniteResult<T>): HomeSection<T> {
  const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    query

  const items = useMemo<T[]>(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  return {
    items,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    loadMore: () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
    },
  }
}
