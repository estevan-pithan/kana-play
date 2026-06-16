import { Link } from 'react-router-dom'

import type { SpotifyAlbum } from '@/api/services/spotify/type'

interface AlbumCardProps {
  album: SpotifyAlbum
}

export function AlbumCard({ album }: AlbumCardProps) {
  const cover = album.images[0]?.url
  const year = album.release_date?.slice(0, 4)
  const artist = album.artists[0]

  const inner = (
    <>
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-white/10">
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div>
        <p className="truncate text-sm font-semibold text-white">{album.name}</p>
        <p className="truncate text-xs text-white/50">
          {[artist?.name, year].filter(Boolean).join(' · ')}
        </p>
      </div>
    </>
  )

  const className = 'group block w-[160px] shrink-0 space-y-2'
  const style = { scrollSnapAlign: 'start' } as const

  if (artist) {
    return (
      <Link to={`/artist/${artist.id}`} state={{ album }} className={className} style={style}>
        {inner}
      </Link>
    )
  }

  return (
    <div className={className} style={style}>
      {inner}
    </div>
  )
}
