import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

import type { SpotifyTrack } from '@/api/services/spotify/type'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { PlayButton } from '@/components/player/PlayButton'
import { usePlayer } from '@/contexts/PlayerContext'
import { cn } from '@/lib/utils'

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

interface TrackRowProps {
  track: SpotifyTrack
  onAdd?: (track: SpotifyTrack) => void
  /** `carousel` keeps the fixed-width snap behaviour; `list` fills its column. */
  variant?: 'carousel' | 'list'
  /** 1-based position shown as a leading rank in `list` variant. */
  rank?: number
}

export function TrackRow({ track, onAdd, variant = 'carousel', rank }: TrackRowProps) {
  const { t } = useTranslation()
  const { state } = usePlayer()
  const cover = track.album.images[0]?.url
  const artistNames = track.artists.map((a) => a.name).join(', ')
  const isList = variant === 'list'
  const isCurrent = state.currentTrack?.id === track.id

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.04] ${
        isList ? 'w-full' : 'w-[320px] shrink-0'
      }`}
      style={isList ? undefined : { scrollSnapAlign: 'start' }}
    >
      {isList && rank != null && (
        <span className="w-5 shrink-0 text-center text-xs font-semibold text-white/40">{rank}</span>
      )}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/10">
        {cover && <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100',
            isCurrent && 'opacity-100',
          )}
        >
          <PlayButton
            trackId={track.id}
            playInput={{ uris: [`spotify:track:${track.id}`] }}
            iconClassName="text-white"
          />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm font-semibold',
            isCurrent ? 'text-brand-light' : 'text-white',
          )}
        >
          {track.name}
        </p>
        <p className="truncate text-xs text-white/50">{artistNames}</p>
      </div>
      <FavoriteButton
        className="shrink-0"
        defaults={{ trackName: track.name, artist: artistNames, album: track.album.name }}
      />
      <span className="shrink-0 text-xs text-white/40">{formatDuration(track.duration_ms)}</span>
      {onAdd && (
        <button
          type="button"
          onClick={() => {
            onAdd(track)
          }}
          aria-label={t('artistDiscovery.addToQueue')}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
