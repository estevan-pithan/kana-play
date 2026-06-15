import type {
  PlayHistoryEntry,
  RecentlyPlayed,
} from '@/api/services/spotify/player/get-recently-played'
import type { SpotifyTrack } from '@/api/services/spotify/type'

const HOUR = 60 * 60 * 1000

function track(
  id: string,
  name: string,
  artistId: string,
  artistName: string,
  durationMs: number,
): SpotifyTrack {
  return {
    id,
    name,
    duration_ms: durationMs,
    album: { id: `al-${id}`, name: `${name} (Single)`, images: [] },
    artists: [{ id: artistId, name: artistName, external_urls: { spotify: '' } }],
    preview_url: null,
  }
}

/** Built relative to load time so the trend always covers the last several days. */
function buildItems(): PlayHistoryEntry[] {
  const now = Date.now()
  const plays: [SpotifyTrack, number][] = [
    [track('t1', 'Midnight City', 'a1', 'M83', 244_000), 2 * HOUR],
    [track('t2', 'Outro', 'a1', 'M83', 380_000), 3 * HOUR],
    [track('t3', 'Nightcall', 'a2', 'Kavinsky', 258_000), 20 * HOUR],
    [track('t4', 'Resonance', 'a3', 'HOME', 211_000), 26 * HOUR],
    [track('t5', 'Sunset', 'a3', 'HOME', 230_000), 30 * HOUR],
    [track('t6', 'Strangers', 'a4', 'The Midnight', 312_000), 48 * HOUR],
    [track('t7', 'Sunset (Reprise)', 'a4', 'The Midnight', 198_000), 50 * HOUR],
    [track('t8', 'A Real Hero', 'a5', 'College', 264_000), 54 * HOUR],
    [track('t9', 'Tech Noir', 'a6', 'Gunship', 289_000), 72 * HOUR],
    [track('t10', 'Fly For Your Life', 'a6', 'Gunship', 301_000), 74 * HOUR],
    [track('t11', 'Turbo Killer', 'a7', 'Carpenter Brut', 226_000), 96 * HOUR],
    [track('t12', 'Le Perv', 'a7', 'Carpenter Brut', 244_000), 99 * HOUR],
    [track('t13', 'Roygbiv', 'a8', 'Boards of Canada', 210_000), 120 * HOUR],
    [track('t14', 'Dayvan Cowboy', 'a8', 'Boards of Canada', 302_000), 123 * HOUR],
    [track('t15', 'Crystal Dolphin', 'a9', 'Engelwood', 175_000), 140 * HOUR],
    [track('t16', 'Lush', 'a10', 'Four Tet', 333_000), 150 * HOUR],
  ]

  return plays.map(([t, agoMs]) => ({
    track: t,
    playedAt: new Date(now - agoMs).toISOString(),
  }))
}

export const getRecentlyPlayedSuccessMock: RecentlyPlayed = {
  items: buildItems(),
  next: null,
  cursorAfter: null,
}

export const getRecentlyPlayedEmptyMock: RecentlyPlayed = {
  items: [],
  next: null,
  cursorAfter: null,
}

export const getRecentlyPlayedErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
