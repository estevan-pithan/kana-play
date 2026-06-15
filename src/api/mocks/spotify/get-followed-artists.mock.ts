import { getUserTopArtistsSuccessMock } from './get-user-top-artists.mock'
import type {
  SpotifyArtist,
  SpotifyPaging,
} from '@/api/services/spotify/type'

// Reuse the top-artists mock data — same shape, same fixtures are fine for
// a fake "followed artists" surface in the demo.
export const getFollowedArtistsSuccessMock: SpotifyPaging<SpotifyArtist> = {
  ...getUserTopArtistsSuccessMock,
  items: [...getUserTopArtistsSuccessMock.items].reverse(),
}

export const getFollowedArtistsEmptyMock: SpotifyPaging<SpotifyArtist> = {
  items: [],
  total: 0,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getFollowedArtistsErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
