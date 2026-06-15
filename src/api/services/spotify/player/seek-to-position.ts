import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'

export const seekToPositionInputSchema = z.object({
  positionMs: z.number().min(0),
  deviceId: z.string().optional(),
})

export type SeekToPositionInput = z.infer<typeof seekToPositionInputSchema>

/** PUT /me/player/seek — seek to a position (ms) in the current track. Resolves on 204. */
export async function seekToPosition({ positionMs, deviceId }: SeekToPositionInput): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  await apiSpotify.put('/me/player/seek', undefined, {
    params: { position_ms: Math.max(0, Math.round(positionMs)), device_id: deviceId },
  })
}
