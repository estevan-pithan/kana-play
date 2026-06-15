/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPOTIFY_CLIENT_ID: string
  readonly VITE_SPOTIFY_BASE_URL: string
  readonly VITE_SPOTIFY_AUTH_URL: string
  readonly VITE_HOST: string
  readonly VITE_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// --- Spotify Web Playback SDK (minimal hand-written typings) ---

interface SpotifyPlayerImage {
  url: string
}

interface SpotifyPlayerTrack {
  id: string | null
  uri: string
  name: string
  duration_ms: number
  artists: { name: string; uri: string }[]
  album: { uri: string; name: string; images: SpotifyPlayerImage[] }
}

interface SpotifyPlaybackState {
  paused: boolean
  position: number
  duration: number
  shuffle: boolean
  repeat_mode: 0 | 1 | 2
  track_window: {
    current_track: SpotifyPlayerTrack
    previous_tracks: SpotifyPlayerTrack[]
    next_tracks: SpotifyPlayerTrack[]
  }
}

interface SpotifyPlayerInit {
  name: string
  getOAuthToken: (cb: (token: string) => void) => void
  volume?: number
}

type SpotifyPlayerErrorEvent =
  | 'initialization_error'
  | 'authentication_error'
  | 'account_error'
  | 'playback_error'

interface SpotifyPlayer {
  connect: () => Promise<boolean>
  disconnect: () => void
  addListener: {
    (event: 'ready' | 'not_ready', cb: (data: { device_id: string }) => void): boolean
    (event: 'player_state_changed', cb: (state: SpotifyPlaybackState | null) => void): boolean
    (event: SpotifyPlayerErrorEvent, cb: (data: { message: string }) => void): boolean
  }
  removeListener: (event: string) => boolean
  getCurrentState: () => Promise<SpotifyPlaybackState | null>
  setName: (name: string) => Promise<void>
  setVolume: (volume: number) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  togglePlay: () => Promise<void>
  seek: (positionMs: number) => Promise<void>
  previousTrack: () => Promise<void>
  nextTrack: () => Promise<void>
}

interface Window {
  onSpotifyWebPlaybackSDKReady: () => void
  Spotify?: {
    Player: new (init: SpotifyPlayerInit) => SpotifyPlayer
  }
}
