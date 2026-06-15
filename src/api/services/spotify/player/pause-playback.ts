import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'

/** PUT /me/player/pause — pause playback on the active (or given) device. Resolves on 204. */
export async function pausePlayback(deviceId?: string): Promise<void> {
  if (USE_SPOTIFY_MOCK) return

  await apiSpotify.put('/me/player/pause', undefined, { params: { device_id: deviceId } })
}
