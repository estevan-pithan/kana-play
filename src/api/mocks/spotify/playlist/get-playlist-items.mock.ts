import type { PlaylistTrack } from '@/api/services/spotify/playlist/get-playlist-items'
import type { SpotifyPaging } from '@/api/services/spotify/type'

const taylor = {
  id: '06HL4z0CvFAxyc27GXpf02',
  name: 'Taylor Swift',
  external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
}
const drake = {
  id: '3TVXtAsR1Inumwj472S9r4',
  name: 'Drake',
  external_urls: { spotify: 'https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4' },
}
const weeknd = {
  id: '1Xyo4u8uXC1ZmMpatF05PJ',
  name: 'The Weeknd',
  external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' },
}

export const getPlaylistItemsSuccessMock: SpotifyPaging<PlaylistTrack> = {
  items: [
    {
      added_at: '2024-10-12T09:00:00Z',
      is_local: false,
      track: {
        id: '0V3wPSX9ygBnCm8psDIegu',
        name: 'Anti-Hero',
        duration_ms: 200_690,
        artists: [taylor],
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
        preview_url: null,
      },
    },
    {
      added_at: '2024-10-12T09:01:00Z',
      is_local: false,
      track: {
        id: '4iJyoBOLtHqaGxP12qzhQI',
        name: 'God’s Plan',
        duration_ms: 198_973,
        artists: [drake],
        album: {
          id: '1ATL5GLyefJaxhQzSPVrLX',
          name: 'Scorpion',
          images: [
            {
              url: 'https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5',
              height: 640,
              width: 640,
            },
          ],
        },
        preview_url: null,
      },
    },
    {
      added_at: '2024-10-12T09:02:00Z',
      is_local: false,
      track: {
        id: '0VjIjW4GlUZAMYd2vXMi3b',
        name: 'Blinding Lights',
        duration_ms: 200_040,
        artists: [weeknd],
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
        preview_url: null,
      },
    },
  ],
  total: 3,
  limit: 50,
  offset: 0,
  next: null,
  previous: null,
}

export const getPlaylistItemsEmptyMock: SpotifyPaging<PlaylistTrack> = {
  items: [],
  total: 0,
  limit: 50,
  offset: 0,
  next: null,
  previous: null,
}

export const getPlaylistItemsErrorMock = {
  error: { status: 404, message: 'Playlist not found' },
}
