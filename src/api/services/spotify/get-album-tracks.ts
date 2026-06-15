import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from './api'
import { spotifySimplifiedArtistSchema } from './type'
import type { SpotifyPaging } from './type'
import { getAlbumTracksSuccessMock } from '@/api/mocks/spotify/get-album-tracks.mock'

/**
 * `/albums/{id}/tracks` returns *simplified* tracks: no nested `album` and no
 * images (the cover belongs to the parent album), but name, duration,
 * track number and artists are present.
 */
export const albumTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration_ms: z.number(),
  track_number: z.number(),
  artists: z.array(spotifySimplifiedArtistSchema),
  preview_url: z.string().nullable().optional().default(null),
})

export type AlbumTrack = z.infer<typeof albumTrackSchema>

const getAlbumTracksResponseSchema = z.object({
  items: z.array(albumTrackSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
})

export async function getAlbumTracks(
  id: string,
  limit = 50,
): Promise<SpotifyPaging<AlbumTrack>> {
  if (USE_SPOTIFY_MOCK) return getAlbumTracksSuccessMock

  const response = await apiSpotify.get(`/albums/${id}/tracks`, {
    params: { limit },
  })
  return getAlbumTracksResponseSchema.parse(response.data)
}
