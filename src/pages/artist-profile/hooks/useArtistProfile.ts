import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getArtist } from '@/api/services/spotify/get-artist'
import { getArtistAlbums } from '@/api/services/spotify/get-artist-albums'
import { getAlbumTracks } from '@/api/services/spotify/get-album-tracks'

const FIVE_MIN = 5 * 60 * 1000

/** Albums shown per page in the table (no infinite scroll — explicit paging). */
export const ALBUMS_PER_PAGE = 8

/** Loads the artist header (name, image, genres) — followers/popularity dropped. */
export function useArtist(id: string | undefined) {
  const query = useQuery({
    queryKey: ['artist', id],
    queryFn: () => getArtist(id!),
    enabled: Boolean(id),
    staleTime: FIVE_MIN,
  })
  return { artist: query.data, isLoading: query.isLoading, isError: query.isError }
}

/** Offset-paginated albums table state + data. */
export function useArtistAlbums(id: string | undefined) {
  const [page, setPage] = useState(0)

  const query = useQuery({
    queryKey: ['artist-albums', id, page],
    queryFn: () =>
      getArtistAlbums({
        id: id!,
        limit: ALBUMS_PER_PAGE,
        offset: page * ALBUMS_PER_PAGE,
      }),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
    staleTime: FIVE_MIN,
  })

  const total = query.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / ALBUMS_PER_PAGE))

  return {
    albums: query.data?.items ?? [],
    total,
    page,
    totalPages,
    setPage,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
  }
}

/** Tracks of the selected album — only fetched while an album is open. */
export function useAlbumTracks(albumId: string | undefined) {
  const query = useQuery({
    queryKey: ['album-tracks', albumId],
    queryFn: () => getAlbumTracks(albumId!),
    enabled: Boolean(albumId),
    staleTime: FIVE_MIN,
  })

  return {
    tracks: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
