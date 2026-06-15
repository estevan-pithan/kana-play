import type {
  SpotifyPaging,
  SpotifyTrack,
} from '@/api/services/spotify/type'

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
    duration_ms: 233_713,
    album: {
      id: '3T4tUhGYeRNVUGevb0wThu',
      name: '\u00f7 (Deluxe)',
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
  {
    id: '1BxfuPKGuaTgP7aM0Bbdph',
    name: 'Anti-Hero',
    duration_ms: 200_690,
    album: {
      id: '151w1FgRZfnKZA9FEcg9Z3',
      name: 'Midnights',
      images: [
        {
          url: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
          height: 640,
          width: 640,
        },
      ],
    },
    artists: [
      {
        id: '06HL4z0CvFAxyc27GXpf02',
        name: 'Taylor Swift',
        external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
      },
    ],
    preview_url: null,
  },
  {
    id: '3KkXRkHbMCARz0aVfEt68P',
    name: 'Sunflower - Spider-Man: Into the Spider-Verse',
    duration_ms: 158_040,
    album: {
      id: '4yP0hdKOZPNshxUOjY0cZj',
      name: "Hollywood's Bleeding",
      images: [
        {
          url: 'https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02',
          height: 640,
          width: 640,
        },
      ],
    },
    artists: [
      {
        id: '246dkjvS1zLTtiykXe5h60',
        name: 'Post Malone',
        external_urls: { spotify: 'https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60' },
      },
    ],
    preview_url: null,
  },
]

export const getUserTopTracksSuccessMock: SpotifyPaging<SpotifyTrack> = {
  items,
  total: items.length,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getUserTopTracksEmptyMock: SpotifyPaging<SpotifyTrack> = {
  items: [],
  total: 0,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getUserTopTracksErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
