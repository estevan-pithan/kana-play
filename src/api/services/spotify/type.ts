import { z } from 'zod'

export const spotifyImageSchema = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
})

export type SpotifyImage = z.infer<typeof spotifyImageSchema>

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
  external_urls: z.object({ spotify: z.string() }),
})

export type SpotifyArtist = z.infer<typeof spotifyArtistResponseSchema>

export const spotifyAlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  album_type: z.string(),
  release_date: z.string(),
  total_tracks: z.number(),
  images: z.array(spotifyImageSchema),
  artists: z.array(spotifySimplifiedArtistSchema),
})

export type SpotifyAlbum = z.infer<typeof spotifyAlbumSchema>

export const spotifyTrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration_ms: z.number(),
  album: z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(spotifyImageSchema),
  }),
  artists: z.array(spotifySimplifiedArtistSchema),
  preview_url: z.string().nullable().optional().default(null),
})

export type SpotifyTrack = z.infer<typeof spotifyTrackSchema>

const trackCountSchema = z.object({ total: z.number() })

export const spotifyPlaylistSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().default(null),
    images: z.array(spotifyImageSchema).default([]),
    owner: z.object({
      id: z.string(),
      display_name: z.string().nullable().default(null),
    }),
    tracks: trackCountSchema.optional(),
    items: trackCountSchema.optional(),
    external_urls: z.object({ spotify: z.string() }),
  })
  .transform(({ items, tracks, ...rest }) => ({
    ...rest,
    tracks: tracks ?? items ?? { total: 0 },
  }))

export type SpotifyPlaylist = z.infer<typeof spotifyPlaylistSchema>

export const spotifyUserProfileSchema = z.object({
  id: z.string(),
  display_name: z.string().nullable().default(null),
  email: z.string().optional(),
  images: z.array(spotifyImageSchema).default([]),
  external_urls: z.object({ spotify: z.string() }),
})

export type SpotifyUserProfile = z.infer<typeof spotifyUserProfileSchema>

export function spotifyPagingSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
  })
}

export interface SpotifyPaging<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  next: string | null
  previous: string | null
}
