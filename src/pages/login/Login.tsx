import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'
import { useApp } from '@/contexts/AppContext'
import { RESOURCES, type LanguageKey } from '@/langs/resources'
import { cn } from '@/lib/utils'

export default function Login() {
  const { t } = useTranslation()
  const { setToken, state, setLanguage } = useApp()
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setToken('placeholder-token')
    void navigate('/')
  }

  return (
    <main className="relative min-h-screen px-6 py-10">
      <div className="bg-blob bg-blob--ochre h-96 w-96 -top-24 -left-24" />
      <div className="bg-blob bg-blob--amber h-[28rem] w-[28rem] bottom-0 right-0" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        <div className="flex justify-end gap-2 self-end">
          {(Object.keys(RESOURCES) as LanguageKey[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setLanguage(lang)
              }}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors',
                state.language === lang
                  ? 'btn-brand'
                  : 'border border-white/10 text-white/70 hover:text-white',
              )}
            >
              {RESOURCES[lang].label}
            </button>
          ))}
        </div>

        <section className="glass-card w-full max-w-md p-10 text-center">
          <img src={logo} alt="" className="mx-auto h-20" />
          <h1 className="mt-3 text-2xl font-bold">
            Kana<span className="accent-brand">Play</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">{t('login.subtitle')}</p>

          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <p className="text-xs text-white/50">
              Phase 4 will replace this with a real Spotify auth form.
            </p>
            <button type="submit" className="btn-brand w-full rounded-full px-6 py-2.5">
              {t('login.submit')}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
