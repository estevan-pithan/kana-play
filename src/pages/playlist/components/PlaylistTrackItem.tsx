import { Play } from 'lucide-react'

import type { SpotifyTrack } from '@/api/services/spotify/type'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { formatDuration } from '@/pages/artist-profile/utils'

interface PlaylistTrackItemProps {
  index: number
  track: SpotifyTrack
}

export function PlaylistTrackItem({ index, track }: PlaylistTrackItemProps) {
  const artistNames = track.artists.map((a) => a.name).join(', ')
  const cover = track.album.images[0]?.url

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/4 p-3 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10">
      <div className="flex w-8 items-center justify-center text-sm font-medium text-white/40">
        <span className="group-hover:hidden">{index + 1}</span>
        <Play className="hidden h-3 w-3 fill-current text-white group-hover:block" />
      </div>

      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/10">
        {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-base font-medium text-white transition-colors group-hover:text-brand-light">
          {track.name}
        </h4>
        <p className="mt-0.5 truncate text-sm text-white/50">{artistNames}</p>
      </div>

      <p className="hidden min-w-0 max-w-[28%] truncate text-sm text-white/40 md:block">
        {track.album.name}
      </p>

      <div className="flex w-16 items-center justify-end gap-4 text-right">
        <FavoriteButton
          defaults={{ trackName: track.name, artist: artistNames, album: track.album.name }}
          idleClassName="text-transparent group-hover:text-white/50 hover:text-white!"
        />
        <span className="text-sm font-medium text-white/40">
          {formatDuration(track.duration_ms)}
        </span>
      </div>
    </div>
  )
}
