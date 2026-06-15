import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'

import type { AlbumTrack } from '@/api/services/spotify/get-album-tracks'
import type { SpotifyAlbum } from '@/api/services/spotify/type'
import { useAlbumTracks } from '../hooks/useArtistProfile'
import { formatReleaseDate } from '../utils'
import { TrackItem } from './TrackItem'

interface AlbumTracksViewProps {
  album: SpotifyAlbum
  onBack: () => void
  onSelectTrack: (track: AlbumTrack) => void
}

export function AlbumTracksView({
  album,
  onBack,
  onSelectTrack,
}: AlbumTracksViewProps) {
  const { t } = useTranslation()
  const { tracks, isLoading, isError } = useAlbumTracks(album.id)
  const cover = album.images[0]?.url

  return (
    <section>
      {/* Back to the artist's album list */}
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
      >
        <ChevronLeft className="h-5 w-5" />
        {t('artistProfile.backToAlbums')}
      </button>

      {/* Album header */}
      <div className="mb-8 flex items-end gap-5">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-lg md:h-36 md:w-36">
          {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
            {album.album_type}
          </p>
          <h2 className="mt-1 text-3xl font-bold text-white md:text-4xl">{album.name}</h2>
          <p className="mt-2 text-sm text-white/50">
            {formatReleaseDate(album.release_date)} ·{' '}
            {t('artistDiscovery.trackCount', { count: album.total_tracks })}
          </p>
        </div>
      </div>

      {/* Track list */}
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
            <TrackItem key={track.id} track={track} onSelect={onSelectTrack} />
          ))}
        </div>
      )}
    </section>
  )
}
