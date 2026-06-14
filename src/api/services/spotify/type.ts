import { z } from 'zod'

/**
 * Shared Spotify schemas/types reused across more than one endpoint in this domain.
 * Endpoint-specific schemas stay in their own service file.
 */

export const spotifyImageSchema = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
})

export type SpotifyImage = z.infer<typeof spotifyImageSchema>

/** Slim artist reference embedded in tracks and albums. */
export const spotifySimplifiedArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  external_urls: z.object({ spotify: z.string() }),
})

export type SpotifySimplifiedArtist = z.infer<typeof spotifySimplifiedArtistSchema>

export const spotifyArtistResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(spotifyImageSchema).default([]),
  // The `/search` endpoint returns slim artist objects WITHOUT genres,
  // followers or popularity — those only come from the full `/artists/{id}`
  // endpoint. Defaulted so search results parse while full objects keep their
  // real values, and downstream code can always read them safely.
  genres: z.array(z.string()).default([]),
  followers: z.object({ total: z.number() }).default({ total: 0 }),
  popularity: z.number().default(0),
  external_urls: z.object({ spotify: z.string() }),
})

export type SpotifyArtist = z.infer<typeof spotifyArtistResponseSchema>

/** Generic shape of Spotify's paginated collections. */
export interface SpotifyPaging<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  next: string | null
  previous: string | null
}
