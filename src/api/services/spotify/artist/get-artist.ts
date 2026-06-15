import { apiSpotify, USE_SPOTIFY_MOCK } from '../api'
import { spotifyArtistResponseSchema } from '../type'
import type { SpotifyArtist } from '../type'
import { getArtistSuccessMock } from '@/api/mocks/spotify/artist/get-artist.mock'

export async function getArtist(id: string): Promise<SpotifyArtist> {
  if (USE_SPOTIFY_MOCK) return getArtistSuccessMock

  const response = await apiSpotify.get(`/artists/${id}`)
  return spotifyArtistResponseSchema.parse(response.data)
}
