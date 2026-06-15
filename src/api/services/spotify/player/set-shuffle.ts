import { z } from 'zod'

import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'

export const setShuffleInputSchema = z.object({
  state: z.boolean(),
  deviceId: z.string().optional(),
})

export type SetShuffleInput = z.infer<typeof setShuffleInputSchema>

/** PUT /me/player/shuffle — toggle shuffle on/off. Resolves on 204. */
export async function setShuffle({ state, deviceId }: SetShuffleInput): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  await apiSpotify.put('/me/player/shuffle', undefined, {
    params: { state, device_id: deviceId },
  })
}
