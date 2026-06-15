import type { SpotifyPaging, SpotifyTrack } from '@/api/services/spotify/type'

const items: SpotifyTrack[] = [
  {
    id: '0VjIjW4GlUZAMYd2vXMi3b',
    name: 'Blinding Lights',
    duration_ms: 200_040,
    album: {
      id: '4yP0hdKOZPNshxUOjY0cZj',
      name: 'After Hours',
      images: [
        {
          url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
          height: 640,
          width: 640,
        },
      ],
    },
    artists: [
      {
        id: '1Xyo4u8uXC1ZmMpatF05PJ',
        name: 'The Weeknd',
        external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' },
      },
    ],
    preview_url: null,
  },
  {
    id: '7qiZfU4dY1lWllzX7mPBI3',
    name: 'Shape of You',
    duration_ms: 233_712,
    album: {
      id: '3T4tUhGYeRNVUGevb0wThu',
      name: '÷ (Deluxe)',
      images: [
        {
          url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
          height: 640,
          width: 640,
        },
      ],
    },
    artists: [
      {
        id: '6eUKZXaKkcviH0Ku9w2n3V',
        name: 'Ed Sheeran',
        external_urls: { spotify: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V' },
      },
    ],
    preview_url: null,
  },
]

export const getSavedTracksSuccessMock: SpotifyPaging<SpotifyTrack> = {
  items,
  total: 148,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getSavedTracksEmptyMock: SpotifyPaging<SpotifyTrack> = {
  items: [],
  total: 0,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getSavedTracksErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
