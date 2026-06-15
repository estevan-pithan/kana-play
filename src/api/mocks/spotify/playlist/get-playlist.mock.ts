import type { Playlist } from '@/api/services/spotify/playlist/get-playlist'

export const getPlaylistSuccessMock: Playlist = {
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
  tracks: { total: 3 },
  external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' },
}

export const getPlaylistErrorMock = {
  error: { status: 404, message: 'Playlist not found' },
}
