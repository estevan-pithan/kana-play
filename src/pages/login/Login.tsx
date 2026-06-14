import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import logo from '@/assets/logo.png'
import { useApp } from '@/contexts/AppContext'
import { RESOURCES, type LanguageKey } from '@/langs/resources'
import { cn } from '@/lib/utils'
   import { useSpotifyLogin } from './hooks/useSpotifyLogin'

export default function Login() {
  const { t } = useTranslation()
  const { state, setLanguage } = useApp()
  const { login, isPending } = useSpotifyLogin()
  const year = new Date().getFullYear()

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <div className="bg-blob bg-blob--ochre -top-40 -left-40 h-136 w-136" />
      <div className="bg-blob bg-blob--amber -bottom-32 -right-24 h-96 w-96" />

      <div className="absolute right-5 top-5 z-20 flex gap-1.5">
        {(Object.keys(RESOURCES) as LanguageKey[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => {
              setLanguage(lang)
            }}
            className={cn(
              'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
              state.language === lang
                ? 'btn-brand'
                : 'border border-white/10 text-white/60 hover:text-white',
            )}
          >
            {RESOURCES[lang].label}
          </button>
        ))}
      </div>

      <section className="glass-card relative z-10 w-full max-w-95 rounded-3xl px-9 py-10 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-white shadow-lg">
          <img src={logo} alt="" className="h-18 object-contain" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">KanaPlay</h1>
        <p className="mt-1.5 text-sm text-white/55">{t('login.subtitle')}</p>

        <button
          type="button"
          onClick={() => {
            void login()
          }}
          disabled={isPending}
          className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-brand to-brand-light px-6 py-3 text-sm font-semibold text-bg-deep shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
         null
          )}
          {isPending ? t('login.connecting') : t('login.continueWithSpotify')}
        </button>

        <p className="mt-4 text-xs text-white/40">{t('login.oauthHint')}</p>

        <p className="mt-8 text-[11px] text-white/30">{t('login.footerCopy', { year })}</p>
      </section>
    </main>
  )
}
