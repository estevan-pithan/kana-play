import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'

/** POST /me/player/next — skip to the next track in the queue. Resolves on 204. */
export async function skipToNext(deviceId?: string): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  await apiSpotify.post('/me/player/next', undefined, { params: { device_id: deviceId } })
}
