import { useTranslation } from 'react-i18next'
import { MoreHorizontal } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'
import type { TrendPoint } from '../hooks/useInsightsData'

const LINE_COLOR = '#E8B84B'

interface ListeningTrendsChartProps {
  data: TrendPoint[]
}

function TrendTooltip({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
  const { t } = useTranslation()
  const point = payload?.[0]
  if (!active || !point) return null

  return (
    <div className="glass-card rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-white">{label}</p>
      <p className="flex items-center gap-2 text-white/70">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: LINE_COLOR }}
        />
        <span className="font-medium text-white">{point.value}</span> {t('insights.hoursUnit')}
      </p>
    </div>
  )
}

export function ListeningTrendsChart({ data }: ListeningTrendsChartProps) {
  const { t } = useTranslation()

  return (
    <div className="glass-card flex min-w-0 flex-1 flex-col rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{t('insights.listeningTrends')}</h3>
          <p className="mt-0.5 text-xs text-white/40">{t('insights.last7Days')}</p>
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

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.35} />
                <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={40}
              allowDecimals={false}
            />
            <Tooltip
              content={<TrendTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              name={t('insights.hoursPlayed')}
              stroke={LINE_COLOR}
              strokeWidth={3}
              fill="url(#trendFill)"
              dot={{ r: 3, fill: LINE_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
