const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = `http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/callback`
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
const SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-follow-read',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-modify-playback-state',
]

const VERIFIER_KEY = 'kanaplay_pkce_verifier'
const STATE_KEY = 'kanaplay_pkce_state'

export const spotifyAuthConfig = {
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
}

function base64UrlEncode(bytes: ArrayBuffer): string {
  let binary = ''
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function randomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(values, (value) => charset[value % charset.length]).join('')
}

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
}

export async function buildSpotifyAuthorizeUrl(): Promise<string> {
  const verifier = randomString(64)
  const state = randomString(16)
  const challenge = base64UrlEncode(await sha256(verifier))

  sessionStorage.setItem(VERIFIER_KEY, verifier)
  sessionStorage.setItem(STATE_KEY, state)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
    scope: SCOPES.join(' '),
  })

  return `${AUTHORIZE_URL}?${params.toString()}`
}

export function readStoredVerifier(): string | null {
  return sessionStorage.getItem(VERIFIER_KEY)
}

export function readStoredState(): string | null {
  return sessionStorage.getItem(STATE_KEY)
}

export function clearPkceStorage(): void {
  sessionStorage.removeItem(VERIFIER_KEY)
  sessionStorage.removeItem(STATE_KEY)
}
