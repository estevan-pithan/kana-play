import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import { spotifyTrackSchema, type SpotifyTrack } from '../type'
import { getRecentlyPlayedSuccessMock } from '@/api/mocks/spotify/player/get-recently-played.mock'

export const getRecentlyPlayedInputSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  /** Unix ms cursor — returns items played after this position. */
  after: z.number().optional(),
  before: z.number().optional(),
})

export type GetRecentlyPlayedInput = z.infer<typeof getRecentlyPlayedInputSchema>

export interface PlayHistoryEntry {
  track: SpotifyTrack
  playedAt: string
}

export interface RecentlyPlayed {
  items: PlayHistoryEntry[]
  next: string | null
  cursorAfter: string | null
}

const responseSchema = z
  .object({
    items: z.array(
      z.object({
        track: spotifyTrackSchema,
        played_at: z.string(),
      }),
    ),
    next: z.string().nullable().default(null),
    cursors: z
      .object({ after: z.string().nullable().optional(), before: z.string().nullable().optional() })
      .nullable()
      .optional(),
  })
  .transform(
    ({ items, next, cursors }): RecentlyPlayed => ({
      items: items.map((entry) => ({ track: entry.track, playedAt: entry.played_at })),
      next,
      cursorAfter: cursors?.after ?? null,
    }),
  )

/** GET /me/player/recently-played — up to 50 most recent plays with timestamps. */
export async function getRecentlyPlayed({
  limit = 50,
  after,
  before,
}: GetRecentlyPlayedInput = {}): Promise<RecentlyPlayed> {
  if (USE_SPOTIFY_MOCK) return getRecentlyPlayedSuccessMock

  const response = await apiSpotify.get('/me/player/recently-played', {
    params: { limit, after, before },
  })
  return responseSchema.parse(response.data)
}
