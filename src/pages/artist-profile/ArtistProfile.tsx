import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

import type { SpotifyAlbum } from '@/api/services/spotify/type'
import { useArtist, useArtistAlbums } from './hooks/useArtistProfile'
import { ArtistHero } from './components/ArtistHero'
import { AlbumsTable } from './components/AlbumsTable'
import { AlbumTracksView } from './components/AlbumTracksView'

export default function ArtistProfile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  const preselectedAlbum =
    (location.state as { album?: SpotifyAlbum } | null)?.album ?? null

  const { artist, isLoading, isError } = useArtist(id)
  const albums = useArtistAlbums(id)

  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(preselectedAlbum)

  const backButton = (
    <button
      type="button"
      aria-label={t('common.back')}
      onClick={() => {
        if (selectedAlbum) {
          setSelectedAlbum(null)
        } else {
          navigate(-1)
        }
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-white"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  )

  if (selectedAlbum) {
    return <AlbumTracksView album={selectedAlbum} backButton={backButton} />
  }

  if (isLoading) {
    return (
      <div className="w-full px-7 pt-4">
        {backButton}
        <div className="mt-4 h-72 animate-pulse rounded-3xl bg-white/5" />
        <div className="mt-10 h-96 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  if (isError || !artist) {
    return (
      <div className="w-full px-7 pt-4">
        {backButton}
        <div className="mt-4 glass-card p-10 text-center">
          <p className="text-base font-semibold">{t('artistDiscovery.errorTitle')}</p>
          <p className="mt-2 text-sm text-white/60">{t('common.error')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ArtistHero artist={artist} backButton={backButton} />

      <div className="relative z-10 w-full px-7 pt-8">
        <AlbumsTable
          albums={albums.albums}
          total={albums.total}
          page={albums.page}
          totalPages={albums.totalPages}
          isLoading={albums.isLoading}
          isError={albums.isError}
          isFetching={albums.isFetching}
          onPageChange={albums.setPage}
          onSelect={setSelectedAlbum}
        />
      </div>
    </>
  )
}
