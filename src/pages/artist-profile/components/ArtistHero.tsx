import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BadgeCheck } from 'lucide-react'

import type { SpotifyArtist } from '@/api/services/spotify/type'

interface ArtistHeroProps {
  artist: SpotifyArtist
  backButton?: ReactNode
}

export function ArtistHero({ artist, backButton }: ArtistHeroProps) {
  const { t } = useTranslation()
  const backdrop = artist.images[0]?.url

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

      <div className="relative z-10 flex w-full flex-col px-7 pt-4">
        <div className="glass-card relative mt-4 flex w-full flex-col items-start justify-center overflow-hidden rounded-t-3xl border-b-0 p-8 text-left md:p-12">
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

          <div className="relative z-10 flex w-full flex-col items-start">
            {backButton && <div className="mb-6">{backButton}</div>}

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
          </div>
        </div>
      </div>
    </section>
  )
}
