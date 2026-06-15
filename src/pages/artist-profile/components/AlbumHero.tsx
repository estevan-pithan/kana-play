import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { SpotifyAlbum } from '@/api/services/spotify/type'
import { formatReleaseDate } from '../utils'

interface AlbumHeroProps {
  album: SpotifyAlbum
  backButton?: ReactNode
}

export function AlbumHero({ album, backButton }: AlbumHeroProps) {
  const { t } = useTranslation()
  const cover = album.images[0]?.url
  const artistNames = album.artists.map((a) => a.name).join(', ')

  return (
    <section className="relative flex w-full items-end pt-4">
      {/* Full-bleed album cover with gradient blends */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {cover && (
          <img
            src={cover}
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

            <div className="flex w-full flex-col gap-6 md:flex-row md:items-start md:gap-8">
              {/* Cover thumbnail */}
              <div className="h-36 w-36 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-2xl md:h-44 md:w-44">
                {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
              </div>

              {/* Text in front of the cover */}
              <div className="flex flex-col items-start">
                {/* Album type badge */}
                <div
                  className="mb-4 inline-flex w-max items-center gap-2 rounded-full px-3 py-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--brand-border)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
                    {album.album_type}
                  </span>
                </div>

                <h1 className="mb-4 bg-linear-to-r from-brand-light via-brand to-brand-light bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-2xl md:text-6xl">
                  {album.name}
                </h1>

                <p className="mb-1 text-lg font-semibold text-white">{artistNames}</p>
                <p className="mb-6 text-sm text-white/50">
                  {formatReleaseDate(album.release_date)} ·{' '}
                  {t('artistDiscovery.trackCount', { count: album.total_tracks })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
