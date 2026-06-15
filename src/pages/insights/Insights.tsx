import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PieChart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InsightsSidebar, type InsightsView } from './components/InsightsSidebar'
import { OverviewView } from './components/OverviewView'
import { HistoryView } from './components/HistoryView'
import { TopChartsView } from './components/TopChartsView'
import { LibraryStatsView } from './components/LibraryStatsView'
import { type InsightsPeriod } from './hooks/useInsightsData'

const PERIODS: { value: InsightsPeriod; labelKey: string }[] = [
  { value: 'week', labelKey: 'insights.periodWeek' },
  { value: 'month', labelKey: 'insights.periodMonth' },
  { value: 'year', labelKey: 'insights.periodYear' },
]

/** The period (top-items affinity window) only applies to these views. */
const PERIOD_VIEWS: InsightsView[] = ['overview', 'topCharts']

const SUBTITLE_KEY: Record<InsightsView, string> = {
  overview: 'insights.subtitle',
  history: 'insights.historySubtitle',
  topCharts: 'insights.topChartsSubtitle',
  library: 'insights.librarySubtitle',
}

export default function Insights() {
  const { t } = useTranslation()
  const [view, setView] = useState<InsightsView>('overview')
  const [period, setPeriod] = useState<InsightsPeriod>('month')

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 lg:flex-row">
      <InsightsSidebar active={view} onSelect={setView} />

      <main className="flex min-w-0 flex-1 flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {t('insights.title')}
            </h1>
            <p className="flex items-center gap-2 text-sm font-medium text-white/50">
              <PieChart className="h-3.5 w-3.5" />
              {t(SUBTITLE_KEY[view])}
            </p>
          </div>

          {PERIOD_VIEWS.includes(view) && (
            <div className="flex items-center gap-1 self-start rounded-xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl sm:self-auto">
              {PERIODS.map(({ value, labelKey }) => {
                const isActive = value === period
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPeriod(value)}
                    aria-pressed={isActive}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      isActive ? 'btn-brand' : 'text-white/70 hover:text-white',
                    )}
                  >
                    {t(labelKey)}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {view === 'overview' && <OverviewView period={period} />}
        {view === 'history' && <HistoryView />}
        {view === 'topCharts' && <TopChartsView period={period} />}
        {view === 'library' && <LibraryStatsView />}
      </main>
    </div>
  )
}
