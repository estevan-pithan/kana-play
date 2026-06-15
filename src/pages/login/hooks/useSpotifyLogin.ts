import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { USE_SPOTIFY_MOCK } from '@/api/services/spotify/api'
import { exchangeCodeForTokenSuccessMock } from '@/api/mocks/spotify/auth/exchange-code-for-token.mock'
import { useApp } from '@/contexts/AppContext'
import { buildSpotifyAuthorizeUrl } from '@/utils/spotify-pkce'


export function useSpotifyLogin() {
  const { t } = useTranslation()
  const { setToken } = useApp()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)

  async function login(): Promise<void> {
    setIsPending(true)
    try {
      if (USE_SPOTIFY_MOCK) {
        setToken(exchangeCodeForTokenSuccessMock.access_token)
        void navigate('/')
        return
      }

      const authorizeUrl = await buildSpotifyAuthorizeUrl()
      window.location.assign(authorizeUrl)
    } catch {
      toast.error(t('login.authError'))
      setIsPending(false)
    }
  }

  return { login, isPending }
}
