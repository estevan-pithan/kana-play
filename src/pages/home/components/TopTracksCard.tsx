import { useCallback, type UIEvent } from 'react'
import { useTranslation } from 'react-i18next'

import type { SpotifyTrack } from '@/api/services/spotify/type'
import type { HomeSection } from '../hooks/useHomeData'
import { TrackRow } from './TrackRow'

interface TopTracksCardProps {
  title: string
  section: HomeSection<SpotifyTrack>
}

const PREFETCH_THRESHOLD = 240

export function TopTracksCard({ title, section }: TopTracksCardProps) {
  const { t } = useTranslation()
  const { items, isLoading, isError, loadMore, isFetchingNextPage } = section

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
      if (scrollTop + clientHeight >= scrollHeight - PREFETCH_THRESHOLD) {
        loadMore()
      }
    },
    [loadMore],
  )

  return (
    <section className="glass-card flex flex-col p-5 xl:h-full xl:min-h-0">
      <h2 className="mb-4 shrink-0 text-xl font-semibold text-white">{title}</h2>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
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
        <div
          onScroll={handleScroll}
          className="hide-scrollbar -mx-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2"
        >
          {items.map((track, index) => (
            <TrackRow key={track.id} track={track} variant="list" rank={index + 1} />
          ))}
          {isFetchingNextPage && (
            <div className="grid place-items-center py-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
