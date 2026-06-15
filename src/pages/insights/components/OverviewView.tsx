import { useTranslation } from 'react-i18next'
import { ListeningTrendsChart } from './ListeningTrendsChart'
import { TopArtistsChart } from './TopArtistsChart'
import { StatCards } from './StatCards'
import { InsightsError } from './InsightsError'
import { useInsightsData, type InsightsPeriod } from '../hooks/useInsightsData'

interface OverviewViewProps {
  period: InsightsPeriod
}

export function OverviewView({ period }: OverviewViewProps) {
  const { t } = useTranslation()
  const data = useInsightsData(period, t('insights.others'))

  if (data.isError) return <InsightsError />

  if (data.isLoading) {
    return (
      <>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="h-[404px] flex-1 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-[404px] animate-pulse rounded-2xl bg-white/5 lg:w-[350px]" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[110px] animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row">
        <ListeningTrendsChart data={data.trends} />
        <TopArtistsChart data={data.artists} />
      </div>
      <StatCards data={data} />
    </>
  )
}
