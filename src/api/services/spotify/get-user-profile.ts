import { apiSpotify, USE_SPOTIFY_MOCK } from './api'
import { spotifyUserProfileSchema, type SpotifyUserProfile } from './type'
import { getUserProfileSuccessMock } from '@/api/mocks/spotify/get-user-profile.mock'

export type { SpotifyUserProfile } from './type'

export async function getUserProfile(): Promise<SpotifyUserProfile> {
  if (USE_SPOTIFY_MOCK) return getUserProfileSuccessMock

  const response = await apiSpotify.get('/me')
  return spotifyUserProfileSchema.parse(response.data)
}
