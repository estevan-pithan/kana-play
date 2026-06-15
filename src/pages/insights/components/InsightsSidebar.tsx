import { useTranslation } from 'react-i18next'
import { Clock, Download, Library, LineChart, Trophy, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InsightsView = 'overview' | 'history' | 'topCharts' | 'library'

interface NavItem {
  key: InsightsView
  labelKey: string
  icon: LucideIcon
}

const ITEMS: NavItem[] = [
  { key: 'overview', labelKey: 'insights.overview', icon: LineChart },
  { key: 'history', labelKey: 'insights.history', icon: Clock },
  { key: 'topCharts', labelKey: 'insights.topCharts', icon: Trophy },
  { key: 'library', labelKey: 'insights.libraryStats', icon: Library },
]

interface InsightsSidebarProps {
  active: InsightsView
  onSelect: (view: InsightsView) => void
}

export function InsightsSidebar({ active, onSelect }: InsightsSidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 sticky top-28 h-[calc(100vh-12rem)]">
      <div className="glass-card flex h-full w-full flex-col rounded-2xl p-6">
        <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-white/40">
          {t('insights.sidebarTitle')}
        </h3>

        <nav className="flex flex-col gap-2">
          {ITEMS.map(({ key, labelKey, icon: Icon }) => {
            const isActive = key === active
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'border border-white/5 bg-white/10 text-brand-light'
                    : 'text-white/60 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    !isActive && 'transition-colors group-hover:text-brand-light/80',
                  )}
                />
                {t(labelKey)}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Download className="h-4 w-4" />
            {t('insights.exportReport')}
          </button>
        </div>
      </div>
    </aside>
  )
}
