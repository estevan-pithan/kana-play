import { useQuery } from '@tanstack/react-query'
import { getRecentlyPlayed } from '@/api/services/spotify/player/get-recently-played'
import { INSIGHTS_STALE_TIME } from './useInsightsData'

/** Recently-played feed for the History tab (shares cache with the Overview trends). */
export function useRecentPlays() {
  const query = useQuery({
    queryKey: ['insights', 'recently-played'],
    queryFn: () => getRecentlyPlayed({ limit: 50 }),
    staleTime: INSIGHTS_STALE_TIME,
  })

  return {
    plays: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
