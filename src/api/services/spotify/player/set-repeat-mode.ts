import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import { type RepeatMode } from './get-playback-state'

export const setRepeatModeInputSchema = z.object({
  state: z.enum(['off', 'track', 'context']),
  deviceId: z.string().optional(),
})

export type SetRepeatModeInput = z.infer<typeof setRepeatModeInputSchema>

/** PUT /me/player/repeat — set repeat mode (track | context | off). Resolves on 204. */
export async function setRepeatMode({
  state,
  deviceId,
}: {
  state: RepeatMode
  deviceId?: string
}): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  await apiSpotify.put('/me/player/repeat', undefined, {
    params: { state, device_id: deviceId },
  })
}
