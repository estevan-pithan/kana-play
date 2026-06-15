import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from './api'
import { spotifyTrackSchema } from './type'
import { getArtistTopTracksSuccessMock } from '@/api/mocks/spotify/get-artist-top-tracks.mock'

export type { SpotifyTrack } from './type'

const getArtistTopTracksResponseSchema = z.object({
  tracks: z.array(spotifyTrackSchema),
})

export type GetArtistTopTracksResponse = z.infer<typeof getArtistTopTracksResponseSchema>

export async function getArtistTopTracks(
  id: string,
  market = 'US',
): Promise<GetArtistTopTracksResponse> {
  if (USE_SPOTIFY_MOCK) return getArtistTopTracksSuccessMock

  // `market` is required in practice: with a client-credentials token there is no
  // user country, so the endpoint returns no tracks unless a market is provided.
  const response = await apiSpotify.get(`/artists/${id}/top-tracks`, {
    params: { market },
  })
  return getArtistTopTracksResponseSchema.parse(response.data)
}
