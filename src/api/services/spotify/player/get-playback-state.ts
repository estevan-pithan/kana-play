import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import { spotifyTrackSchema, type SpotifyTrack } from '../type'
import { getPlaybackStateSuccessMock } from '@/api/mocks/spotify/player/get-playback-state.mock'

export type RepeatMode = 'off' | 'track' | 'context'

export interface PlaybackState {
  deviceId: string | null
  deviceName: string | null
  isPlaying: boolean
  progressMs: number
  shuffle: boolean
  repeatMode: RepeatMode
  track: SpotifyTrack | null
}

const responseSchema = z
  .object({
    device: z
      .object({ id: z.string().nullable(), name: z.string() })
      .nullable()
      .optional(),
    is_playing: z.boolean().default(false),
    progress_ms: z.number().nullable().default(0),
    shuffle_state: z.boolean().default(false),
    repeat_state: z.enum(['off', 'track', 'context']).default('off'),
    item: spotifyTrackSchema.nullable().default(null),
  })
  .transform(
    ({ device, is_playing, progress_ms, shuffle_state, repeat_state, item }): PlaybackState => ({
      deviceId: device?.id ?? null,
      deviceName: device?.name ?? null,
      isPlaying: is_playing,
      progressMs: progress_ms ?? 0,
      shuffle: shuffle_state,
      repeatMode: repeat_state,
      track: item,
    }),
  )

/**
 * GET /me/player — current playback state. Spotify replies `204 No Content` when there is
 * no active device/playback; in that case (and on mock-empty) we resolve `null`.
 */
export async function getPlaybackState(): Promise<PlaybackState | null> {
  if (USE_SPOTIFY_MOCK) return getPlaybackStateSuccessMock

  const response = await apiSpotify.get('/me/player')
  if (response.status === 204 || !response.data) return null
  return responseSchema.parse(response.data)
}
