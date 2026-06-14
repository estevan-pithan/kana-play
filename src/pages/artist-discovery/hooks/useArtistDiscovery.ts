import { useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { searchArtists } from '@/api/services/spotify/search-artists'
import type { SpotifyArtist, SpotifyPaging } from '@/api/services/spotify/type'

const PAGE_SIZE = 20

/**
 * Drives the Artist Discovery grid. The query is owned by the URL (`?q`) and
 * passed in, so the navbar search box and the page stay in sync. Debouncing
 * happens at the navbar input before the URL changes.
 */
export function useArtistDiscovery(query: string) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const effectiveQuery = query.trim()

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<SpotifyPaging<SpotifyArtist>>({
    queryKey: ['artists', effectiveQuery],
    queryFn: ({ pageParam = 0 }) =>
      searchArtists({
        query: effectiveQuery,
        limit: PAGE_SIZE,
        offset: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.offset + lastPage.limit
      return next < lastPage.total ? next : undefined
    },
    enabled: effectiveQuery.length > 0,
  })

  const artists = useMemo<SpotifyArtist[]>(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return {
    artists,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    loadMoreRef,
  }
}
