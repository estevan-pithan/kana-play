import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from './api'
import { spotifyImageSchema, spotifySimplifiedArtistSchema } from './type'
import { getArtistTopTracksSuccessMock } from '@/api/mocks/spotify/get-artist-top-tracks.mock'

const spotifyTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration_ms: z.number(),
  album: z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(spotifyImageSchema),
  }),
  artists: z.array(spotifySimplifiedArtistSchema),
  preview_url: z.string().nullable(),
})

export type SpotifyTrack = z.infer<typeof spotifyTrackSchema>

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
