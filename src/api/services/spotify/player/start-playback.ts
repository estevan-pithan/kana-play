import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'

export const startPlaybackInputSchema = z.object({
  deviceId: z.string().optional(),
  /** Album/artist/playlist URI to play. Mutually exclusive with `uris`. */
  contextUri: z.string().optional(),
  /** Explicit track URIs to play. Mutually exclusive with `contextUri`. */
  uris: z.array(z.string()).optional(),
  /** Where to start within a context — by index or by track uri. */
  offset: z.union([z.object({ position: z.number() }), z.object({ uri: z.string() })]).optional(),
  positionMs: z.number().optional(),
})

export type StartPlaybackInput = z.infer<typeof startPlaybackInputSchema>

/**
 * PUT /me/player/play — start/resume playback. Pass `uris` for ad-hoc tracks or `contextUri`
 * (+ optional `offset`) to play within an album/playlist. Resolves on 204.
 */
export async function startPlayback({
  deviceId,
  contextUri,
  uris,
  offset,
  positionMs,
}: StartPlaybackInput = {}): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  await apiSpotify.put(
    '/me/player/play',
    {
      context_uri: contextUri,
      uris,
      offset,
      position_ms: positionMs,
    },
    { params: { device_id: deviceId } },
  )
}
