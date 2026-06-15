import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import {
  spotifyPagingSchema,
  spotifyTrackSchema,
  type SpotifyPaging,
  type SpotifyTrack,
} from '../type'
import { getSavedTracksSuccessMock } from '@/api/mocks/spotify/user/get-saved-tracks.mock'

export const getSavedTracksInputSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
})

export type GetSavedTracksInput = z.infer<typeof getSavedTracksInputSchema>

const responseSchema = spotifyPagingSchema(
  z.object({ added_at: z.string(), track: spotifyTrackSchema }),
).transform((page) => ({
  ...page,
  items: page.items.map((entry) => entry.track),
}))

/** GET /me/tracks — the user's "Liked Songs". Used for the Library Stats total. */
export async function getSavedTracks({ limit = 20, offset = 0 }: GetSavedTracksInput = {}): Promise<
  SpotifyPaging<SpotifyTrack>
> {
  if (USE_SPOTIFY_MOCK) return getSavedTracksSuccessMock

  const response = await apiSpotify.get('/me/tracks', {
    params: { limit, offset },
  })
  return responseSchema.parse(response.data)
}
