import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

import type { AlbumTrack } from '@/api/services/spotify/get-album-tracks'
import type { SpotifyAlbum } from '@/api/services/spotify/type'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useArtist, useArtistAlbums } from './hooks/useArtistProfile'
import { ArtistHero } from './components/ArtistHero'
import { AlbumsTable } from './components/AlbumsTable'
import { AlbumTracksView } from './components/AlbumTracksView'
import { AlbumTracksPanel } from './components/AlbumTracksPanel'
import {
  AddFavoriteDialog,
  type FavoriteDefaults,
} from './components/AddFavoriteDialog'

export default function ArtistProfile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Matches Tailwind's `lg` breakpoint — desktop gets the two-panel layout.
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const { artist, isLoading, isError } = useArtist(id)
  const albums = useArtistAlbums(id)

  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null)
  const [favoriteDefaults, setFavoriteDefaults] = useState<FavoriteDefaults | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleSelectTrack(track: AlbumTrack) {
    setFavoriteDefaults({
      trackName: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: selectedAlbum?.name ?? '',
    })
    setDialogOpen(true)
  }

  // Page-level back — sits just under the navbar, leaves the profile entirely.
  const backButton = (
    <button
      type="button"
      aria-label={t('common.back')}
      onClick={() => {
        navigate(-1)
      }}
      className="absolute left-7 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-white"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  )

  if (isLoading) {
    return (
      <>
        {backButton}
        <div className="w-full px-7 pt-32">
          <div className="h-72 animate-pulse rounded-3xl bg-white/5" />
          <div className="mt-10 h-96 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </>
    )
  }

  if (isError || !artist) {
    return (
      <>
        {backButton}
        <div className="w-full px-7 pt-32">
          <div className="glass-card p-10 text-center">
            <p className="text-base font-semibold">{t('artistDiscovery.errorTitle')}</p>
            <p className="mt-2 text-sm text-white/60">{t('common.error')}</p>
          </div>
        </div>
      </>
    )
  }

  const albumsTable = (
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
      selectedAlbumId={isDesktop ? selectedAlbum?.id : undefined}
    />
  )

  return (
    <>
      {backButton}

      <ArtistHero artist={artist} />

      <div className="relative z-10 w-full px-7 pt-8">
        {isDesktop ? (
          // Desktop: albums (2/3) on the left, selected album's tracks (1/3) on the right.
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">{albumsTable}</div>
            <div className="lg:col-span-1">
              <AlbumTracksPanel
                album={selectedAlbum}
                onSelectTrack={handleSelectTrack}
              />
            </div>
          </div>
        ) : // Mobile: selecting an album swaps the table for its track list.
        selectedAlbum ? (
          <AlbumTracksView
            album={selectedAlbum}
            onBack={() => {
              setSelectedAlbum(null)
            }}
            onSelectTrack={handleSelectTrack}
          />
        ) : (
          albumsTable
        )}
      </div>

      <AddFavoriteDialog
        defaults={favoriteDefaults}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
