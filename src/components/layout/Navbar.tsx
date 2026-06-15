import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home } from 'lucide-react'

import logo from '@/assets/logo.png'
import { SearchPill } from './SearchPill'
import { UserMenu } from './UserMenu'

export function Navbar() {
  const { t } = useTranslation()

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.09)',
      }}
    >
      <div className="px-7 flex h-20 w-full   items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center">
            <img src={logo} alt="" className="h-14" />
            <span className="text-xl font-bold tracking-tight">
              Kana<span className="accent-brand">Play</span>
            </span>
          </NavLink>
        </div>

        <div className="flex justify-center items-center grow gap-3 ">
          <NavLink
            to="/"
            end
            aria-label={t('nav.home')}
            className={({ isActive }) =>
              `ml-2 inline-flex size-10 items-center justify-center
             rounded-full transition-colors ${
               isActive
                 ? 'bg-white/10 text-white'
                 : 'text-white/60 hover:bg-white/5 hover:text-white'
             }`
            }
          >
            <Home className="h-4 w-4" />
          </NavLink>
          <SearchPill />
        </div>

        <div className="flex items-center justify-end">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
