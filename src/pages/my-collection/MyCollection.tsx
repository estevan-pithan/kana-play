import { useTranslation } from 'react-i18next'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function MyCollection() {
  const { t } = useTranslation()
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold">{t('collection.title')}</h1>
      <p className="mt-2 text-white/60">{t('collection.subtitle')}</p>
      <p className="mt-8 text-sm text-white/40">Phase 7 will populate this page.</p>
    </PageWrapper>
  )
}
