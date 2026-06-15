import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import {
  spotifyArtistResponseSchema,
  spotifyPagingSchema,
  type SpotifyArtist,
  type SpotifyPaging,
} from '../type'
import { getUserTopArtistsSuccessMock } from '@/api/mocks/spotify/user/get-user-top-artists.mock'

export const getUserTopArtistsInputSchema = z.object({
  timeRange: z.enum(['short_term', 'medium_term', 'long_term']).optional(),
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
})

export type GetUserTopArtistsInput = z.infer<typeof getUserTopArtistsInputSchema>

const responseSchema = spotifyPagingSchema(spotifyArtistResponseSchema)

export async function getUserTopArtists({
  timeRange = 'medium_term',
  limit = 20,
  offset = 0,
}: GetUserTopArtistsInput = {}): Promise<SpotifyPaging<SpotifyArtist>> {
  if (USE_SPOTIFY_MOCK) return getUserTopArtistsSuccessMock

  const response = await apiSpotify.get('/me/top/artists', {
    params: { time_range: timeRange, limit, offset },
  })
  return responseSchema.parse(response.data)
}
