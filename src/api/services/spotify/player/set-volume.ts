import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'

export const setVolumeInputSchema = z.object({
  volumePercent: z.number().min(0).max(100),
  deviceId: z.string().optional(),
})

export type SetVolumeInput = z.infer<typeof setVolumeInputSchema>

/** PUT /me/player/volume — set device volume (0–100, clamped). Resolves on 204. */
export async function setVolume({ volumePercent, deviceId }: SetVolumeInput): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  const clamped = Math.min(100, Math.max(0, Math.round(volumePercent)))
  await apiSpotify.put('/me/player/volume', undefined, {
    params: { volume_percent: clamped, device_id: deviceId },
  })
}
