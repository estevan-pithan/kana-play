import { useTranslation } from 'react-i18next'

export function InsightsError() {
  const { t } = useTranslation()
  return (
    <div className="glass-card flex flex-col items-center rounded-2xl p-10 text-center">
      <p className="text-base font-semibold text-white">{t('artistDiscovery.errorTitle')}</p>
      <p className="mt-2 text-sm text-white/60">{t('common.error')}</p>
    </div>
  )
}
