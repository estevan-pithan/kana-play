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
      if (status === 401) {
        onUnauthorized()
      } else if (status === 400) {
        const data = error.response?.data as { error?: { message?: string } } | undefined
        toast.error(data?.error?.message ?? 'Spotify request failed.')
      }
    }
    return Promise.reject(error as Error)
  },
)
