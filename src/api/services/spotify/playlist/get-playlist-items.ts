import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import { spotifyTrackSchema, type SpotifyPaging, type SpotifyTrack } from '../type'
import { getPlaylistItemsSuccessMock } from '@/api/mocks/spotify/playlist/get-playlist-items.mock'

const playlistRowSchema = z
  .object({
    added_at: z.string().nullable().optional().default(null),
    is_local: z.boolean().optional().default(false),
    item: z.unknown().nullable().optional(),
    track: z.unknown().nullable().optional(),
  })
  .transform((row) => ({
    added_at: row.added_at,
    is_local: row.is_local,
    payload: row.item ?? row.track ?? null,
  }))

export interface PlaylistTrack {
  added_at: string | null
  is_local: boolean
  track: SpotifyTrack
}

const responseSchema = z.object({
  items: z.array(playlistRowSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
})

export interface GetPlaylistItemsInput {
  id: string
  limit?: number
  offset?: number
}

export async function getPlaylistItems({
  id,
  limit = 50,
  offset = 0,
}: GetPlaylistItemsInput): Promise<SpotifyPaging<PlaylistTrack>> {
  if (USE_SPOTIFY_MOCK) return getPlaylistItemsSuccessMock

  const response = await apiSpotify.get(`/playlists/${id}/items`, {
    params: { limit, offset },
  })
  const parsed = responseSchema.parse(response.data)

  return {
    ...parsed,
    items: parsed.items.flatMap((row) => {
      const track = spotifyTrackSchema.safeParse(row.payload)
      if (!track.success) return []
      return [{ added_at: row.added_at, is_local: row.is_local, track: track.data }]
    }),
  }
}
