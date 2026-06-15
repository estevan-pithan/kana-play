import type {
  SpotifyAlbum,
  SpotifyPaging,
} from '@/api/services/spotify/type'

const items: SpotifyAlbum[] = [
  {
    id: '4yP0hdKOZPNshxUOjY0cZj',
    name: 'After Hours',
    album_type: 'album',
    release_date: '2020-03-20',
    total_tracks: 14,
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        height: 640,
        width: 640,
      },
    ],
    artists: [
      {
        id: '1Xyo4u8uXC1ZmMpatF05PJ',
        name: 'The Weeknd',
        external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' },
      },
    ],
  },
  {
    id: '151w1FgRZfnKZA9FEcg9Z3',
    name: 'Midnights',
    album_type: 'album',
    release_date: '2022-10-21',
    total_tracks: 13,
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
        height: 640,
        width: 640,
      },
    ],
    artists: [
      {
        id: '06HL4z0CvFAxyc27GXpf02',
        name: 'Taylor Swift',
        external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
      },
    ],
  },
  {
    id: '2fenSS68JI1h4Fo0BVhxQ7',
    name: 'folklore',
    album_type: 'album',
    release_date: '2020-07-24',
    total_tracks: 16,
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273c288028c2592f400dd0b9233',
        height: 640,
        width: 640,
      },
    ],
    artists: [
      {
        id: '06HL4z0CvFAxyc27GXpf02',
        name: 'Taylor Swift',
        external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
      },
    ],
  },
  {
    id: '3T4tUhGYeRNVUGevb0wThu',
    name: '\u00f7 (Deluxe)',
    album_type: 'album',
    release_date: '2017-03-03',
    total_tracks: 16,
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
        height: 640,
        width: 640,
      },
    ],
    artists: [
      {
        id: '6eUKZXaKkcviH0Ku9w2n3V',
        name: 'Ed Sheeran',
        external_urls: { spotify: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V' },
      },
    ],
  },
]

export const getSavedAlbumsSuccessMock: SpotifyPaging<SpotifyAlbum> = {
  items,
  total: items.length,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getSavedAlbumsEmptyMock: SpotifyPaging<SpotifyAlbum> = {
  items: [],
  total: 0,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getSavedAlbumsErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
