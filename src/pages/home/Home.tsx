import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { PageWrapper } from '@/components/layout/PageWrapper'
import { useHomeData } from './hooks/useHomeData'
import { useSearchResults } from './hooks/useSearchResults'
import { FilterChips } from './components/FilterChips'
import { SectionRow } from './components/SectionRow'
import { BrowseGrid } from './components/BrowseGrid'
import { PlaylistCard } from './components/PlaylistCard'
import { ArtistCard } from './components/ArtistCard'
import { TrackRow } from './components/TrackRow'
import { TopTracksCard } from './components/TopTracksCard'
import { AlbumCard } from './components/AlbumCard'
import {
  SEARCH_TYPES,
  type SearchType,
} from '@/api/services/spotify/search/search'

function isSearchType(value: string | null): value is SearchType {
  return value !== null && (SEARCH_TYPES as readonly string[]).includes(value)
}

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const rawType = searchParams.get('type')
  const type: SearchType = isSearchType(rawType) ? rawType : 'all'

  const isSearching = query.length > 0

  return (
    <PageWrapper>
      {isSearching ? (
        <SearchMode query={query} type={type} />
      ) : (
        <HomeMode type={type} />
      )}
    </PageWrapper>
  )
}

function HomeMode({ type }: { type: SearchType }) {
  if (type === 'all') return <CarouselHome />
  return <BrowseHome type={type} />
}

function BrowseHome({ type }: { type: Exclude<SearchType, 'all'> }) {
  const { t } = useTranslation()
  const { playlists, topArtists, topTracks, followedArtists, savedAlbums } =
    useHomeData()

  return (
    <div className="space-y-8">
      <FilterChips />

      {type === 'playlist' && (
        <BrowseGrid
          title={t('artistDiscovery.topPlaylists')}
          section={playlists}
          renderItem={(playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          )}
        />
      )}

      {type === 'artist' && (
        <>
          <BrowseGrid
            title={t('artistDiscovery.topArtists')}
            section={topArtists}
            renderItem={(artist) => (
              <div key={artist.id} className="flex justify-center">
                <ArtistCard artist={artist} />
              </div>
            )}
          />
          <BrowseGrid
            title={t('artistDiscovery.followedArtists')}
            section={followedArtists}
            renderItem={(artist) => (
              <div key={`followed-${artist.id}`} className="flex justify-center">
                <ArtistCard artist={artist} />
              </div>
            )}
          />
        </>
      )}

      {type === 'track' && (
        <BrowseGrid
          title={t('artistDiscovery.topTracks')}
          section={topTracks}
          layout="list"
          renderItem={(track, index) => (
            <TrackRow key={track.id} track={track} variant="list" rank={index + 1} />
          )}
        />
      )}

      {type === 'album' && (
        <BrowseGrid
          title={t('artistDiscovery.savedAlbums')}
          section={savedAlbums}
          renderItem={(album) => <AlbumCard key={album.id} album={album} />}
        />
      )}
    </div>
  )
}

function CarouselHome() {
  const { t } = useTranslation()
  const { playlists, topArtists, topTracks, followedArtists, savedAlbums } =
    useHomeData()

  return (
    <div className="flex flex-col gap-8 xl:h-[calc(100vh-16.5rem)] xl:overflow-hidden">
      <FilterChips />

      <div className="grid grid-cols-1 gap-8 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="hide-scrollbar min-w-0 space-y-8 xl:overflow-y-auto xl:pr-2">
          <SectionRow
            title={t('artistDiscovery.topPlaylists')}
            isLoading={playlists.isLoading}
            isError={playlists.isError}
            isEmpty={playlists.items.length === 0}
            isFetchingMore={playlists.isFetchingNextPage}
            onReachEnd={playlists.loadMore}
            skeletonShape="square"
          >
            {playlists.items.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </SectionRow>

          <SectionRow
            title={t('artistDiscovery.topArtists')}
            isLoading={topArtists.isLoading}
            isError={topArtists.isError}
            isEmpty={topArtists.items.length === 0}
            isFetchingMore={topArtists.isFetchingNextPage}
            onReachEnd={topArtists.loadMore}
            skeletonShape="circle"
          >
            {topArtists.items.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </SectionRow>

          <SectionRow
            title={t('artistDiscovery.followedArtists')}
            isLoading={followedArtists.isLoading}
            isError={followedArtists.isError}
            isEmpty={followedArtists.items.length === 0}
            isFetchingMore={followedArtists.isFetchingNextPage}
            onReachEnd={followedArtists.loadMore}
            skeletonShape="circle"
          >
            {followedArtists.items.map((artist) => (
              <ArtistCard key={`followed-${artist.id}`} artist={artist} />
            ))}
          </SectionRow>

          <SectionRow
            title={t('artistDiscovery.savedAlbums')}
            isLoading={savedAlbums.isLoading}
            isError={savedAlbums.isError}
            isEmpty={savedAlbums.items.length === 0}
            isFetchingMore={savedAlbums.isFetchingNextPage}
            onReachEnd={savedAlbums.loadMore}
            skeletonShape="square"
          >
            {savedAlbums.items.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </SectionRow>
        </div>

        <TopTracksCard
          title={t('artistDiscovery.tracks')}
          section={topTracks}
        />
      </div>
    </div>
  )
}

function SearchMode({ query, type }: { query: string; type: SearchType }) {
  const { t } = useTranslation()
  const {
    items,
    isLoading,
    isError,
    isFetchingNextPage,
    loadMoreRef,
  } = useSearchResults(query, type)

  return (
    <div className="space-y-6">
      <FilterChips />

      <h2 className="text-2xl font-semibold tracking-tight">
        {t('artistDiscovery.searchResultsFor', { query })}
      </h2>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-xl bg-white/5"
            />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="glass-card p-10 text-center">
          <p className="text-base font-semibold">
            {t('artistDiscovery.errorTitle')}
          </p>
          <p className="mt-2 text-sm text-white/60">{t('common.error')}</p>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="glass-card p-10 text-center">
          <p className="text-base font-semibold">
            {t('artistDiscovery.noResults')}
          </p>
        </div>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => {
              switch (item.kind) {
                case 'artist':
                  return (
                    <div key={`artist-${item.data.id}`} className="flex justify-center">
                      <ArtistCard artist={item.data} />
                    </div>
                  )
                case 'album':
                  return <AlbumCard key={`album-${item.data.id}`} album={item.data} />
                case 'playlist':
                  return (
                    <PlaylistCard
                      key={`playlist-${item.data.id}`}
                      playlist={item.data}
                    />
                  )
                case 'track':
                  return (
                    <div
                      key={`track-${item.data.id}`}
                      className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5"
                    >
                      <TrackRow track={item.data} variant="list" />
                    </div>
                  )
              }
            })}
          </div>

          <div ref={loadMoreRef} className="h-10" aria-hidden="true" />

          {isFetchingNextPage && (
            <p className="text-center text-xs text-white/40">
              {t('common.loading')}
            </p>
          )}
        </>
      )}
    </div>
  )
}
