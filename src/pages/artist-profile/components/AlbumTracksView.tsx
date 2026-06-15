import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { SpotifyAlbum } from '@/api/services/spotify/type'
import { useAlbumTracks } from '../hooks/useArtistProfile'
import { AlbumHero } from './AlbumHero'
import { TrackItem } from './TrackItem'

interface AlbumTracksViewProps {
  album: SpotifyAlbum
  backButton?: ReactNode
}

/**
 * Full-screen album view: the album hero (cover backdrop) followed by its track
 * list. Returning to the albums list is handled by the page-level back button.
 */
export function AlbumTracksView({ album, backButton }: AlbumTracksViewProps) {
  const { t } = useTranslation()
  const { tracks, isLoading, isError } = useAlbumTracks(album.id)

  return (
    <>
      <AlbumHero album={album} backButton={backButton} />

      <div className="relative z-10 w-full px-7 pt-8">
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <p className="text-sm text-white/50">{t('artistDiscovery.errorTitle')}</p>
        )}

        {!isLoading && !isError && tracks.length === 0 && (
          <p className="text-sm text-white/40">{t('common.empty')}</p>
        )}

        {!isLoading && !isError && tracks.length > 0 && (
          <div className="flex flex-col gap-2">
            {tracks.map((track) => (
              <TrackItem key={track.id} track={track} albumName={album.name} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
