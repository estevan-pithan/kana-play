import { useState } from 'react'
import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query'

import { getArtist } from '@/api/services/spotify/artist/get-artist'
import { getArtistAlbums } from '@/api/services/spotify/artist/get-artist-albums'
import { getAlbumTracks } from '@/api/services/spotify/album/get-album-tracks'

const FIVE_MIN = 5 * 60 * 1000

export const ALBUMS_PER_PAGE = 8

export function useArtist(id: string | undefined) {
  const query = useQuery({
    queryKey: ['artist', id],
    queryFn: id ? () => getArtist(id) : skipToken,
    staleTime: FIVE_MIN,
  })
  return { artist: query.data, isLoading: query.isLoading, isError: query.isError }
}

export function useArtistAlbums(id: string | undefined) {
  const [page, setPage] = useState(0)

  const query = useQuery({
    queryKey: ['artist-albums', id, page],
    queryFn: id
      ? () =>
          getArtistAlbums({
            id,
            limit: ALBUMS_PER_PAGE,
            offset: page * ALBUMS_PER_PAGE,
          })
      : skipToken,
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

export function useAlbumTracks(albumId: string | undefined) {
  const query = useQuery({
    queryKey: ['album-tracks', albumId],
    queryFn: albumId ? () => getAlbumTracks(albumId) : skipToken,
    staleTime: FIVE_MIN,
  })

  return {
    tracks: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
