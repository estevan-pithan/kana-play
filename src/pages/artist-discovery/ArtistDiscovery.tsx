import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { useArtistDiscovery } from './hooks/useArtistDiscovery'
import { HeroBanner } from './components/HeroBanner'
import { FeaturedArtistCard } from './components/FeaturedArtistCard'
import { TopPickItem } from './components/TopPickItem'
import { getArtistTopTracks } from '@/api/services/spotify/get-artist-top-tracks'
import type { SpotifyArtist } from '@/api/services/spotify/type'

// Default catalogue query used to populate the curated landing when the user
// hasn't searched for anything yet (Spotify's `/search` requires a non-empty q).
const BROWSE_QUERY = 'a'

export default function ArtistDiscovery() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const isSearching = query.length > 0

  const {
    artists,
    isLoading,
    isError,
    isFetchingNextPage,
    loadMoreRef,
  } = useArtistDiscovery(isSearching ? query : BROWSE_QUERY)

  const featured = artists[0]
  const featuredCards = artists.slice(1, 4)

  const topTracksQuery = useQuery({
    queryKey: ['artist-top-tracks', featured?.id],
    queryFn: () => getArtistTopTracks(featured?.id ?? ''),
    enabled: Boolean(featured) && !isSearching,
  })
  const topPicks = topTracksQuery.data?.tracks.slice(0, 4) ?? []

  return (
    <div
      className="relative z-10 min-h-screen pb-32"
      style={{ background: '#0d0d0d' }}
    >
      <div className="mx-auto w-full max-w-[1280px] px-8 py-9">
        {isLoading && <DiscoverySkeleton searching={isSearching} />}

        {isError && !isLoading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <p className="text-base font-semibold">
              {t('artistDiscovery.errorTitle')}
            </p>
            <p className="mt-2 text-sm text-white/60">{t('common.error')}</p>
          </div>
        )}

        {!isLoading && !isError && artists.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <p className="text-base font-semibold">
              {t('artistDiscovery.noResults')}
            </p>
          </div>
        )}

        {/* Search mode — results grid with infinite scroll (Phase 5 feature). */}
        {!isLoading && !isError && isSearching && artists.length > 0 && (
          <>
            <h2 className="mb-5 text-lg font-bold tracking-tight">
              {t('artistDiscovery.searchResultsFor', { query })}
            </h2>
            <ArtistGrid artists={artists} />

            <div ref={loadMoreRef} className="h-10" aria-hidden="true" />

            {isFetchingNextPage && (
              <p className="mt-4 text-center text-xs text-white/40">
                {t('common.loading')}
              </p>
            )}
          </>
        )}

        {/* Discover mode — curated landing (Hero + Featured + Top Picks). */}
        {!isLoading && !isError && !isSearching && featured && (
          <>
            <HeroBanner artist={featured} />

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <section>
                <h2 className="mb-4 text-lg font-bold tracking-tight">
                  {t('artistDiscovery.featuredArtists')}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {featuredCards.map((artist) => (
                    <FeaturedArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight">
                    {t('artistDiscovery.topPicks')}
                  </h2>
                  <Link
                    to={`/artist/${featured.id}`}
                    className="text-xs font-medium text-white/50 transition-colors hover:text-white"
                  >
                    {t('artistDiscovery.viewAll')}
                  </Link>
                </div>
                <div className="grid gap-2">
                  {topPicks.map((track) => (
                    <TopPickItem key={track.id} track={track} />
                  ))}
                  {topPicks.length === 0 && !topTracksQuery.isLoading && (
                    <p className="rounded-xl border border-white/8 bg-white/[0.04] p-3 text-xs text-white/50">
                      {t('common.empty')}
                    </p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ArtistGrid({ artists }: { artists: SpotifyArtist[] }) {
  if (artists.length === 0) return null
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {artists.map((artist) => (
        <Link
          key={artist.id}
          to={`/artist/${artist.id}`}
          className="group block rounded-xl border border-white/8 bg-white/[0.03] p-3 transition-colors hover:border-white/15 hover:bg-white/[0.06]"
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-white/10">
            {artist.images[0]?.url && (
              <img
                src={artist.images[0].url}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
          <p className="mt-3 truncate text-sm font-semibold">{artist.name}</p>
        </Link>
      ))}
    </div>
  )
}

function DiscoverySkeleton({ searching }: { searching: boolean }) {
  if (searching) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-xl bg-white/[0.05]"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="h-[300px] animate-pulse rounded-2xl bg-white/[0.05]" />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-white/[0.04]"
            />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-white/[0.04]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
