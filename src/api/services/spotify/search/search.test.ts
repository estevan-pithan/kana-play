import { describe, it, expect, vi, beforeEach } from 'vitest'
import { search, SEARCH_MAX_LIMIT } from './search'
import { apiSpotify } from '../api'

vi.mock('../api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api')>()
  return { ...actual, USE_SPOTIFY_MOCK: false }
})

function makeArtist(id: string) {
  return {
    id,
    name: `Artist ${id}`,
    images: [{ url: `https://img/${id}`, height: 640, width: 640 }],
    external_urls: { spotify: `https://open.spotify.com/artist/${id}` },
  }
}

function makeAlbum(id: string) {
  return {
    id,
    name: `Album ${id}`,
    album_type: 'album',
    release_date: '2024-01-01',
    total_tracks: 10,
    images: [{ url: `https://img/${id}`, height: 640, width: 640 }],
    artists: [{ id: 'a1', name: 'Artist a1', external_urls: { spotify: 'https://s' } }],
  }
}

function makeTrack(id: string) {
  return {
    id,
    name: `Track ${id}`,
    duration_ms: 200000,
    album: { id: 'alb1', name: 'Album alb1', images: [{ url: 'https://img/alb1', height: 300, width: 300 }] },
    artists: [{ id: 'a1', name: 'Artist a1', external_urls: { spotify: 'https://s' } }],
    preview_url: null,
  }
}

function makePlaylist(id: string) {
  return {
    id,
    name: `Playlist ${id}`,
    description: null,
    images: [{ url: `https://img/${id}`, height: 300, width: 300 }],
    owner: { id: 'owner1', display_name: 'Owner' },
    tracks: { total: 20 },
    external_urls: { spotify: `https://open.spotify.com/playlist/${id}` },
  }
}

describe('search()', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('type: "all" (round-robin interleave)', () => {
    it('interleaves results in artist, album, track, playlist order', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [makeArtist('a1'), makeArtist('a2')], total: 50, limit: 10, offset: 0, next: 'http://next' },
          albums: { items: [makeAlbum('b1')], total: 30, limit: 10, offset: 0, next: null },
          tracks: { items: [makeTrack('t1'), makeTrack('t2')], total: 40, limit: 10, offset: 0, next: 'http://next' },
          playlists: { items: [makePlaylist('p1')], total: 20, limit: 10, offset: 0, next: null },
        },
      })

      const result = await search({ query: 'test', type: 'all' })

      expect(result.items.map((i) => i.kind)).toEqual([
        'artist', 'album', 'track', 'playlist',
        'artist', 'track',
      ])
      expect(result.items[0]).toEqual({ kind: 'artist', data: expect.objectContaining({ id: 'a1' }) })
    })

    it('aggregates totals from all types', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [], total: 10, limit: 10, offset: 0, next: null },
          albums: { items: [], total: 20, limit: 10, offset: 0, next: null },
          tracks: { items: [], total: 30, limit: 10, offset: 0, next: null },
          playlists: { items: [], total: 40, limit: 10, offset: 0, next: null },
        },
      })

      const result = await search({ query: 'test', type: 'all' })
      expect(result.total).toBe(100)
    })

    it('hasMore is true if any type has a .next', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [], total: 50, limit: 10, offset: 0, next: 'http://next' },
          albums: { items: [], total: 5, limit: 10, offset: 0, next: null },
          tracks: { items: [], total: 5, limit: 10, offset: 0, next: null },
          playlists: { items: [], total: 5, limit: 10, offset: 0, next: null },
        },
      })

      const result = await search({ query: 'test', type: 'all' })
      expect(result.hasMore).toBe(true)
    })

    it('hasMore is false when no type has a .next', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [], total: 5, limit: 10, offset: 0, next: null },
          albums: { items: [], total: 5, limit: 10, offset: 0, next: null },
          tracks: { items: [], total: 5, limit: 10, offset: 0, next: null },
          playlists: { items: [], total: 5, limit: 10, offset: 0, next: null },
        },
      })

      const result = await search({ query: 'test', type: 'all' })
      expect(result.hasMore).toBe(false)
    })

    it('deduplicates items by id', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [makeArtist('dup'), makeArtist('dup')], total: 2, limit: 10, offset: 0, next: null },
          albums: { items: [], total: 0, limit: 10, offset: 0, next: null },
          tracks: { items: [], total: 0, limit: 10, offset: 0, next: null },
          playlists: { items: [], total: 0, limit: 10, offset: 0, next: null },
        },
      })

      const result = await search({ query: 'test', type: 'all' })
      expect(result.items).toHaveLength(1)
    })

    it('filters null items from responses', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [null, makeArtist('a1'), null], total: 3, limit: 10, offset: 0, next: null },
          albums: { items: [], total: 0, limit: 10, offset: 0, next: null },
          tracks: { items: [], total: 0, limit: 10, offset: 0, next: null },
          playlists: { items: [], total: 0, limit: 10, offset: 0, next: null },
        },
      })

      const result = await search({ query: 'test', type: 'all' })
      expect(result.items).toHaveLength(1)
      expect(result.items[0]!.data.id).toBe('a1')
    })
  })

  describe('single-type queries', () => {
    it('artist type returns correct kind and pagination', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [makeArtist('a1'), makeArtist('a2')], total: 50, limit: 10, offset: 0, next: 'http://next' },
        },
      })

      const result = await search({ query: 'pop', type: 'artist' })
      expect(result.items).toHaveLength(2)
      expect(result.items.every((i) => i.kind === 'artist')).toBe(true)
      expect(result.total).toBe(50)
      expect(result.hasMore).toBe(true)
    })

    it('album type returns correct kind', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          albums: { items: [makeAlbum('b1')], total: 10, limit: 10, offset: 0, next: null },
        },
      })

      const result = await search({ query: 'rock', type: 'album' })
      expect(result.items).toHaveLength(1)
      expect(result.items[0]!.kind).toBe('album')
      expect(result.total).toBe(10)
      expect(result.hasMore).toBe(false)
    })

    it('track type returns correct kind', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          tracks: { items: [makeTrack('t1')], total: 100, limit: 10, offset: 0, next: 'http://n' },
        },
      })

      const result = await search({ query: 'love', type: 'track' })
      expect(result.items[0]!.kind).toBe('track')
      expect(result.hasMore).toBe(true)
    })

    it('playlist type returns correct kind', async () => {
      vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          playlists: { items: [makePlaylist('p1')], total: 5, limit: 10, offset: 0, next: null },
        },
      })

      const result = await search({ query: 'chill', type: 'playlist' })
      expect(result.items[0]!.kind).toBe('playlist')
      expect(result.total).toBe(5)
    })
  })

  describe('limit clamping', () => {
    it('clamps limit to SEARCH_MAX_LIMIT', async () => {
      const spy = vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [], total: 0, limit: 10, offset: 0, next: null },
        },
      })

      await search({ query: 'test', type: 'artist', limit: 50 })
      expect(spy).toHaveBeenCalledWith('/search', {
        params: { q: 'test', type: 'artist', limit: SEARCH_MAX_LIMIT, offset: 0 },
      })
    })

    it('passes limit as-is when within bounds', async () => {
      const spy = vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [], total: 0, limit: 5, offset: 0, next: null },
        },
      })

      await search({ query: 'test', type: 'artist', limit: 5 })
      expect(spy).toHaveBeenCalledWith('/search', {
        params: { q: 'test', type: 'artist', limit: 5, offset: 0 },
      })
    })
  })

  describe('API call shape', () => {
    it('type "all" sends all four types comma-joined', async () => {
      const spy = vi.spyOn(apiSpotify, 'get').mockResolvedValue({
        data: {
          artists: { items: [], total: 0, limit: 10, offset: 0, next: null },
          albums: { items: [], total: 0, limit: 10, offset: 0, next: null },
          tracks: { items: [], total: 0, limit: 10, offset: 0, next: null },
          playlists: { items: [], total: 0, limit: 10, offset: 0, next: null },
        },
      })

      await search({ query: 'q', type: 'all', offset: 20 })
      expect(spy).toHaveBeenCalledWith('/search', {
        params: { q: 'q', type: 'artist,album,track,playlist', limit: SEARCH_MAX_LIMIT, offset: 20 },
      })
    })
  })
})
