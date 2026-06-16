import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'

import { useApp } from '@/contexts/AppContext'
import { loadSpotifyPlayerSDK } from '@/utils/spotify-player-sdk'
import { type SpotifyTrack } from '@/api/services/spotify/type'
import { type RepeatMode } from '@/api/services/spotify/player/get-playback-state'
import { transferPlayback } from '@/api/services/spotify/player/transfer-playback'
import { startPlayback } from '@/api/services/spotify/player/start-playback'
import { setShuffle } from '@/api/services/spotify/player/set-shuffle'
import { setRepeatMode } from '@/api/services/spotify/player/set-repeat-mode'

const DEVICE_NAME = 'KanaPlay Web Player'
const DEFAULT_VOLUME = 70

export type PlayerError = 'premium_required' | 'auth' | 'init' | null

export interface PlayerState {
  currentTrack: SpotifyTrack | null
  isPlaying: boolean
  progressMs: number
  durationMs: number
  volume: number
  shuffle: boolean
  repeatMode: RepeatMode
  deviceId: string | null
  isReady: boolean
  error: PlayerError
}

type PlayerAction = { type: 'PATCH'; payload: Partial<PlayerState> } | { type: 'RESET' }

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  progressMs: 0,
  durationMs: 0,
  volume: DEFAULT_VOLUME,
  shuffle: false,
  repeatMode: 'off',
  deviceId: null,
  isReady: false,
  error: null,
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PATCH':
      return { ...state, ...action.payload }
    case 'RESET':
      return initialState
  }
}

const SDK_REPEAT: Record<number, RepeatMode> = { 0: 'off', 1: 'context', 2: 'track' }

function mapSdkTrack(track: SpotifyPlayerTrack): SpotifyTrack {
  const albumId = track.album.uri.split(':').pop() ?? ''
  return {
    id: track.id ?? track.uri.split(':').pop() ?? '',
    name: track.name,
    duration_ms: track.duration_ms,
    album: {
      id: albumId,
      name: track.album.name,
      images: track.album.images.map((image) => ({ url: image.url, height: null, width: null })),
    },
    artists: track.artists.map((artist) => ({
      id: artist.uri.split(':').pop() ?? '',
      name: artist.name,
      external_urls: { spotify: '' },
    })),
    preview_url: null,
  }
}

export interface PlayTrackInput {
  uris?: string[]
  contextUri?: string
  offset?: { position: number } | { uri: string }
}

interface PlayerContextValue {
  state: PlayerState
  playTrack: (input: PlayTrackInput) => Promise<void>
  togglePlay: () => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
  seek: (ms: number) => Promise<void>
  setVolume: (volume: number) => Promise<void>
  toggleShuffle: () => Promise<void>
  cycleRepeat: () => Promise<void>
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { state: appState } = useApp()
  const { token } = appState

  const [state, dispatch] = useReducer(playerReducer, initialState)

  const playerRef = useRef<SpotifyPlayer | null>(null)
  const deviceIdRef = useRef<string | null>(null)
  const tokenRef = useRef<string | null>(token)

  useEffect(() => {
    tokenRef.current = token
  }, [token])

  useEffect(() => {
    if (!token) {
      playerRef.current?.disconnect()
      playerRef.current = null
      deviceIdRef.current = null
      dispatch({ type: 'RESET' })
      return
    }
    if (playerRef.current) return

    let cancelled = false
    let player: SpotifyPlayer | null = null

    void loadSpotifyPlayerSDK()
      .then(() => {
        if (cancelled || !window.Spotify) return

        player = new window.Spotify.Player({
          name: DEVICE_NAME,
          getOAuthToken: (cb) => {
            if (tokenRef.current) cb(tokenRef.current)
          },
          volume: DEFAULT_VOLUME / 100,
        })
        playerRef.current = player

        player.addListener('ready', ({ device_id }) => {
          deviceIdRef.current = device_id
          dispatch({ type: 'PATCH', payload: { deviceId: device_id, isReady: true, error: null } })
          void transferPlayback({ deviceId: device_id, play: false }).catch(() => undefined)
        })

        player.addListener('not_ready', () => {
          dispatch({ type: 'PATCH', payload: { isReady: false } })
        })

        player.addListener('player_state_changed', (sdkState) => {
          if (!sdkState) return
          dispatch({
            type: 'PATCH',
            payload: {
              currentTrack: mapSdkTrack(sdkState.track_window.current_track),
              isPlaying: !sdkState.paused,
              progressMs: sdkState.position,
              durationMs: sdkState.duration,
              shuffle: sdkState.shuffle,
              repeatMode: SDK_REPEAT[sdkState.repeat_mode] ?? 'off',
            },
          })
        })

        player.addListener('account_error', () => {
          dispatch({ type: 'PATCH', payload: { error: 'premium_required', isReady: false } })
        })
        player.addListener('authentication_error', () => {
          dispatch({ type: 'PATCH', payload: { error: 'auth', isReady: false } })
        })
        player.addListener('initialization_error', () => {
          dispatch({ type: 'PATCH', payload: { error: 'init', isReady: false } })
        })

        void player.connect()
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'PATCH', payload: { error: 'init' } })
      })

    return () => {
      cancelled = true
      player?.disconnect()
      if (playerRef.current === player) playerRef.current = null
    }
  }, [token])

  const playTrack = useCallback(async (input: PlayTrackInput) => {
    await startPlayback({ deviceId: deviceIdRef.current ?? undefined, ...input })
  }, [])

  const togglePlay = useCallback(async () => {
    await playerRef.current?.togglePlay()
  }, [])

  const next = useCallback(async () => {
    await playerRef.current?.nextTrack()
  }, [])

  const previous = useCallback(async () => {
    await playerRef.current?.previousTrack()
  }, [])

  const seek = useCallback((ms: number) => {
    dispatch({ type: 'PATCH', payload: { progressMs: ms } })
    return playerRef.current?.seek(Math.max(0, Math.round(ms))) ?? Promise.resolve()
  }, [])

  const setVolume = useCallback((volume: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(volume)))
    dispatch({ type: 'PATCH', payload: { volume: clamped } })
    return playerRef.current?.setVolume(clamped / 100) ?? Promise.resolve()
  }, [])

  const toggleShuffle = useCallback(async () => {
    const nextShuffle = !state.shuffle
    dispatch({ type: 'PATCH', payload: { shuffle: nextShuffle } })
    await setShuffle({ state: nextShuffle, deviceId: deviceIdRef.current ?? undefined })
  }, [state.shuffle])

  const cycleRepeat = useCallback(async () => {
    const order: RepeatMode[] = ['off', 'context', 'track']
    const nextMode = order[(order.indexOf(state.repeatMode) + 1) % order.length] ?? 'off'
    dispatch({ type: 'PATCH', payload: { repeatMode: nextMode } })
    await setRepeatMode({ state: nextMode, deviceId: deviceIdRef.current ?? undefined })
  }, [state.repeatMode])

  const value = useMemo<PlayerContextValue>(
    () => ({
      state,
      playTrack,
      togglePlay,
      next,
      previous,
      seek,
      setVolume,
      toggleShuffle,
      cycleRepeat,
    }),
    [state, playTrack, togglePlay, next, previous, seek, setVolume, toggleShuffle, cycleRepeat],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider')
  return ctx
}
