import { useTranslation } from 'react-i18next'
import { Pause, Play } from 'lucide-react'

import { usePlayer, type PlayTrackInput } from '@/contexts/PlayerContext'
import { cn } from '@/lib/utils'

interface PlayButtonProps {
  /** Spotify track id, used to detect whether this row is the active track. */
  trackId: string
  /** What to start when this row isn't already playing. */
  playInput: PlayTrackInput
  className?: string
  iconClassName?: string
}

/**
 * Shared play/pause affordance for track rows. Starts `playInput` when its track
 * isn't the current one; otherwise toggles play/pause on the active track.
 */
export function PlayButton({ trackId, playInput, className, iconClassName }: PlayButtonProps) {
  const { t } = useTranslation()
  const { state, playTrack, togglePlay } = usePlayer()

  const isCurrent = state.currentTrack?.id === trackId
  const isPlayingThis = isCurrent && state.isPlaying
  const disabled = state.error === 'premium_required'

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={t(isPlayingThis ? 'player.pause' : 'player.play')}
      title={disabled ? t('player.premiumRequired') : undefined}
      onClick={(e) => {
        e.stopPropagation()
        if (isCurrent) {
          void togglePlay()
        } else {
          void playTrack(playInput)
        }
      }}
      className={cn(
        'inline-flex items-center justify-center transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
    >
      {isPlayingThis ? (
        <Pause className={cn('h-4 w-4 fill-current', iconClassName)} />
      ) : (
        <Play className={cn('h-4 w-4 fill-current', iconClassName)} />
      )}
    </button>
  )
}
