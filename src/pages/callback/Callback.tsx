import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { exchangeCodeForToken } from '@/api/services/spotify/auth/exchange-code-for-token'
import { useApp } from '@/contexts/AppContext'
import { clearPkceStorage, readStoredState, readStoredVerifier } from '@/utils/spotify-pkce'
import { writeStorage } from '@/utils/storage'

const REFRESH_TOKEN_KEY = 'kanaplay_refresh_token'

export default function Callback() {
  const { t } = useTranslation()
  const { setToken } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [hasError, setHasError] = useState(false)
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    function fail(): void {
      clearPkceStorage()
      setHasError(true)
      toast.error(t('login.authError'))
      void navigate('/login', { replace: true })
    }

    async function run(): Promise<void> {
      const code = params.get('code')
      const state = params.get('state')
      const verifier = readStoredVerifier()
      const expectedState = readStoredState()

      if (!code || !state || !verifier || state !== expectedState) {
        fail()
        return
      }

      try {
        const data = await exchangeCodeForToken({ code, codeVerifier: verifier })
        if (data.refresh_token) writeStorage(REFRESH_TOKEN_KEY, data.refresh_token)
        setToken(data.access_token)
        clearPkceStorage()
        void navigate('/', { replace: true })
      } catch {
        fail()
      }
    }

    void run()
  }, [params, navigate, setToken, t])

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      <div className="bg-blob bg-blob--ochre -top-24 -left-24 h-96 w-96" />
      <div className="relative z-10 flex items-center gap-3 text-sm text-white/70">
        {!hasError && <Loader2 className="h-5 w-5 animate-spin" />}
        {hasError ? t('login.authError') : t('login.connecting')}
      </div>
    </main>
  )
}
