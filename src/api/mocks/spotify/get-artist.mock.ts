import type { SpotifyArtist } from '@/api/services/spotify/type'

export const getArtistSuccessMock: SpotifyArtist = {
  id: '06HL4z0CvFAxyc27GXpf02',
  name: 'Taylor Swift',
  images: [
    {
      url: 'https://i.scdn.co/image/ab6761610000e5eb6a224073987b930f99adc706',
      height: 640,
      width: 640,
    },
    {
      url: 'https://i.scdn.co/image/ab67616100005174a224073987b930f99adc706',
      height: 320,
      width: 320,
    },
    {
      url: 'https://i.scdn.co/image/ab6761610000f178a224073987b930f99adc706',
      height: 160,
      width: 160,
    },
  ],
  external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
}

export const getArtistEmptyMock: SpotifyArtist = {
  id: '',
  name: '',
  images: [],
  external_urls: { spotify: '' },
}

export const getArtistErrorMock = {
  error: { status: 404, message: 'Non existing id' },
}
