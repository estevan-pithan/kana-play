import type { PlaybackState } from '@/api/services/spotify/player/get-playback-state'

export const getPlaybackStateSuccessMock: PlaybackState = {
  deviceId: 'kanaplay-web-mock',
  deviceName: 'KanaPlay Web Player',
  isPlaying: true,
  progressMs: 68_000,
  shuffle: false,
  repeatMode: 'off',
  track: {
    id: 't1',
    name: 'Midnight City',
    duration_ms: 244_000,
    album: {
      id: 'al-t1',
      name: 'Hurry Up, We’re Dreaming',
      images: [
        { url: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647', height: 640, width: 640 },
      ],
    },
    artists: [{ id: 'a1', name: 'M83', external_urls: { spotify: '' } }],
    preview_url: null,
  },
}

/** Spotify's `204` case — nothing playing on any device. */
export const getPlaybackStateEmptyMock: PlaybackState | null = null

export const getPlaybackStateErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
