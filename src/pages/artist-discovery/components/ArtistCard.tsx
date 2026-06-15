import { Link } from 'react-router-dom'

import type { SpotifyArtist } from '@/api/services/spotify/type'

interface ArtistCardProps {
  artist: SpotifyArtist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const cover = artist.images[0]?.url
  const genre = artist.genres[0]

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group flex w-[140px] shrink-0 flex-col items-center gap-2"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="h-[140px] w-[140px] overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10 transition-shadow group-hover:ring-white/30">
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="w-full text-center">
        <p className="truncate text-sm font-semibold text-white">{artist.name}</p>
        {genre && (
          <p className="truncate text-xs capitalize text-white/50">{genre}</p>
        )}
      </div>
    </Link>
  )
}
