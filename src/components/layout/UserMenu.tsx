import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, LineChart, LogOut, Languages } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/contexts/AppContext'
import { getUserProfile } from '@/api/services/spotify/user/get-user-profile'

export function UserMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state, setLanguage, setToken } = useApp()

  const profileQuery = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    enabled: Boolean(state.token),
    staleTime: 5 * 60 * 1000,
  })

  const profile = profileQuery.data
  const avatarUrl = profile?.images?.[0]?.url
  const displayName = profile?.display_name ?? 'You'
  const initial = displayName.charAt(0).toUpperCase() || 'K'

  function toggleLanguage() {
    setLanguage(state.language === 'enUS' ? 'ptBR' : 'enUS')
  }

  function handleLogout() {
    setToken(null)
    navigate('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-1 pr-2 text-white/80 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        aria-label={displayName}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full border border-white/10 object-cover"
          />
        ) : (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-[#1a0e00]"
            style={{
              background:
                'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
            }}
            aria-hidden="true"
          >
            {initial}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => navigate('/insights')}>
          <LineChart className="h-4 w-4 text-white/60" />
          <span>{t('nav.insights')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={toggleLanguage}>
          <Languages className="h-4 w-4 text-white/60" />
          <span>
            {t('nav.language')} · {state.language === 'enUS' ? 'EN' : 'PT'}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="h-4 w-4 text-white/60" />
          <span>{t('nav.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
