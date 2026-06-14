import { Heart, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getArtist } from '@/api/services/spotify/get-artist'
import type { SpotifyArtist } from '@/api/services/spotify/type'
import { cn } from '@/lib/utils'

interface HeroBannerProps {
  artist: SpotifyArtist
}

export function HeroBanner({ artist }: HeroBannerProps) {
  const { t } = useTranslation()
  const image = artist.images[0]?.url

  // `/search` omits genres — fetch the full artist for a richer subtitle.
  const fullArtist = useQuery({
    queryKey: ['artist', artist.id],
    queryFn: () => getArtist(artist.id),
    staleTime: 5 * 60_000,
  })
  const genres = fullArtist.data?.genres ?? artist.genres

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10',
        'min-h-[280px] md:min-h-[340px]',
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.65) 45%, rgba(13,13,13,0.2) 100%)',
        }}
      />

      <div className="relative flex h-full flex-col justify-between gap-8 p-8 md:p-10">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              background: 'rgba(232, 184, 75, 0.18)',
              color: 'var(--brand-light)',
              border: '1px solid var(--brand-border)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: 'var(--brand-light)' }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: 'var(--brand-light)' }}
              />
            </span>
            {t('artistDiscovery.trendingNow')}
          </span>
        </div>

        <div className="max-w-xl space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            {artist.name}
          </h1>
          <p className="text-sm text-white/70 md:text-base">
            {genres.slice(0, 3).join(' · ') || t('common.tagline')}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/artist/${artist.id}`}
              className="btn-brand inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm"
            >
              <Play className="h-4 w-4 fill-current" />
              {t('common.playNow')}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t('artistProfile.addFavorite')}
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
