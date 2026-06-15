import { useState } from 'react'
import {
  Heart,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  ListMusic,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_TRACK = {
  title: 'Cruel Summer',
  artist: 'Taylor Swift',
  cover:
    'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
  durationLabel: '3:42',
}

export function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [progress, setProgress] = useState(28)
  const [volume, setVolume] = useState(70)

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl"
      style={{
        background: 'rgba(13,13,13,0.85)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="mx-auto grid h-24 w-full max-w-7xl grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-center gap-4 px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/10"
            aria-hidden="true"
          >
            <img
              src={MOCK_TRACK.cover}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {MOCK_TRACK.title}
            </p>
            <p className="truncate text-xs text-white/50">{MOCK_TRACK.artist}</p>
          </div>
          <button
            type="button"
            aria-label="Like"
            onClick={() => {
              setIsLiked((prev) => !prev)
            }}
            className={cn(
              'ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              isLiked
                ? 'text-[var(--brand-light)]'
                : 'text-white/60 hover:text-white',
            )}
          >
            <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Shuffle"
              className="text-white/50 transition-colors hover:text-white"
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Previous"
              className="text-white/70 transition-colors hover:text-white"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={() => {
                setIsPlaying((prev) => !prev)
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 translate-x-[1px] fill-current" />
              )}
            </button>
            <button
              type="button"
              aria-label="Next"
              className="text-white/70 transition-colors hover:text-white"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Repeat"
              className="text-white/50 transition-colors hover:text-white"
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          <div className="flex w-full max-w-[420px] items-center gap-2">
            <span className="text-[10px] tabular-nums text-white/50">
              {formatProgress(progress, MOCK_TRACK.durationLabel)}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => {
                setProgress(Number(e.target.value))
              }}
              className="kana-range flex-1"
              aria-label="Progress"
            />
            <span className="text-[10px] tabular-nums text-white/50">
              {MOCK_TRACK.durationLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 text-white/60">
          <button
            type="button"
            aria-label="Lyrics"
            className="transition-colors hover:text-white"
          >
            <Mic2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Queue"
            className="transition-colors hover:text-white"
          >
            <ListMusic className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => {
                setVolume(Number(e.target.value))
              }}
              aria-label="Volume"
              className="kana-range w-24"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

function formatProgress(percent: number, durationLabel: string): string {
  const [mm, ss] = durationLabel.split(':').map(Number)
  if (mm == null || ss == null) return '0:00'
  const total = mm * 60 + ss
  const elapsed = Math.round((percent / 100) * total)
  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
