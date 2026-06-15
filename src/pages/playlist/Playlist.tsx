import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Lock } from 'lucide-react'

import { usePlaylist, usePlaylistTracks } from './hooks/usePlaylist'
import { PlaylistHero } from './components/PlaylistHero'
import { PlaylistTrackItem } from './components/PlaylistTrackItem'

function isForbidden(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 403
}

export default function Playlist() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    playlist,
    isLoading: heroLoading,
    isError: heroError,
    error: heroErrorObj,
  } = usePlaylist(id)
  const tracks = usePlaylistTracks(id)

  const backButton = (
    <button
      type="button"
      aria-label={t('common.back')}
      onClick={() => navigate(-1)}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-white"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  )

  if (heroLoading) {
    return (
      <div className="w-full px-7 pt-4">
        {backButton}
        <div className="mt-4 h-72 animate-pulse rounded-3xl bg-white/5" />
        <div className="mt-10 h-96 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  if (heroError || !playlist) {
    const forbidden = isForbidden(heroErrorObj)
    return (
      <div className="w-full px-7 pt-4">
        {backButton}
        <div className="mt-4 glass-card flex flex-col items-center p-10 text-center">
          {forbidden && <Lock className="mb-4 h-8 w-8 text-white/60" />}
          <p className="text-base font-semibold">
            {forbidden ? t('playlist.forbiddenTitle') : t('artistDiscovery.errorTitle')}
          </p>
          <p className="mt-2 text-sm text-white/60">
            {forbidden ? t('playlist.forbiddenBody') : t('common.error')}
          </p>
        </div>
      </div>
    )
  }

  const tracksForbidden = isForbidden(tracks.error)
  const showTrackCount = tracks.total > 0

  return (
    <>
      <PlaylistHero
        playlist={playlist}
        trackCount={showTrackCount ? tracks.total : undefined}
        backButton={backButton}
      />

      <div className="relative z-10 w-full px-7 pt-8 pb-12">
        {tracks.isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        )}

        {!tracks.isLoading && tracks.isError && (
          <div className="glass-card flex flex-col items-center p-8 text-center">
            {tracksForbidden && <Lock className="mb-3 h-7 w-7 text-white/60" />}
            <p className="text-sm font-semibold text-white">
              {tracksForbidden
                ? t('playlist.forbiddenTitle')
                : t('artistDiscovery.errorTitle')}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {tracksForbidden ? t('playlist.forbiddenBody') : t('common.error')}
            </p>
          </div>
        )}

        {!tracks.isLoading && !tracks.isError && tracks.tracks.length === 0 && (
          <p className="text-sm text-white/40">{t('common.empty')}</p>
        )}

        {!tracks.isLoading && !tracks.isError && tracks.tracks.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              {tracks.tracks.map((row, i) => (
                <PlaylistTrackItem
                  key={`${row.track.id}-${i}`}
                  index={i}
                  track={row.track}
                />
              ))}
            </div>

            {tracks.hasNextPage && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => tracks.fetchNextPage()}
                  disabled={tracks.isFetchingNextPage}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  {tracks.isFetchingNextPage
                    ? t('common.loading')
                    : t('artistDiscovery.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
