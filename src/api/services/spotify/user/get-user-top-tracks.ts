import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import {
  spotifyPagingSchema,
  spotifyTrackSchema,
  type SpotifyPaging,
  type SpotifyTrack,
} from '../type'
import { getUserTopTracksSuccessMock } from '@/api/mocks/spotify/user/get-user-top-tracks.mock'

export const getUserTopTracksInputSchema = z.object({
  timeRange: z.enum(['short_term', 'medium_term', 'long_term']).optional(),
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
})

export type GetUserTopTracksInput = z.infer<typeof getUserTopTracksInputSchema>

const responseSchema = spotifyPagingSchema(spotifyTrackSchema)

export async function getUserTopTracks({
  timeRange = 'medium_term',
  limit = 20,
  offset = 0,
}: GetUserTopTracksInput = {}): Promise<SpotifyPaging<SpotifyTrack>> {
  if (USE_SPOTIFY_MOCK) return getUserTopTracksSuccessMock

  const response = await apiSpotify.get('/me/top/tracks', {
    params: { time_range: timeRange, limit, offset },
  })
  return responseSchema.parse(response.data)
}
