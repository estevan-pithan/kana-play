import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import {
  searchPage,
  type SearchResultItem,
  type SearchResultPage,
  type SearchType,
} from '@/api/services/spotify/search/search'
import { useInfiniteScroll } from './useInfiniteScroll'

export function useSearchResults(query: string, type: SearchType) {
  const effectiveQuery = query.trim()

  const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery<SearchResultPage>({
      queryKey: ['search', effectiveQuery, type],
      queryFn: ({ pageParam = 0 }) =>
        searchPage({
          query: effectiveQuery,
          type,
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
