import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, User, X } from 'lucide-react'
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const debounceRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      window.clearTimeout(debounceRef.current)
    }
  }, [])

  // Debounce typing, then push the term into the URL (`/?q=`). The Discovery
  // page reads `?q` and switches between its curated + results views. Driven
  // from the input (not a mount effect) so other pages aren't redirected.
  function handleSearchChange(value: string) {
    setSearchValue(value)
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      const term = value.trim()
      navigate(term ? `/?q=${encodeURIComponent(term)}` : '/')
    }, 300)
  }

  function openSearch() {
    setSearchOpen(true)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  function closeSearch() {
    window.clearTimeout(debounceRef.current)
    const hadTerm = searchValue.trim().length > 0
    setSearchOpen(false)
    setSearchValue('')
    if (hadTerm) navigate('/')
  }

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.09)',
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className="h-8 w-auto" />
          <span className="text-lg font-bold tracking-tight">
            Kana<span className="accent-brand">Play</span>
          </span>
        </NavLink>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navLinks.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'text-white' : 'text-white/60 hover:text-white',
                )
              }
            >
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {searchOpen ? (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    handleSearchChange(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') closeSearch()
                  }}
                  placeholder={t('artistDiscovery.searchPlaceholder')}
                  className="glass-input w-44 rounded-full py-2 pl-9 pr-9 text-sm placeholder:text-white/40 sm:w-56"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label={t('common.cancel')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openSearch}
                aria-label={t('common.search')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            {(Object.keys(RESOURCES) as LanguageKey[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setLanguage(lang)
                }}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                  state.language === lang
                    ? 'btn-brand'
                    : 'text-white/50 hover:text-white',
                )}
              >
                {RESOURCES[lang].label}
              </button>
            ))}
          </div>

          <div
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#0d0d0d]"
            style={{
              background:
                'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
            }}
            aria-hidden="true"
          >
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
