import { Plus } from 'lucide-react'
import type { SpotifyTrack } from '@/api/services/spotify/get-artist-top-tracks'

interface TopPickItemProps {
  track: SpotifyTrack
  onAdd?: (track: SpotifyTrack) => void
}

export function TopPickItem({ track, onAdd }: TopPickItemProps) {
  const cover = track.album.images[0]?.url
  const artistNames = track.artists.map((a) => a.name).join(', ')

  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-white/8 p-2.5 transition-colors hover:border-white/15"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div
        className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/10"
        aria-hidden="true"
      >
        {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{track.name}</p>
        <p className="truncate text-xs text-white/50">{artistNames}</p>
      </div>
      <button
        type="button"
        onClick={() => onAdd?.(track)}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        aria-label="Add"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
