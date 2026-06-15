import { useTranslation } from 'react-i18next'
import { Mic2, Music } from 'lucide-react'
import type { SpotifyArtist, SpotifyTrack } from '@/api/services/spotify/type'
import { useTopCharts } from '../hooks/useTopCharts'
import type { InsightsPeriod } from '../hooks/useInsightsData'
import { InsightsError } from './InsightsError'
import { formatDuration } from '../utils'

interface TopChartsViewProps {
  period: InsightsPeriod
}

function RankRow({
  rank,
  image,
  title,
  subtitle,
  trailing,
}: {
  rank: number
  image?: string
  title: string
  subtitle: string
  trailing?: string
}) {
  return (
    <li className="flex items-center gap-4 border-b border-white/5 py-3 last:border-0">
      <span className="w-5 flex-shrink-0 text-right text-sm font-semibold text-brand-light">
        {rank}
      </span>
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-white/5">
        {image && <img src={image} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{title}</p>
        <p className="truncate text-xs text-white/50">{subtitle}</p>
      </div>
      {trailing && <span className="flex-shrink-0 text-xs text-white/40">{trailing}</span>}
    </li>
  )
}

function ChartCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="glass-card flex flex-1 flex-col rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export function TopChartsView({ period }: TopChartsViewProps) {
  const { t } = useTranslation()
  const { artists, tracks, isLoading, isError } = useTopCharts(period)

  if (isError) return <InsightsError />

  const skeleton = (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <ChartCard
        icon={<Mic2 className="h-4 w-4 text-brand-light" />}
        title={t('insights.topArtists')}
      >
        {isLoading ? (
          skeleton
        ) : artists.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">{t('common.empty')}</p>
        ) : (
          <ul className="flex flex-col">
            {artists.map((artist: SpotifyArtist, i) => (
              <RankRow
                key={artist.id}
                rank={i + 1}
                image={artist.images[0]?.url}
                title={artist.name}
                subtitle={t('insights.artist')}
              />
            ))}
          </ul>
        )}
      </ChartCard>

      <ChartCard
        icon={<Music className="h-4 w-4 text-brand-light" />}
        title={t('insights.topTracks')}
      >
        {isLoading ? (
          skeleton
        ) : tracks.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">{t('common.empty')}</p>
        ) : (
          <ul className="flex flex-col">
            {tracks.map((track: SpotifyTrack, i) => (
              <RankRow
                key={track.id}
                rank={i + 1}
                image={track.album.images[0]?.url}
                title={track.name}
                subtitle={track.artists.map((a) => a.name).join(', ')}
                trailing={formatDuration(track.duration_ms)}
              />
            ))}
          </ul>
        )}
      </ChartCard>
    </div>
  )
}
