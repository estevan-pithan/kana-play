import type { AlbumTrack } from '@/api/services/spotify/album/get-album-tracks'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { PlayButton } from '@/components/player/PlayButton'
import { usePlayer } from '@/contexts/PlayerContext'
import { cn } from '@/lib/utils'
import { formatDuration } from '../utils'

interface TrackItemProps {
  track: AlbumTrack
  albumId: string
  albumName: string
}

export function TrackItem({ track, albumId, albumName }: TrackItemProps) {
  const { state } = usePlayer()
  const artistNames = track.artists.map((a) => a.name).join(', ')
  const isCurrent = state.currentTrack?.id === track.id

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/4 p-3 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10">
      <div className="flex w-8 items-center justify-center text-sm font-medium text-white/40">
        <span className={cn('group-hover:hidden', isCurrent && 'hidden')}>
          {track.track_number}
        </span>
        <PlayButton
          trackId={track.id}
          playInput={{
            contextUri: `spotify:album:${albumId}`,
            offset: { uri: `spotify:track:${track.id}` },
          }}
          className={cn('hidden group-hover:inline-flex', isCurrent && 'inline-flex')}
          iconClassName="h-3 w-3 text-white"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4
          className={cn(
            'truncate text-base font-medium transition-colors group-hover:text-brand-light',
            isCurrent ? 'text-brand-light' : 'text-white',
          )}
        >
          {track.name}
        </h4>
        <p className="mt-0.5 truncate text-sm text-white/50">{artistNames}</p>
      </div>

      <div className="flex w-16 items-center justify-end gap-4 text-right">
        <FavoriteButton
          defaults={{ trackName: track.name, artist: artistNames, album: albumName }}
          idleClassName="text-transparent group-hover:text-white/50 hover:text-white!"
        />
        <span className="text-sm font-medium text-white/40">
          {formatDuration(track.duration_ms)}
        </span>
      </div>
    </div>
  )
}
