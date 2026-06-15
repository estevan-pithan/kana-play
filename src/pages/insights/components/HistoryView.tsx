import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useRecentPlays } from '../hooks/useRecentPlays'
import { InsightsError } from './InsightsError'
import { formatDuration, formatRelativeTime } from '../utils'

function localeFor(language: string): string {
  return language === 'ptBR' ? 'pt-BR' : 'en-US'
}

export function HistoryView() {
  const { t } = useTranslation()
  const { state } = useApp()
  const locale = localeFor(state.language)
  const { plays, isLoading, isError } = useRecentPlays()

  if (isError) return <InsightsError />

  return (
    <div className="glass-card flex flex-col rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-2">
        <Clock className="h-4 w-4 text-brand-light" />
        <h3 className="text-lg font-semibold text-white">{t('insights.history')}</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : plays.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/40">{t('common.empty')}</p>
      ) : (
        <ul className="flex flex-col">
          {plays.map(({ track, playedAt }, i) => (
            <li
              key={`${track.id}-${i}`}
              className="flex items-center gap-4 border-b border-white/5 py-3 last:border-0"
            >
              <span className="w-5 flex-shrink-0 text-right text-xs text-white/30">{i + 1}</span>
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-white/5">
                {track.album.images[0]?.url && (
                  <img
                    src={track.album.images[0].url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{track.name}</p>
                <p className="truncate text-xs text-white/50">
                  {track.artists.map((a) => a.name).join(', ')}
                </p>
              </div>
              <span className="hidden flex-shrink-0 text-xs text-white/40 sm:block">
                {formatRelativeTime(playedAt, locale)}
              </span>
              <span className="w-12 flex-shrink-0 text-right text-xs text-white/40">
                {formatDuration(track.duration_ms)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
