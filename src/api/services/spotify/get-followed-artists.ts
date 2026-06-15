import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from './api'
import {
  spotifyArtistResponseSchema,
  type SpotifyArtist,
  type SpotifyPaging,
} from './type'
import { getFollowedArtistsSuccessMock } from '@/api/mocks/spotify/get-followed-artists.mock'

export const getFollowedArtistsInputSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  // Spotify uses cursor-based pagination here (after = artist id).
  after: z.string().optional(),
})

export type GetFollowedArtistsInput = z.infer<typeof getFollowedArtistsInputSchema>

// `/me/following?type=artist` wraps the page under an `artists` key and uses
// cursor-based pagination — flatten and surface `next` so callers can detect
// the end of the list. `offset` is synthesized for the shared paging shape.
const responseSchema = z
  .object({
    artists: z.object({
      items: z.array(spotifyArtistResponseSchema),
      total: z.number().default(0),
      limit: z.number(),
      next: z.string().nullable(),
      cursors: z
        .object({ after: z.string().nullable().optional() })
        .optional(),
    }),
  })
  .transform(({ artists }) => ({
    items: artists.items,
    total: artists.total,
    limit: artists.limit,
    offset: 0,
    next: artists.next,
    previous: null,
  }))

export async function getFollowedArtists({
  limit = 20,
  after,
}: GetFollowedArtistsInput = {}): Promise<SpotifyPaging<SpotifyArtist>> {
  if (USE_SPOTIFY_MOCK) return getFollowedArtistsSuccessMock

  const response = await apiSpotify.get('/me/following', {
    params: { type: 'artist', limit, ...(after ? { after } : {}) },
  })
  return responseSchema.parse(response.data)
}
