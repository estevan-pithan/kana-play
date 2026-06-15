import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import {
  spotifyPagingSchema,
  spotifyPlaylistSchema,
  type SpotifyPaging,
  type SpotifyPlaylist,
} from '../type'
import { getUserPlaylistsSuccessMock } from '@/api/mocks/spotify/user/get-user-playlists.mock'

export const getUserPlaylistsInputSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
})

export type GetUserPlaylistsInput = z.infer<typeof getUserPlaylistsInputSchema>

const responseSchema = z
  .object({
    items: z.array(spotifyPlaylistSchema.nullable()),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
  })
  .transform((page) => ({
    ...page,
    items: page.items.filter((item): item is SpotifyPlaylist => item !== null),
  }))

export async function getUserPlaylists({
  limit = 20,
  offset = 0,
}: GetUserPlaylistsInput = {}): Promise<SpotifyPaging<SpotifyPlaylist>> {
  if (USE_SPOTIFY_MOCK) return getUserPlaylistsSuccessMock

  const response = await apiSpotify.get('/me/playlists', {
    params: { limit, offset },
  })
  return responseSchema.parse(response.data)
}

export type { SpotifyPlaylist } from '../type'
export const userPlaylistsPagingSchema = spotifyPagingSchema(spotifyPlaylistSchema)
