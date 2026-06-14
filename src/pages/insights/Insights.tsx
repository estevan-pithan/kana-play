import { useTranslation } from 'react-i18next'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function Insights() {
  const { t } = useTranslation()
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold">{t('insights.title')}</h1>
      <p className="mt-2 text-white/60">{t('insights.subtitle')}</p>
      <p className="mt-8 text-sm text-white/40">Phase 8 will populate this page.</p>
    </PageWrapper>
  )
}
