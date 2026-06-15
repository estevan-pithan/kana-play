import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'

export const transferPlaybackInputSchema = z.object({
  deviceId: z.string(),
  /** Whether to start playing on the new device immediately. */
  play: z.boolean().optional(),
})

export type TransferPlaybackInput = z.infer<typeof transferPlaybackInputSchema>

/** PUT /me/player — move playback to a device (our Web Playback SDK device). Resolves on 204. */
export async function transferPlayback({ deviceId, play = false }: TransferPlaybackInput): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  await apiSpotify.put('/me/player', { device_ids: [deviceId], play })
}
