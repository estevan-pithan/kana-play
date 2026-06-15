import { useTranslation } from 'react-i18next'
import { Disc3 } from 'lucide-react'

import type { AlbumTrack } from '@/api/services/spotify/get-album-tracks'
import type { SpotifyAlbum } from '@/api/services/spotify/type'
import { useAlbumTracks } from '../hooks/useArtistProfile'
import { formatReleaseDate } from '../utils'
import { TrackItem } from './TrackItem'

interface AlbumTracksPanelProps {
  album: SpotifyAlbum | null
  onSelectTrack: (track: AlbumTrack) => void
}

/** Desktop right panel (1/3): tracks of the album selected in the left table. */
export function AlbumTracksPanel({ album, onSelectTrack }: AlbumTracksPanelProps) {
  const { t } = useTranslation()

  return (
    <section className="lg:sticky lg:top-24">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        {t('artistProfile.tracks')}
      </h2>

      {album ? (
        <TracksContent album={album} onSelectTrack={onSelectTrack} />
      ) : (
        <div className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl p-10 text-center">
          <Disc3 className="h-10 w-10 text-white/30" />
          <p className="text-base font-semibold text-white/80">
            {t('artistProfile.selectAlbumTitle')}
          </p>
          <p className="text-sm text-white/50">{t('artistProfile.selectAlbumHint')}</p>
        </div>
      )}
    </section>
  )
}

function TracksContent({
  album,
  onSelectTrack,
}: {
  album: SpotifyAlbum
  onSelectTrack: (track: AlbumTrack) => void
}) {
  const { t } = useTranslation()
  const { tracks, isLoading, isError } = useAlbumTracks(album.id)
  const cover = album.images[0]?.url

  return (
    <div>
      {/* Compact album header */}
      <div className="mb-5 flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-lg">
          {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-white">{album.name}</h3>
          <p className="mt-0.5 truncate text-xs text-white/50">
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
        <div className="hide-scrollbar flex flex-col gap-2 lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto lg:pr-1">
          {tracks.map((track) => (
            <TrackItem key={track.id} track={track} onSelect={onSelectTrack} />
          ))}
        </div>
      )}
    </div>
  )
}
