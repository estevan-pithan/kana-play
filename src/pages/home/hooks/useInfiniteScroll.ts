import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  /** Invoked when the sentinel scrolls into view. Should self-gate (no-op when
   *  already fetching or fully loaded). */
  onLoadMore: () => void
  /** Skip observing once there's nothing left to fetch. */
  enabled?: boolean
  /** How far ahead of the sentinel to trigger (default 300px). */
  rootMargin?: string
}

/**
 * Attaches an IntersectionObserver to a sentinel element and calls `onLoadMore`
 * as it approaches the viewport — the shared engine behind every infinite list.
 */
export function useInfiniteScroll({
  onLoadMore,
  enabled = true,
  rootMargin = '300px',
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  }, [onLoadMore, enabled, rootMargin])

  return sentinelRef
}
