import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from './api'
import {
  spotifyAlbumSchema,
  spotifyPagingSchema,
  type SpotifyAlbum,
  type SpotifyPaging,
} from './type'
import { getSavedAlbumsSuccessMock } from '@/api/mocks/spotify/get-saved-albums.mock'

export const getSavedAlbumsInputSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
})

export type GetSavedAlbumsInput = z.infer<typeof getSavedAlbumsInputSchema>

// `/me/albums` wraps each album under `{ added_at, album }`. Flatten so the
// shape matches the rest of the album surfaces in the app.
const responseSchema = spotifyPagingSchema(
  z.object({ added_at: z.string(), album: spotifyAlbumSchema }),
).transform((page) => ({
  ...page,
  items: page.items.map((entry) => entry.album),
}))

export async function getSavedAlbums({
  limit = 20,
  offset = 0,
}: GetSavedAlbumsInput = {}): Promise<SpotifyPaging<SpotifyAlbum>> {
  if (USE_SPOTIFY_MOCK) return getSavedAlbumsSuccessMock

  const response = await apiSpotify.get('/me/albums', {
    params: { limit, offset },
  })
  return responseSchema.parse(response.data)
}
