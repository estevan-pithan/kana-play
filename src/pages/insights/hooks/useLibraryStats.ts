import { useQuery } from '@tanstack/react-query'
import { getSavedTracks } from '@/api/services/spotify/user/get-saved-tracks'
import { getSavedAlbums } from '@/api/services/spotify/user/get-saved-albums'
import { getUserPlaylists } from '@/api/services/spotify/user/get-user-playlists'
import { getFollowedArtists } from '@/api/services/spotify/user/get-followed-artists'
import { INSIGHTS_STALE_TIME } from './useInsightsData'

export interface LibraryStats {
  savedTracks: number
  savedAlbums: number
  playlists: number
  following: number
  isLoading: boolean
  isError: boolean
}

/** Real account totals (the `total` field of each paged library endpoint). */
export function useLibraryStats(): LibraryStats {
  const tracks = useQuery({
    queryKey: ['library', 'saved-tracks-total'],
    queryFn: () => getSavedTracks({ limit: 1 }),
    staleTime: INSIGHTS_STALE_TIME,
  })
  const albums = useQuery({
    queryKey: ['library', 'saved-albums-total'],
    queryFn: () => getSavedAlbums({ limit: 1 }),
    staleTime: INSIGHTS_STALE_TIME,
  })
  const playlists = useQuery({
    queryKey: ['library', 'playlists-total'],
    queryFn: () => getUserPlaylists({ limit: 1 }),
    staleTime: INSIGHTS_STALE_TIME,
  })
  const following = useQuery({
    queryKey: ['library', 'following-total'],
    queryFn: () => getFollowedArtists({ limit: 1 }),
    staleTime: INSIGHTS_STALE_TIME,
  })

  const queries = [tracks, albums, playlists, following]

  return {
    savedTracks: tracks.data?.total ?? 0,
    savedAlbums: albums.data?.total ?? 0,
    playlists: playlists.data?.total ?? 0,
    following: following.data?.total ?? 0,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  }
}
