import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'

/** POST /me/player/previous — skip to the previous track in the queue. Resolves on 204. */
export async function skipToPrevious(deviceId?: string): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  await apiSpotify.post('/me/player/previous', undefined, { params: { device_id: deviceId } })
}
