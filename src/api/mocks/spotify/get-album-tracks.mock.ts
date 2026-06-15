import type { AlbumTrack } from '@/api/services/spotify/get-album-tracks'
import type { SpotifyPaging } from '@/api/services/spotify/type'

const artist = {
  id: '06HL4z0CvFAxyc27GXpf02',
  name: 'Taylor Swift',
  external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
}

export const getAlbumTracksSuccessMock: SpotifyPaging<AlbumTrack> = {
  items: [
    {
      id: '0V3wPSX9ygBnCm8psDIegu',
      name: 'Anti-Hero',
      duration_ms: 200_690,
      track_number: 3,
      artists: [artist],
      preview_url: null,
    },
    {
      id: '1Mrt5XnHcvjLLh9Km5MtZv',
      name: 'Lavender Haze',
      duration_ms: 202_396,
      track_number: 1,
      artists: [artist],
      preview_url: null,
    },
    {
      id: '3COaCN9Yn0Ap8jagJN3Lqj',
      name: 'Snow On The Beach',
      duration_ms: 256_124,
      track_number: 4,
      artists: [artist],
      preview_url: null,
    },
  ],
  total: 3,
  limit: 50,
  offset: 0,
  next: null,
  previous: null,
}

export const getAlbumTracksEmptyMock: SpotifyPaging<AlbumTrack> = {
  items: [],
  total: 0,
  limit: 50,
  offset: 0,
  next: null,
  previous: null,
}

export const getAlbumTracksErrorMock = {
  error: { status: 404, message: 'Non existing id' },
}
