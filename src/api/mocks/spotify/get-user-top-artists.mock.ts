import type {
  SpotifyArtist,
  SpotifyPaging,
} from '@/api/services/spotify/type'

const items: SpotifyArtist[] = [
  {
    id: '06HL4z0CvFAxyc27GXpf02',
    name: 'Taylor Swift',
    images: [
      {
        url: 'https://i.scdn.co/image/ab6761610000e5ebe672b5f553298dcdccb0e676',
        height: 640,
        width: 640,
      },
    ],
    genres: ['pop'],
    followers: { total: 110_000_000 },
    popularity: 100,
    external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
  },
  {
    id: '1Xyo4u8uXC1ZmMpatF05PJ',
    name: 'The Weeknd',
    images: [
      {
        url: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb',
        height: 640,
        width: 640,
      },
    ],
    genres: ['pop', 'r&b'],
    followers: { total: 95_000_000 },
    popularity: 95,
    external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' },
  },
  {
    id: '6eUKZXaKkcviH0Ku9w2n3V',
    name: 'Ed Sheeran',
    images: [
      {
        url: 'https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba',
        height: 640,
        width: 640,
      },
    ],
    genres: ['pop'],
    followers: { total: 115_000_000 },
    popularity: 92,
    external_urls: { spotify: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V' },
  },
  {
    id: '246dkjvS1zLTtiykXe5h60',
    name: 'Post Malone',
    images: [
      {
        url: 'https://i.scdn.co/image/ab6761610000e5eb6be070445b03e0b63147c2c1',
        height: 640,
        width: 640,
      },
    ],
    genres: ['hip hop', 'pop'],
    followers: { total: 50_000_000 },
    popularity: 90,
    external_urls: { spotify: 'https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60' },
  },
]

export const getUserTopArtistsSuccessMock: SpotifyPaging<SpotifyArtist> = {
  items,
  total: items.length,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getUserTopArtistsEmptyMock: SpotifyPaging<SpotifyArtist> = {
  items: [],
  total: 0,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getUserTopArtistsErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
