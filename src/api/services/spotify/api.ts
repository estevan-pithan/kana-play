import axios from 'axios'
import { toast } from 'sonner'

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
      const data = error.response?.data as { error?: { message?: string } } | undefined
      const message = data?.error?.message

      if (status === 401) {
        onUnauthorized()
      } else if (status === 429) {
        // Spotify hints at the cooldown via the `Retry-After` header (in seconds).
        const retryAfter = Number(error.response?.headers?.['retry-after'])
        toast.error(
          message ??
            (Number.isFinite(retryAfter) && retryAfter > 0
              ? `Spotify rate limit reached. Try again in ${retryAfter}s.`
              : 'Spotify rate limit reached. Please try again shortly.'),
        )
      } else if (status === 400 || status === 403 || status === 404) {
        toast.error(message ?? 'Spotify request failed.')
      } else if (status !== undefined && status >= 500) {
        toast.error(message ?? 'Spotify is unavailable right now. Please try again later.')
      } else if (status === undefined) {
        // No response (network/CORS): fall through with a generic notice.
        toast.error('Network error reaching Spotify.')
      }
    }
    return Promise.reject(error as Error)
  },
)
