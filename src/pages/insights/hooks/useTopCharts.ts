import { useQuery } from '@tanstack/react-query'
import { getUserTopArtists } from '@/api/services/spotify/user/get-user-top-artists'
import { getUserTopTracks } from '@/api/services/spotify/user/get-user-top-tracks'
import { INSIGHTS_STALE_TIME, TIME_RANGE, type InsightsPeriod } from './useInsightsData'

const CHART_SIZE = 10

/** Ranked top artists + top tracks for the selected period (real affinity ranking). */
export function useTopCharts(period: InsightsPeriod) {
  const timeRange = TIME_RANGE[period]

  const artistsQuery = useQuery({
    // Shares the Overview cache (limit 50); sliced down for display.
    queryKey: ['insights', 'top-artists', timeRange],
    queryFn: () => getUserTopArtists({ timeRange, limit: 50 }),
    staleTime: INSIGHTS_STALE_TIME,
  })

  const tracksQuery = useQuery({
    queryKey: ['insights', 'top-tracks', timeRange],
    queryFn: () => getUserTopTracks({ timeRange, limit: CHART_SIZE }),
    staleTime: INSIGHTS_STALE_TIME,
  })

  return {
    artists: (artistsQuery.data?.items ?? []).slice(0, CHART_SIZE),
    tracks: tracksQuery.data?.items ?? [],
    isLoading: artistsQuery.isLoading || tracksQuery.isLoading,
    isError: artistsQuery.isError || tracksQuery.isError,
  }
}
