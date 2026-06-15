import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import type { HomeSection } from '../hooks/useHomeData'

interface BrowseGridProps<T> {
  title: string
  section: HomeSection<T>
  /** `grid` for cards, `list` for full-width rows (tracks). */
  layout?: 'grid' | 'list'
  renderItem: (item: T) => ReactNode
}

const GRID_CLASSES =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

export function BrowseGrid<T>({
  title,
  section,
  layout = 'grid',
  renderItem,
}: BrowseGridProps<T>) {
  const { t } = useTranslation()
  const { items, isLoading, isError, isFetchingNextPage, hasNextPage, loadMore } =
    section

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    enabled: hasNextPage,
  })

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      {isLoading && (
        <div className={layout === 'list' ? 'flex flex-col gap-2' : GRID_CLASSES}>
          {Array.from({ length: layout === 'list' ? 8 : 15 }).map((_, i) => (
            <div
              key={i}
              className={
                layout === 'list'
                  ? 'h-14 animate-pulse rounded-xl bg-white/[0.05]'
                  : 'aspect-square animate-pulse rounded-xl bg-white/[0.05]'
              }
            />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <p className="text-sm text-white/50">{t('artistDiscovery.errorTitle')}</p>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <p className="text-sm text-white/40">{t('common.empty')}</p>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <>
          <div className={layout === 'list' ? 'flex flex-col gap-2' : GRID_CLASSES}>
            {items.map(renderItem)}
          </div>

          <div ref={sentinelRef} className="h-10" aria-hidden="true" />

          {isFetchingNextPage && (
            <p className="text-center text-xs text-white/40">
              {t('common.loading')}
            </p>
          )}
        </>
      )}
    </section>
  )
}
