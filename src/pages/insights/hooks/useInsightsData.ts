import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getUserTopArtists } from '@/api/services/spotify/user/get-user-top-artists'
import {
  getRecentlyPlayed,
  type PlayHistoryEntry,
} from '@/api/services/spotify/player/get-recently-played'
import { useApp } from '@/contexts/AppContext'

export type InsightsPeriod = 'week' | 'month' | 'year'

/** The Week/Month/Year toggle maps onto Spotify's top-items affinity windows. */
export const TIME_RANGE: Record<InsightsPeriod, 'short_term' | 'medium_term' | 'long_term'> = {
  week: 'short_term',
  month: 'medium_term',
  year: 'long_term',
}

export const INSIGHTS_STALE_TIME = 5 * 60 * 1000

/** Palette for the Top Artists donut — brand-led, with a neutral "Others" tail. */
const ARTIST_COLORS = ['#E8B84B', '#C8922A', '#4a90d9', '#7c3aed', '#27ae60']
const OTHERS_COLOR = '#6b7280'
const TOP_SLICE_COUNT = 5
const TREND_DAYS = 7

export interface TrendPoint {
  /** Localized short weekday label, e.g. "Mon". */
  day: string
  hours: number
}

export interface ArtistSlice {
  name: string
  value: number
  color: string
}

export interface InsightsData {
  trends: TrendPoint[]
  artists: ArtistSlice[]
  hoursPlayed: number
  newArtists: number
  topArtist: string | null
  isLoading: boolean
  isError: boolean
}

function localeFor(language: string): string {
  return language === 'ptBR' ? 'pt-BR' : 'en-US'
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

/** Hours listened per day across the last `TREND_DAYS`, oldest → newest. */
function buildTrends(plays: PlayHistoryEntry[], locale: string): TrendPoint[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const buckets: TrendPoint[] = []
  const totals = new Array<number>(TREND_DAYS).fill(0)

  for (const { track, playedAt } of plays) {
    const played = new Date(playedAt)
    played.setHours(0, 0, 0, 0)
    const dayDiff = Math.round((today.getTime() - played.getTime()) / 86_400_000)
    const idx = TREND_DAYS - 1 - dayDiff
    if (idx >= 0 && idx < TREND_DAYS)
      totals[idx] = (totals[idx] ?? 0) + track.duration_ms / 3_600_000
  }

  for (let i = 0; i < TREND_DAYS; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - (TREND_DAYS - 1 - i))
    buckets.push({ day: fmt.format(d), hours: round1(totals[i] ?? 0) })
  }
  return buckets
}

/** Top artists by recent play count (real magnitudes), with the long tail folded into "Others". */
function buildArtistSlices(plays: PlayHistoryEntry[], othersLabel: string): ArtistSlice[] {
  const counts = new Map<string, number>()
  for (const { track } of plays) {
    const artist = track.artists[0]?.name
    if (artist) counts.set(artist, (counts.get(artist) ?? 0) + 1)
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1])
  const top = ranked.slice(0, TOP_SLICE_COUNT)
  const othersTotal = ranked.slice(TOP_SLICE_COUNT).reduce((acc, [, n]) => acc + n, 0)

  const slices: ArtistSlice[] = top.map(([name, value], i) => ({
    name,
    value,
    color: ARTIST_COLORS[i] ?? OTHERS_COLOR,
  }))
  if (othersTotal > 0) slices.push({ name: othersLabel, value: othersTotal, color: OTHERS_COLOR })
  return slices
}

/**
 * Builds the Insights view-model entirely from real Spotify data:
 * `/me/top/artists` (scoped by the period selector) and `/me/player/recently-played`.
 * No values are fabricated — genre data is intentionally absent since Spotify no
 * longer returns it for this app.
 */
export function useInsightsData(period: InsightsPeriod, othersLabel: string): InsightsData {
  const { state } = useApp()
  const locale = localeFor(state.language)

  const topArtistsQuery = useQuery({
    queryKey: ['insights', 'top-artists', TIME_RANGE[period]],
    queryFn: () => getUserTopArtists({ timeRange: TIME_RANGE[period], limit: 50 }),
    staleTime: INSIGHTS_STALE_TIME,
  })

  const recentQuery = useQuery({
    queryKey: ['insights', 'recently-played'],
    queryFn: () => getRecentlyPlayed({ limit: 50 }),
    staleTime: INSIGHTS_STALE_TIME,
  })

  return useMemo<InsightsData>(() => {
    const plays = recentQuery.data?.items ?? []
    const topArtists = topArtistsQuery.data?.items ?? []

    const hoursPlayed = round1(
      plays.reduce((acc, { track }) => acc + track.duration_ms / 3_600_000, 0),
    )

    // "New artists" = artists you've played recently that aren't among your established top artists.
    const topIds = new Set(topArtists.map((a) => a.id))
    const recentArtistIds = new Set<string>()
    for (const { track } of plays) {
      const id = track.artists[0]?.id
      if (id) recentArtistIds.add(id)
    }
    const newArtists = [...recentArtistIds].filter((id) => !topIds.has(id)).length

    return {
      trends: buildTrends(plays, locale),
      artists: buildArtistSlices(plays, othersLabel),
      hoursPlayed,
      newArtists,
      topArtist: topArtists[0]?.name ?? null,
      isLoading: topArtistsQuery.isLoading || recentQuery.isLoading,
      isError: topArtistsQuery.isError || recentQuery.isError,
    }
  }, [recentQuery, topArtistsQuery, locale, othersLabel])
}
