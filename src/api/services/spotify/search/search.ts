import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import {
  spotifyAlbumSchema,
  spotifyArtistResponseSchema,
  spotifyPlaylistSchema,
  spotifyTrackSchema,
  type SpotifyAlbum,
  type SpotifyArtist,
  type SpotifyPlaylist,
  type SpotifyTrack,
} from '../type'
import { searchArtistsSuccessMock } from '@/api/mocks/spotify/search/search-artists.mock'

export const SEARCH_TYPES = ['all', 'artist', 'album', 'track', 'playlist'] as const
export type SearchType = (typeof SEARCH_TYPES)[number]
export type SingleSearchType = Exclude<SearchType, 'all'>

export type SearchResultItem =
  | { kind: 'artist'; data: SpotifyArtist }
  | { kind: 'album'; data: SpotifyAlbum }
  | { kind: 'track'; data: SpotifyTrack }
  | { kind: 'playlist'; data: SpotifyPlaylist }

export interface SearchResultPage {
  items: SearchResultItem[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export const SEARCH_MAX_LIMIT = 10

export const searchInputSchema = z.object({
  query: z.string().min(1),
  type: z.enum(SEARCH_TYPES).optional(),
  limit: z.number().min(1).max(SEARCH_MAX_LIMIT).optional(),
  offset: z.number().min(0).optional(),
})

export type SearchInput = z.infer<typeof searchInputSchema>

const pageSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item.nullable()).default([]),
    total: z.number().default(0),
    limit: z.number().default(0),
    offset: z.number().default(0),
    next: z.string().nullable().default(null),
  })

const responseSchema = z.object({
  artists: pageSchema(spotifyArtistResponseSchema).optional(),
  albums: pageSchema(spotifyAlbumSchema).optional(),
  tracks: pageSchema(spotifyTrackSchema).optional(),
  playlists: pageSchema(spotifyPlaylistSchema).optional(),
})

const SINGLE_TYPES: SingleSearchType[] = ['artist', 'album', 'track', 'playlist']

function dedupe<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of arr) {
    if (item && !seen.has(item.id)) {
      seen.add(item.id)
      out.push(item)
    }
  }
  return out
}

export async function search({
  query,
  type = 'artist',
  limit = SEARCH_MAX_LIMIT,
  offset = 0,
}: SearchInput): Promise<SearchResultPage> {
  const safeLimit = Math.min(limit, SEARCH_MAX_LIMIT)

  if (USE_SPOTIFY_MOCK) {
    return {
      items: searchArtistsSuccessMock.items.map((data) => ({ kind: 'artist', data })),
      total: searchArtistsSuccessMock.total,
      limit: safeLimit,
      offset,
      hasMore: false,
    }
  }

  if (type === 'all') {
    const response = await apiSpotify.get('/search', {
      params: {
        q: query,
        type: SINGLE_TYPES.join(','),
        limit: safeLimit,
        offset,
      },
    })
    const parsed = responseSchema.parse(response.data)

    const artists = dedupe(
      (parsed.artists?.items ?? []).filter((x): x is SpotifyArtist => x !== null),
    )
    const albums = dedupe(
      (parsed.albums?.items ?? []).filter((x): x is SpotifyAlbum => x !== null),
    )
    const tracks = dedupe(
      (parsed.tracks?.items ?? []).filter((x): x is SpotifyTrack => x !== null),
    )
    const playlists = dedupe(
      (parsed.playlists?.items ?? []).filter((x): x is SpotifyPlaylist => x !== null),
    )

    const items: SearchResultItem[] = []
    const max = Math.max(artists.length, albums.length, tracks.length, playlists.length)
    for (let i = 0; i < max; i += 1) {
      const a = artists[i]
      if (a) items.push({ kind: 'artist', data: a })
      const al = albums[i]
      if (al) items.push({ kind: 'album', data: al })
      const tr = tracks[i]
      if (tr) items.push({ kind: 'track', data: tr })
      const pl = playlists[i]
      if (pl) items.push({ kind: 'playlist', data: pl })
    }

    const total =
      (parsed.artists?.total ?? 0) +
      (parsed.albums?.total ?? 0) +
      (parsed.tracks?.total ?? 0) +
      (parsed.playlists?.total ?? 0)
    const hasMore = Boolean(
      parsed.artists?.next ||
        parsed.albums?.next ||
        parsed.tracks?.next ||
        parsed.playlists?.next,
    )

    return { items, total, limit: safeLimit, offset, hasMore }
  }

  const response = await apiSpotify.get('/search', {
    params: { q: query, type, limit: safeLimit, offset },
  })
  const parsed = responseSchema.parse(response.data)

  let items: SearchResultItem[] = []
  let total = 0
  let hasMore = false

  if (type === 'artist' && parsed.artists) {
    items = dedupe(
      parsed.artists.items.filter((x): x is SpotifyArtist => x !== null),
    ).map((data) => ({ kind: 'artist', data }))
    total = parsed.artists.total
    hasMore = parsed.artists.next !== null
  } else if (type === 'album' && parsed.albums) {
    items = dedupe(
      parsed.albums.items.filter((x): x is SpotifyAlbum => x !== null),
    ).map((data) => ({ kind: 'album', data }))
    total = parsed.albums.total
    hasMore = parsed.albums.next !== null
  } else if (type === 'track' && parsed.tracks) {
    items = dedupe(
      parsed.tracks.items.filter((x): x is SpotifyTrack => x !== null),
    ).map((data) => ({ kind: 'track', data }))
    total = parsed.tracks.total
    hasMore = parsed.tracks.next !== null
  } else if (type === 'playlist' && parsed.playlists) {
    items = dedupe(
      parsed.playlists.items.filter((x): x is SpotifyPlaylist => x !== null),
    ).map((data) => ({ kind: 'playlist', data }))
    total = parsed.playlists.total
    hasMore = parsed.playlists.next !== null
  }

  return { items, total, limit: safeLimit, offset, hasMore }
}
