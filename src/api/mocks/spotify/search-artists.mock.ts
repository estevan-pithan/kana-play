import type { SpotifyArtist, SpotifyPaging } from '@/api/services/spotify/type'

export const searchArtistsSuccessMock: SpotifyPaging<SpotifyArtist> = {
  items: [
    {
      id: '06HL4z0CvFAxyc27GXpf02',
      name: 'Taylor Swift',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb6a224073987b930f99adc706', height: 640, width: 640 },
        { url: 'https://i.scdn.co/image/ab67616100005174a224073987b930f99adc706', height: 320, width: 320 },
      ],
      genres: ['pop', 'singer-songwriter pop'],
      followers: { total: 96_500_000 },
      popularity: 100,
      external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
    },
    {
      id: '3TVXtAsR1Inumwj472S9r4',
      name: 'Drake',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb4293385d429161cd37974616', height: 640, width: 640 },
      ],
      genres: ['canadian hip hop', 'rap'],
      followers: { total: 82_000_000 },
      popularity: 96,
      external_urls: { spotify: 'https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4' },
    },
    {
      id: '1Xyo4u8uXC1ZmMpatF05PJ',
      name: 'The Weeknd',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb9e528993a2820267c1a25f64', height: 640, width: 640 },
      ],
      genres: ['canadian contemporary r&b', 'pop'],
      followers: { total: 78_000_000 },
      popularity: 95,
      external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' },
    },
    {
      id: '66CXWjxzNUsdJxJ2JdwvnR',
      name: 'Ariana Grande',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952', height: 640, width: 640 },
      ],
      genres: ['pop', 'dance pop'],
      followers: { total: 92_000_000 },
      popularity: 93,
      external_urls: { spotify: 'https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR' },
    },
    {
      id: '6eUKZXaKkcviH0Ku9w2n3V',
      name: 'Ed Sheeran',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6', height: 640, width: 640 },
      ],
      genres: ['pop', 'singer-songwriter pop', 'uk pop'],
      followers: { total: 110_000_000 },
      popularity: 91,
      external_urls: { spotify: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V' },
    },
    {
      id: '4q3ewBCX7sLwd24euuV69X',
      name: 'Bad Bunny',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb9ad50e478a469c0c0395a8dc', height: 640, width: 640 },
      ],
      genres: ['reggaeton', 'trap latino', 'urbano latino'],
      followers: { total: 68_000_000 },
      popularity: 94,
      external_urls: { spotify: 'https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X' },
    },
    {
      id: '1uNFoZAHBGtllmzznpCI3s',
      name: 'Justin Bieber',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36', height: 640, width: 640 },
      ],
      genres: ['canadian pop', 'pop'],
      followers: { total: 73_000_000 },
      popularity: 88,
      external_urls: { spotify: 'https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s' },
    },
    {
      id: '7dGJo4pcD2V6oG8kP0tJRR',
      name: 'Eminem',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eba00b11c129f27a88fc0f10bc', height: 640, width: 640 },
      ],
      genres: ['detroit hip hop', 'hip hop', 'rap'],
      followers: { total: 78_500_000 },
      popularity: 90,
      external_urls: { spotify: 'https://open.spotify.com/artist/7dGJo4pcD2V6oG8kP0tJRR' },
    },
    {
      id: '0du5cEVh5yTK9QJze8zA0C',
      name: 'Bruno Mars',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd', height: 640, width: 640 },
      ],
      genres: ['dance pop', 'pop'],
      followers: { total: 52_000_000 },
      popularity: 89,
      external_urls: { spotify: 'https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C' },
    },
    {
      id: '4dpARuHxo51G3z768sgnrY',
      name: 'Adele',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb68f6e5892075d7f22615bd17', height: 640, width: 640 },
      ],
      genres: ['british soul', 'pop', 'uk pop'],
      followers: { total: 55_000_000 },
      popularity: 86,
      external_urls: { spotify: 'https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY' },
    },
    {
      id: '6M2wZ9GZgrQXHCFfjv46we',
      name: 'Dua Lipa',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb3868375f97b6c1a7edd33df5', height: 640, width: 640 },
      ],
      genres: ['dance pop', 'pop', 'uk pop'],
      followers: { total: 47_000_000 },
      popularity: 87,
      external_urls: { spotify: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we' },
    },
    {
      id: '5K4W6rqBFWDnAN6FQUkS6x',
      name: 'Kanye West',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb6e835a500e791bf9c27f9c74', height: 640, width: 640 },
      ],
      genres: ['chicago rap', 'hip hop', 'rap'],
      followers: { total: 60_000_000 },
      popularity: 88,
      external_urls: { spotify: 'https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x' },
    },
    {
      id: '3Nrfpe0tUJi4K4DXYWgMUX',
      name: 'BTS',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5ebd642648235ebf3460d2d1f34', height: 640, width: 640 },
      ],
      genres: ['k-pop', 'korean pop'],
      followers: { total: 74_000_000 },
      popularity: 85,
      external_urls: { spotify: 'https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX' },
    },
    {
      id: '5pKCCKE2ajJHZ9KAiaK11H',
      name: 'Rihanna',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb99e4fca7c0b7cb166d915789', height: 640, width: 640 },
      ],
      genres: ['barbadian pop', 'dance pop', 'pop', 'r&b'],
      followers: { total: 64_000_000 },
      popularity: 84,
      external_urls: { spotify: 'https://open.spotify.com/artist/5pKCCKE2ajJHZ9KAiaK11H' },
    },
    {
      id: '0Y5tJX1MQlPlqiwlOH1tJY',
      name: 'Travis Scott',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb19c2790744c792d05570bb71', height: 640, width: 640 },
      ],
      genres: ['rap', 'slap house'],
      followers: { total: 55_000_000 },
      popularity: 91,
      external_urls: { spotify: 'https://open.spotify.com/artist/0Y5tJX1MQlPlqiwlOH1tJY' },
    },
    {
      id: '2YZyLoL8N0Wb9xBt1NhZWg',
      name: 'Kendrick Lamar',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022', height: 640, width: 640 },
      ],
      genres: ['conscious hip hop', 'hip hop', 'rap', 'west coast rap'],
      followers: { total: 44_000_000 },
      popularity: 90,
      external_urls: { spotify: 'https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg' },
    },
    {
      id: '6qqNVTkY8uBg9cP3Jd7DAH',
      name: 'Billie Eilish',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf', height: 640, width: 640 },
      ],
      genres: ['art pop', 'electropop', 'pop'],
      followers: { total: 62_000_000 },
      popularity: 92,
      external_urls: { spotify: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH' },
    },
    {
      id: '4gzpq5DPGxSnKTe4SA8HAU',
      name: 'Coldplay',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5eb989ed05e1f0570cc4726c2d3', height: 640, width: 640 },
      ],
      genres: ['permanent wave', 'pop'],
      followers: { total: 47_000_000 },
      popularity: 86,
      external_urls: { spotify: 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU' },
    },
    {
      id: '246dkjvS1zLTtiykXe5h60',
      name: 'Post Malone',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5ebb9bba13631ef276fb1a1fb2c', height: 640, width: 640 },
      ],
      genres: ['dfw rap', 'melodic rap', 'pop'],
      followers: { total: 40_000_000 },
      popularity: 87,
      external_urls: { spotify: 'https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60' },
    },
    {
      id: '1McMsnEElThX1knmY4oliG',
      name: 'Olivia Rodrigo',
      images: [
        { url: 'https://i.scdn.co/image/ab6761610000e5ebe03a98785f3658f0b6461ec4', height: 640, width: 640 },
      ],
      genres: ['pop', 'indie pop'],
      followers: { total: 38_000_000 },
      popularity: 88,
      external_urls: { spotify: 'https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG' },
    },
  ],
  total: 200,
  limit: 20,
  offset: 0,
  next: 'https://api.spotify.com/v1/search?query=pop&type=artist&offset=20&limit=20',
  previous: null,
}

export const searchArtistsEmptyMock: SpotifyPaging<SpotifyArtist> = {
  items: [],
  total: 0,
  limit: 20,
  offset: 0,
  next: null,
  previous: null,
}

export const searchArtistsErrorMock = {
  error: { status: 401, message: 'Invalid access token' },
}
