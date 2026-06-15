import type {
  SpotifyPaging,
  SpotifyPlaylist,
} from '@/api/services/spotify/type'

const items: SpotifyPlaylist[] = [
  {
    id: '37i9dQZF1DXcBWIGoYBM5M',
    name: "Today's Top Hits",
    description: 'The hottest tracks right now.',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67706f00000002b0fe40a6e1692822f5a9d8f1',
        height: 300,
        width: 300,
      },
    ],
    owner: { id: 'spotify', display_name: 'Spotify' },
    tracks: { total: 50 },
    external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' },
  },
  {
    id: '37i9dQZF1DX0XUsuxWHRQd',
    name: 'RapCaviar',
    description: 'New music from Drake, Kendrick Lamar and more.',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67706f00000002a960ee4cf6f04e08bcb87a2c',
        height: 300,
        width: 300,
      },
    ],
    owner: { id: 'spotify', display_name: 'Spotify' },
    tracks: { total: 60 },
    external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' },
  },
  {
    id: '37i9dQZF1DWXRqgorJj26U',
    name: 'Rock Classics',
    description: 'Rock legends and epic songs.',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112',
        height: 300,
        width: 300,
      },
    ],
    owner: { id: 'spotify', display_name: 'Spotify' },
    tracks: { total: 100 },
    external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U' },
  },
  {
    id: '37i9dQZF1DX4dyzvuaRJ0n',
    name: 'mint',
    description: 'The world\u2019s biggest dance hits.',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67706f0000000264fea50a4ddc4b71ff70f3d0',
        height: 300,
        width: 300,
      },
    ],
    owner: { id: 'spotify', display_name: 'Spotify' },
    tracks: { total: 80 },
    external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n' },
  },
]

export const getUserPlaylistsSuccessMock: SpotifyPaging<SpotifyPlaylist> = {
  items,
  total: items.length,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getUserPlaylistsEmptyMock: SpotifyPaging<SpotifyPlaylist> = {
  items: [],
  total: 0,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const getUserPlaylistsErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
