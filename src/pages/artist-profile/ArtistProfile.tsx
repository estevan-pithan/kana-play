import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function ArtistProfile() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold">{t('artistProfile.aboutTitle')}</h1>
      <p className="mt-2 text-white/60">Artist id: {id ?? 'unknown'}</p>
      <p className="mt-8 text-sm text-white/40">Phase 6 will populate this page.</p>
    </PageWrapper>
  )
}
