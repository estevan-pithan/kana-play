import { useTranslation } from 'react-i18next'
import { Disc3, ListMusic, Music2, Users, type LucideIcon } from 'lucide-react'
import { useLibraryStats } from '../hooks/useLibraryStats'
import { InsightsError } from './InsightsError'

interface StatDef {
  labelKey: string
  value: number
  icon: LucideIcon
}

export function LibraryStatsView() {
  const { t } = useTranslation()
  const stats = useLibraryStats()

  if (stats.isError) return <InsightsError />

  const cards: StatDef[] = [
    { labelKey: 'insights.savedTracks', value: stats.savedTracks, icon: Music2 },
    { labelKey: 'insights.savedAlbums', value: stats.savedAlbums, icon: Disc3 },
    { labelKey: 'insights.playlists', value: stats.playlists, icon: ListMusic },
    { labelKey: 'insights.following', value: stats.following, icon: Users },
  ]

  if (stats.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[110px] animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {cards.map(({ labelKey, value, icon: Icon }) => (
        <article key={labelKey} className="glass-card flex items-center gap-6 rounded-2xl p-6">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand-light">
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="mb-1 text-sm font-medium text-white/50">{t(labelKey)}</p>
            <h4 className="text-3xl font-bold tracking-tight text-white">
              {value.toLocaleString()}
            </h4>
          </div>
        </article>
      ))}
    </div>
  )
}
