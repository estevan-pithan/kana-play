import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import { spotifyAlbumSchema } from '../type'
import { getArtistAlbumsSuccessMock } from '@/api/mocks/spotify/artist/get-artist-albums.mock'

export type { SpotifyAlbum } from '../type'

export const getArtistAlbumsInputSchema = z.object({
  id: z.string(),
  limit: z.number().min(1).max(10).optional(),
  offset: z.number().min(0).optional(),
})

export type GetArtistAlbumsInput = z.infer<typeof getArtistAlbumsInputSchema>

const getArtistAlbumsResponseSchema = z.object({
  items: z.array(spotifyAlbumSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
})

export type GetArtistAlbumsResponse = z.infer<typeof getArtistAlbumsResponseSchema>

export async function getArtistAlbums({
  id,
  limit = 10,
  offset = 0,
}: GetArtistAlbumsInput): Promise<GetArtistAlbumsResponse> {
  if (USE_SPOTIFY_MOCK) return getArtistAlbumsSuccessMock

  const response = await apiSpotify.get(`/artists/${id}/albums`, {
    params: { limit, offset },
  })

  return getArtistAlbumsResponseSchema.parse(response.data)
}
