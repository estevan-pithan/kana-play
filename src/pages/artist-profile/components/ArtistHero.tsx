import { useTranslation } from 'react-i18next'
import { BadgeCheck, Play } from 'lucide-react'

import type { SpotifyArtist } from '@/api/services/spotify/type'

interface ArtistHeroProps {
  artist: SpotifyArtist
}

export function ArtistHero({ artist }: ArtistHeroProps) {
  const { t } = useTranslation()
  const backdrop = artist.images[0]?.url
  const genres = artist.genres.slice(0, 3)

  return (
    <section className="relative flex w-full items-end pt-4">
      {/* Full-bleed backdrop with gradient blends */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="h-full w-full object-cover opacity-50 mix-blend-luminosity"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg-near-black via-bg-near-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-bg-near-black/80 via-transparent to-bg-near-black/80" />
      </div>

      <div className="relative z-10 flex w-full flex-col px-7 pt-24">
        <div className="glass-card relative flex w-full flex-col items-center justify-center overflow-hidden rounded-t-3xl border-b-0 p-8 text-center md:p-12">
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Verified badge */}
            <div
              className="mb-4 inline-flex w-max items-center gap-2 rounded-full px-3 py-1"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--brand-border)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <BadgeCheck className="h-3.5 w-3.5 text-brand-light" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
                {t('artistProfile.verifiedArtist')}
              </span>
            </div>

            <h1 className="mb-5 bg-linear-to-r from-brand-light via-brand to-brand-light bg-clip-text text-5xl font-bold tracking-tight text-transparent drop-shadow-2xl md:text-7xl">
              {artist.name}
            </h1>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium capitalize text-white/70 backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-2 flex items-center gap-4">
              <button
                type="button"
                aria-label={t('common.playNow')}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-brand to-brand-light text-bg-deep shadow-[0_0_30px_rgba(204,119,34,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]"
              >
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
