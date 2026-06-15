import { useTranslation } from 'react-i18next'
import { MoreHorizontal } from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
} from 'recharts'
import type { ArtistSlice } from '../hooks/useInsightsData'

interface TopArtistsChartProps {
  data: ArtistSlice[]
}

function ArtistTooltip({ active, payload }: Partial<TooltipContentProps<number, string>>) {
  const { t } = useTranslation()
  const slice = payload?.[0]
  if (!active || !slice) return null
  const color = (slice.payload as ArtistSlice | undefined)?.color

  return (
    <div className="glass-card rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="flex items-center gap-2 text-white/80">
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold text-white">{slice.name}</span>
        {slice.value} {t('insights.plays')}
      </p>
    </div>
  )
}

export function TopArtistsChart({ data }: TopArtistsChartProps) {
  const { t } = useTranslation()
  const hasData = data.some((slice) => slice.value > 0)

  return (
    <div className="glass-card flex w-full flex-col rounded-2xl p-6 lg:w-[350px] lg:flex-shrink-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{t('insights.topArtists')}</h3>
          <p className="mt-0.5 text-xs text-white/40">{t('insights.byRecentPlays')}</p>
        </div>
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="text-white/40 transition-colors hover:text-brand-light"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {hasData ? (
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="relative h-[180px] w-[180px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((slice) => (
                    <Cell key={slice.name} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip content={<ArtistTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex min-w-0 flex-col gap-3 text-sm">
            {data.map((slice) => (
              <li key={slice.name} className="flex items-center gap-2 text-white/70">
                <span
                  className="inline-block h-3 w-3 flex-shrink-0 rounded-sm"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="truncate">{slice.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-white/40">
          {t('common.empty')}
        </div>
      )}
    </div>
  )
}
