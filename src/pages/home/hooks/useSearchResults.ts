import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import {
  search,
  SEARCH_MAX_LIMIT,
  type SearchResultItem,
  type SearchResultPage,
  type SearchType,
} from '@/api/services/spotify/search/search'
import { useInfiniteScroll } from './useInfiniteScroll'

// `/search` caps `limit` at 10 per item type, so page in increments of that.
const PAGE_SIZE = SEARCH_MAX_LIMIT

/**
 * Drives the search-mode results grid on Home. The query and type are both
 * owned by the URL (`?q=`, `?type=`); the navbar SearchPill / SearchTypeSelect
 * are the only writers, the page just reads them.
 */
export function useSearchResults(query: string, type: SearchType) {
  const effectiveQuery = query.trim()

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<SearchResultPage>({
    queryKey: ['search', effectiveQuery, type],
    queryFn: ({ pageParam = 0 }) =>
      search({
        query: effectiveQuery,
        type,
        limit: PAGE_SIZE,
        offset: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
    enabled: effectiveQuery.length > 0,
  })

  const items = useMemo<SearchResultItem[]>(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  const loadMoreRef = useInfiniteScroll({
    enabled: Boolean(hasNextPage),
    onLoadMore: () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
    },
  })

  return {
    items,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    loadMoreRef,
  }
}
