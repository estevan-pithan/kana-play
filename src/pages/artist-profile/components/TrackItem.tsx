import { useTranslation } from 'react-i18next'
import { Heart, Play } from 'lucide-react'

import type { AlbumTrack } from '@/api/services/spotify/get-album-tracks'
import { useFavorites } from '@/contexts/FavoritesContext'
import { cn } from '@/lib/utils'
import { formatDuration } from '../utils'

interface TrackItemProps {
  track: AlbumTrack
  onSelect: (track: AlbumTrack) => void
}

export function TrackItem({ track, onSelect }: TrackItemProps) {
  const { t } = useTranslation()
  const { isFavorited } = useFavorites()
  const artistNames = track.artists.map((a) => a.name).join(', ')
  const favorited = isFavorited(
    (f) => f.trackName === track.name && f.artist === artistNames,
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onSelect(track)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(track)
        }
      }}
      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/[0.07] bg-white/4 p-3 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
    >
      <div className="flex w-8 items-center justify-center text-sm font-medium text-white/40">
        <span className="group-hover:hidden">{track.track_number}</span>
        <Play className="hidden h-3 w-3 fill-current text-white group-hover:block" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-base font-medium text-white transition-colors group-hover:text-brand-light">
          {track.name}
        </h4>
        <p className="mt-0.5 truncate text-sm text-white/50">{artistNames}</p>
      </div>

      <div className="flex w-16 items-center justify-end gap-4 text-right">
        <button
          type="button"
          aria-label={t('artistProfile.addFavorite')}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(track)
          }}
          className={cn(
            'transition-all hover:scale-110',
            favorited
              ? 'text-brand-light'
              : 'text-transparent group-hover:text-white/50 hover:text-white!',
          )}
        >
          <Heart className={cn('h-4 w-4', favorited && 'fill-current')} />
        </button>
        <span className="text-sm font-medium text-white/40">
          {formatDuration(track.duration_ms)}
        </span>
      </div>
    </div>
  )
}
