import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'

import { useFavorites } from '@/contexts/FavoritesContext'
import { cn } from '@/lib/utils'
import { AddFavoriteDialog, type FavoriteDefaults } from './AddFavoriteDialog'

interface FavoriteButtonProps {
  /** Track identity used to look up, add or remove the favorite. */
  defaults: FavoriteDefaults
  /** Layout classes applied to the button regardless of state. */
  className?: string
  /** Color classes applied while the track is favorited. */
  favoritedClassName?: string
  /** Color classes applied while the track is not favorited. */
  idleClassName?: string
  iconClassName?: string
}

/**
 * Heart toggle shared by the home and artist-profile track lists. Clicking an
 * un-favorited track opens the dialog to capture details; clicking a favorited
 * one removes it immediately.
 */
export function FavoriteButton({
  defaults,
  className,
  favoritedClassName = 'text-brand-light',
  idleClassName = 'text-white/50 hover:text-white',
  iconClassName,
}: FavoriteButtonProps) {
  const { t } = useTranslation()
  const { favorites, removeFavorite } = useFavorites()
  const [dialogOpen, setDialogOpen] = useState(false)

  const favorite = favorites.find(
    (f) => f.trackName === defaults.trackName && f.artist === defaults.artist,
  )
  const favorited = Boolean(favorite)

  return (
    <>
      <button
        type="button"
        aria-pressed={favorited}
        aria-label={t(favorited ? 'artistProfile.removeFavorite' : 'artistProfile.addFavorite')}
        onClick={(e) => {
          e.stopPropagation()
          if (favorite) {
            removeFavorite(favorite.id)
          } else {
            setDialogOpen(true)
          }
        }}
        className={cn(
          'transition-all hover:scale-110',
          favorited ? favoritedClassName : idleClassName,
          className,
        )}
      >
        <Heart className={cn('h-4 w-4', favorited && 'fill-current', iconClassName)} />
      </button>

      <AddFavoriteDialog
        defaults={defaults}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
