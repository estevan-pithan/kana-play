import type { SpotifyAlbum } from '@/api/services/spotify/type'

interface AlbumCardProps {
  album: SpotifyAlbum
}

export function AlbumCard({ album }: AlbumCardProps) {
  const cover = album.images[0]?.url
  const year = album.release_date?.slice(0, 4)
  const artistName = album.artists[0]?.name

  return (
    <div
      className="group block w-[160px] shrink-0 space-y-2"
      style={{ scrollSnapAlign: 'start' }}
    >
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
          {[artistName, year].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  )
}
