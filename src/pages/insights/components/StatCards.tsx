import { useTranslation } from 'react-i18next'
import { Headphones, Sparkles, Star } from 'lucide-react'
import type { InsightsData } from '../hooks/useInsightsData'

interface StatCardsProps {
  data: InsightsData
}

export function StatCards({ data }: StatCardsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Hours Played — sum of recently-played track durations */}
      <article className="glass-card flex items-center gap-6 rounded-2xl p-6">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand-light">
          <Headphones className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium text-white/50">{t('insights.hoursPlayed')}</p>
          <h4 className="text-3xl font-bold tracking-tight text-white">
            {data.hoursPlayed.toLocaleString()}
          </h4>
          <p className="text-xs text-white/40">{t('insights.recentlyPlayed')}</p>
        </div>
      </article>

      {/* New Artists — recently-played artists not in your top artists */}
      <article className="glass-card flex items-center gap-6 rounded-2xl p-6">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
          <Sparkles className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium text-white/50">{t('insights.newArtists')}</p>
          <h4 className="text-3xl font-bold tracking-tight text-white">{data.newArtists}</h4>
          <p className="text-xs text-white/40">{t('insights.notInTop')}</p>
        </div>
      </article>

      {/* Top Artist — #1 from /me/top/artists for the selected period */}
      <article className="glass-card flex items-center gap-6 rounded-2xl p-6">
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400">
          <Star className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium text-white/50">{t('insights.topArtist')}</p>
          <h4 className="truncate text-2xl font-bold tracking-tight text-brand-light">
            {data.topArtist ?? '—'}
          </h4>
        </div>
      </article>
    </div>
  )
}
