import type { SpotifyUserProfile } from '@/api/services/spotify/type'

export const getUserProfileSuccessMock: SpotifyUserProfile = {
  id: 'kanaplay-demo',
  display_name: 'Kana Demo',
  email: 'demo@kanaplay.app',
  images: [
    {
      url: 'https://i.pravatar.cc/96?u=kanaplay',
      height: 96,
      width: 96,
    },
  ],
  country: 'BR',
  product: 'premium',
  external_urls: { spotify: 'https://open.spotify.com/user/kanaplay-demo' },
}

export const getUserProfileEmptyMock: SpotifyUserProfile = {
  id: 'empty',
  display_name: null,
  images: [],
  external_urls: { spotify: 'https://open.spotify.com/user/empty' },
}

export const getUserProfileErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
