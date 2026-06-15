import axios from 'axios'
import { toast } from 'sonner'

import i18n from '@/langs/i18n'

export const VITE_SPOTIFY_BASE_URL = import.meta.env.VITE_SPOTIFY_BASE_URL
export const VITE_SPOTIFY_AUTH_URL = import.meta.env.VITE_SPOTIFY_AUTH_URL
export const USE_SPOTIFY_MOCK = false

let tokenGetter: () => string | null = () => null
let onUnauthorized: () => void = () => undefined

export function setSpotifyTokenGetter(getter: () => string | null): void {
  tokenGetter = getter
}

export function setSpotifyAuthHandlers(handlers: { onUnauthorized: () => void }): void {
  onUnauthorized = handlers.onUnauthorized
}

export const apiSpotify = axios.create({
  baseURL: VITE_SPOTIFY_BASE_URL,
})

apiSpotify.interceptors.request.use((config) => {
  const token = tokenGetter()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

apiSpotify.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const t = i18n.t.bind(i18n)

      if (status === 401) {
        onUnauthorized()
      } else if (status === 429) {
        // Spotify hints at the cooldown via the `Retry-After` header (in seconds).
        const retryAfter = Number(error.response?.headers?.['retry-after'])
        toast.error(
          Number.isFinite(retryAfter) && retryAfter > 0
            ? t('apiErrors.rateLimitedWithRetry', { seconds: retryAfter })
            : t('apiErrors.rateLimited'),
        )
      } else if (status === 403) {
        toast.error(t('apiErrors.forbidden'))
      } else if (status === 404) {
        toast.error(t('apiErrors.notFound'))
      } else if (status === 400) {
        toast.error(t('apiErrors.badRequest'))
      } else if (status !== undefined && status >= 500) {
        toast.error(t('apiErrors.serverError'))
      } else if (status === undefined) {
        toast.error(t('apiErrors.network'))
      }
    }
    return Promise.reject(error as Error)
  },
)
