import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '@/assets/logo.png'
import { useApp } from '@/contexts/AppContext'
import { RESOURCES, type LanguageKey } from '@/langs/resources'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', key: 'discover' as const },
  { to: '/collection', key: 'myCollection' as const },
  { to: '/insights', key: 'insights' as const },
]

export function Navbar() {
  const { t } = useTranslation()
  const { state, setLanguage } = useApp()

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.09)',
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-6 px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className="h-9 w-9" />
          <span className="text-lg font-bold tracking-tight">
            Kana<span className="accent-brand">Play</span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'accent-brand'
                    : 'text-white/70 hover:text-white',
                )
              }
              style={({ isActive }) =>
                isActive
                  ? { background: 'rgba(200, 146, 42, 0.12)' }
                  : undefined
              }
            >
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
      </div>
    </header>
  )
}
