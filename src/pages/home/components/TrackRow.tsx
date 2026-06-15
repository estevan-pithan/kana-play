import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

import type { SpotifyTrack } from '@/api/services/spotify/type'

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

interface TrackRowProps {
  track: SpotifyTrack
  onAdd?: (track: SpotifyTrack) => void
}

export function TrackRow({ track, onAdd }: TrackRowProps) {
  const { t } = useTranslation()
  const cover = track.album.images[0]?.url
  const artistNames = track.artists.map((a) => a.name).join(', ')

  return (
    <div
      className="flex w-[320px] shrink-0 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.04]"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/10">
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{track.name}</p>
        <p className="truncate text-xs text-white/50">{artistNames}</p>
      </div>
      <span className="shrink-0 text-xs text-white/40">
        {formatDuration(track.duration_ms)}
      </span>
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
