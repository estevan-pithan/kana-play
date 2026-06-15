import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react'

import { usePlayer } from '@/contexts/PlayerContext'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { cn } from '@/lib/utils'

export function PlayerBar() {
  const { t } = useTranslation()
  const { state, togglePlay, next, previous, seek, setVolume, toggleShuffle, cycleRepeat } =
    usePlayer()
  const { currentTrack, isPlaying, durationMs, volume, shuffle, repeatMode } = state

  const [displayMs, setDisplayMs] = useState(state.progressMs)
  const [dragMs, setDragMs] = useState<number | null>(null)

  const [synced, setSynced] = useState({ progressMs: state.progressMs, trackId: currentTrack?.id })
  if (synced.progressMs !== state.progressMs || synced.trackId !== currentTrack?.id) {
    setSynced({ progressMs: state.progressMs, trackId: currentTrack?.id })
    setDisplayMs(state.progressMs)
  }

  useEffect(() => {
    if (!isPlaying || dragMs !== null) return
    const id = window.setInterval(() => {
      setDisplayMs((prev) => (durationMs ? Math.min(prev + 1000, durationMs) : prev + 1000))
    }, 1000)
    return () => {
      window.clearInterval(id)
    }
  }, [isPlaying, dragMs, durationMs])

  const isPremiumBlocked = state.error === 'premium_required'
  const isConnecting = !state.isReady && state.error === null
  const controlsDisabled = !state.isReady
  const hint = isPremiumBlocked
    ? t('player.premiumRequired')
    : isConnecting
      ? t('player.connecting')
      : null

  const artistNames = currentTrack?.artists.map((a) => a.name).join(', ') ?? ''
  const cover = currentTrack?.album.images[0]?.url
  const progressMs = dragMs ?? displayMs

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
            {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0">
            {currentTrack ? (
              <>
                <p className="truncate text-sm font-medium text-white">{currentTrack.name}</p>
                <p className="truncate text-xs text-white/50">{artistNames}</p>
              </>
            ) : (
              <p className="truncate text-sm text-white/40">{hint ?? t('player.nothingPlaying')}</p>
            )}
          </div>
          {currentTrack && (
            <FavoriteButton
              className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full"
              defaults={{
                trackName: currentTrack.name,
                artist: artistNames,
                album: currentTrack.album.name,
              }}
            />
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={t('player.shuffle')}
              aria-pressed={shuffle}
              disabled={controlsDisabled}
              onClick={() => void toggleShuffle()}
              className={cn(
                'transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40',
                shuffle ? 'text-[var(--brand-light)]' : 'text-white/50',
              )}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={t('player.previous')}
              disabled={controlsDisabled}
              onClick={() => void previous()}
              className="text-white/70 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? t('player.pause') : t('player.play')}
              disabled={controlsDisabled}
              title={hint ?? undefined}
              onClick={() => void togglePlay()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 translate-x-[1px] fill-current" />
              )}
            </button>
            <button
              type="button"
              aria-label={t('player.next')}
              disabled={controlsDisabled}
              onClick={() => void next()}
              className="text-white/70 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={t('player.repeat')}
              aria-pressed={repeatMode !== 'off'}
              disabled={controlsDisabled}
              onClick={() => void cycleRepeat()}
              className={cn(
                'transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40',
                repeatMode === 'off' ? 'text-white/50' : 'text-[var(--brand-light)]',
              )}
            >
              {repeatMode === 'track' ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex w-full max-w-[420px] items-center gap-2">
            <span className="text-[10px] tabular-nums text-white/50">{formatMs(progressMs)}</span>
            <input
              type="range"
              min={0}
              max={durationMs || 0}
              value={Math.min(progressMs, durationMs || 0)}
              disabled={controlsDisabled || !currentTrack}
              onChange={(e) => {
                setDragMs(Number(e.target.value))
              }}
              onPointerUp={() => {
                if (dragMs !== null) {
                  setDisplayMs(dragMs)
                  void seek(dragMs)
                  setDragMs(null)
                }
              }}
              className="kana-range flex-1"
              aria-label={t('player.progress')}
            />
            <span className="text-[10px] tabular-nums text-white/50">{formatMs(durationMs)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 text-white/60">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              disabled={controlsDisabled}
              onChange={(e) => {
                void setVolume(Number(e.target.value))
              }}
              aria-label={t('player.volume')}
              className="kana-range w-24"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

function formatMs(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '0:00'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
