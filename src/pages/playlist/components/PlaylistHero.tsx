import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Play } from 'lucide-react'

import type { Playlist } from '@/api/services/spotify/get-playlist'

interface PlaylistHeroProps {
  playlist: Playlist
  trackCount?: number
  backButton?: ReactNode
}

/** Full-bleed hero for a playlist — its cover fills the background. */
export function PlaylistHero({ playlist, trackCount, backButton }: PlaylistHeroProps) {
  const { t } = useTranslation()
  const cover = playlist.images[0]?.url
  const ownerName = playlist.owner.display_name ?? playlist.owner.id
  const total = trackCount ?? playlist.tracks.total

  return (
    <section className="relative flex w-full items-end pt-4">
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
        {backButton}
        <div className="glass-card relative mt-4 flex w-full flex-col items-center justify-center overflow-hidden rounded-t-3xl border-b-0 p-8 text-center md:p-12">
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 h-36 w-36 overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-2xl md:h-44 md:w-44">
              {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
            </div>

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
                {t('playlist.badge')}
              </span>
            </div>

            <h1 className="mb-4 bg-linear-to-r from-brand-light via-brand to-brand-light bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-2xl md:text-6xl">
              {playlist.name}
            </h1>

            {playlist.description && (
              <p className="mb-3 max-w-2xl text-sm text-white/70">{playlist.description}</p>
            )}

            <p className="mb-1 text-sm text-white/60">
              {t('playlist.byOwner', { name: ownerName })}
            </p>
            {total > 0 && (
              <p className="mb-6 text-sm text-white/50">
                {t('artistDiscovery.trackCount', { count: total })}
              </p>
            )}

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
