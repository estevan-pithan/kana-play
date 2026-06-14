import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from './api'
import { spotifyArtistResponseSchema } from './type'
import type { SpotifyArtist, SpotifyPaging } from './type'
import { searchArtistsSuccessMock } from '@/api/mocks/spotify/search-artists.mock'

export const searchArtistsInputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
})

export type SearchArtistsInput = z.infer<typeof searchArtistsInputSchema>

const searchArtistsResponseSchema = z.object({
  artists: z.object({
    items: z.array(spotifyArtistResponseSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
  }),
})

export type SearchArtistsResponse = z.infer<typeof searchArtistsResponseSchema>

const MAX_PAGE_SIZE = 10

async function fetchSearchArtistsChunk(
  query: string,
  limit: number,
  offset: number,
): Promise<SpotifyPaging<SpotifyArtist>> {
  const response = await apiSpotify.get('/search', {
    params: { type: 'artist', q: query, limit, offset },
  })
  return searchArtistsResponseSchema.parse(response.data).artists
}

export async function searchArtists({
  query,
  limit = 20,
  offset = 0,
}: SearchArtistsInput): Promise<SpotifyPaging<SpotifyArtist>> {
  if (USE_SPOTIFY_MOCK) return searchArtistsSuccessMock

  // Spotify's `/search` caps `limit` at 10, but the spec asks for pages of 20.
  // Fan out into sequential 10-item chunks and stitch them back into one page,
  // tracking the original `offset` / `limit` so consumers keep accurate pagination.
  const chunks: { limit: number; offset: number }[] = []
  let remaining = limit
  let cursor = offset
  while (remaining > 0) {
    const size = Math.min(remaining, MAX_PAGE_SIZE)
    chunks.push({ limit: size, offset: cursor })
    remaining -= size
    cursor += size
  }

  const responses = await Promise.all(
    chunks.map((chunk) => fetchSearchArtistsChunk(query, chunk.limit, chunk.offset)),
  )

  const items = responses.flatMap((r) => r.items)
  const total = responses[0]?.total ?? 0
  const endOffset = offset + items.length

  return {
    items,
    total,
    limit,
    offset,
    next: endOffset < total ? String(endOffset) : null,
    previous: offset > 0 ? String(Math.max(0, offset - limit)) : null,
  }
}
