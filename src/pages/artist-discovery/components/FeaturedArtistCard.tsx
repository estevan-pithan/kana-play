import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getArtist } from '@/api/services/spotify/get-artist'
import type { SpotifyArtist } from '@/api/services/spotify/type'

interface FeaturedArtistCardProps {
  artist: SpotifyArtist
}

function toGenreLabel(genres: string[]): string {
  return genres
    .slice(0, 2)
    .map((genre) =>
      genre.replace(/\b\w/g, (char) => char.toUpperCase()),
    )
    .join(' / ')
}

export function FeaturedArtistCard({ artist }: FeaturedArtistCardProps) {
  const image = artist.images[0]?.url

  // `/search` doesn't return genres — fetch the full artist so the card can
  // show a genre label like the design. Cached, so the profile page reuses it.
  const fullArtist = useQuery({
    queryKey: ['artist', artist.id],
    queryFn: () => getArtist(artist.id),
    staleTime: 5 * 60_000,
  })

  const genres = fullArtist.data?.genres ?? artist.genres
  const genreLabel = toGenreLabel(genres)

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] p-3 transition-colors hover:border-white/15 hover:bg-white/[0.07]"
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-white/10">
        {image && (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-3 min-w-0">
        <p className="truncate text-sm font-semibold text-white">{artist.name}</p>
        <p className="truncate text-xs text-white/50">{genreLabel || '—'}</p>
      </div>
    </Link>
  )
}
